import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  PLATFORM_ID,
  Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { Set } from '../../../core/models/set.model';
import { CardFilters } from '../../../core/models/cards-filters.model';
import { MatCardModule } from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-card-filter-bar',
  imports: [
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatExpansionModule,
    MatIcon,
    MatInput,
    MatCardModule,
    MatSlideToggleModule
  ],
  templateUrl: './card-filter-bar.component.html',
  styleUrl: './card-filter-bar.component.scss',
})
export class CardFilterBarComponent implements OnInit {
  @Input({ required: true }) filters!: CardFilters;
  @Output() setSelectionChange = new EventEmitter<string[]>();
  private apiUrl = environment.apiUrl;
  sets = signal<Set[]>([]);
  showMoreFilters = signal(false);

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
