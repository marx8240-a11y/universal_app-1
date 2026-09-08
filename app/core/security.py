from pwdlib import PasswordHash
from datetime import datetime , timezone , timedelta
import jwt
from app.core.config import settings

password_hash  = PasswordHash.recommended()

def hash_password(plain_pass :str ) -> str:
    return password_hash.hash(plain_pass)

def verify_password(plain_pass :str , hashed_pass :str) -> bool:
    return password_hash.verify(plain_pass , hashed_pass)

def create_access_token(subject: str )-> str :
    expiry_time = datetime.now(timezone.utc) + timedelta( minutes=settings.ACCESS_TOKEN_EXPIRY_MINUTES)
    payload ={"sub" :subject , "exp" :expiry_time}

    return jwt.encode(payload=payload , key=settings.SECRET_KEY , algorithm=settings.ALGORITHM)

def check_access_token(token :str):
    try:
        payload = jwt.decode(
            token , settings.SECRET_KEY , algorithm=settings.ALGORITHM
        )
        return payload.get("sub")
    except jwt.PyJWTError:
        return None

