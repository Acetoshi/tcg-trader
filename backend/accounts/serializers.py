from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers
import re

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=12)

    class Meta:
        model = User
        fields = ["email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

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

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class ResetPasswordSerializer(serializers.Serializer):
    id = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ForgottenPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "bio", "tcgpId"]

    tcgpId = serializers.CharField(source="tcgp_id")
    # username = serializers.CharField()
