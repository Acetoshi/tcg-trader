from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.card_collections.serializers.read_user_collection import ReadUserCollection
from modules.card_collections.sql.collection_query_builder import build_get_collection_query


class UserCollectionView(SlidingAuthBaseView):

    def get(self, request, **kwargs):
        target_username = kwargs["target_username"]
        serializer = ReadUserCollection(data={"username": target_username})

        if not serializer.is_valid():
            return Response(
                {"message": "User collection not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        target_user_id = serializer.validated_data["user"].id

        with connection.cursor() as cursor:
            sql_request, params = build_get_collection_query(
                {
                    "user_id": target_user_id,
                    "set_codes": request.query_params.get("set"),
                    "rarity_codes": request.query_params.get("rarity"),
                    "search": request.query_params.get("search"),
                    "card_type_codes": request.query_params.get("type"),
                    "color_codes": request.query_params.get("color"),
                    "weakness_codes": request.query_params.get("weakness"),
                    "owned_only": request.query_params.get("owned"),
                    "wishlist_only": request.query_params.get("wishlist"),
                }
            )
            cursor.execute(sql_request, params)
            results = self.dict_fetchall(cursor)

            paginator = PageNumberPagination()
            paginated_page = paginator.paginate_queryset(results, request)

        return paginator.get_paginated_response(paginated_page)

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
