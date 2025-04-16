import bleach
from rest_framework import serializers


class AutoSanitizingSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        for field_name, value in attrs.items():
            if isinstance(value, str):
                attrs[field_name] = bleach.clean(value, tags=[], strip=True)
        return super().validate(attrs)
