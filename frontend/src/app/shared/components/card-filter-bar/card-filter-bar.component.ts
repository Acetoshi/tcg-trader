import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

export interface Set {
  code: string;
  name: string;
}

@Component({
  selector: 'app-card-filter-bar',
  imports: [CommonModule, MatSelectModule, MatOptionModule],
  templateUrl: './card-filter-bar.component.html',
})
export class CardFilterBarComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  sets = signal<Set[]>([]);
  selectedSetCodes = signal<string[]>([]);
  loading = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async fetchSets() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR 
    try {
      this.loading.set(true);
      const response = await fetch(`${this.apiUrl}/en/sets`);
      const data = await response.json();
      this.sets.set(data.results);
    } catch (error) {
      console.error('Error fetching Sets');
    } finally {
      this.loading.set(false);
    }
  }

  onSetSelectionChange(event: any) {
    this.selectedSetCodes.set(event.value); // Update the signal
    console.log('Selected sets:', this.selectedSetCodes());
  }

  ngOnInit() {
    this.fetchSets();
  }
}
