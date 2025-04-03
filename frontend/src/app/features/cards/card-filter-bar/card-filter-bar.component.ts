import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  PLATFORM_ID,
  Inject,
  Input,
  Output,
  Signal,
  EventEmitter,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Set } from '../../../core/models/set.model';
import { CardFilters } from '../../../core/models/cards-filters.model';

@Component({
  selector: 'app-card-filter-bar',
  imports: [CommonModule, MatSelectModule, MatOptionModule],
  templateUrl: './card-filter-bar.component.html',
})
export class CardFilterBarComponent implements OnInit {
  @Input({ required: true }) filters!: CardFilters;
  @Output() setSelectionChange = new EventEmitter<string[]>();
  private apiUrl = environment.apiUrl;
  sets = signal<Set[]>([]);

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
    this.setSelectionChange.emit(event.value);
  }

  ngOnInit() {
    this.fetchSets();
  }
}
