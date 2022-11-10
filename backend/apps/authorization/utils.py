from fastapi import Depends
from fastapi_jwt_auth import AuthJWT

from apps.authorization.models import User


async def get_current_user(authorize: AuthJWT = Depends()):
    authorize.jwt_required()
    user_id = authorize.get_jwt_subject()
    return await User.filter(id=user_id).first()


def test():
    print('asdas')
