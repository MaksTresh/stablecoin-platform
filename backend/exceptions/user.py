from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST

from exceptions.base import CustomHTTPException


class UserRegisterError(HTTPException):
    def __init__(self, detail: list[dict], status_code: int = HTTP_400_BAD_REQUEST) -> None:
        super().__init__(status_code, detail)


class InvalidCredentials(CustomHTTPException):
    status_code = HTTP_400_BAD_REQUEST
    detail = "Неверный логин или пароль."
