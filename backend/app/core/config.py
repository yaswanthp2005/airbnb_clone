from typing import Optional

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
    # Comma-separated exact origins, e.g. "https://airbnb-clone.vercel.app,http://localhost:3000".
    cors_origins: str = "http://localhost:3000"
    # Optional extra origins by pattern, e.g. Vercel preview deploys: "https://airbnb-clone-.*\.vercel\.app".
    cors_origin_regex: Optional[str] = None
    # Create tables + seed demo data when the database is empty (hosts with an ephemeral disk
    # start from an empty SQLite file on every boot).
    seed_on_startup: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip().rstrip("/")
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
