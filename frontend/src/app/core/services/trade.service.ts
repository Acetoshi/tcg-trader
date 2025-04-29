import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../environments/environment";
import { PaginatedResponse } from "./pagination.model";
import { GroupedTradeOpportunities, TradeOffer } from "./trade.models";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  pagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

  // Signal for myCollection data
  opportunities = signal<GroupedTradeOpportunities[]>([]);

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
        this.pagination.set({ next: response.next, previous: response.previous });
        this.opportunities.set(response.results);
      });
  }

  fetchTradeOpportunitiesNextPage(): void {
    if (this.pagination().next) {
      this.http
        .get<PaginatedResponse<GroupedTradeOpportunities>>(this.pagination().next as string)
        .subscribe(response => {
          this.pagination.set({ next: response.next, previous: response.previous });
          this.opportunities.set([...this.opportunities(), ...response.results]);
        });
    }
  }

  // Method to get the current collection data (signal)
  getOpportunities(): Signal<GroupedTradeOpportunities[]> {
    return this.opportunities;
  }

  sendOffer(tradeOfferData: TradeOffer): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(`${this.apiUrl}/trades`, tradeOfferData)
      .pipe(tap(() => this.removeOpportunity(tradeOfferData)));
  }

  // this method is needed for send offer
  private removeOpportunity(tradeOfferData: TradeOffer): void {
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

  // fetchSentTradeOffers(): void {
  //   if (!isPlatformBrowser(this.platformId)) return;
  //   this.http
  //     .get<PaginatedResponse<GroupedTradeOpportunities>>(`${this.apiUrl}/trades/opportunities`)
  //     .subscribe(response => {
  //       this.pagination.set({ next: response.next, previous: response.previous });
  //       this.opportunities.set(response.results);
  //     });
  // }
}
