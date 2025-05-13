from django.db import connection
from django.contrib.auth import get_user_model
from rest_framework import serializers
from modules.card_collections.sql.collection_query_builder import build_get_collection_query

User = get_user_model()


class ReadUserCollection(serializers.Serializer):
    username = serializers.CharField()
    query_params = serializers.DictField(required=False)

    def validate(self, attrs):
        try:
            user = User.objects.get(username=attrs["username"])
            attrs["user"] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("This user doesn't exist")
        return attrs

    def read_user_collection(self, view_mode):
        user = self.validated_data["user"]
        query_params = self.validated_data.get("query_params", {})

        with connection.cursor() as cursor:
            sql_request, params = build_get_collection_query(
                {
                    "user_id": user.id,
                    "set_codes": query_params.get("set"),
                    "rarity_codes": query_params.get("rarity"),
                    "search": query_params.get("search"),
                    "card_type_codes": query_params.get("type"),
                    "color_codes": query_params.get("color"),
                    "weakness_codes": query_params.get("weakness"),
                    "owned_only": view_mode == "owned",
                    "wishlist_only": view_mode == "wishlist",
                    "for_trade_only": view_mode == "for_trade",
                }
            )
            cursor.execute(sql_request, params)
            results = self.dict_fetchall(cursor)

        return results

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
