-- this is just to keep this here, as it'll be useful later on when refactoring collections
WITH card_info AS (
    SELECT
        c.id AS id,
        cs.code || '-' || LPAD(c.number :: text, 3, '0') AS reference,
        translation.name AS name,
        img.url AS img_url,
        cs.code AS set_code,
        lang.id AS langage_id,
        lang.code AS langage_code,
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
) SELECT *
FROM card_info
ORDER BY card_info.id ASC;
