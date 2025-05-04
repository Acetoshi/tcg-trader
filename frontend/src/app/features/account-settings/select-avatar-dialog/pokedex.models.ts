export interface PokedexEntry {
  pokedexNumber: number;
  name: MultiLangEntry<string>;
  imageUrl: string;
}

type MultiLangEntry<T>= {
  [code in LanguageCode]: T;
};

type LanguageCode = "EN" | "FR"
