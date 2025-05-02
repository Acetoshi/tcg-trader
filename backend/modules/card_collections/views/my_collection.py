from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.card_collections.serializers.patch_my_collection import PatchMyCollectionSerializer


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

    # This complex query was needed because django's ORM won't easily handle the json_agg function
    def build_get_collection_query(self, filters):
        base_sql = """
            SELECT
                c.id AS "id",
                c.number AS "setNumber",
                set.code AS "setCode",
                json_agg(
                    json_build_object(
                        'languageCode', lang.code,
                        'name', name_trans.name,
                        'imageUrl', img.url,
                        'owned', COALESCE(ucc.quantity_owned, 0),
                        'forTrade', COALESCE(ucc.quantity_for_trade, 0),
                        'wishlist', COALESCE(ucc.desired_quantity, 0)
                    )
                    ORDER BY lang.code
                ) AS "languageVersions"
            FROM cards_card c
            INNER JOIN cards_cardnametranslation name_trans ON name_trans.card_id = c.id
            INNER JOIN cards_language lang ON lang.id = name_trans.language_id
            INNER JOIN cards_set set ON set.id = c.set_id
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
            base_sql += " INNER JOIN cards_rarity rarity ON rarity.id = c.rarity_id "

        if filters.get("card_type_codes"):
            card_type_codes = filters["card_type_codes"].split(",")
            where_clauses.append("type.code IN %(card_type_codes)s")
            params["card_type_codes"] = tuple(card_type_codes)
            base_sql += " INNER JOIN cards_cardtype type ON type.id = c.type_id "

        if filters.get("weakness_codes") or filters.get("color_codes"):
            base_sql += (
                " INNER JOIN cards_pokemoncarddetails poke_details ON poke_details.card_id = c.id "
            )

            if filters.get("color_codes"):
                color_codes = filters["color_codes"].split(",")
                where_clauses.append("color.code IN %(color_codes)s")
                params["color_codes"] = tuple(color_codes)
                base_sql += " INNER JOIN cards_color color ON poke_details.color_id=color.id "

            if filters.get("weakness_codes"):
                weakness_codes = filters["weakness_codes"].split(",")
                where_clauses.append("weakness.code IN %(weakness_codes)s")
                params["weakness_codes"] = tuple(weakness_codes)
                base_sql += (
                    " INNER JOIN cards_color weakness ON poke_details.weak_to_id=weakness.id "
                )

        if filters.get("search"):
            where_clauses.append("unaccent(name_trans.name) ILIKE unaccent(%(search)s)")
            params["search"] = f"%{filters['search']}%"

        if filters.get("owned_only") and filters["owned_only"] == "true":
            where_clauses.append("ucc.quantity_owned >= 1")

        if filters.get("wishlist_only") and filters["wishlist_only"] == "true":
            where_clauses.append("ucc.desired_quantity >= 1")

        if where_clauses:
            base_sql += " WHERE " + " AND ".join(where_clauses)

        base_sql += " GROUP BY c.id, c.number, c.set_id, set.code ORDER BY c.set_id, c.number "  # TODO : remove the limit and implement pagination

        return base_sql, params

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
