from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str =  "sqlite:///./data.db"
    PROJECT_NAME: str =  "FASTAPI BLOG"

    class Config:
        env_file = ".env"


settings = Settings()        