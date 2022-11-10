from enum import Enum

from tortoise import Model
from tortoise.fields import UUIDField, CharEnumField, ReverseRelation, ForeignKeyRelation, ForeignKeyField, DecimalField


class Currency(str, Enum):
    GOZG = "GOZG"
    GOZP = "GOZP"
    GOZS = "GOZS"
    GOZB = "GOZB"


class Wallet(Model):
    id = UUIDField(pk=True)
    user_id = UUIDField(unique=True)
    metal_currencies = ReverseRelation["MetalCurrency"]


class MetalCurrency(Model):
    id = UUIDField(pk=True)
    currency: Currency = CharEnumField(Currency)
    wallet: ForeignKeyRelation[Wallet] = ForeignKeyField(
        "models.Wallet", related_name="metal_currencies"
    )
    amount = DecimalField(max_digits=16, decimal_places=4, default=0)
