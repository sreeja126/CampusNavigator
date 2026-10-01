from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central place for all environment-driven configuration.
    Values are read from the .env file (see .env.example).
    """

    database_url: str = "postgresql://campus_admin:changeme@localhost:5432/campus_navigator"
    secret_key: str = "dev-secret-change-me"
    environment: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()