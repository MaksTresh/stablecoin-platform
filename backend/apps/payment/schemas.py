from decimal import Decimal

from pydantic import BaseModel


class PaymentRequest(BaseModel):
    value: float


class PaymentResponse(BaseModel):
    rub_account: Decimal
