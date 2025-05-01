import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../environments/environment";
import { PaginatedResponse, PaginationDefault, PaginationObject } from "./pagination.model";
import {
  CreateTradeOfferRequestBody,
  GroupedOngoingTrades,
  GroupedReceivedTradeOffers,
  GroupedSentTradeOffers,
  GroupedTradeOpportunities,
  TradeStatusUpdateRequestBody,
  TradeStatusUpdateResponse,
} from "./trade.models";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  // Signal for myCollection data
  opportunities = signal<GroupedTradeOpportunities[]>([]);
  opportunitiesPagination = signal<PaginationObject>(PaginationDefault);
  opportunitiesCount = computed(() => this.opportunities().reduce((acc, group) => acc + group.opportunities.length, 0));

  sentOffers = signal<GroupedSentTradeOffers[]>([]);
  sentOffersPagination = signal<PaginationObject>(PaginationDefault);
  sentOffersCount = computed(() => this.sentOffers().reduce((acc, group) => acc + group.sentOffers.length, 0));

  receivedOffers = signal<GroupedReceivedTradeOffers[]>([]);
  receivedOffersPagination = signal<PaginationObject>(PaginationDefault);
  receivedOffersCount = computed(() =>
    this.receivedOffers().reduce((acc, group) => acc + group.receivedOffers.length, 0)
  );

  ongoingTrades = signal<GroupedOngoingTrades[]>([]);
  ongoingTradesPagination = signal<PaginationObject>(PaginationDefault);
  ongoingTradesCount = computed(() => this.ongoingTrades().reduce((acc, group) => acc + group.ongoingTrades.length, 0));

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  // Method to fetch opportunities
  fetchTradeOpportunities(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<PaginatedResponse<GroupedTradeOpportunities>>(`${this.apiUrl}/trades/opportunities`)
      .subscribe(response => {
        this.opportunitiesPagination.set({ next: response.next, previous: response.previous });
        this.opportunities.set(response.results);
      });
  }

  fetchTradeOpportunitiesNextPage(): void {
    if (this.opportunitiesPagination().next) {
      this.http
        .get<PaginatedResponse<GroupedTradeOpportunities>>(this.opportunitiesPagination().next as string)
        .subscribe(response => {
          this.opportunitiesPagination.set({ next: response.next, previous: response.previous });
          this.opportunities.set([...this.opportunities(), ...response.results]);
        });
    }
  }

  // Method to get the current collection data (signal)
  getOpportunities(): Signal<GroupedTradeOpportunities[]> {
    return this.opportunities;
  }

  sendOffer(tradeOfferData: CreateTradeOfferRequestBody): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/trades`, tradeOfferData).pipe(
      tap(() => {
        this.removeOpportunity(tradeOfferData);
        this.fetchSentTradeOffers();
      })
    );
  }

  // this method is needed for send offer
  private removeOpportunity(tradeOfferData: CreateTradeOfferRequestBody): void {
    const updatedOpportunities = this.opportunities().reduce<GroupedTradeOpportunities[]>((acc, group) => {
      if (group.partnerUsername === tradeOfferData.partnerUsername) {
        // remove the opportunity whe the offer was successfully sent
        const remaining = group.opportunities.filter(
          op =>
            !(
              op.offeredCard.collectionId === tradeOfferData.offeredCardCollectionId &&
              op.requestedCard.collectionId === tradeOfferData.requestedCardCollectionId
            )
        );
        if (remaining.length) {
          acc.push({ ...group, opportunities: remaining });
        }
      } else {
        acc.push(group);
      }
      return acc;
    }, []);
    this.opportunities.set(updatedOpportunities);
  }

  fetchSentTradeOffers(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<PaginatedResponse<GroupedSentTradeOffers>>(`${this.apiUrl}/trades/sent`).subscribe(response => {
      this.sentOffersPagination.set({ next: response.next, previous: response.previous });
      this.sentOffers.set(response.results);
    });
  }

  updateTrade(tradeData: TradeStatusUpdateRequestBody): Observable<TradeStatusUpdateResponse> {
    return this.http.patch<TradeStatusUpdateResponse>(`${this.apiUrl}/trades`, tradeData).pipe(
      tap(responseData => {
        if (responseData.statusCode == "Cancelled"){
          this.fetchSentTradeOffers();
          this.fetchOngoingTrades();
        }
        if (responseData.statusCode == "Refused" || responseData.statusCode == "Accepted")
          this.fetchReceivedTradeOffers();
        if (responseData.statusCode == "Accepted")
          this.fetchOngoingTrades();
      })
    ); // refetch to stay up to date, it would be more efficient to edit the signals without refteching, but this works for now.
  }

  fetchReceivedTradeOffers(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<PaginatedResponse<GroupedReceivedTradeOffers>>(`${this.apiUrl}/trades/received`)
      .subscribe(response => {
        this.receivedOffersPagination.set({ next: response.next, previous: response.previous });
        this.receivedOffers.set(response.results);
      });
  }

  fetchOngoingTrades(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<PaginatedResponse<GroupedOngoingTrades>>(`${this.apiUrl}/trades/ongoing`).subscribe(response => {
      this.ongoingTradesPagination.set({ next: response.next, previous: response.previous });
      this.ongoingTrades.set(response.results);
    });
  }
}
