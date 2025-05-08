import re
import random
from rest_framework import serializers
from api.security_utils.xss_safe_serializer import AutoSanitizingSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class CreateUserSerializer(AutoSanitizingSerializer):
    password = serializers.CharField(write_only=True, min_length=12)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not available.")
        return value

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if len(value) > 20:
            raise serializers.ValidationError("Username must be at most 20 characters long.")
        if User.objects.filter(username__unaccent__iexact=value).exists():
            raise serializers.ValidationError("This username is not available.")
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

        # give the user a random starter avatar
        starters = [
            "pikachu",
            "eevee",
            "snorlax",
            "mew",
            "mewtwo",
            "charizard",
            "gengar",
            "bulbasaur",
            "charmander",
            "squirtle",
            "chikorita",
            "cyndaquil",
            "totodile",
            "treecko",
            "torchic",
            "mudkip",
            "turtwig",
            "chimchar",
            "piplup",
            "snivy",
            "tepig",
            "oshawott",
            "chespin",
            "fennekin",
            "froakie",
            "rowlet",
            "litten",
            "popplio",
            "grookey",
            "scorbunny",
            "sobble",
            "sprigatito",
            "fuecoco",
            "quaxly",
        ]

        random_pokemon = random.choice(starters)
        random_avatar_url = f"/images/pokemon/{random_pokemon}.webp"

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            avatar_url=random_avatar_url,
            is_active=False,  # Deactivate account until email verification
        )
        return user
