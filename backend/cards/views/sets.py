from django.db.models import Subquery, OuterRef
from rest_framework.generics import ListAPIView
from cards.serializers.set import SetSerializer
from cards.models import Set, SetTranslation


class SetListView(ListAPIView):
    serializer_class = SetSerializer

    def get_queryset(self):
        # Get the language code from the URL
        language_code = self.kwargs["language_code"]

        # Base query with no filters applied
        sets_queryset = Set.objects.all().order_by("code")

        set_name_subquery = SetTranslation.objects.filter(
            set_id=OuterRef("id"),  # Match the set of the card
            language__code__iexact=language_code,  # Filter by language
        ).values("name")[:1]

        sets_queryset = sets_queryset.annotate(name=Subquery(set_name_subquery))

        return sets_queryset
