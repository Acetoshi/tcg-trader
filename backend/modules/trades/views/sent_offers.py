from django.db import connection
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView


class SentTradeOffersView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT *
                FROM trades_tradetransaction trans
                WHERE trans.initiator_id = %s
            """,
                [user_id],
            )
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(results, status=status.HTTP_200_OK)
