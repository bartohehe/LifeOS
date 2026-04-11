from .base import *
import dj_database_url
from decouple import config

DEBUG = False
DATABASES = {
    'default': dj_database_url.parse(config('DATABASE_URL'))
}
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
