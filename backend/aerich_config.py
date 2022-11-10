from config import get_settings


settings = get_settings()


TORTOISE_ORM = {
    "connections": {"default": f"postgres://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
                               f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"},
    "apps": {
        "models": {
            "models": settings.TORTOISE_MODELS,
            "default_connection": "default",
        },
    },
}