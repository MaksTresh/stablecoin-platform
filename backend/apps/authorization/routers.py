import httpx

from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from starlette.status import HTTP_200_OK

from apps.authorization.models import User
from apps.authorization.schemas import UserRegister, UserLogin, AuthTokens, RefreshResponse, UserFullInfo
from apps.authorization.services.hasher import Hasher
from apps.authorization.utils import get_current_user
from apps.authorization.validators import UserValidator
from config import Settings, get_settings
from exceptions.user import UserRegisterError, InvalidCredentials

router = APIRouter()


@router.post(
    '/register',
    response_model=AuthTokens,
    status_code=HTTP_200_OK,
)
async def register(
    user_data: UserRegister,
    settings: Settings = Depends(get_settings),
    authorize: AuthJWT = Depends(),
) -> AuthTokens:
    user_validator = UserValidator(user_data, settings)
    await user_validator.validate()

    if errors := user_validator.get_errors():
        raise UserRegisterError(errors)

    hasher = Hasher()
    user = User(
        name=user_data.name,
        password=hasher.get_password_hash(user_data.password),
        email=user_data.email,
    )
    await user.save()

    access_token = authorize.create_access_token(subject=str(user.id))
    refresh_token = authorize.create_refresh_token(subject=str(user.id))

    async with httpx.AsyncClient(follow_redirects=True) as client:
        await client.post(
            f"{settings.BLOCKCHAIN_URL}/wallet",
            headers={'Authorization': f'Bearer {access_token}'},
        )

    return AuthTokens(access_token=access_token, refresh_token=refresh_token)


@router.post(
    '/login',
    response_model=AuthTokens,
    status_code=HTTP_200_OK,
)
async def login(
    user_creds: UserLogin,
    authorize: AuthJWT = Depends(),
) -> AuthTokens:
    email = user_creds.email
    password = user_creds.password

    user = await User.filter(email=email).get_or_none()
    if not user:
        raise InvalidCredentials

    hasher = Hasher()
    if not hasher.verify_password(password, user.password):
        raise InvalidCredentials

    access_token = authorize.create_access_token(subject=str(user.id))
    refresh_token = authorize.create_refresh_token(subject=str(user.id))

    return AuthTokens(access_token=access_token, refresh_token=refresh_token)


@router.get(
    '/me',
    response_model=UserFullInfo,
    status_code=HTTP_200_OK,
)
async def login(
    user: User = Depends(get_current_user),
) -> UserFullInfo:
    return UserFullInfo.parse_obj(user)


@router.post(
    '/refresh',
    status_code=HTTP_200_OK,
    response_model=RefreshResponse,
)
async def refresh(
    authorize: AuthJWT = Depends(),
) -> RefreshResponse:
    authorize.jwt_refresh_token_required()
    access_token = authorize.create_access_token(subject=authorize.get_jwt_subject())

    return RefreshResponse(access_token=access_token)
