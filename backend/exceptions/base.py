from fastapi import HTTPException


class CustomHTTPException(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=self.status_code, detail=self.detail)
