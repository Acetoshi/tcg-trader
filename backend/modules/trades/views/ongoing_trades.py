from django.db import connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.trades.sql.ongoing_trades_query import ongoing_trades_query


class OngoingtradesView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        with connection.cursor() as cursor:
            cursor.execute(ongoing_trades_query, [user_id, user_id])
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]

            paginator = PageNumberPagination()
            paginated_page = paginator.paginate_queryset(results, request)
            page = paginator.get_paginated_response(paginated_page)

        return page
