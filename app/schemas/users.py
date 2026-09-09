from sqlmodel import SQLModel , Field



class UserPublic(SQLModel):
    id :int    
    username :str 


class UserCreate(SQLModel):
    username :str =Field(index=True , min_length=3 , max_length=50 , unique=True)
    password :str =Field(min_length=6 , max_length=50)


class UserLogin(SQLModel):
    username :str
    password :str


class Token(SQLModel):
    access_token :str
    token_type :str = "bearer"