from django.db.models import Subquery, OuterRef
from rest_framework.generics import ListAPIView
from cards.serializers.color import ColorSerializer
from cards.models import Color, ColorTranslation
from cards.utils import sanitize_input


class ColorListView(ListAPIView):
    serializer_class = ColorSerializer

    def get_queryset(self):
        # Get the language code from the URL
        language_code = sanitize_input(self.kwargs["language_code"])

        # Base query with no filters applied
        colors_queryset = Color.objects.all().order_by("id")

        color_name_subquery = ColorTranslation.objects.filter(
            color_id=OuterRef("id"), language__code__iexact=language_code
        ).values("name")[:1]

        colors_queryset = colors_queryset.annotate(name=Subquery(color_name_subquery))

        return colors_queryset
