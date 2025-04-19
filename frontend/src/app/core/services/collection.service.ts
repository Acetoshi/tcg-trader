import { Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { CardFilters } from "../../features/cards/models/cards-filters.model";
import { isPlatformBrowser } from "@angular/common";
import { CollectionItem } from "../../features/dashboard/models/collection-item.model";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = environment.apiUrl;

  // Signal for myCollection data
  myCollection = signal<CollectionItem[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  // Method to fetch collection data
  fetchMyCollection(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const params = new HttpParams()
      .set("search", filters.search || "")
      .set("setCodes", filters.setCodes.join(","))
      .set("rarityCodes", filters.rarityCodes.join(","))
      .set("cardTypeCodes", filters.cardTypeCodes.join(","))
      .set("colorCodes", filters.colorCodes.join(","))
      .set("weaknessCodes", filters.weaknessCodes.join(","));

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
      const updated = await firstValueFrom(this.http.patch(`${this.apiUrl}/user/collection`, data));

      console.log(updated)

      return true;
    } catch (error) {
      //TODO : show a toast
      console.error("Failed to update collection item:", error);
      return false;
    }
  }
}
