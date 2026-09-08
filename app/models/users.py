from sqlmodel import SQLModel , Field

class UserDb(SQLModel , table=True):
    id :int|None = Field(index=True , primary_key=True , default=None )
    username :str =Field(index=True , min_length=3 , max_length=50 , unique=True)
    hashed_password :str 