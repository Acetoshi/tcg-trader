from django.urls import path
from modules.card_collections.views.my_collection import MyCollectionView
from modules.card_collections.views.user_collection import UserCollectionView

urlpatterns = [
    path("user/collection", MyCollectionView.as_view(), name="my_collection"),
    path(
        "users/<str:target_username>/collection",
        UserCollectionView.as_view(),
        name="user_collection",
    ),
]
