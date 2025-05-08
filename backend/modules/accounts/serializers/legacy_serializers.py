from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.security_utils.xss_safe_serializer import AutoSanitizingSerializer

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class ResetPasswordSerializer(serializers.Serializer):
    id = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ForgottenPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserDetailsSerializer(AutoSanitizingSerializer):
    tcgpId = serializers.CharField(source="tcgp_id", allow_blank=True)
    avatarUrl = serializers.CharField(source="avatar_url", allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "bio", "tcgpId", "avatarUrl"]

    def validate_username(self, value):
        user = self.instance or self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is not available.")
        return value
