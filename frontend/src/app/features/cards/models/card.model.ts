export interface Card {
  id: number;
  name: string | null;
  typeCode: string;
  typeName: string;
  imageUrl: string | null;
  rarityCode: string;
  rarityName: string | null;
  rarityImageUrl: string;
  setNumber: string;
  setCode: string;
  setName: string | null;
  illustratorName: string;
}
