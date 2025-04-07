export interface CardFilters {
  search: string;
  setCodes: string[];
  rarityCodes: string[];
}

export const defaultFilters = {
  search: "",
  setCodes: [],
  rarityCodes: [],
  cardTypeCodes: [],
};
