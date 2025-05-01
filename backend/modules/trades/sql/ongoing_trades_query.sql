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
        INNER JOIN cards_cardimage image ON card.id = image.card_id
        INNER JOIN cards_set card_set
        ON card_set.id = card.set_id
        INNER JOIN cards_cardnametranslation translation ON translation.card_id = card.id
        INNER JOIN cards_language language ON language.id = translation.language_id
        INNER JOIN cards_rarity rarity ON rarity.id = card.rarity_id
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
        json_build_object(
            'tradeId',
            trans.id,
            'requestedCard',
            json_build_object(
                'collectionId',
                initiator_ucc.id,
                'languageCode',
                initiator_card.language_code,
                'cardRef',
                initiator_card.reference,
                'imgUrl',
                initiator_card.img_url
            ),
            'offeredCard',
            json_build_object(
                'collectionId',
                partner_ucc.id,
                'languageCode',
                partner_card.language_code,
                'cardRef',
                partner_card.reference,
                'imgUrl',
                partner_card.img_url
            )
        ) AS ongoing_trade
    FROM
        trades_tradetransaction trans
        INNER JOIN trades_tradestatus status ON trans.status_id = status.id
        INNER JOIN accounts_customuser initiator ON initiator_id = initiator.id -- initiator card details
        INNER JOIN card_collections_usercardcollection initiator_ucc ON trans.offered_id = initiator_ucc.id
        INNER JOIN card_info initiator_card ON initiator_ucc.card_id = initiator_card.id
        AND initiator_ucc.language_id = initiator_card.language_id -- partner card details
        INNER JOIN card_collections_usercardcollection partner_ucc ON trans.offered_id = partner_ucc.id
        INNER JOIN card_info partner_card ON partner_ucc.card_id = partner_card.id
        AND partner_ucc.language_id = partner_card.language_id
    WHERE
        trans.partner_id = %s
        AND status.code = 'Accepted'
),
all_trades AS (
    SELECT
        partner_username,
        ongoing_trade
    FROM
        trades_as_initiator
    -- UNION
    -- ALL
    -- SELECT
    --     partner_username,
    --     ongoing_trade
    -- FROM
    --     trades_as_partner
)
SELECT
    partner_username AS "partnerUsername",
    json_agg(ongoing_trade) AS "ongoingTrades"
FROM
    all_trades
GROUP BY
    partner_username;
