import { Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { CardFilters, defaultFilters } from "../../features/cards/models/cards-filters.model";
import { isPlatformBrowser } from "@angular/common";
import { CollectionItem, LanguageVersion } from "../../features/dashboard/models/collection-item.model";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = environment.apiUrl;

  filters = signal<CardFilters>(defaultFilters);

  // Signal for myCollection data
  myCollection = signal<CollectionItem[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {
    // effect(() => console.log(this.myCollection()));
  }

  // Method to fetch collection data
  fetchMyCollection(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    //TODO : convert this to a utility function.
    let params = new HttpParams();
    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));

    this.http.get<CollectionItem[]>(`${this.apiUrl}/user/collection`, { params }).subscribe(collection => {
      this.myCollection.set(collection);
    });
  }

  // Method to get the current collection data (signal)
  getMyCollection(): Signal<CollectionItem[]> {
    return this.myCollection;
  }

  async updateCollectionItem(data: {
    cardId: number;
    languageCode: string;
    owned: number;
    forTrade: number;
    wishlist: number;
  }): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    try {
      const updatedLanguageVersion = (await firstValueFrom(
        this.http.patch(`${this.apiUrl}/user/collection`, data)
      )) as LanguageVersion;

      //if successful, we need to update the collection signal
      const myUpdatedCollection = [...this.myCollection()];
      const updatedItem = myUpdatedCollection.find((item: CollectionItem) => item.id === data.cardId) as CollectionItem;
      const languageVersion = updatedItem.languageVersions.find(
        languageVersion => languageVersion.languageCode === data.languageCode
      ) as LanguageVersion;
      Object.assign(languageVersion, updatedLanguageVersion);

      this.myCollection.set(myUpdatedCollection);

      return true;
    } catch (error) {
      //TODO : show a toast
      console.error("Failed to update collection item:", error);
      return false;
    }
  }

  updateFilters(newFilters: Partial<CardFilters>) {
    this.filters.set({ ...this.filters(), ...newFilters });
    this.fetchMyCollection(this.filters());
  }
}
