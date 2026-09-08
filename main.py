from fastapi import FastAPI
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

app.include_router(users.router , prefix="/users" , tags=["users"])