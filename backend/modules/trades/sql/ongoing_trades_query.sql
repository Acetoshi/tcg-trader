-- card_info
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
        INNER JOIN cards_cardimage image
            ON card.id = image.card_id
        INNER JOIN cards_set card_set
            ON card_set.id = card.set_id
        INNER JOIN cards_cardnametranslation translation
            ON translation.card_id = card.id
        INNER JOIN cards_language language
            ON language.id = translation.language_id
        INNER JOIN cards_rarity rarity
            ON rarity.id = card.rarity_id
),

collection_card_info AS (
    SELECT
        ucc.id AS id,
        json_build_object(
          'collectionId',ucc.id,
          'languageCode',ci.language_code,
          'cardRef',ci.reference,
          'imgUrl',ci.img_url
        ) as info
    FROM card_collections_usercardcollection ucc
    INNER JOIN card_info ci
        ON ucc.card_id = ci.id
        AND ucc.language_id = ci.language_id
),

trades_as_initiator AS (
    SELECT
        partner.username AS partner_username,
        trans.id as trans_id,
        json_build_object(
            'tradeId',trans.id,
            'offeredCard',initiator_card.info,
            'requestedCard',partner_card.info
        ) AS ongoing_trade
    FROM
        trades_tradetransaction trans
        INNER JOIN trades_tradestatus status
            ON trans.status_id = status.id

        INNER JOIN accounts_customuser partner
            ON partner_id = partner.id

        INNER JOIN collection_card_info initiator_card
            ON trans.offered_id = initiator_card.id

        INNER JOIN collection_card_info partner_card
            ON trans.requested_id = partner_card.id
    WHERE
        trans.initiator_id = %s
        AND status.code = 'Accepted'
),
-- basically when the user is not the initiator, he's the partner, but then the initiator becomes the user's partner.
-- maybe my DB structure choices are to blame here, but just maybe.
trades_as_partner AS (
    SELECT
        initiator.username AS partner_username,
        trans.id as trans_id,
        json_build_object(
            'tradeId',trans.id,
            'offeredCard',partner_card.info,
            'requestedCard',initiator_card.info
        ) AS ongoing_trade
    FROM
        trades_tradetransaction trans
        INNER JOIN trades_tradestatus status
            ON trans.status_id = status.id

        INNER JOIN accounts_customuser initiator
            ON initiator_id = initiator.id

        INNER JOIN collection_card_info initiator_card
            ON trans.offered_id = initiator_card.id

        INNER JOIN collection_card_info partner_card
            ON trans.requested_id = partner_card.id
    WHERE
        trans.partner_id = %s
        AND status.code = 'Accepted'
),
-- this basically joins the two previous tables and the distinct on act as a de-duplicating step.
all_trades AS (
    SELECT DISTINCT ON (trans_id)
        partner_username,
        ongoing_trade
    FROM (
        SELECT
            partner_username,
            trans_id,
            ongoing_trade
        FROM
            trades_as_initiator
        UNION ALL
        SELECT
            partner_username,
            trans_id,
            ongoing_trade
        FROM
            trades_as_partner
    ) combined
)

SELECT
    partner_username AS "partnerUsername",
    json_agg(ongoing_trade) AS "ongoingTrades"
FROM
    all_trades
GROUP BY
    partner_username;
