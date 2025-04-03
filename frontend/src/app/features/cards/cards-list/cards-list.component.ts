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
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardFilterBarComponent } from '../card-filter-bar/card-filter-bar.component';
import { CardFilters } from '../../../core/models/cards-filters.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cards-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CardFilterBarComponent,
    MatIcon,
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
  noResults = signal(false);

  // These are used for filtering
  filters = signal<CardFilters>({ setCodes: [], search: '' });
  lastFetchedFilters: CardFilters = { setCodes: [], search: '' };

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    effect(() => {
      const currentFilters = this.filters();
      console.log('Current filters:', currentFilters);
      if (
        this.lastFetchedFilters.setCodes.toString() !==
          currentFilters.setCodes.toString() ||
        this.lastFetchedFilters.search !== currentFilters.search
      ) {
        this.cards.set([]);
        this.nextPage = 1;
        this.fetchCards(this.nextPage);
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
      this.noResults.set(false);
      const response = await fetch(
        `${this.apiUrl}/en/cards?page=${
          targetPage || ''
        }&set=${this.filters().setCodes.join(',')}&search=${
          this.filters().search
        }` //
      );
      const data = await response.json();

      this.cards.set([...this.cards(), ...data.results]);

      if (data.count === 0) this.noResults.set(true);

      this.lastFetchedFilters = this.filters();
      const nextPageUrl = data.next;
      if (nextPageUrl === null) {
        this.nextPage = null;
      } else {
        const nextPage = new URL(nextPageUrl).searchParams.get('page');
        this.nextPage = parseInt(nextPage as string);
      }
    } catch {
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

  updateFilters(updatedFilters: Partial<CardFilters>) {
    this.filters.set({ ...this.filters(), ...updatedFilters });
  }
}
