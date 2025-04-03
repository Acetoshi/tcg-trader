import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  computed,
  PLATFORM_ID,
  Inject,
  effect,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardFilterBarComponent } from '../card-filter-bar/card-filter-bar.component';

@Component({
  selector: 'app-cards-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CardFilterBarComponent,
  ],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit, AfterViewInit {
  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  cards = signal<any[]>([]);
  loading = signal(false);
  currentPage: number | null = null;
  nextPage: number | null = 1;

  // These are used for filtering
  filters = signal<{ setCodes: string[] }>({ setCodes: [] });
  lastFetchedFilters: { setCodes: string[] } = { setCodes: [] };

  filteredCards = computed(() => {
    const selectedCodes = this.filters().setCodes;
    let filteredCards = this.cards();
    if (selectedCodes.length) {
      filteredCards = filteredCards.filter((card) =>
        selectedCodes.includes(card.setCode)
      );
    }
    return filteredCards;
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      const currentFilters = this.filters();
      if (
        this.lastFetchedFilters.setCodes.toString() !==
        currentFilters.setCodes.toString()
      ) {
        this.nextPage = 1;
        this.fetchCards(this.nextPage);
        // this.cards = [];

        // this.loadCards();
      }

      // if no new filter was applied, do nothing.
    });
  }

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

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
      const response = await fetch(
        `${this.apiUrl}/en/cards?page=${
          targetPage || ''
        }&set=${this.filters().setCodes.join(',')}` //
      );
      const data = await response.json();
      this.cards.set([...this.cards(), ...data.results]);
      this.lastFetchedFilters = this.filters();
      // update pagination
      const nextPageUrl = data.next;
      if (nextPageUrl === null) {
        this.nextPage = null;
      } else {
        const nextPage = new URL(nextPageUrl).searchParams.get('page');
        this.nextPage = parseInt(nextPage as string);
      }
    } catch (error) {
      console.error('Cards fetch error:');
    } finally {
      this.loading.set(false);
    }
  }

  setupScrollListener() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    if (!this.scrollAnchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.fetchCards(this.nextPage);
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }

  updateSelectedSetCodes(newCodes: string[]) {
    this.filters.set({ ...this.filters(), setCodes: newCodes });
  }
}
