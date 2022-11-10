from decimal import Decimal

from pydantic import BaseModel


class MetalCurrency(BaseModel):
    currency: str
    amount: Decimal


class WalletMetals(BaseModel):
    metal_currencies: list[MetalCurrency]


class BuyRequest(BaseModel):
    value: float
    currency: str


class SellRequest(BaseModel):
    rub_amount: float
    currency: str
