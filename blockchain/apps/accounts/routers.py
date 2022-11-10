from decimal import Decimal

from fastapi import APIRouter, Depends
from starlette.responses import Response
from starlette.status import HTTP_200_OK, HTTP_201_CREATED

from apps.accounts.exceptions import NegativeOrZeroPaymentValue
from apps.accounts.models import MetalCurrency, Wallet
from apps.accounts.schemas import WalletMetals, BuyRequest, MetalCurrency as MetalCurrencySchema, SellRequest
from apps.accounts.utils import get_current_user_id
from config import Settings, get_settings

router = APIRouter()


@router.post(
    '/',
    status_code=HTTP_201_CREATED,
)
async def create_wallet(
    user_id: str = Depends(get_current_user_id),
) -> Response:
    await Wallet.get_or_create(user_id=user_id)
    return Response(status_code=HTTP_201_CREATED)


@router.get(
    '/',
    status_code=HTTP_200_OK,
    response_model=WalletMetals,
)
async def get_wallet_currencies(
    user_id: str = Depends(get_current_user_id),
) -> WalletMetals:
    wallet, _ = await Wallet.get_or_create(user_id=user_id)
    # print(await wallet.metal_currencies.all())
    return WalletMetals(metal_currencies=[MetalCurrencySchema.parse_obj(metal_currency) for metal_currency in await wallet.metal_currencies.all()])


@router.post(
    '/buy',
    status_code=HTTP_200_OK,
)
async def buy_currency(
    buy_request: BuyRequest,
    user_id: str = Depends(get_current_user_id),
) -> WalletMetals:
    wallet, _ = await Wallet.get_or_create(user_id=user_id)
    currency, _ = await MetalCurrency.get_or_create(wallet_id=wallet.id, currency=buy_request.currency)
    currency.amount += Decimal(buy_request.value)

    await currency.save()

    return WalletMetals(metal_currencies=[MetalCurrencySchema.parse_obj(metal_currency) for metal_currency in await wallet.metal_currencies.all()])


@router.post(
    '/sell',
    status_code=HTTP_200_OK,
)
async def sell_currency(
    sell_request: SellRequest,
    user_id: str = Depends(get_current_user_id),
    settings: Settings = Depends(get_settings),
) -> WalletMetals:
    value_in_currency = sell_request.rub_amount * settings.COMMISSION

    wallet, _ = await Wallet.get_or_create(user_id=user_id)
    currency = await MetalCurrency.get_or_none(wallet_id=wallet.id, currency=sell_request.currency)

    if not currency or currency.amount - Decimal(value_in_currency) < 0:
        raise NegativeOrZeroPaymentValue

    currency.amount -= Decimal(value_in_currency)
    await currency.save()

    return WalletMetals(metal_currencies=[MetalCurrencySchema.parse_obj(metal_currency) for metal_currency in
                                          await wallet.metal_currencies.all()])

