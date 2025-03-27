from django.db.models import F, Subquery, OuterRef
from rest_framework.generics import ListAPIView
from cards.models import Card
from cards.serializers.cards import CardSerializer
from cards.models import Language, CardImage

class CardListView(ListAPIView):
    serializer_class = CardSerializer

    # Add language_code from URL params to the serializer context
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["language_code"] = self.kwargs.get("language_code", "en")  # Default to 'en'
        return context
    
    def get_queryset(self):
        # Get the language code from the URL
        language_code = self.kwargs['language_code']
        set_codes = self.request.query_params.get('set')
        rarity_codes = self.request.query_params.get('rarity')

        #Base query with no filters applied    
        cards_queryset= Card.objects.all().select_related('illustrator').prefetch_related('image').prefetch_related('pokemon_card_details').order_by('set__code', 'number')

        if set_codes:
            set_filter=set_codes.split(',')
            cards_queryset = cards_queryset.filter(set__code__in=set_filter)

        if rarity_codes:
            rarity_filter=rarity_codes.split(',')
            cards_queryset = cards_queryset.filter(rarity__code__in=rarity_filter)

        return cards_queryset
    
    #TODO : subquerying seems to be the scalable way to do things. 
    # def get_queryset(self):
    #     language_code = self.kwargs.get("language_code", "en")  # Get language from URL params

    #     # Subquery to fetch the correct image URL for each card
    #     image_subquery = CardImage.objects.filter(
    #         card=OuterRef("pk"), language__code=language_code
    #     ).values("url")[:1]  # Select only the first matching image

    #     return Card.objects.annotate(image_url=Subquery(image_subquery))
    

