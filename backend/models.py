from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class Priority(str, Enum):
    alta = "Alta"
    media = "Media"
    baja = "Baja"

class Category(str, Enum):
    trabajo = "Trabajo"
    personal = "Personal"
    compras = "Compras"
    otros = "Otros"

class Status(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class ProjectCreate(BaseModel):
    name: str
    color: Optional[str] = "#6C63FF"
    description: Optional[str] = ""

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Priority = Priority.media
    category: Category = Category.otros
    due_date: Optional[str] = None
    status: Status = Status.pending
    project_id: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    category: Optional[Category] = None
    due_date: Optional[str] = None
    status: Optional[Status] = None
    completed: Optional[bool] = None
    project_id: Optional[str] = None

class TaskDB(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str = ""
    priority: Priority
    category: Category
    due_date: Optional[str] = None
    status: Status = Status.pending
    completed: bool = False
    project_id: Optional[str] = None
    created_at: str
