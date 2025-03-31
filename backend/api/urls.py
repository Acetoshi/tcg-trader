from django.urls import include, path
from rest_framework import routers
from django.contrib import admin

router = routers.DefaultRouter()

urlpatterns = [
    path("api/", include(router.urls)),
    path('api/admin', admin.site.urls),
    path("api/auth/", include("auth.urls")),
    path("api/<str:language_code>/", include("cards.urls")),
]
