from django.urls import path
from cards.views.cards import CardListView
from cards.views.sets import SetListView

urlpatterns = [
    path('cards', CardListView.as_view(), name='card-list'),
    path('sets', SetListView.as_view(), name='set-list'),
]