from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from ..database import User
from .. import models, schemas
# import secrets
from jose import JWTError, jwt
from ..utils import verify
from ..oauth2 import create_access_token
# from datetime import datetime, timedelta, timezone
from ..utils import send_reset_email, hash
from fastapi.security import OAuth2PasswordBearer
from ..config import settings
from ..schemas import individual_serial_user
from datetime import datetime

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register", status_code=status.HTTP_201_CREATED)
def create_user(user: models.CreateUser):

    existing_email = User.find_one({"email": user.email})

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this email already exists")

    existing_username = User.find_one({"username": user.username})

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=f"User with this username already exists")

    # hash the password - user.password
    hashed_password = hash(user.password)
    user.password = hashed_password

    current_time = datetime.now()
    user_dict = dict(user)
    user_dict.update({
        "createdAt": current_time,
        "updatedAt": current_time
    })

    result = User.insert_one(user_dict)

    # Return the inserted todo with the generated ObjectId
    inserted_user = User.find_one({"_id": result.inserted_id})
    return {"message": f"User {user.username} created!", "user": individual_serial_user(inserted_user)}


@router.post('/login')
# credentials are send via form data and not body!!!
def login(user_credentials: OAuth2PasswordRequestForm = Depends()):

    user = User.find_one({"email": user_credentials.username})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not verify(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    serialized_user = individual_serial_user(user)
    # create token
    access_token = create_access_token(
        data={"user_id": serialized_user["_id"]})

    username = serialized_user["username"]

    # return token
    return {"access_token": access_token, "token_type": "bearer", "user": serialized_user,
            "message": f"User {username} logged in successfully"
            }


@router.get('/checktokenexpiration')
def check_token_expiration(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": "Token is still valid"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")


# @router.post("/forgotpassword")
# def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):

#     user = db.query(models.User).filter(
#         models.User.email == request.email).first()

#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")

#     # Generate a random token
#     token = secrets.token_urlsafe(32)
#     expiration_time = datetime.utcnow() + timedelta(minutes=15)

#     # Store the token in the database
#     password_reset_token = models.PasswordResetToken(
#         user_id=user.id, token=token, expiration_time=expiration_time)
#     db.add(password_reset_token)
#     db.commit()
#     db.close()

#     # Send the reset email
#     send_reset_email(request.email, token)
#     return {"message": "Reset email sent"}


# @router.post("/resetpassword")
# def reset_password(request: schemas.PasswordReset, db: Session = Depends(get_db)):

#     token_data_query = db.query(models.PasswordResetToken).filter(
#         models.PasswordResetToken.token == request.token)
#     token_data = db.query(models.PasswordResetToken).filter(
#         models.PasswordResetToken.token == request.token).first()

#     if not token_data:
#         raise HTTPException(status_code=400, detail="Invalid or expired token")

#     # Check if the token is still valid
#     if token_data.expiration_time < datetime.now(timezone.utc):
#         token_data_query.delete(synchronize_session=False)
#         db.commit()
#         raise HTTPException(status_code=400, detail="Invalid or expired token")

#     # Find the user in the database
#     user = db.query(models.User).filter(
#         models.User.id == token_data.user_id).first()

#     # Update the user's password (replace this with your actual password hashing logic)
#     user.password = hash(request.newPassword)

#     # Remove the used token
#     token_data_query.delete(synchronize_session=False)
#     db.commit()

#     return {"message": "Password reset successfully"}
