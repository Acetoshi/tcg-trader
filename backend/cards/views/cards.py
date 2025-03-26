from rest_framework.generics import ListAPIView
from cards.models import Card
from cards.serializers.cards import CardSerializer

class CardListView(ListAPIView):
    queryset = Card.objects.all().select_related('illustrator').prefetch_related('image')
    serializer_class = CardSerializer