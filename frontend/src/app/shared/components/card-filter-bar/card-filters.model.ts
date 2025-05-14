export interface CardFilters {
  search: string;
  setCodes: string[];
  rarityCodes: string[];
  cardTypeCodes: string[];
  colorCodes: string[];
  weaknessCodes: string[];
}

export const defaultFilters = {
  search: "",
  setCodes: [],
  rarityCodes: [],
  cardTypeCodes: [],
  colorCodes: [],
  weaknessCodes: [],
};

export interface Set {
  code: string;
  name: string;
}

export interface Rarity {
  code: string;
  name: string;
  imageUrl: string;
}

export interface Color {
  code: string;
  name: string;
  imageUrl: string;
}

export interface CardType {
  code: string;
  name: string;
}
