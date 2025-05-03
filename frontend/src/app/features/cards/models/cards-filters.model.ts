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
