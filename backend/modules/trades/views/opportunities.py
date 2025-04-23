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

    # This complex query COULD be optimized by using a CTE. (WITH matches AS ... SELECT )
    def build_get_opportunities_query(self, filters):
        base_sql = """
                    SELECT
            u.username AS "partnerUsername",
            json_build_object(
                'languageCode', your_lang.code,
                'collectionId', your_offer.id,
                'imgUrl', your_offer_img.url
            ) AS "offeredItem",
            json_build_object(
                'languageCode', their_lang.code,
                'collectionId', their_offer.id,
                'imgUrl', their_offer_img.url
            ) AS "requestedItem"

        FROM card_collections_usercardcollection your_offer
        JOIN card_collections_usercardcollection their_offer
        ON their_offer.user_id != your_offer.user_id
        JOIN accounts_customuser u
        ON their_offer.user_id = u.id

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

        -- Join cards and images to display something
        JOIN cards_cardimage your_offer_img
        ON your_offer.card_id = your_offer_img.card_id
        AND your_offer.language_id = your_offer_img.language_id

        JOIN cards_cardimage their_offer_img
        ON their_offer.card_id =  their_offer_img.card_id
        AND their_offer.language_id = their_offer_img.language_id

        -- Join languages for pretty display (optional)
        JOIN cards_language your_lang ON your_lang.id = your_offer.language_id
        JOIN cards_language their_lang ON their_lang.id = their_offer.language_id
        WHERE your_offer.user_id = %(user_id)s
        AND ( your_offer.card_id != their_offer.card_id
            OR your_offer.language_id != their_offer.language_id )
        AND your_offer.quantity_for_trade >= 1
        AND your_wish.desired_quantity >= 1
        AND their_offer.quantity_for_trade >= 1
        AND their_wish.desired_quantity >= 1
        """

        params = {"user_id": filters["user_id"]}

        return base_sql, params

    def dict_fetchall(self, cursor):
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]
