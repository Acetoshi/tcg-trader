# This complex query was needed because django's ORM won't easily handle the json_agg function
def build_get_collection_query(filters):
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
            base_sql += " INNER JOIN cards_color weakness ON poke_details.weak_to_id=weakness.id "

    if filters.get("search"):
        where_clauses.append("unaccent(name_trans.name) ILIKE unaccent(%(search)s)")
        params["search"] = f"%{filters['search']}%"

    if filters.get("owned_only") and (filters["owned_only"] == "true" or filters["owned_only"]):
        base_sql += """
            INNER JOIN (
                SELECT DISTINCT card_id
                FROM card_collections_usercardcollection
                WHERE user_id = %(user_id)s AND quantity_owned >= 1
            ) owned_cards
            ON owned_cards.card_id = c.id
        """
    # TODO : clean this condition after my_collection has been refactored
    if filters.get("wishlist_only") and (
        filters["wishlist_only"] == "true" or filters["wishlist_only"]
    ):
        base_sql += """
            INNER JOIN (
                SELECT DISTINCT card_id
                FROM card_collections_usercardcollection
                WHERE user_id = %(user_id)s AND desired_quantity >= 1
            ) owned_cards
            ON owned_cards.card_id = c.id
        """

    if filters.get("for_trade_only") and filters["for_trade_only"]:
        base_sql += """
            INNER JOIN (
                SELECT DISTINCT card_id
                FROM card_collections_usercardcollection
                WHERE user_id = %(user_id)s AND quantity_for_trade >= 1
            ) owned_cards
            ON owned_cards.card_id = c.id
        """

    if where_clauses:
        base_sql += " WHERE " + " AND ".join(where_clauses)
    base_sql += " GROUP BY c.id, c.number, c.set_id, set.code ORDER BY c.set_id, c.number "
    return base_sql, params
