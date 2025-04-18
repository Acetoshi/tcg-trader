from accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from card_collections.models import UserCardCollection
from card_collections.serializers.patch_my_collection import PatchMyCollectionSerializer


class MyCollectionView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        with connection.cursor() as cursor:
            sql_request, params = self.build_get_collection_query(
                {
                    "user_id": request.user.id,
                    "set_codes": request.query_params.get("set"),
                    "rarity_codes": request.query_params.get("rarity"),
                    "search": request.query_params.get("search"),
                }
            )
            cursor.execute(sql_request, params)
            results = self.dict_fetchall(cursor)

        return Response(results, status.HTTP_200_OK)

    # This complex query was needed because django's ORM won't easily handle the json_agg function
    def build_get_collection_query(self, filters):
        base_sql = """
            SELECT
                c.id AS cardId,
                c.number,
                set.code AS setCode,
                json_agg(
                    json_build_object(
                        'languageCode', lang.code,
                        'name', name_trans.name,
                        'imageUrl', img.url,
                        'owned', COALESCE(ucc.quantity_owned, 0),
                        'forTrade', COALESCE(ucc.quantity_for_trade, 0),
                        'desired', COALESCE(ucc.desired_quantity, 0)
                    )
                    ORDER BY lang.code
                ) AS variants
            FROM cards_card c
            INNER JOIN cards_cardnametranslation name_trans ON name_trans.card_id = c.id
            INNER JOIN cards_language lang ON lang.id = name_trans.language_id
            INNER JOIN cards_set set ON set.id = c.set_id
            INNER JOIN cards_rarity rarity ON rarity.id = c.rarity_id
            LEFT JOIN cards_cardimage img ON img.card_id = c.id AND img.language_id = lang.id
            LEFT JOIN card_collections_usercardcollection ucc
                ON ucc.card_id = c.id AND ucc.language_id = lang.id AND ucc.user_id = %(user_id)s
        """

        where_clauses = []
        params = {"user_id": filters["user_id"]}

        if filters.get("set_codes"):
            set_codes = filters["set_codes"].split(",")
            where_clauses.append("set.code IN %(set_codes)s")
            params["set_codes"] = tuple(set_codes)

        if filters.get("rarity_codes"):
            rarity_codes = filters["rarity_codes"].split(",")
            where_clauses.append("rarity.code IN %(rarity_codes)s")
            params["rarity_codes"] = tuple(rarity_codes)

        if filters.get("search"):
            where_clauses.append("unaccent(name_trans.name) ILIKE unaccent(%(search)s)")
            params["search"] = f"%{filters['search']}%"

        if where_clauses:
            base_sql += " WHERE " + " AND ".join(where_clauses)

        base_sql += " GROUP BY c.id, c.number, c.set_id, set.code ORDER BY c.set_id, c.number"

        return base_sql, params

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

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
