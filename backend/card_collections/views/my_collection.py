from accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from card_collections.models import UserCardCollection
from card_collections.serializers.patch_my_collection import PatchMyCollectionSerializer
from card_collections.serializers.get_my_collection import GetMyCollectionSerializer


class MyCollectionView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cards = UserCardCollection.objects.filter(user=user)
        print(cards)
        serializer = GetMyCollectionSerializer(cards, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = PatchMyCollectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        card = serializer.validated_data["card"]
        language = serializer.validated_data.get("language")

        obj, created = UserCardCollection.objects.get_or_create(
            user=user, card=card, language=language
        )

        updated = serializer.update(obj, serializer.validated_data)
        if created:
            return Response(PatchMyCollectionSerializer(updated).data, status.HTTP_201_CREATED)
        else:
            return Response(PatchMyCollectionSerializer(updated).data, status.HTTP_200_OK)
