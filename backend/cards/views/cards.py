from django.db.models import F, Subquery, OuterRef
from rest_framework.generics import ListAPIView
from cards.models import Card
from cards.serializers.cards import CardSerializer
from cards.models import SetTranslation, CardImage, RarityTranslation, CardNameTranslation

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

        # Accessing the set name based on the language parameters
        set_name_subquery = SetTranslation.objects.filter(
            set_id=OuterRef('set_id'),  # Match the set of the card
            language__code__iexact=language_code  # Filter by language
        ).values('name')[:1]  # Get only the first match

        cards_queryset = cards_queryset.annotate(setName=Subquery(set_name_subquery))


        # Accessing the image url based on the language parameters
        image_url_subquery = CardImage.objects.filter(
            card_id=OuterRef('id'), 
            language__code__iexact=language_code
        ).values('url')[:1]

        cards_queryset = cards_queryset.annotate(imageUrl=Subquery(image_url_subquery ))


        # Accessing the rarity name based on the language parameters
        rarity_name_subquery = RarityTranslation.objects.filter(
            rarity_id=OuterRef('rarity_id'), 
            language__code__iexact=language_code
        ).values('name')[:1]

        cards_queryset = cards_queryset.annotate(rarityName=Subquery(rarity_name_subquery ))

        # Accessing the card name based on the language parameters
        card_name_subquery = CardNameTranslation.objects.filter(
            card_id=OuterRef('id'), 
            language__code__iexact=language_code
        ).values('name')[:1]

        cards_queryset = cards_queryset.annotate(name=Subquery(card_name_subquery ))

        return cards_queryset
    

