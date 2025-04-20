import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { CardFilters, defaultFilters } from "../../features/cards/models/cards-filters.model";
import { CollectionItem, LanguageVersion } from "../../features/dashboard/models/collection-item.model";
import { PaginatedResponse } from "./pagination.model";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  filters = signal<CardFilters>(defaultFilters);
  pagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

  // Signal for myCollection data
  myCollection = signal<CollectionItem[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  // Method to fetch collection data
  fetchMyCollection(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let params = new HttpParams();
    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/user/collection`, { params })
      .subscribe(response => {
        this.pagination.set({ next: response.next, previous: response.previous });
        this.myCollection.set(response.results);
      });
  }

  fetchMyCollectionNextPage(): void {
    if (this.pagination().next) {
      this.http.get<PaginatedResponse<CollectionItem>>(this.pagination().next as string).subscribe(response => {
        this.pagination.set({ next: response.next, previous: response.previous });
        this.myCollection.set([...this.myCollection(), ...response.results]);
      });
    }
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
      this.toastService.showError('There was an error updating your collection, refresh the page and try again')
      return false;
    }
  }

  updateFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.filters.set({ ...this.filters(), ...newFilters });
    this.fetchMyCollection(this.filters());
  }
}
