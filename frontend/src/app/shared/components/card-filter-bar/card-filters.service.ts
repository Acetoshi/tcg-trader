import { computed, Inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { LanguageService } from "../../../core/services/language.service";
import { CardType, Color, Rarity, Set } from "./card-filters.model";
import { PaginatedResponse } from "../../../core/services/pagination.model";

@Injectable({
  providedIn: "root",
})
export class CardFiltersService{
  private apiUrl = environment.apiUrl;
  private _loading = signal(false);
  loading = computed(() => this._loading());

  sets = signal<Set[]>([]);
  rarities = signal<Rarity[]>([]);
  cardTypes = signal<CardType[]>([]);
  colors = signal<Color[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  fetchFiltersData() {
    this.fetchSets();
    this.fetchRarities();
    this.fetchCardTypes();
    this.fetchColors();
  }

  fetchSets() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<PaginatedResponse<Set>>(`${this.apiUrl}/${this.languageService.currentLang()}/sets`)
      .subscribe(response => {
        this.sets.set(response.results);
      });
  }

  fetchRarities() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    this.http
      .get<PaginatedResponse<Rarity>>(`${this.apiUrl}/${this.languageService.currentLang()}/rarities`)
      .subscribe(response => {
        this.rarities.set(response.results);
      });
  }

  fetchCardTypes() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<PaginatedResponse<CardType>>(`${this.apiUrl}/${this.languageService.currentLang()}/card-types`)
      .subscribe(response => {
        this.cardTypes.set(response.results);
      });
  }

  fetchColors() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http
      .get<PaginatedResponse<Color>>(`${this.apiUrl}/${this.languageService.currentLang()}/colors`)
      .subscribe(response => {
        this.colors.set(response.results);
      });
  }
}
