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

        # print(language_code)
        
        # Fetch the language object based on the language code (default to English if not found)
        #language = Language.objects.get(code=language_code)

        # Filter the cards based on the language (including translations and images)
        #return Card.objects.all().select_related('illustrator').prefetch_related('image')
    
        # Define the language you want to filter by
        target_language = Language.objects.get(code=language_code.upper())

        # Subquery to select the image URL for the 'en' language
        image_subquery = CardImage.objects.filter(
            card=OuterRef('pk'),  # Match the 'card' foreign key
            language=target_language  # Filter by English language
        ).values('url')  # Select only the URL field

        #print(image_subquery)

        # Now query the Card model, annotating each card with its associated 'image_url'
        cards = Card.objects.all().select_related('illustrator').annotate(
            image_url=Subquery(image_subquery[:1])  # Take the first image URL (if available)
        )

        return cards
