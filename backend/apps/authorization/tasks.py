import asyncio

from celery import current_app as current_celery_app
from celery.utils.log import get_task_logger

from apps.authorization.models import User
from apps.celery.utils import db_context

logger = get_task_logger(__name__)


async def finance_updates():
    pass


@current_celery_app.task()
def test():
    asyncio.run_coroutine_threadsafe(
        coro=db_context(finance_updates),
        loop=current_celery_app.loop,
    )
