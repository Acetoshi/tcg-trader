from django.db import connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView


class OngoingtradesView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    u.username AS "partnerUsername",
                    json_agg(
                        json_build_object(
                            'tradeId', trans.id,
                            'offeredCard', json_build_object(
                                'collectionId', your_ucc.id,
                                'languageCode', your_lang.code,
                                'cardRef', your_set.code || '-' || LPAD(your_card.number::text, 3, '0'),
                                'imgUrl', your_img.url
                            ),
                            'requestedCard', json_build_object(
                                'collectionId', their_ucc.id,
                                'languageCode', their_lang.code,
                                'cardRef', their_set.code || '-' || LPAD(their_card.number::text, 3, '0'),
                                'imgUrl', their_img.url
                            )
                        )
                    ) AS "ongoingTrades"
                FROM trades_tradetransaction trans
                INNER JOIN trades_tradestatus status
                    ON trans.status_id=status.id

                INNER JOIN accounts_customuser u
                    ON partner_id = u.id

                -- your card details
                INNER JOIN card_collections_usercardcollection your_ucc
                    ON trans.offered_id = your_ucc.id
                INNER JOIN cards_card your_card
                    ON your_ucc.card_id = your_card.id
                JOIN cards_cardimage your_img
                    ON your_card.id = your_img.card_id
                    AND your_ucc.language_id = your_img.language_id
                JOIN cards_language your_lang
                    ON your_lang.id = your_ucc.language_id
                JOIN cards_set your_set
                    ON your_set.id = your_card.set_id

                -- their card details
                INNER JOIN card_collections_usercardcollection their_ucc
                    ON trans.requested_id = their_ucc.id
                INNER JOIN cards_card their_card
                    ON their_ucc.card_id = their_card.id
                JOIN cards_cardimage their_img
                    ON their_card.id = their_img.card_id
                    AND their_ucc.language_id = their_img.language_id
                JOIN cards_language their_lang
                    ON their_lang.id = their_ucc.language_id
                JOIN cards_set their_set
                    ON their_set.id = their_card.set_id

                WHERE trans.initiator_id = %s
                AND status.code='Accepted'

                GROUP BY u.username
            """,
                [user_id],
            )
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]

            paginator = PageNumberPagination()
            paginated_page = paginator.paginate_queryset(results, request)
            page = paginator.get_paginated_response(paginated_page)

        return page
