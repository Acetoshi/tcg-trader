export interface PokedexEntry {
  pokedexNumber: number;
  name: MultiLangEntry<string>;
  imageUrl: string;
}

type MultiLangEntry<T> = Record<LanguageCode, T>;

type LanguageCode = "EN" | "FR";
