import json
from django.http import JsonResponse
from django.views import View


class HelloView(View):
    """Returns a simple Hello World JSON response."""

    def get(self, request):
        return JsonResponse({"message": "Hello, World!", "status": "ok"})


class HealthView(View):
    """Health check endpoint — Render pings this to confirm the service is up."""

    def get(self, request):
        return JsonResponse({"status": "healthy"})