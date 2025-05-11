-- This query isn't used anywhere for the moment.
-- It is meant to replace the collection_query_builder in the future.
-- It is more maintainable and easier to read.


WITH card_info AS (
    SELECT
        c.id AS id,
        c.number AS set_number,
        cs.code || '-' || LPAD(c.number :: text, 3, '0') AS reference,
        translation.name AS name,
        img.url AS img_url,
        cs.code AS set_code,
        lang.id AS language_id,
        lang.code AS language_code,
        r.code AS rarity_code,
        ct.code AS type_code
    FROM
        cards_card c
        INNER JOIN cards_set cs
            ON cs.id = c.set_id
        INNER JOIN cards_cardnametranslation translation
            ON translation.card_id = c.id
        INNER JOIN cards_language lang
            ON lang.id = translation.language_id
        INNER JOIN cards_cardimage img
            ON c.id = img.card_id
            AND lang.id = img.language_id
        INNER JOIN cards_rarity r
            ON r.id = c.rarity_id
        INNER JOIN cards_cardtype ct
            ON ct.id = c.type_id
),
collection_info AS (
    SELECT
        ucc.id AS id,
        ucc.user_id AS user_id,
        c.id AS card_id,
        c.set_number AS set_number,
        c.set_code AS set_code,
        c.reference AS reference,
        c.language_code AS language_code,
        c.name AS name,
        c.img_url AS img_url,
        COALESCE(ucc.quantity_owned, 0) AS owned,
        COALESCE(ucc.quantity_for_trade, 0) AS for_trade,
        COALESCE(ucc.desired_quantity, 0) AS wishlist
    FROM
        card_info c
        RIGHT JOIN card_collections_usercardcollection ucc
            ON ucc.card_id = c.id AND ucc.language_id = c.language_id
) SELECT
    MIN(ci.id) AS "id",
    ci.set_number AS "setNumber",
    ci.set_code AS "setCode",
    ci.reference AS reference,
    json_agg(
        json_build_object(
            'languageCode', ci.language_code,
            'name', ci.name,
            'imageUrl', ci.img_url,
            'owned', ci.owned,
            'forTrade', ci.for_trade,
            'wishlist', ci.wishlist
        )
        ORDER BY ci.language_code
    ) AS "languageVersions"
FROM collection_info ci
WHERE ci.user_id = '335d236b-99ff-4cd5-b71c-dcc18eb9f52f'
GROUP BY ci.card_id, ci.set_number, ci.set_code, ci.reference;
