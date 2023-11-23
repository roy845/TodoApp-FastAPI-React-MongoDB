from fastapi import FastAPI
from .routers import todos, auth, users
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path


app = FastAPI()


app.include_router(todos.router)
app.include_router(auth.router)
app.include_router(users.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


frontend_path = Path(__file__).resolve().parent.parent / "build"
# Serve the React app from the 'build' folder at the root path
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
