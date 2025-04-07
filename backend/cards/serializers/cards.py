from rest_framework import serializers
from cards.models import Card
from cards.serializers.pokemon_card_details import PokemonCardDetailsSerializer


class CardSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    typeCode = illustratorName = serializers.CharField(source="type.code")
    typeName = serializers.CharField(read_only=True)
    illustratorName = serializers.CharField(source="illustrator.name")
    rarityCode = serializers.CharField(source="rarity.code")
    rarityImageUrl = serializers.CharField(source="rarity.image_url")
    rarityName = serializers.CharField(read_only=True)
    setNumber = serializers.CharField(source="number")
    setCode = serializers.CharField(source="set.code")
    setName = serializers.CharField(read_only=True)
    imageUrl = serializers.CharField(read_only=True)

    pokemonDetails = serializers.SerializerMethodField()

    def get_pokemonDetails(self, obj):
        # Assuming `pokemon_card_details` is prefetched, otherwise performance is bad.
        # The query below has a slightly better performance, but returns an array.
        # pokemonDetails = PokemonCardDetailsSerializer(many=True, source="pokemon_card_details")
        pokemon_details = obj.pokemon_card_details.first()
        if pokemon_details:
            return PokemonCardDetailsSerializer(pokemon_details).data
        return None

    class Meta:
        model = Card
        fields = [
            "id",
            "name",
            "typeCode",
            "typeName",
            "imageUrl",
            "rarityCode",
            "rarityName",
            "rarityImageUrl",
            "setNumber",
            "setCode",
            "setName",
            "pokemonDetails",
            "illustratorName",
        ]
        # fields = '__all__'  # Include all fields from the Card model
