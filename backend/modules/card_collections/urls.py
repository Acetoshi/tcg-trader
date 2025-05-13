from django.urls import path
from modules.card_collections.views.my_collection import MyCollectionView
from modules.card_collections.views.user_collection import UserCollectionView
from modules.card_collections.views.user_for_trade import UserForTradeView
from modules.card_collections.views.user_wishlist import UserWishlistView

urlpatterns = [
    path("user/collection", MyCollectionView.as_view(), name="my-collection"),
    path(
        "users/<str:target_username>/collection",
        UserCollectionView.as_view(),
        name="target-user-collection",
    ),
    path(
        "users/<str:target_username>/for-trade",
        UserForTradeView.as_view(),
        name="target-user-for-trade",
    ),
    path(
        "users/<str:target_username>/wishlist",
        UserWishlistView.as_view(),
        name="target-user-wishlist",
    ),
]
