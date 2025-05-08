import re
from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.security_utils.xss_safe_serializer import AutoSanitizingSerializer

User = get_user_model()


class UpdateUserInfoSerializer(AutoSanitizingSerializer):
    tcgpId = serializers.CharField(source="tcgp_id", allow_blank=True)
    avatarUrl = serializers.CharField(source="avatar_url", allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "bio", "tcgpId", "avatarUrl"]

    def validate_username(self, value):
        user = self.context["user"]
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if len(value) > 20:
            raise serializers.ValidationError("Username must be at most 20 characters long.")
        if User.objects.exclude(pk=user.pk).filter(username__unaccent__iexact=value).exists():
            raise serializers.ValidationError("This username is not available.")
        return value

    def validate_bio(self, value):
        if len(value) > 200:
            raise serializers.ValidationError("Bio must be at most 200 characters long.")
        return value

    def validate_tcgpId(self, value):
        if not re.match(r"^\d{4}-\d{4}-\d{4}-\d{4}$", value):
            raise serializers.ValidationError("tcgpId must be in the format 1234-5678-9012-3456")
        return value


class UpdateUserPasswordSerializer(serializers.Serializer):
    id = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        if len(value) < 12:
            raise serializers.ValidationError("Password must be at least 12 characters long.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):  # Special character check
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
        return value
