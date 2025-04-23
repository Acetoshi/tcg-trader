import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  PLATFORM_ID,
  Inject,
  effect,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { LanguageService } from "../../../core/services/language.service";
import { CardFilters, defaultFilters } from "../models/cards-filters.model";
import { Card } from "../models/card.model";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CardFilterBarComponent } from "../card-filter-bar/card-filter-bar.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";

@Component({
  selector: "app-cards-list",
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, CardFilterBarComponent, NoResultsComponent],
  templateUrl: "./cards-list.component.html",
  styleUrl: "./cards-list.component.scss",
})
export class CardsListComponent implements OnInit, AfterViewInit {
  // Backend config
  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  cards = signal<Card[]>([]);
  currentPage: number | null = null;
  nextPage: number | null = 1;

  // user Feedback
  loading = signal(false);
  noResults = signal(false);

  // Filter logic
  filters = signal<CardFilters>(defaultFilters);
  lastFetchedFilters: CardFilters = defaultFilters;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private languageService: LanguageService
  ) {
    effect(() => {
      // Check if the filters have changed
      const currentFilters = this.filters();
      const filterKeys = Object.keys(currentFilters) as (keyof CardFilters)[];
      const shouldFetch = filterKeys.some(
        key => this.lastFetchedFilters[key]?.toString() !== currentFilters[key]?.toString()
      );
      // If any filter has changed, fetch the cards again
      if (shouldFetch) {
        this.cards.set([]);
        this.nextPage = 1;
        this.fetchCards(this.nextPage);
        this.lastFetchedFilters = { ...currentFilters };
      }
    });
  }

  @ViewChild("scrollAnchor", { static: false }) scrollAnchor!: ElementRef;

  ngOnInit() {
    this.fetchCards(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setupScrollListener();
    }, 0);
  }

  async fetchCards(targetPage: number | null) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (targetPage === null) return;
    if (this.loading()) return;
    try {
      this.loading.set(true);
      this.noResults.set(false);

      const currentFilters = this.filters();
      const { setCodes, search, rarityCodes, cardTypeCodes, colorCodes, weaknessCodes } = currentFilters;
      const params = new URLSearchParams({
        page: targetPage ? targetPage.toString() : "",
        set: setCodes.join(","),
        search,
        rarity: rarityCodes.join(","),
        type: cardTypeCodes.join(","),
        color: colorCodes.join(","),
        weakness: weaknessCodes.join(","),
      });

      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/cards?${params.toString()}`);
      const data = await response.json();

      this.cards.set([...this.cards(), ...data.results]);

      if (data.count === 0) this.noResults.set(true);

      this.lastFetchedFilters = currentFilters;
      const nextPageUrl = data.next;
      if (nextPageUrl === null) {
        this.nextPage = null;
      } else {
        const nextPage = new URL(nextPageUrl).searchParams.get("page");
        this.nextPage = parseInt(nextPage as string);
      }
    } catch {
      console.error("Cards fetch error:");
    } finally {
      this.loading.set(false);
    }
  }

  setupScrollListener() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    if (!this.scrollAnchor) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.fetchCards(this.nextPage);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }

  updateFilters(updatedFilters: Partial<CardFilters>) {
    this.filters.set({ ...this.filters(), ...updatedFilters });
  }
}
