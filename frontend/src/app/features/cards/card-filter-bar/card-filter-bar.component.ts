import { Component, OnInit, signal, PLATFORM_ID, Inject, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
// Services
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../../../core/services/language.service";
import { environment } from "../../../../environments/environment";
// Models
import { CardFilters, defaultFilters } from "../models/cards-filters.model";
import { Set } from "../models/set.model";
import { Rarity } from "../models/rarity.model";
import { CardType } from "../models/card-type.model";
import { Color } from "../models/color.model";
// UI
import { MatInput } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIcon } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@Component({
  selector: "app-card-filter-bar",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    MatIcon,
    MatInput,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: "./card-filter-bar.component.html",
  styleUrl: "./card-filter-bar.component.scss",
})
export class CardFilterBarComponent implements OnInit {
  @Input({ required: true }) filters!: CardFilters;
  @Output() filterChange = new EventEmitter<CardFilters>();

  filtersForm!: FormGroup;

  // UI preferences
  showMoreFilters = signal(false);
  @Input({ required: false }) ownedFilter = false;
  @Input({ required: false }) wishlistFilter = false;

  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  loading = signal(false);

  sets = signal<Set[]>([]);
  rarities = signal<Rarity[]>([]);
  cardTypes = signal<CardType[]>([]);
  colors = signal<Color[]>([]);

  constructor(
    private languageService: LanguageService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object,
    private translateService: TranslateService
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
      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/sets`);
      const data = await response.json();
      this.sets.set(data.results);
    } catch {
      console.error(this.translateService.instant("cardFilterBar.errors.fetchSets"));
    } finally {
      this.loading.set(false);
    }
  }

  async fetchRarities() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/rarities`);
      const data = await response.json();
      this.rarities.set(data.results);
    } catch {
      console.error(this.translateService.instant("cardFilterBar.errors.fetchRarities"));
    }
  }

  async fetchCardTypes() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/card-types`);
      const data = await response.json();
      this.cardTypes.set(data.results);
    } catch {
      console.error(this.translateService.instant("cardFilterBar.errors.fetchCardTypes"));
    }
  }

  async fetchColors() {
    if (!isPlatformBrowser(this.platformId)) return; // don't do anything in SSR
    try {
      const response = await fetch(`${this.apiUrl}/${this.languageService.currentLang()}/colors`);
      const data = await response.json();
      this.colors.set(data.results);
    } catch {
      console.error(this.translateService.instant("cardFilterBar.errors.fetchColors"));
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  toggleFiltersVisibility(): void {
    this.showMoreFilters.set(!this.showMoreFilters());
  }

  createForm() {
    this.filtersForm = this.fb.group(defaultFilters);
    if (this.ownedFilter) this.filtersForm.patchValue({ owned: true });
    if (this.wishlistFilter) this.filtersForm.patchValue({ wishlist: true });
  }

  resetFilters() {
    this.filtersForm.reset(defaultFilters);
    if (this.ownedFilter) this.filtersForm.patchValue({ owned: true });
    if (this.wishlistFilter) this.filtersForm.patchValue({ wishlist: true });
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
      owned: this.filtersForm.get("owned")?.value || false,
      wishlist: this.filtersForm.get("wishlist")?.value || false,
    };
    this.filterChange.emit(updatedFilters);
  }
}
