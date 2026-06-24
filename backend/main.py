from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime

from database import tasks_collection, projects_collection
from models import TaskCreate, TaskUpdate, ProjectCreate, ProjectUpdate, Status

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def serialize_task(task):
    status = task.get("status")
    if not status:
        status = "completed" if task.get("completed", False) else "pending"
    return {
        "_id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description", ""),
        "priority": task["priority"],
        "category": task["category"],
        "due_date": task.get("due_date"),
        "status": status,
        "completed": status == "completed",
        "project_id": task.get("project_id"),
        "created_at": task.get("created_at", datetime.now().isoformat()),
    }

def serialize_project(project):
    return {
        "_id": str(project["_id"]),
        "name": project["name"],
        "color": project.get("color", "#6C63FF"),
        "description": project.get("description", ""),
        "created_at": project.get("created_at", datetime.now().isoformat()),
    }

@app.get("/api/projects")
async def get_projects():
    projects = await projects_collection.find().sort("created_at", -1).to_list(100)
    return [serialize_project(p) for p in projects]

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    doc = project.model_dump()
    doc["created_at"] = datetime.now().isoformat()
    result = await projects_collection.insert_one(doc)
    created = await projects_collection.find_one({"_id": result.inserted_id})
    return serialize_project(created)

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project: ProjectUpdate):
    update_data = {k: v for k, v in project.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(400, "No fields to update")
    result = await projects_collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Project not found")
    updated = await projects_collection.find_one({"_id": ObjectId(project_id)})
    return serialize_project(updated)

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    result = await projects_collection.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Project not found")
    await tasks_collection.update_many(
        {"project_id": project_id}, {"$set": {"project_id": None}}
    )
    return {"message": "Project deleted"}

@app.get("/api/tasks")
async def get_tasks(search: str = "", priority: str = "", category: str = "", status: str = "", project_id: str = ""):
    query = {}
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if priority:
        query["priority"] = priority
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    if project_id:
        query["project_id"] = project_id

    tasks = await tasks_collection.find(query).sort("created_at", -1).to_list(1000)
    return [serialize_task(t) for t in tasks]

@app.get("/api/tasks/stats")
async def get_stats():
    total = await tasks_collection.count_documents({})
    pending = await tasks_collection.count_documents({"status": "pending"})
    in_progress = await tasks_collection.count_documents({"status": "in_progress"})
    completed = await tasks_collection.count_documents({"status": "completed"})

    pipeline = [{"$group": {"_id": "$priority", "count": {"$sum": 1}}}]
    by_priority = await tasks_collection.aggregate(pipeline).to_list(10)

    pipeline_cat = [{"$group": {"_id": "$category", "count": {"$sum": 1}}}]
    by_category = await tasks_collection.aggregate(pipeline_cat).to_list(10)

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "completed": completed,
        "by_priority": {p["_id"]: p["count"] for p in by_priority},
        "by_category": {c["_id"]: c["count"] for c in by_category},
    }

@app.post("/api/tasks")
async def create_task(task: TaskCreate):
    doc = task.model_dump()
    doc["created_at"] = datetime.now().isoformat()
    result = await tasks_collection.insert_one(doc)
    created = await tasks_collection.find_one({"_id": result.inserted_id})
    return serialize_task(created)

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, task: TaskUpdate):
    update_data = {k: v for k, v in task.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(400, "No fields to update")
    if "completed" in update_data:
        update_data["status"] = "completed" if update_data.pop("completed") else "pending"
    result = await tasks_collection.update_one(
        {"_id": ObjectId(task_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Task not found")
    updated = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    return serialize_task(updated)

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Task not found")
    return {"message": "Task deleted"}
