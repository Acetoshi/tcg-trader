from django.db.models import OuterRef, Subquery
from rest_framework.generics import ListAPIView
from cards.models import Card
from cards.serializers.cards import CardSerializer
from cards.models import Language, CardImage

class CardListView(ListAPIView):
    serializer_class = CardSerializer
    
    def get_queryset(self):
        # Get the language code from the URL
        language_code = self.kwargs['language_code']
        set_codes = self.request.query_params.get('set')
        rarity_codes = self.request.query_params.get('rarity')

        #Base query with no filters applied    
        cards_queryset= Card.objects.all().select_related('illustrator').prefetch_related('image').order_by('set__code', 'number')

        if set_codes:
            set_filter=set_codes.split(',')
            cards_queryset = cards_queryset.filter(set__code__in=set_filter)

        if rarity_codes:
            rarity_filter=rarity_codes.split(',')
            cards_queryset = cards_queryset.filter(rarity__code__in=rarity_filter)

        return cards_queryset
    

