from rest_framework import serializers
from cards.models import Color


class ColorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    imageUrl = serializers.CharField(source="image_url")

    class Meta:
        model = Color
        fields = ["code", "name", "imageUrl"]
