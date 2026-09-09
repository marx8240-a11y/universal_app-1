from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str =  "sqlite:///./data.db"
    PROJECT_NAME: str =  "FASTAPI BLOG"
    ALGORITHM: str ="HS256"
    SECRET_KEY :str ="change-me-in-dev"
    ACCESS_TOKEN_EXPIRY_MINUTES :int =30

    class Config:
        env_file = ".env"


settings = Settings()        