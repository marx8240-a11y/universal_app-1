from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from app.core.database import engine
from app.core.config import settings
from app.routers import users

@asynccontextmanager
async def lifespan (app :FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title=settings.PROJECT_NAME , lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router , prefix="/users" , tags=["users"])