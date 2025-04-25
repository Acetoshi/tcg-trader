export interface LanguageVersion {
  languageCode: string;
  name: string;
  imageUrl: string;
  owned: number;
  forTrade: number;
  wishlist: number;
}

export interface CollectionItem {
  id: number;
  setNumber: number;
  setCode: string;
  languageVersions: LanguageVersion[];
}
