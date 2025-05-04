from django.db import connection
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView


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
            SELECT * from cards_pokemon pokemon
        """

        where_clauses = []
        params = {}

        if filters.get("search"):
            where_clauses.append("unaccent(name_trans.name) ILIKE unaccent(%(search)s)")
            params["search"] = f"%{filters['search']}%"

        if where_clauses:
            base_sql += " WHERE " + " AND ".join(where_clauses)

        base_sql += " ORDER BY pokemon.id ASC"

        return base_sql, params

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
