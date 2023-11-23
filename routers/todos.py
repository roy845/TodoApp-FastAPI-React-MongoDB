from fastapi import APIRouter, Depends, status, HTTPException
from pymongo import ReturnDocument
from models import CreateTodo, UpdateTodo
from database import Todo, User
from schemas import list_serial_todos, individual_serial_todo, individual_serial_user
from oauth2 import get_current_user
from bson import ObjectId
from datetime import datetime


router = APIRouter(
    prefix="/todos",
    tags=["Todos"]
)


@router.get("/")
def get_todos(current_user: dict = Depends(get_current_user), limit: int = 0):
    try:
        todos = list_serial_todos(
            Todo.find().sort("createdAt", -1).limit(limit)
        )

        for todo in todos:
            user_id = todo.get("user_id")
            if user_id:
                user_details = User.find_one({"_id": ObjectId(user_id)})
                if user_details:
                    todo["user_details"] = individual_serial_user(
                        user_details)

        return todos

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching todos: {e}"
        )


@router.get('/getTodosByUserId', status_code=status.HTTP_200_OK)
def get_todos_by_user_id(current_user: dict = Depends(get_current_user)):
    try:

        todos = Todo.find({"user_id": current_user["_id"]}).sort("createdAt", -1)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching user todos: {e}"
        )

    return list_serial_todos(todos)


@router.get('/{todo_id}', status_code=status.HTTP_200_OK)
def get_todo(todo_id: str):
    try:
        todo_id_object = ObjectId(todo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid todo_id format: {e}"
        )

    todo = Todo.find_one({"_id": todo_id_object})

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id: {todo_id} not found"
        )

    return individual_serial_todo(todo)


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_todo(todo: CreateTodo, current_user: dict = Depends(get_current_user)):

    try:
        current_time = datetime.now()
        todo_dict = dict(todo)
        todo_dict.update({
            "user_id": ObjectId(current_user["_id"]),
            "completed":False,
            "createdAt": current_time,
            "updatedAt": current_time
        })

       
        result = Todo.insert_one(todo_dict)

        # Return the inserted todo with the generated ObjectId
        inserted_todo = Todo.find_one({"_id": result.inserted_id})
        return {"message": "Todo created!", "todo": individual_serial_todo(inserted_todo)}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the todo: {e}"
        )


@router.delete('/{todo_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: str):
    try:
        todo_id_object = ObjectId(todo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid todo_id format: {e}"
        )

    deleted_todo = Todo.find_one_and_delete(
        {"_id": todo_id_object})

    if not deleted_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id: {todo_id} not found"
        )

    return {"message":"Todo deleted successfully"}


@router.put('/{todo_id}', status_code=status.HTTP_200_OK)
def update_todo(todo_id: str, updated_todo: UpdateTodo):
    try:
        todo_id_object = ObjectId(todo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid todo_id format: {e}"
        )
    
    updated_todo_dict = dict(updated_todo)
    updated_todo_dict.update({"updatedAt":datetime.now()})

    update_data = {
        "$set": updated_todo_dict,
    }

    updated_todo_from_db = Todo.find_one_and_update(
        {"_id": todo_id_object},
        update_data,
        return_document=ReturnDocument.AFTER  # Return the updated document
    )

    if not updated_todo_from_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id: {todo_id} not found"
        )

    return individual_serial_todo(updated_todo_from_db)


@router.delete('/', status_code=status.HTTP_204_NO_CONTENT)
def delete_all_todos():
    result = Todo.delete_many({})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No todos found to delete"
        )

    return {"message": "All todos deleted successfully"}