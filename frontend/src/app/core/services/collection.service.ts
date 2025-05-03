import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { CardFilters, defaultFilters } from "../../features/cards/models/cards-filters.model";
import { CollectionItem, LanguageVersion } from "../../features/my-collection/models/collection-item.model";
import { PaginatedResponse } from "./pagination.model";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  // Signal for myCollection data
  allCards = signal<CollectionItem[]>([]);
  allCardsFilters = signal<CardFilters>(defaultFilters);
  allCardsPagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

  myCollection = signal<CollectionItem[]>([]);
  myCollectionFilters = signal<CardFilters>(defaultFilters);
  myCollectionPagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });
  myCollectionCount = computed(() => this.myCollection().length);

  myWishlist = signal<CollectionItem[]>([]);
  myWishlistFilters = signal<CardFilters>(defaultFilters);
  myWishlistPagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });
  myWishlistCount = computed(() => this.myWishlist().length);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  // Method to fetch collection data
  fetchMyCollection(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let params = new HttpParams();
    params = params.set("owned", "true");
    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));

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

  updateCollectionItem(data: {
    cardId: number;
    languageCode: string;
    owned: number;
    forTrade: number;
    wishlist: number;
  }): Observable<CollectionItem> {
    // if (!isPlatformBrowser(this.platformId)) return false;
    return this.http.patch<CollectionItem>(`${this.apiUrl}/user/collection`, data).pipe(
      tap(newCollectionItem => {
        this.upsertCollectionItem(newCollectionItem);
      })
    );
  }

  upsertCollectionItem(newCollectionItem: CollectionItem): void {
    // upsert myCollection
    const myCollectionIndex = this.myCollection().findIndex((item: CollectionItem) => item.id === newCollectionItem.id);
    const totalOwned = newCollectionItem.languageVersions.reduce(
      (acc: number, item: LanguageVersion) => acc + item.owned,
      0
    );
    let myUpdatedCollection: CollectionItem[];

    if (myCollectionIndex !== -1) {
      if (totalOwned === 0) {
        // Remove
        myUpdatedCollection = this.myCollection().filter((item: CollectionItem) => item.id !== newCollectionItem.id);
      } else {
        //Replace
        const updated = { ...this.myCollection()[myCollectionIndex], ...newCollectionItem };
        myUpdatedCollection = [...this.myCollection()];
        myUpdatedCollection[myCollectionIndex] = updated;
      }
    } else {
      // Add new
      myUpdatedCollection = [...this.myCollection(), newCollectionItem];
    }
    this.myCollection.set(myUpdatedCollection);

    //upsert myWishlist
    const myWishlistIndex = this.myCollection().findIndex((item: CollectionItem) => item.id === newCollectionItem.id);
    const totalWishlisted = newCollectionItem.languageVersions.reduce(
      (acc: number, item: LanguageVersion) => acc + item.wishlist,
      0
    );
    let myUpdatedWishlist: CollectionItem[];

    if (myWishlistIndex !== -1) {
      if (totalWishlisted === 0) {
        // Remove
        myUpdatedWishlist = this.myWishlist().filter((item: CollectionItem) => item.id !== newCollectionItem.id);
      } else {
        //Replace
        const updated = { ...this.myWishlist()[myWishlistIndex], ...newCollectionItem };
        myUpdatedWishlist = [...this.myWishlist()];
        myUpdatedWishlist[myWishlistIndex] = updated;
      }
    } else {
      // Add new
      myUpdatedWishlist = [...this.myWishlist(), newCollectionItem];
    }
    this.myWishlist.set(myUpdatedWishlist);

    //upsert allCards
    const allCardsIndex = this.allCards().findIndex((item: CollectionItem) => item.id === newCollectionItem.id);
    const updated = { ...this.allCards()[allCardsIndex], ...newCollectionItem };
    const allCardsUpdated = [...this.allCards()];
    allCardsUpdated[allCardsIndex] = updated;
    this.allCards.set(allCardsUpdated);
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
    params = params.set("wishlist", "true");
    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));

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

  // ALL CARDS
  fetchAllCards(filters: CardFilters): void {
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
        this.allCardsPagination.set({ next: response.next, previous: response.previous });
        this.allCards.set(response.results);
      });
  }

  fetchAllCardsNextPage(): void {
    if (this.allCardsPagination().next) {
      this.http.get<PaginatedResponse<CollectionItem>>(this.allCardsPagination().next as string).subscribe(response => {
        this.allCardsPagination.set({ next: response.next, previous: response.previous });
        this.allCards.set([...this.allCards(), ...response.results]);
      });
    }
  }

  updateAllCardsFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.allCardsFilters.set({ ...this.allCardsFilters(), ...newFilters });
    this.fetchAllCards(this.allCardsFilters());
  }
}
