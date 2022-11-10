from decimal import Decimal

import httpx
from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from starlette.responses import JSONResponse
from starlette.status import HTTP_200_OK

from apps.authorization.models import User
from apps.authorization.utils import get_current_user
from apps.wallet.schemas import WalletMetals, BuyRequest, SellRequest

from config import Settings, get_settings
from exceptions.payment import NegativeOrZeroPaymentValue

router = APIRouter()


@router.get(
    '/',
    response_model=WalletMetals,
    status_code=HTTP_200_OK,
)
async def get_wallet_currencies(
    settings: Settings = Depends(get_settings),
    authorize: AuthJWT = Depends(),
    user: User = Depends(get_current_user),
) -> WalletMetals:
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(
            f"{settings.BLOCKCHAIN_URL}/wallet",
            headers={'Authorization': f'Bearer {authorize.create_access_token(subject=str(user.id))}'},
        )
        return WalletMetals(**response.json())


@router.post(
    '/buy',
    status_code=HTTP_200_OK,
)
async def buy_currency(
    buy_request: BuyRequest,
    settings: Settings = Depends(get_settings),
    authorize: AuthJWT = Depends(),
    user: User = Depends(get_current_user),
) -> WalletMetals:
    value_in_rub = buy_request.value * settings.COMMISSION * settings.EXCHANGE_RATES[buy_request.currency]

    if float(user.rub_account) - value_in_rub < 0:
        raise NegativeOrZeroPaymentValue
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.post(
            f"{settings.BLOCKCHAIN_URL}/wallet/buy",
            json=dict(buy_request),
            headers={'Authorization': f'Bearer {authorize.create_access_token(subject=str(user.id))}'},
        )
    if response.status_code == 200:
        user.rub_account -= Decimal(value_in_rub)
        await user.save()
    else:
        return JSONResponse(response.json(), status_code=response.status_code)

    return WalletMetals(**response.json())


@router.post(
    '/sell',
    status_code=HTTP_200_OK,
)
async def sell_currency(
    sell_request: SellRequest,
    settings: Settings = Depends(get_settings),
    authorize: AuthJWT = Depends(),
    user: User = Depends(get_current_user),
) -> WalletMetals:
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.post(
            f"{settings.BLOCKCHAIN_URL}/wallet/sell",
            json=dict(sell_request),
            headers={'Authorization': f'Bearer {authorize.create_access_token(subject=str(user.id))}'},
        )

    print(response.text)

    if response.status_code == 200:
        user.rub_account += Decimal(sell_request.rub_amount) * Decimal(settings.EXCHANGE_RATES[sell_request.currency])
        await user.save()
    else:
        return JSONResponse(response.json(), status_code=response.status_code)

    return WalletMetals(**response.json())
