from functools import lru_cache
from typing import TypeVar
from datetime import timedelta

from pydantic import BaseSettings, Field

T = TypeVar("T", str, int)


def get_env(name: str, *, required: bool = False, default: T = None) -> T:
    if required and not default:
        default = ...  # type: ignore
    return Field(default, env=name)


class DatabaseSettings(BaseSettings):
    POSTGRES_HOST: str = get_env("POSTGRES_HOST", default="blockchain_db")
    POSTGRES_DB: str = get_env("POSTGRES_DB", required=True)
    POSTGRES_USER: str = get_env("POSTGRES_USER", required=True)
    POSTGRES_PASSWORD: str = get_env("POSTGRES_PASSWORD", required=True)
    POSTGRES_PORT: int = get_env("POSTGRES_PORT", default=5432)


class TortoiseORMSettings(BaseSettings):
    TORTOISE_MODELS: list[str] = ["aerich.models", "apps.accounts.models"]


class AuthJWTSettings(BaseSettings):
    authjwt_secret_key: str = get_env("AUTH_SECRET_KEY", required=True)
    authjwt_access_token_expires: timedelta = timedelta(weeks=1)
    authjwt_refresh_token_expires: timedelta = timedelta(weeks=4)


class Settings(DatabaseSettings, AuthJWTSettings, TortoiseORMSettings):
    COMMISSION: float = 1.005


@lru_cache
def get_settings() -> Settings:
    return Settings()
