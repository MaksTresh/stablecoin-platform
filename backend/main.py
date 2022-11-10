from fastapi import FastAPI
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from starlette.requests import Request
from starlette.responses import JSONResponse
from tortoise.contrib.fastapi import register_tortoise

from apps.authorization.routers import router as authorization_router
from apps.payment.routers import router as payment_router
from apps.wallet.routers import router as wallet_router
from config import get_settings, Settings

app = FastAPI(
    title="Platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException) -> None:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


def configure_db(settings: Settings) -> None:
    register_tortoise(
        app,
        db_url=f"postgres://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
               f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
        modules={
            "models": settings.TORTOISE_MODELS,
        },
        generate_schemas=False,
        add_exception_handlers=True,
    )


@app.on_event("startup")
async def startup() -> None:
    AuthJWT.load_config(get_settings)  # noqa
    settings = Settings()

    configure_db(settings)

    app.dependency_overrides = {
        get_settings: lambda: settings,
    }

app.include_router(authorization_router, tags=["Authorization"], prefix="/api/authorization")
app.include_router(payment_router, tags=["Payment"], prefix="/api/payment")
app.include_router(wallet_router, tags=["Wallet"], prefix="/api/wallet")
