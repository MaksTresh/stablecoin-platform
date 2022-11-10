from decimal import Decimal

from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK

from apps.authorization.models import User
from apps.authorization.utils import get_current_user
from apps.payment.schemas import PaymentRequest, PaymentResponse
from exceptions.payment import NegativeOrZeroPaymentValue

router = APIRouter()


@router.post(
    '/hook',
    response_model=PaymentResponse,
    status_code=HTTP_200_OK,
    description="Mocked endpoint"
)
async def payment_hook(
    payment: PaymentRequest,
    user: User = Depends(get_current_user),
) -> PaymentResponse:
    payment_value = payment.value
    if payment_value <= 0:
        raise NegativeOrZeroPaymentValue

    user.rub_account += Decimal(payment_value)
    await user.save()

    return PaymentResponse(rub_account=user.rub_account)
