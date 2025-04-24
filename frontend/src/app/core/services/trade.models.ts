export interface TradeOpportunity {
  partnerUsername: string;
  offeredItem: TradeItem;
  requestedItem: TradeItem;
}

interface TradeItem {
  collectionId: number;
  languageCode: string;
  cardNumber: number;
  setCode: string;
  imgUrl: string;
}
