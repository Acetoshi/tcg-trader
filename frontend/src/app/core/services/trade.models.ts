export interface GroupedTradeOpportunities {
  partnerUsername: string;
  opportunities: TradeOpportunity[];
}

export interface GroupedSentTradeOffers {
  partnerUsername: string;
  sentOffers: TradeTransaction[];
}

export interface GroupedReceivedTradeOffers {
  partnerUsername: string;
  receivedOffers: TradeTransaction[];
}

export interface GroupedOngoingTrades {
  partnerUsername: string;
  ongoingTrades: TradeTransaction[];
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

export interface CreateTradeOfferRequestBody {
  partnerUsername: string;
  offeredCardCollectionId: number;
  requestedCardCollectionId: number;
}

////////////////////
// Trade Statuses //
////////////////////

export type TradeStatusCode = "Pending" | "Accepted" | "Completed" | "Cancelled" | "Refused";

export interface TradeStatusUpdateRequestBody {
  tradeId: string;
  newStatusCode: TradeStatusCode;
}

export interface TradeStatusUpdateResponse {
  statusCode: TradeStatusCode;
}
