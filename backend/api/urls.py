from django.urls import path
from .views import HelloView, HealthView

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("health/", HealthView.as_view(), name="health"),
]