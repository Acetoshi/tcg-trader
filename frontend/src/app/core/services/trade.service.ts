import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../environments/environment";
import { PaginatedResponse } from "./pagination.model";
import { TradeOpportunity } from "./trade.models";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  pagination = signal<{ next: string | null; previous: string | null }>({ next: null, previous: null });

  // Signal for myCollection data
  opportunities = signal<TradeOpportunity[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  // Method to fetch collection data
  fetchTradeOpportunities(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<PaginatedResponse<TradeOpportunity>>(`${this.apiUrl}/trades/opportunities`).subscribe(response => {
      this.pagination.set({ next: response.next, previous: response.previous });
      this.opportunities.set(response.results);
    });
  }

  fetchTradeOpportunitiesNextPage(): void {
    if (this.pagination().next) {
      this.http.get<PaginatedResponse<TradeOpportunity>>(this.pagination().next as string).subscribe(response => {
        this.pagination.set({ next: response.next, previous: response.previous });
        this.opportunities.set([...this.opportunities(), ...response.results]);
      });
    }
  }

  // Method to get the current collection data (signal)
  getOpportunities(): Signal<TradeOpportunity[]> {
    return this.opportunities;
  }
}
