from rest_framework import serializers
from modules.cards.models import Illustrator


class IllustratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Illustrator
        fields = ["name"]
