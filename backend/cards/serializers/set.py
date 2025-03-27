from rest_framework import serializers
from cards.models import Set

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['code']