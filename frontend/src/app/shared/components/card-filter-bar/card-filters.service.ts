import { computed, Inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { CardType, Color, Rarity, Set } from "./card-filters.model";
import { LanguageService } from "../../../core/services/language.service";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  sets = signal<Set[]>([]);
  rarities = signal<Rarity[]>([]);
  cardTypes = signal<CardType[]>([]);
  colors = signal<Color[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
    private languageService: LanguageService,
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

  async fetchSets() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR

    this.http.get<Set[]>(`${this.apiUrl}/${this.languageService.currentLang()}/sets`).subscribe(
      response => {
        this.sets.set(response.results);
      },
      error => {
        console.error(this.translateService.instant("cardFilterBar.errors.fetchSets"));
      }
    );

    try {
      this.loading.set(true);
      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/sets`);
      const data = await response.json();
      this.sets.set(data.results);
    } catch {
      console.error(this.translateService.instant("cardFilterBar.errors.fetchSets"));
    } finally {
      this.loading.set(false);
    }
  }
}
