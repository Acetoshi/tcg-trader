import { computed, Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { CardFilters, defaultFilters } from "../../shared/components/card-filter-bar/card-filters.model";
import { CollectionItem, LanguageVersion } from "./collection.models";
import { PaginatedResponse, PaginationDefault, PaginationObject } from "./pagination.model";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  /***********************************************************
   *                       ALL CARDS                         *
   ***********************************************************/
  allCards = signal<CollectionItem[]>([]);
  allCardsFilters = signal<CardFilters>(defaultFilters);
  allCardsPagination = signal<PaginationObject>(PaginationDefault);

  fetchAllCards(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters);
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

  /***********************************************************
   *                       MY COLLECTION                     *
   ***********************************************************/
  myCollection = signal<CollectionItem[]>([]);
  myCollectionFilters = signal<CardFilters>(defaultFilters);
  myCollectionPagination = signal<PaginationObject>(PaginationDefault);
  myCollectionCount = computed(() => this.myCollection().length);
  hasActiveMyCollectionFilters = computed(() => this.hasActiveFilters(this.myCollectionFilters()));

  fetchMyCollection(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters, { owned: "true" });
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

  updateMyCollectionFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.myCollectionFilters.set({ ...this.myCollectionFilters(), ...newFilters });
    this.fetchMyCollection(this.myCollectionFilters());
  }

  /***********************************************************
   *                       MY WISHLIST                       *
   ***********************************************************/
  myWishlist = signal<CollectionItem[]>([]);
  myWishlistFilters = signal<CardFilters>(defaultFilters);
  myWishlistPagination = signal<PaginationObject>(PaginationDefault);
  myWishlistCount = computed(() => this.myWishlist().length);
  hasActiveWishlistFilters = computed(() => this.hasActiveFilters(this.myWishlistFilters()));

  fetchMyWishlist(filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters, { wishlist: "true" });

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

  updateMyWishlistFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.myWishlistFilters.set({ ...this.myWishlistFilters(), ...newFilters });
    this.fetchMyWishlist(this.myWishlistFilters());
  }

  /***********************************************************
   *  UPDATERS FOR MY COLLECTION, MY WISHLIST AND ALL CARDS  *
   ***********************************************************/
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

  // Method to know wether any filter is currently active
  hasActiveFilters(filters: CardFilters): boolean {
    return (
      filters.search.trim() !== "" ||
      filters.setCodes.length > 0 ||
      filters.rarityCodes.length > 0 ||
      filters.cardTypeCodes.length > 0 ||
      filters.colorCodes.length > 0 ||
      filters.weaknessCodes.length > 0
    );
  }

  /***********************************************************
   *               TARGER USER'S COLLECTION                  *
   ***********************************************************/

  targetUsername = signal<string>(""); // used as memoisation of the target username for the service

  targetUserCollection = signal<CollectionItem[]>([]);
  targetUserCollectionFilters = signal<CardFilters>(defaultFilters);
  targetUserCollectionPagination = signal<PaginationObject>(PaginationDefault);
  hasActiveTargetUserCollectionFilters = computed(() => this.hasActiveFilters(this.targetUserCollectionFilters()));

  fetchTargetUserCollection(targetUsername: string, filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters);

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/users/${targetUsername}/collection`, { params })
      .subscribe(response => {
        this.targetUserCollectionPagination.set({ next: response.next, previous: response.previous });
        this.targetUserCollection.set(response.results);
        this.targetUsername.set(targetUsername);
      });
  }

  fetchTargetUserCollectionNextPage(): void {
    if (this.targetUserCollectionPagination().next) {
      this.http
        .get<PaginatedResponse<CollectionItem>>(this.targetUserCollectionPagination().next as string)
        .subscribe(response => {
          this.targetUserCollectionPagination.set({ next: response.next, previous: response.previous });
          this.targetUserCollection.set([...this.targetUserCollection(), ...response.results]);
        });
    }
  }

  updateTargetUserCollectionFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.targetUserCollectionFilters.set({ ...this.targetUserCollectionFilters(), ...newFilters });
    this.fetchTargetUserCollection(this.targetUsername(), this.targetUserCollectionFilters());
  }

  /***********************************************************
   *               TARGER USER'S WISHLIST                    *
   ***********************************************************/
  targetUserWishlist = signal<CollectionItem[]>([]);
  targetUserWishlistFilters = signal<CardFilters>(defaultFilters);
  targetUserWishlistPagination = signal<PaginationObject>(PaginationDefault);
  hasActiveTargetUserWishlistFilters = computed(() => this.hasActiveFilters(this.targetUserWishlistFilters()));

  fetchTargetUserWishlist(targetUsername: string, filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters);

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/users/${targetUsername}/wishlist`, { params })
      .subscribe(response => {
        this.targetUserWishlistPagination.set({ next: response.next, previous: response.previous });
        this.targetUserWishlist.set(response.results);
        this.targetUsername.set(targetUsername);
      });
  }

  fetchTargetUserWishlistNextPage(): void {
    if (this.targetUserWishlistPagination().next) {
      this.http
        .get<PaginatedResponse<CollectionItem>>(this.targetUserWishlistPagination().next as string)
        .subscribe(response => {
          this.targetUserWishlistPagination.set({ next: response.next, previous: response.previous });
          this.targetUserWishlist.set([...this.targetUserWishlist(), ...response.results]);
        });
    }
  }

  updateTargetUserWishlistFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.targetUserWishlistFilters.set({ ...this.targetUserWishlistFilters(), ...newFilters });
    this.fetchTargetUserWishlist(this.targetUsername(), this.targetUserWishlistFilters());
  }

  /***********************************************************
   *         TARGER USER'S CARDS FOR TRADE                   *
   ***********************************************************/
  targetUserCardsForTrade = signal<CollectionItem[]>([]);
  targetUserCardsForTradeFilters = signal<CardFilters>(defaultFilters);
  targetUserCardsForTradePagination = signal<PaginationObject>(PaginationDefault);
  hasActiveTargetUserCardsForTradeFilters = computed(() =>
    this.hasActiveFilters(this.targetUserCardsForTradeFilters())
  );

  fetchTargetUserCardsForTrade(targetUsername: string, filters: CardFilters): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = this.buildHttpParams(filters);

    this.http
      .get<PaginatedResponse<CollectionItem>>(`${this.apiUrl}/users/${targetUsername}/for-trade`, { params })
      .subscribe(response => {
        this.targetUserCardsForTradePagination.set({ next: response.next, previous: response.previous });
        this.targetUserCardsForTrade.set(response.results);
        this.targetUsername.set(targetUsername);
      });
  }

  fetchTargetUserCardsForTradeNextPage(): void {
    if (this.targetUserCardsForTradePagination().next) {
      this.http
        .get<PaginatedResponse<CollectionItem>>(this.targetUserCardsForTradePagination().next as string)
        .subscribe(response => {
          this.targetUserCardsForTradePagination.set({ next: response.next, previous: response.previous });
          this.targetUserCardsForTrade.set([...this.targetUserCardsForTrade(), ...response.results]);
        });
    }
  }

  updateTargetUserCardsForTradeFilters(newFilters: Partial<CardFilters>) {
    //TODO : i need to perfomr a deep comparison here to know wether i need to refetch or not.
    // Otherwise i'd get a weird behaviour when toggling filters
    this.targetUserCardsForTradeFilters.set({ ...this.targetUserCardsForTradeFilters(), ...newFilters });
    this.fetchTargetUserCardsForTrade(this.targetUsername(), this.targetUserCardsForTradeFilters());
  }

  // Method to build HTTP parameters for API requests
  // This method takes filters and additional parameters as input and constructs an HttpParams object
  private buildHttpParams(filters: CardFilters, additionalParams?: Record<string, string>): HttpParams {
    let params = new HttpParams();
    Object.entries(additionalParams || {}).forEach(([key, value]) => {
      params = params.set(key, value);
    });

    if (filters.search) params = params.set("search", filters.search);
    if (filters.setCodes.length) params = params.set("set", filters.setCodes.join(","));
    if (filters.rarityCodes.length) params = params.set("rarity", filters.rarityCodes.join(","));
    if (filters.cardTypeCodes.length) params = params.set("type", filters.cardTypeCodes.join(","));
    if (filters.colorCodes.length) params = params.set("color", filters.colorCodes.join(","));
    if (filters.weaknessCodes.length) params = params.set("weakness", filters.weaknessCodes.join(","));

    return params;
  }
}
