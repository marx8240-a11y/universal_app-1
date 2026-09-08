from sqlmodel import SQLModel  , create_engine , Session
from typing import Annotated
from app.core.config import settings
from fastapi import Depends

engine = create_engine(settings.DATABASE_URL ,echo=True)

def get_session():
    with Session(engine) as session:
        yield session

sessionDep = Annotated[Session , Depends(get_session)]
