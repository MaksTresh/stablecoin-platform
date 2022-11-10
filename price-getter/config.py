from functools import lru_cache
from typing import TypeVar

from pydantic import BaseSettings, Field

T = TypeVar("T", str, int)


def get_env(name: str, *, required: bool = False, default: T = None) -> T:
    if required and not default:
        default = ...  # type: ignore
    return Field(default, env=name)


class BinanceConfig(BaseSettings):
    BINANCE_API_KEY: str = get_env("BINANCE_API_KEY", required=True)
    BINANCE_API_SECRET: str = get_env("BINANCE_API_SECRET", required=True)


class Settings(BinanceConfig):
    pass


@lru_cache
def get_settings() -> Settings:
    return Settings()
