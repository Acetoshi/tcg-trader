export interface GroupedTradeOpportunities {
  partnerUsername: string;
  opportunities: TradeOpportunity[];
}

export interface TradeOpportunity {
  offeredCard: TradePart;
  requestedCard: TradePart;
}

export interface TradePart {
  collectionId: number;
  languageCode: string;
  cardRef: string;
  imgUrl: string;
}
