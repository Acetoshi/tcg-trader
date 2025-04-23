from django.db.models import Subquery, OuterRef
from rest_framework.generics import ListAPIView
from modules.cards.serializers.rarity import RaritySerializer
from modules.cards.models import Rarity, RarityTranslation
from modules.cards.utils import sanitize_input


class RarityListView(ListAPIView):
    serializer_class = RaritySerializer

    def get_queryset(self):
        # Get the language code from the URL
        language_code = sanitize_input(self.kwargs["language_code"])

        # Base query with no filters applied
        rarities_queryset = Rarity.objects.all().order_by("id")

        rarity_name_subquery = RarityTranslation.objects.filter(
            rarity_id=OuterRef("id"), language__code__iexact=language_code
        ).values("name")[:1]

        rarities_queryset = rarities_queryset.annotate(name=Subquery(rarity_name_subquery))

        return rarities_queryset
