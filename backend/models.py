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

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: Priority = Priority.media
    category: Category = Category.otros
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    category: Optional[Category] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None

class TaskDB(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: str = ""
    priority: Priority
    category: Category
    due_date: Optional[str] = None
    completed: bool = False
    created_at: str
