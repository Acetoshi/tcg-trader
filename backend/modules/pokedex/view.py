from django.db import connection
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
import json


class PokedexView(SlidingAuthBaseView):

    def get(self, request):

        with connection.cursor() as cursor:
            sql_request, params = self.build_get_collection_query(
                {
                    "search": request.query_params.get("search"),
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
                p.pokedex_number AS pokedexNumber,
                p.image_url AS imgUrl,
                jsonb_object_agg(l.code, pt.name) AS name
            FROM cards_pokemon p
            INNER JOIN cards_pokemontranslation pt
                ON p.id = pt.pokemon_id
            INNER JOIN cards_language l
                ON pt.language_id = l.id
        """

        where_clauses = []
        params = {}

        if filters.get("search"):
            where_clauses.append("unaccent(pt.name) ILIKE unaccent(%(search)s)")
            params["search"] = f"%{filters['search']}%"

        if where_clauses:
            base_sql += " WHERE " + " AND ".join(where_clauses)

        base_sql += " GROUP BY p.id, p.pokedex_number, p.image_url ORDER BY p.pokedex_number ASC"

        return base_sql, params

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        results = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            # Convert the `name` field from JSON string to dict, if needed
            if isinstance(row_dict.get("name"), str):
                try:
                    row_dict["name"] = json.loads(row_dict["name"])
                except json.JSONDecodeError:
                    pass
            results.append(row_dict)
        return results
