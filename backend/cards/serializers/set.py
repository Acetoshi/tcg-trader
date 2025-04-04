from rest_framework import serializers
from cards.models import Set


class SetSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Set
        fields = ["code", "name"]
