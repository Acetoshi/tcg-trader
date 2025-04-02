import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardFilterBarComponent } from '../../shared/components/card-filter-bar/card-filter-bar.component';

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
  sets = signal<any[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(Infinity);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;
  

  ngOnInit() {
    this.fetchCards();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setupScrollListener();
    }, 0);
  }

  async fetchCards() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.loading()) return;
    try {
      this.loading.set(true);
      const response = await fetch(
        `${this.apiUrl}/en/cards?page=${this.currentPage()}`
      );
      const data = await response.json();
      this.cards.set([...this.cards(), ...data.results]);
      this.currentPage.set(this.currentPage() + 1);
    } catch (error) {
      console.error('OH GOD Fetch error:', error);
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
          this.fetchCards();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }
}
