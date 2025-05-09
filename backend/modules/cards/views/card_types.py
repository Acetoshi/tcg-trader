from django.db.models import Subquery, OuterRef
from rest_framework.generics import ListAPIView
from modules.cards.serializers.card_type import CardTypeSerializer
from modules.cards.models import CardType, CardTypeTranslation
from modules.cards.utils import sanitize_input


class CardTypeListView(ListAPIView):
    serializer_class = CardTypeSerializer

    def get_queryset(self):
        # Get the language code from the URL
        language_code = sanitize_input(self.kwargs["language_code"])

        # Base query with no filters applied
        card_types_queryset = CardType.objects.all()

        card_type_name_subquery = CardTypeTranslation.objects.filter(
            card_type=OuterRef("id"),
            language__code__iexact=language_code,
        ).values("name")[:1]

        card_types_queryset = card_types_queryset.annotate(name=Subquery(card_type_name_subquery))

        return card_types_queryset
