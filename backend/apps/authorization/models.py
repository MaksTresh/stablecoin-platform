from tortoise.models import Model
from tortoise.fields import UUIDField, CharField, DecimalField


class User(Model):
    id = UUIDField(pk=True)
    name = CharField(max_length=127)
    password = CharField(max_length=127)
    email = CharField(max_length=127, unique=True)
    rub_account = DecimalField(max_digits=16, decimal_places=2, default=0)

    def __str__(self):
        return f"User(id={self.id}, email={self.email})"
