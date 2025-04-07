from rest_framework import serializers
from cards.models import Card
from cards.serializers.pokemon_card_details import PokemonCardDetailsSerializer


class CardSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    illustratorName = serializers.CharField(source="illustrator.name")
    rarityCode = serializers.CharField(source="rarity.code")
    rarityImageUrl = serializers.CharField(source="rarity.image_url")
    rarityName = serializers.CharField(read_only=True)
    setNumber = serializers.CharField(source="number")
    setCode = serializers.CharField(source="set.code")
    setName = serializers.CharField(read_only=True)
    imageUrl = serializers.CharField(read_only=True)
    pokemon_card_details = PokemonCardDetailsSerializer(many=True)

    class Meta:
        model = Card
        fields = [
            "id",
            "name",
            "imageUrl",
            "rarityCode",
            "rarityName",
            "rarityImageUrl",
            "setNumber",
            "setCode",
            "setName",
            "pokemon_card_details",
            "illustratorName",
        ]
        #'__all__'  # Include all fields from the Card model
