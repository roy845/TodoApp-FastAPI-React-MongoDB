from pydantic import BaseModel
from typing import Optional
from pydantic import EmailStr


class CreateUser(BaseModel):
    username: str
    password: str
    email: EmailStr
    isAdmin: bool = False
    profilePicture: str = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"


class CreateTodo(BaseModel):
    name: str
    description: str


class UpdateTodo(BaseModel):
    name: Optional[str]
    description: Optional[str]
    completed: Optional[bool]


class UpdateUser(BaseModel):
    username: Optional[str]
    password: Optional[str]
    email: Optional[EmailStr]
    profilePic: Optional[str]


class TokenData(BaseModel):
    id: str
