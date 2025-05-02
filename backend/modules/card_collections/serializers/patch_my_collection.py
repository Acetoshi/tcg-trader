from django.db import connection
from rest_framework import serializers
from modules.card_collections.models import UserCardCollection
from modules.cards.models import Card, Language


class PatchMyCollectionSerializer(serializers.ModelSerializer):
    cardId = serializers.PrimaryKeyRelatedField(
        source="card", queryset=Card.objects.all(), required=True
    )
    languageCode = serializers.SlugRelatedField(
        source="language", slug_field="code", queryset=Language.objects.all(), required=True
    )
    owned = serializers.IntegerField(source="quantity_owned", required=False, min_value=0)
    forTrade = serializers.IntegerField(source="quantity_for_trade", required=False, min_value=0)
    wishlist = serializers.IntegerField(source="desired_quantity", required=False, min_value=0)

    class Meta:
        model = UserCardCollection
        fields = [
            "cardId",
            "languageCode",
            "owned",
            "forTrade",
            "wishlist",
        ]

    def save(self, **kwargs):
        user = self.context["user"]
        card = self.validated_data["card"]
        language = self.validated_data["language"]

        obj, created = UserCardCollection.objects.get_or_create(
            user=user, card=card, language=language
        )

        # update fields if they are present in validated_data
        for field in ["quantity_owned", "quantity_for_trade", "desired_quantity"]:
            if field in self.validated_data:
                setattr(obj, field, self.validated_data[field])

        obj.save()
        self.instance = obj  # important for .data to work
        self._created = created
        return obj

    @property
    def created(self):
        return getattr(self, "_created", False)

    # This method enables the forntend to get a full picture of the card that was updated
    def build_response_object(self, params):
        with connection.cursor() as cursor:
            sql_request = """
            SELECT
                c.id AS "id",
                c.number AS "setNumber",
                s.code AS "setCode",
                s.code || '-' || LPAD(c.number :: text, 3, '0') AS reference,
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
            INNER JOIN cards_cardnametranslation name_trans
                ON name_trans.card_id = c.id
            INNER JOIN cards_language lang
                ON lang.id = name_trans.language_id
            INNER JOIN cards_set s
                ON s.id = c.set_id
            LEFT JOIN cards_cardimage img
                ON img.card_id = c.id
                AND img.language_id = lang.id
            LEFT JOIN card_collections_usercardcollection ucc
                ON ucc.card_id = c.id AND ucc.language_id = lang.id AND ucc.user_id = %(user_id)s

            WHERE c.id = %(card_id)s

            GROUP BY c.id, c.number, c.set_id, s.code
            """
            cursor.execute(sql_request, params)
            row = cursor.fetchone()

            new_collection_card = {
                "id": row[0],
                "setNumber": row[1],
                "setCode": row[2],
                "reference": row[3],
                "languageVersions": row[4],
            }

            return new_collection_card
