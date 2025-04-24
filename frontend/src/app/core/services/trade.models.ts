export interface TradeOpportunity {
  partnerUsername: string;
  offeredItem: {
    languageCode: string;
    collectionId: number;
    imgUrl: string;
  };
  requestedItem: {
    languageCode: string;
    collectionId: number;
    imgUrl: string;
  };
}
