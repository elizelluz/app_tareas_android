import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["task_manager"]
tasks_collection = db["tasks"]
projects_collection = db["projects"]
