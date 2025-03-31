import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cards-list',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  cards = signal<any[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(Infinity);

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  ngOnInit() {
    this.fetchCards();
  }

  ngAfterViewInit() {
    setTimeout(() => {this.setupScrollListener()}, 0);
  }

  async fetchCards() {
    
    if (this.loading()) return;
    try {
      this.loading.set(true);
      const response = await fetch(`${this.apiUrl}/en/cards?page=${this.currentPage()}`);
      const data = await response.json();
      this.cards.set([...this.cards(), ...data.results]); 
      this.currentPage.set(this.currentPage() + 1);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      this.loading.set(false);
    }
  }

  setupScrollListener() {
    if (!this.scrollAnchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Intersection observed:', entries[0]);
        if (entries[0].isIntersecting) {
          console.log('refetch needed');
          this.fetchCards();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }
}
