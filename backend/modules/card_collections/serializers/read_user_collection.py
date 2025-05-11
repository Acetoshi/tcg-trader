from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ReadUserCollection(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, attrs):
        try:
            user = User.objects.get(username=attrs["username"])
            attrs["user"] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("This user doesn't exist")
        return attrs

    def read_user_collection(self, **kwargs):
        user = self.validated_data["user"]

        user_info = {
            "username": user.username,
            "tcgpId": user.tcgp_id,
            "bio": user.bio,
            "avatarUrl": user.avatar_url,
        }

        return user_info
