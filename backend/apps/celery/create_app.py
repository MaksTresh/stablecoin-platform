import asyncio
import threading
from datetime import timedelta

from celery import Celery, current_app as current_celery_app

from config import Settings

TASK_ROUTES = {
    'default': [
        'apps.authorization.tasks.test',
    ],
}


def create_celery_app(settings: Settings) -> Celery:
    current_celery_app.config_from_object(settings, namespace="CELERY")
    current_celery_app.conf.task_routes = {task: queue for queue, tasks in TASK_ROUTES.items() for task in tasks}
    current_celery_app.conf.beat_schedule = {
        'test': {
            'task': 'apps.authorization.tasks.test',
            'schedule': timedelta(hours=1),
        },
    }

    current_celery_app.loop = asyncio.get_event_loop()
    current_celery_app.loop_runner = threading.Thread(
        target=current_celery_app.loop.run_forever,
        daemon=True,
    )

    current_celery_app.loop_runner.start()

    return current_celery_app
