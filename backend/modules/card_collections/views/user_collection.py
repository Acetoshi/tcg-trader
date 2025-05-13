from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.card_collections.serializers.read_user_collection import ReadUserCollection


class UserCollectionView(SlidingAuthBaseView):

    def get(self, request, **kwargs):
        target_username = kwargs["target_username"]
        serializer = ReadUserCollection(
            data={"username": target_username, "query_params": request.query_params.dict()}
        )

        if not serializer.is_valid():
            return Response(
                {"message": "User collection not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_collection = serializer.read_user_collection("owned")

        paginator = PageNumberPagination()
        paginated_page = paginator.paginate_queryset(user_collection, request)

        return paginator.get_paginated_response(paginated_page)
