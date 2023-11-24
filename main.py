from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from routers import auth,users,todos
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


frontend_path = Path(__file__).resolve().parent / "build"

@app.get("/root", tags=["Root"])
def root():
    return {"message": "hello world"}


@app.get("/{path:path}")
def catch_all():
    return FileResponse(f"{frontend_path}\index.html")


# Serve the React app from the 'build' folder at the root path
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

