from starlette.status import HTTP_400_BAD_REQUEST

from exceptions.base import CustomHTTPException


class NegativeOrZeroPaymentValue(CustomHTTPException):
    status_code = HTTP_400_BAD_REQUEST
    detail = "Некорректное значение перевода."
