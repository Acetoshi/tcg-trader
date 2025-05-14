import { Component, OnInit, signal, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
// Services
import { TranslateModule } from "@ngx-translate/core";
import { CardFiltersService } from "./card-filters.service";
import { environment } from "../../../../environments/environment";
// Models
import { CardFilters, defaultFilters } from "./card-filters.model";
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

  fileServerBaseUrl = environment.fileServerUrl;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    public cardFiltersService: CardFiltersService
  ) {}

  ngOnInit() {
    this.createForm();
    // Debounce input
    Object.keys(defaultFilters).forEach(controlName => {
      this.debounceFormControl(controlName);
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  toggleFiltersVisibility(): void {
    this.showMoreFilters.set(!this.showMoreFilters());
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
