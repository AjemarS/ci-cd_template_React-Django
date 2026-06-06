"""
Django settings for the template project.
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ─────────────────────────────────────────────
# Security
# ─────────────────────────────────────────────
# In production set this via an environment variable in Render dashboard.
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-change-me-in-production")

DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost 127.0.0.1").split()

# ─────────────────────────────────────────────
# CORS — allow the GitHub Pages frontend to call this API
# Set CORS_ALLOWED_ORIGINS in Render environment variables.
# Example: https://your-username.github.io
# ─────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173"
).split()

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

# ─────────────────────────────────────────────
# Application definition
# ─────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "corsheaders",  # django-cors-headers
    "api",          # our hello-world app
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be first
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "core.urls"

WSGI_APPLICATION = "core.wsgi.application"

# ─────────────────────────────────────────────
# No database needed for this template.
# Add your database config here when needed.
# ─────────────────────────────────────────────
DATABASES = {}

# ─────────────────────────────────────────────
# Static files
# ─────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"