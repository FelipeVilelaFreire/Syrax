from .base import *

DEBUG = True
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4923',   # web/ (Next.js consumer app)
    'http://localhost:6711',   # admin/ (Vite admin panel)
]
CORS_ALLOW_CREDENTIALS = True
