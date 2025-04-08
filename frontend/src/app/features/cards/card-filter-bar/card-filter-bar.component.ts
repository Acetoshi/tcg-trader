import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  OnInit,
  signal,
  PLATFORM_ID,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { debounceTime } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { Set } from "../models/set.model";
import { CardFilters, defaultFilters } from "../models/cards-filters.model";
import { MatCardModule } from "@angular/material/card";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Rarity } from "../models/rarity.model";
import { CardType } from "../models/card-type.model";
import { Color } from "../models/color.model";

@Component({
  selector: "app-card-filter-bar",
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
  templateUrl: "./card-filter-bar.component.html",
  styleUrl: "./card-filter-bar.component.scss",
})
export class CardFilterBarComponent implements OnInit {
  @Input({ required: true }) filters!: CardFilters;
  @Output() filterChange = new EventEmitter<CardFilters>();

  filtersForm!: FormGroup;

  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  loading = signal(false);

  sets = signal<Set[]>([]);
  rarities = signal<Rarity[]>([]);
  cardTypes = signal<CardType[]>([]);
  colors = signal<Color[]>([]);
  showMoreFilters = signal(false);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.createForm();
    // Debounce input
    Object.keys(defaultFilters).forEach(controlName => {
      this.debounceFormControl(controlName);
    });
    // Fetch filters data
    this.fetchSets();
    this.fetchRarities();
    this.fetchCardTypes();
    this.fetchColors();
  }

  async fetchSets() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      this.loading.set(true);
      const response = await fetch(`${this.apiUrl}/en/sets`);
      const data = await response.json();
      this.sets.set(data.results);
    } catch {
      console.error("Error fetching Sets");
    } finally {
      this.loading.set(false);
    }
  }

  async fetchRarities() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/en/rarities`);
      const data = await response.json();
      this.rarities.set(data.results);
    } catch {
      console.error("Error fetching Sets");
    }
  }

  async fetchCardTypes() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/en/card-types`);
      const data = await response.json();
      this.cardTypes.set(data.results);
    } catch {
      console.error("Error fetching card types");
    }
  }

  async fetchColors() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/en/colors`);
      const data = await response.json();
      this.colors.set(data.results);
    } catch {
      console.error("Error fetching colors");
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  onToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.showMoreFilters.set(true);
    } else {
      this.showMoreFilters.set(false);
    }
  }

  createForm() {
    this.filtersForm = this.fb.group(defaultFilters);
  }

  resetFilters() {
    this.filtersForm.reset(defaultFilters);
    this.emitFilters();
  }

  private debounceFormControl(controlName: string): void {
    this.filtersForm
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.emitFilters();
      });
  }

  private emitFilters() {
    const updatedFilters: CardFilters = {
      search: this.filtersForm.get("search")?.value || "",
      setCodes: this.filtersForm.get("setCodes")?.value || [],
      rarityCodes: this.filtersForm.get("rarityCodes")?.value || [],
      cardTypeCodes: this.filtersForm.get("cardTypeCodes")?.value || [],
      colorCodes: this.filtersForm.get("colorCodes")?.value || [],
      weaknessCodes: this.filtersForm.get("weaknessCodes")?.value || [],
    };
    this.filterChange.emit(updatedFilters);
  }
}
