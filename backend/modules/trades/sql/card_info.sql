-- this is just to keep this here, as it'll be useful later on when refactoring collections
WITH card_info AS (
    SELECT
        card.id AS id,
        card_set.code || '-' || LPAD(card.number :: text, 3, '0') AS reference,
        translation.name AS name,
        image.url AS img_url,
        card_set.code AS card_set_code,
        language.id AS language_id,
        language.code AS language_code,
        rarity.code AS rarity_code
    FROM
        cards_card card
        INNER JOIN cards_cardimage image ON card.id = image.card_id
        INNER JOIN cards_set card_set
        ON card_set.id = card.set_id
        INNER JOIN cards_cardnametranslation translation ON translation.card_id = card.id
        INNER JOIN cards_language language ON language.id = translation.language_id
        INNER JOIN cards_rarity rarity ON rarity.id = card.rarity_id
)
