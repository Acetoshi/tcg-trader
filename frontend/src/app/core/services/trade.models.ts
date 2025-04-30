export interface GroupedTradeOpportunities {
  partnerUsername: string;
  opportunities: TradeOpportunity[];
}

export interface GroupedSentTradeOffers {
  partnerUsername: string;
  sentOffers: TradeOpportunity[];
}

export interface GroupedReceivedTradeOffers {
  partnerUsername: string;
  sentOffers: TradeTransaction[];
}

export interface TradeOpportunity {
  offeredCard: TradePart;
  requestedCard: TradePart;
}

export interface TradeTransaction {
  tradeId: string;
  offeredCard: TradePart;
  requestedCard: TradePart;
}

export interface TradePart {
  collectionId: number;
  languageCode: string;
  cardRef: string;
  imgUrl: string;
}

export interface TradeOffer {
  partnerUsername: string;
  offeredCardCollectionId: number;
  requestedCardCollectionId: number;
}
