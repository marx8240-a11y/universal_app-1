from fastapi import APIRouter ,HTTPException , status
from sqlmodel import select
from app.core.database import sessionDep
from app.models.users import UserDb
from app.schemas.users import UserPublic , UserCreate
from app.core.security import hash_password

router = APIRouter()

@router.post("/", response_model=UserPublic)
def create_user(session :sessionDep , user_data :UserCreate) ->UserDb:

    existing_user = session.exec(select(
        UserDb).where(UserDb.username == user_data.username)
        ).first()
    

    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User Already exits!")
    
    user_db = UserDb(
        username = user_data.username , hashed_password= hash_password(user_data.password)
    )
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    return user_db
