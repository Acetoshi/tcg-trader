from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.card_collections.serializers.patch_my_collection import PatchMyCollectionSerializer
from modules.card_collections.sql.collection_query_builder import build_get_collection_query


class MyCollectionView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        with connection.cursor() as cursor:
            sql_request, params = build_get_collection_query(
                {
                    "user_id": request.user.id,
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

    def patch(self, request):
        serializer = PatchMyCollectionSerializer(data=request.data, context={"user": request.user})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()

        response_data = serializer.build_response_object(
            {"user_id": request.user.id, "card_id": obj.card.id}
        )

        if serializer.created:
            return Response(response_data, status.HTTP_201_CREATED)
        else:
            return Response(response_data, status.HTTP_200_OK)
