import re

from apps.authorization.schemas import UserRegister
from apps.authorization.models import User
from config import ValidationSettings


class UserValidator:
    def __init__(self, user_data: UserRegister, settings: ValidationSettings):
        self._settings = settings
        self._errors: list[dict[str, str]] = []
        self._user_data = user_data

    async def validate(self) -> None:
        self._errors = []
        self._validate_name_length()
        self._validate_password_length()
        self._validate_password_similarity()
        self._validate_email()
        await self._validate_email_uniqueness()

    def get_errors(self) -> list[dict[str, str]]:
        return self._errors.copy()

    def _validate_name_length(self) -> None:
        max_length = self._settings.USER_NAME_MAX_LENGTH

        if len(self._user_data.name) > max_length:
            self._errors.append({"message": f"Количество символов в имени не должно превышать {max_length})."})
            
    def _validate_password_length(self) -> None:
        max_length = self._settings.USER_PASSWORD_MAX_LENGTH
        min_length = self._settings.USER_PASSWORD_MIN_LENGTH

        if len(self._user_data.password) < min_length or len(self._user_data.password) > max_length:
            self._errors.append(
                {"message": f"Количество символов в пароле должно быть больше {min_length} и меньше {max_length}."}
            )

    def _validate_password_similarity(self) -> None:
        if self._user_data.password != self._user_data.repeated_password:
            self._errors.append(
                {"message": "Пароли не совпадают."}
            )

    def _validate_email(self) -> None:
        if not re.match(self._settings.EMAIL_REGEX, self._user_data.email):
            self._errors.append(
                {"message": "Введенный email не является корректным."}
            )

    async def _validate_email_uniqueness(self) -> None:
        if await User.filter(email=self._user_data.email).exists():
            self._errors.append(
                {"message": "Пользователь с таким email уже зарегистрирован."}
            )
