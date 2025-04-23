import { Component, computed, input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CollectionItem, LanguageVersion } from "../models/collection-item.model";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { CollectionService } from "../../../core/services/collection.service";
import { LanguageService } from "../../../core/services/language.service";

@Component({
  standalone: true,
  selector: "app-collection-item",
  templateUrl: "./collection-item.component.html",
  styleUrls: ["./collection-item.component.scss"],
  imports: [CommonModule, MatCardModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
})
export class CollectionItemComponent implements OnInit {
  collectionItem = input.required<CollectionItem>();

  collectionItemForm!: FormGroup;

  fileServerBaseUrl = environment.fileServerUrl;

  selectedLanguageCode = signal('en');
  availableLanguageCodes = computed(() => this.collectionItem().languageVersions.map(version => version.languageCode));

  // TODO : fallback to english if the default user's language isn't available
  version = computed(
    () =>
      this.collectionItem().languageVersions.find(
        version => version.languageCode.toLowerCase() === this.selectedLanguageCode().toLowerCase()
      ) as LanguageVersion
  );

  constructor(
    private languageService: LanguageService,
    private collectionService: CollectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    //display cards in the user's language if possible
    this.selectedLanguageCode.set(this.languageService.currentLang())

    this.createForm();
    // Debounce input
    ["owned", "forTrade", "wishlist"].forEach(controlName => {
      this.debounceFormControl(controlName);
    });
    // subscribe the signal to the formControl value
    this.collectionItemForm.get("languageCode")?.valueChanges.subscribe(code => {
      this.selectedLanguageCode.set(code);

      this.collectionItemForm.patchValue(
        {
          owned: this.version().owned,
          forTrade: this.version().forTrade,
          wishlist: this.version().wishlist,
        },
        { emitEvent: false }
      );
    });
  }

  createForm() {
    this.collectionItemForm = this.fb.group({
      languageCode: this.version().languageCode,
      owned: this.version().owned,
      forTrade: this.version().forTrade,
      wishlist: this.version().wishlist,
    });
  }

  private debounceFormControl(controlName: string): void {
    this.collectionItemForm
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.collectionService.updateCollectionItem({
          cardId: this.collectionItem().id,
          languageCode: this.collectionItemForm.value.languageCode,
          owned: this.collectionItemForm.value.owned,
          forTrade: this.collectionItemForm.value.forTrade,
          wishlist: this.collectionItemForm.value.wishlist,
        });
      });
  }
}
