import celery

from apps.celery.create_app import create_celery_app
from config import get_settings

celery = celery.Celery()
create_celery_app(get_settings())
