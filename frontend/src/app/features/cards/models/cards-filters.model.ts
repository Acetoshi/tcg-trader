export interface CardFilters {
  search: string;
  setCodes: string[];
  rarityCodes: string[];
  cardTypeCodes: string[];
  colorCodes: string[];
  weaknessCodes: string[];
  owned?: boolean;
  wishlist?: boolean;
}

export const defaultFilters = {
  search: "",
  setCodes: [],
  rarityCodes: [],
  cardTypeCodes: [],
  colorCodes: [],
  weaknessCodes: [],
  owned: false,
  wishlist: false,
};
