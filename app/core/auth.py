from fastapi import Depends , HTTPException , status
from sqlmodel import select
from fastapi.security import OAuth2PasswordBearer
from app.core.database import sessionDep
from app.models.users import UserDb
from app.core.security import check_access_token
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(session: sessionDep , token : Annotated[str , Depends(oauth2_scheme)]) ->UserDb:
    username = check_access_token(token)
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED  , detail="Invalid Or Expired Token" , headers={"WWW-Authenticate" : "Bearer"})

    user = session.exec(select(UserDb).where(UserDb.username == username)).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND  , detail="User Not found!", headers={"WWW-Authenticate" : "Bearer"})

    return user