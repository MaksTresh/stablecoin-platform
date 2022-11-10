from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST


class CustomHTTPException(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=self.status_code, detail=self.detail)


class NegativeOrZeroPaymentValue(CustomHTTPException):
    status_code = HTTP_400_BAD_REQUEST
    detail = "Некорректное значение перевода."
