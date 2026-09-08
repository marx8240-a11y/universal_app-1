from fastapi import APIRouter ,HTTPException , status
from sqlmodel import select
from app.core.database import sessionDep
from app.models.users import UserDb
from app.schemas.users import UserPublic , UserCreate , UserLogin , Token
from app.core.security import hash_password , verify_password , create_access_token 

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


@router.post("/login" , response_model=Token)
def login(session :sessionDep ,user_data :UserLogin) -> Token:
    existing_user = session.exec(select(UserDb).where(UserDb.username == user_data.username)).first()

    if not existing_user or not verify_password(user_data.password , existing_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Invalid Username Or Password!")

    return Token(access_token=create_access_token(existing_user.username))