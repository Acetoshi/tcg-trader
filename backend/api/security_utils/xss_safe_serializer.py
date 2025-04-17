import bleach
from rest_framework import serializers


# this serializer is useful wherever the user can type text in.
class AutoSanitizingSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        for field_name, value in attrs.items():
            if isinstance(value, str):
                attrs[field_name] = bleach.clean(value, tags=[], strip=True)
        return super().validate(attrs)
