def individual_serial_todo(todo) -> dict:
    return {
        "_id": str(todo["_id"]),
        "name": str(todo["name"]),
        "user_id": str(todo["user_id"]),
        "description": str(todo["description"]),
        "completed": bool(todo["completed"]),
        "createdAt": todo.get("createdAt", None),
        "updatedAt": todo.get("updatedAt", None)
    }


def individual_serial_user(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "username": str(user.get("username", "")),
        "email": str(user.get("email", "")),
        "profilePic": str(user.get("profilePic", "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")),
        "isAdmin": bool(user.get("isAdmin", False)),
        "createdAt": user.get("createdAt", None).strftime("%Y-%m-%d %H:%M:%S") if user.get("createdAt") else None,
        "updatedAt": user.get("updatedAt", None).strftime("%Y-%m-%d %H:%M:%S") if user.get("updatedAt") else None
    }


def list_serial_todos(todos) -> list:
    return [individual_serial_todo(todo) for todo in todos]


def list_serial_users(users) -> list:
    return [individual_serial_user(user) for user in users]
