from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Airbnb Clone API"
    debug: bool = False
    database_url: str = "sqlite:///./airbnb.db"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000"


settings = Settings()
