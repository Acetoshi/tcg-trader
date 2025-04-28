import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { CardFilters, defaultFilters } from "../../features/cards/models/cards-filters.model";
import { CollectionItem, LanguageVersion } from "../../features/my-collection/models/collection-item.model";
import { PaginatedResponse } from "./pagination.model";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  // Signal for myCollection data
  myCollection = signal<CollectionItem[]>([]);
  myCollectionFilters = signal<CardFilters>(defaultFilters);
  myCollectionPagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

  myWishlist = signal<CollectionItem[]>([]);
  myWishlistFilters = signal<CardFilters>(defaultFilters);
  myWishlistPagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

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
    if (filters.owned) params = params.set("owned", "true");
    if (filters.wishlist) params = params.set("wishlist", "true");

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/user/collection`, { params })
      .subscribe(response => {
        this.myCollectionPagination.set({ next: response.next, previous: response.previous });
        this.myCollection.set(response.results);
      });
  }

  fetchMyCollectionNextPage(): void {
    if (this.myCollectionPagination().next) {
      this.http
        .get<PaginatedResponse<CollectionItem>>(this.myCollectionPagination().next as string)
        .subscribe(response => {
          this.myCollectionPagination.set({ next: response.next, previous: response.previous });
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
    } catch {
      this.toastService.showError("There was an error updating your collection, refresh the page and try again");
      return false;
    }
  }

  updateMyCollectionFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.myCollectionFilters.set({ ...this.myCollectionFilters(), ...newFilters });
    this.fetchMyCollection(this.myCollectionFilters());
  }

  // Method to fetch collection data
  fetchMyWishlist(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let params = new HttpParams();
    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));
    if (filters.owned) params = params.set("owned", "true");
    if (filters.wishlist) params = params.set("wishlist", "true");

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/user/collection`, { params })
      .subscribe(response => {
        this.myWishlistPagination.set({ next: response.next, previous: response.previous });
        this.myWishlist.set(response.results);
      });
  }

  fetchMyWishlistNextPage(): void {
    if (this.myWishlistPagination().next) {
      this.http
        .get<PaginatedResponse<CollectionItem>>(this.myWishlistPagination().next as string)
        .subscribe(response => {
          this.myWishlistPagination.set({ next: response.next, previous: response.previous });
          this.myWishlist.set([...this.myWishlist(), ...response.results]);
        });
    }
  }

  updateMyWishListFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.myWishlistFilters.set({ ...this.myWishlistFilters(), ...newFilters });
    this.fetchMyWishlist(this.myWishlistFilters());
  }
}
