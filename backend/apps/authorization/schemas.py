from decimal import Decimal

from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(UserBase):
    password: str
    repeated_password: str


class UserFullInfo(UserBase):
    rub_account: Decimal


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str
