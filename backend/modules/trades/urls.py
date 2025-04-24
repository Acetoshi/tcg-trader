from django.urls import path
from modules.trades.views.opportunities import TradeOpportunitiesView

urlpatterns = [
    path("/opportunities", TradeOpportunitiesView.as_view(), name="my_collection"),
]
