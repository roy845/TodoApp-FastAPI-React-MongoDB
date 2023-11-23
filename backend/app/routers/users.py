from fastapi import APIRouter, HTTPException, status
from ..database import User
from ..schemas import individual_serial_user, list_serial_users
from ..models import UpdateUser
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime
from ..utils import hash


router = APIRouter(
    tags=["Users"],
    prefix="/users"
)


@router.get("/")
def get_users():

    try:
        users = list_serial_users(User.find().sort("createdAt", -1))

        return users
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error in fetching users")


@router.get("/{user_id}", status_code=status.HTTP_200_OK)
def get_user(user_id: str):

    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id format: {e}"
        )

    user = User.find_one({"_id": user_id_object})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )

    return individual_serial_user(user)


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str):
    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id object format: {e}"
        )

    deleted_user = User.find_one_and_delete(
        {"_id": user_id_object})

    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )

    return "User deleted successfully"


from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, status
from pymongo import ReturnDocument

@router.put("/{user_id}")
def update_user(user_id: str, updated_user: UpdateUser):

    try:
        user_id_object = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user_id format: {e}"
        )
    
    user = User.find_one({"_id":user_id_object})

    update_data = {"$set": {}}

    update_data["$set"]["password"] = hash(updated_user.password) if updated_user.password else user["password"]
    update_data["$set"]["profilePic"] = updated_user.profilePic if updated_user.profilePic else user["profilePic"]
    update_data["$set"]["username"] = updated_user.username if updated_user.username else user["username"]
    update_data["$set"]["email"] = updated_user.email if updated_user.email else user["email"]
    update_data["$set"]["createdAt"] = user["createdAt"]
    update_data["$set"]["updatedAt"] = datetime.now()

    # Update the database
    updated_user_from_db = User.find_one_and_update(
        {"_id": user_id_object},
        update_data,
        return_document=ReturnDocument.AFTER
    )

    if not updated_user_from_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {user_id} not found"
        )
   
    return {"message": "User updated successfully", "user": individual_serial_user(updated_user_from_db)}


