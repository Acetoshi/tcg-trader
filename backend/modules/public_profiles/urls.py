from django.urls import path
from modules.public_profiles.views.user_info import UserInfoView

urlpatterns = [
    path("<str:target_username>/info", UserInfoView.as_view(), name="pokedex"),
]
