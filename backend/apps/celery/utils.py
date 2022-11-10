from typing import Any, Callable

from tortoise import Tortoise

from config import get_settings


async def db_context(func: Callable, *args, **kwargs) -> Any:
    settings = get_settings()
    try:
        await Tortoise.init(
            db_url=f"postgres://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
                   f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
            modules={
                "models": settings.TORTOISE_MODELS,
            },
        )
        return await func(*args, **kwargs)
    finally:
        await Tortoise.close_connections()
