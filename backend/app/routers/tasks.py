from fastapi import APIRouter, Depends, HTTPException
from app.database import tasks_collection
from app.schemas import TaskCreate, TaskUpdate
from bson import ObjectId
from app.utils.dependencies import get_current_user

router = APIRouter()


# CREATE TASK
@router.post("/")
def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    new_task = {
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date,
        "status": task.status,
        "user_email": current_user["email"]
    }

    result = tasks_collection.insert_one(new_task)

    return {"message": "Task created", "task_id": str(result.inserted_id)}


# GET ALL TASKS (only logged-in user's tasks)
@router.get("/")
def get_tasks(current_user: dict = Depends(get_current_user)):
    tasks = list(tasks_collection.find(
        {"user_email": current_user["email"]},
        {"_id": 1, "title": 1, "description": 1, "status": 1}
    ))

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks


# UPDATE TASK
@router.put("/{task_id}")
def update_task(task_id: str, task: TaskUpdate, current_user: dict = Depends(get_current_user)):

    update_data = {k: v for k, v in task.dict().items() if v is not None}

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_email": current_user["email"]},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task updated"}


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):

    result = tasks_collection.delete_one(
        {"_id": ObjectId(task_id), "user_email": current_user["email"]}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted"}