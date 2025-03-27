from rest_framework import serializers
from cards.models import Card
from cards.serializers.card_images import CardImageSerializer
from cards.serializers.pokemon_card_details import PokemonCardDetailsSerializer

class CardSerializer(serializers.ModelSerializer):
    illustratorName = serializers.CharField(source="illustrator.name") 
    rarityCode = serializers.CharField(source="rarity.code")
    rarityImgUrl = serializers.CharField(source="rarity.image_url")
    setCode = serializers.CharField(source="set.code")
    imageUrl = serializers.SerializerMethodField()
    pokemon_card_details=PokemonCardDetailsSerializer(many=True)

    class Meta:
        model = Card
        fields = '__all__'  # Include all fields from the Card model

    def get_imageUrl(self, obj):
        language_code = self.context.get("language_code", "en")  # Default to 'en'
        image = obj.image.filter(language__code__iexact=language_code).first()  # Adjust filtering based on language_code if needed
        return image.url if image else None