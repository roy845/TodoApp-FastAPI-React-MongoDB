from typing  import Union
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from routers import auth,users,todos
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.exception_handlers import http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException




def SPA(app: FastAPI, build_dir: Union[Path, str]) -> FastAPI:
# Serves a React application in the root directory

    @app.exception_handler(StarletteHTTPException)
    async def _spa_server(req: Request, exc: StarletteHTTPException):
        if exc.status_code == 404:
            return FileResponse(f'{build_dir}/index.html', media_type='text/html')
        else:
            return await http_exception_handler(req, exc)

    if isinstance(build_dir, str):
        build_dir = Path(build_dir)

    app.mount(
        '/static/',
        StaticFiles(directory=build_dir / 'static'),
        name='React app static files',
    )

    return app

frontend_path = Path(__file__).resolve().parent / "build"

app = SPA(FastAPI(),frontend_path)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(todos.router)
app.include_router(auth.router)
app.include_router(users.router)




@app.get("/root", tags=["Root"])
def root():
    return {"message": "hello world"}









