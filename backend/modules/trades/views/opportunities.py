from django.db import connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView


class TradeOpportunitiesView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        with connection.cursor() as cursor:
            sql_request, params = self.build_get_opportunities_query(
                {
                    "user_id": request.user.id,
                }
            )
            cursor.execute(sql_request, params)
            results = self.dict_fetchall(cursor)

            paginator = PageNumberPagination()
            paginated_page = paginator.paginate_queryset(results, request)

        return paginator.get_paginated_response(paginated_page)

    # TODO : this query needs to filter out pending opportunities
    def build_get_opportunities_query(self, filters):
        base_sql = """
        WITH matches AS (
            SELECT
                your_offer.id as your_offer_id,
                your_offer.card_id as your_card_id,
                your_offer.language_id as your_offer_language_id,
                their_offer.user_id as their_user_id,
                their_offer.id as their_offer_id,
                their_offer.card_id as their_card_id,
                their_offer.language_id as their_offer_language_id

            FROM card_collections_usercardcollection your_offer
            JOIN card_collections_usercardcollection their_offer
                ON their_offer.user_id != your_offer.user_id

            -- Your want = what they offer
            JOIN card_collections_usercardcollection your_wish
                ON your_wish.card_id = their_offer.card_id
                AND your_wish.language_id = their_offer.language_id
                AND your_wish.user_id = your_offer.user_id

            -- Their want = what you offer
            JOIN card_collections_usercardcollection their_wish
                ON their_wish.card_id = your_offer.card_id
                AND their_wish.language_id = your_offer.language_id
                AND their_wish.user_id = their_offer.user_id

            WHERE your_offer.user_id = %(user_id)s
            AND ( your_offer.card_id != their_offer.card_id
                OR your_offer.language_id != their_offer.language_id )
            AND your_offer.quantity_for_trade >= 1
            AND your_wish.desired_quantity >= 1
            AND their_offer.quantity_for_trade >= 1
            AND their_wish.desired_quantity >= 1

        )
        SELECT
            u.username AS "partnerUsername",
            json_agg(
                json_build_object(
                    'offeredCard', json_build_object(
                        'collectionId', your_offer_id,
                        'languageCode', your_lang.code,
                        'cardRef', your_set.code || '-' || LPAD(your_card.number::text, 3, '0'),
                        'imgUrl', your_img.url
                    ),
                    'requestedCard', json_build_object(
                        'collectionId', their_offer_id,
                        'languageCode', their_lang.code,
                        'cardRef', their_set.code || '-' || LPAD(their_card.number::text, 3, '0'),
                        'imgUrl', their_img.url
                    )
                )
            ) AS "opportunities"
        FROM matches

        JOIN accounts_customuser u
            ON their_user_id = u.id

        -- Join the necessary tables for the images and language codes
        JOIN cards_cardimage your_img
            ON your_card_id = your_img.card_id
            AND your_offer_language_id = your_img.language_id
        JOIN cards_language your_lang
            ON your_lang.id = your_offer_language_id
        JOIN cards_card your_card
            ON your_card_id = your_card.id
        JOIN cards_set your_set
            ON your_set.id = your_card.set_id

        JOIN cards_cardimage their_img
            ON their_card_id = their_img.card_id
            AND their_offer_language_id = their_img.language_id
        JOIN cards_language their_lang
            ON their_lang.id = their_offer_language_id
        JOIN cards_card their_card
            ON their_card_id = their_card.id
        JOIN cards_set their_set
            ON their_set.id = their_card.set_id

        WHERE
            your_card.rarity_id=their_card.rarity_id

        GROUP BY u.username
        ;"""
        # TODO : need to NOT give the opportunities that were already sent
        params = {"user_id": filters["user_id"]}

        return base_sql, params

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
