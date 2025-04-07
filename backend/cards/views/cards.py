from django.db.models import Q, Subquery, OuterRef
from rest_framework.generics import ListAPIView
from cards.models import Card
from cards.serializers.cards import CardSerializer
from cards.models import (
    SetTranslation,
    CardImage,
    RarityTranslation,
    CardNameTranslation,
    CardTypeTranslation,
)
from cards.utils import sanitize_input


class CardListView(ListAPIView):
    serializer_class = CardSerializer

    def get_queryset(self):
        # Get all parameters from URL, and sanitize them
        language_code = sanitize_input(self.kwargs["language_code"])
        search = sanitize_input(self.request.query_params.get("search"))
        set_codes = self.request.query_params.get("set")
        rarity_codes = self.request.query_params.get("rarity")
        type_codes = self.request.query_params.get("type")

        # Base query with no filters applied
        cards_queryset = (
            Card.objects.all()
            .select_related("illustrator")
            .prefetch_related("image")
            .prefetch_related("pokemon_card_details")
            .order_by("set__code", "number")
        )

        if set_codes:
            set_filter = list(map(sanitize_input, set_codes.split(",")))
            cards_queryset = cards_queryset.filter(set__code__in=set_filter)

        if rarity_codes:
            rarity_filter = list(map(sanitize_input, rarity_codes.split(",")))
            cards_queryset = cards_queryset.filter(rarity__code__in=rarity_filter)

        if type_codes:
            type_filter = list(map(sanitize_input, type_codes.split(",")))
            cards_queryset = cards_queryset.filter(type__code__in=type_filter)

        # Accessing the set name based on the language parameters
        set_name_subquery = SetTranslation.objects.filter(
            set_id=OuterRef("set_id"),  # Match the set of the card
            language__code__iexact=language_code,  # Filter by language
        ).values("name")[
            :1
        ]  # Get only the first match

        cards_queryset = cards_queryset.annotate(setName=Subquery(set_name_subquery))

        # Accessing the image url based on the language parameters
        image_url_subquery = CardImage.objects.filter(
            card_id=OuterRef("id"), language__code__iexact=language_code
        ).values("url")[:1]

        cards_queryset = cards_queryset.annotate(imageUrl=Subquery(image_url_subquery))

        # Accessing the rarity name based on the language parameters
        rarity_name_subquery = RarityTranslation.objects.filter(
            rarity_id=OuterRef("rarity_id"), language__code__iexact=language_code
        ).values("name")[:1]

        cards_queryset = cards_queryset.annotate(rarityName=Subquery(rarity_name_subquery))

        # Accessing the card name based on the language parameters
        card_name_subquery = CardNameTranslation.objects.filter(
            card_id=OuterRef("id"), language__code__iexact=language_code
        ).values("name")[:1]

        cards_queryset = cards_queryset.annotate(name=Subquery(card_name_subquery))

        # # Accessing the card type name based on the language parameters
        card_type_name_subquery = CardTypeTranslation.objects.filter(
            card_type=OuterRef("type_id"), language__code__iexact=language_code
        ).values("name")[:1]

        cards_queryset = cards_queryset.annotate(typeName=Subquery(card_type_name_subquery))

        # Filtering by search term
        if search:
            search_condition = Q(illustrator__name__icontains=search) | Q(name__icontains=search)
            cards_queryset = cards_queryset.filter(search_condition).distinct()

        return cards_queryset
