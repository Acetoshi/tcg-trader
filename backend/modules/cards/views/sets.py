from django.db.models import Subquery, OuterRef
from rest_framework.generics import ListAPIView
from modules.cards.serializers.set import SetSerializer
from modules.cards.models import Set, SetTranslation
from modules.cards.utils import sanitize_input


class SetListView(ListAPIView):
    serializer_class = SetSerializer

    def get_queryset(self):
        # Get the language code from the URL
        language_code = sanitize_input(self.kwargs["language_code"])

        # Base query with no filters applied
        sets_queryset = Set.objects.all().order_by("code")

        set_name_subquery = SetTranslation.objects.filter(
            set_id=OuterRef("id"),  # Match the set of the card
            language__code__iexact=language_code,  # Filter by language
        ).values("name")[:1]

        sets_queryset = sets_queryset.annotate(name=Subquery(set_name_subquery))

        return sets_queryset
