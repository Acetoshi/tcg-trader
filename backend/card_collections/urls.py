from django.urls import path
from card_collections.views.my_collection import MyCollectionView

urlpatterns = [
    path("user/collection", MyCollectionView.as_view(), name="my_collection"),
]
