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
import { debounceTime } from 'rxjs';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './card-filter-bar.component.html',
  styleUrl: './card-filter-bar.component.scss',
})
export class CardFilterBarComponent implements OnInit {
  @Input({ required: true }) filters!: CardFilters;
  @Output() filterChange = new EventEmitter<CardFilters>();

  filtersForm!: FormGroup;

  private apiUrl = environment.apiUrl;
  private defaultFilters = {
    search: '',
    setCodes: [],
  };
  sets = signal<Set[]>([]);
  showMoreFilters = signal(false);

  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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

  ngOnInit() {
    this.createForm();
    this.fetchSets();

    // Debounce the search input
    this.filtersForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.emitFilters(); // Emit the updated filters object
      });

    this.filtersForm
      .get('setCodes')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.emitFilters(); // Emit the updated filters object
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  createForm() {
    this.filtersForm = this.fb.group(this.defaultFilters);
  }

  resetFilters() {
    this.filtersForm.reset(this.defaultFilters);
    this.emitFilters();
  }

  private emitFilters() {
    const updatedFilters: CardFilters = {
      search: this.filtersForm.get('search')?.value || '',
      setCodes: this.filtersForm.get('setCodes')?.value || [],
    };
    console.log('Emitting filters:', updatedFilters);
    this.filterChange.emit(updatedFilters); // Emit the entire filter object
  }
}
