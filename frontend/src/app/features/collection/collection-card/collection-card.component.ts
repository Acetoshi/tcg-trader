import { Component, computed, input, OnInit, signal, OnChanges, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { LanguageService } from "../../../core/services/language.service";
import { environment } from "../../../../environments/environment";
import { CollectionItem } from "../../../core/services/collection.models";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  standalone: true,
  selector: "app-collection-card",
  templateUrl: "./collection-card.component.html",
  styleUrls: ["./collection-card.component.scss"],
  imports: [CommonModule, MatCardModule, MatInputModule, MatSelectModule, ReactiveFormsModule, TranslateModule],
})
export class CollectionCardComponent implements OnInit, OnChanges {
  collectionItem = input.required<CollectionItem>();

  collectionItemForm!: FormGroup;

  fileServerBaseUrl = environment.fileServerUrl;

  selectedLanguageCode = signal("en");
  availableLanguageCodes = computed(() => this.collectionItem().languageVersions.map(version => version.languageCode));

  version = computed(() => {
    const found = this.collectionItem().languageVersions.find(
      version => version.languageCode.toLowerCase() === this.selectedLanguageCode().toLowerCase()
    );
    return found ?? this.collectionItem().languageVersions[0];
  });

  constructor(
    private languageService: LanguageService,
    private collectionService: CollectionService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    // React to language changes
    effect(() => {
      this.selectedLanguageCode.set(this.languageService.currentLang());
      this.collectionItemForm.get("languageCode")?.setValue(this.languageService.currentLang().toUpperCase());
    });
  }

  ngOnInit() {
    //display cards in the user's language if possible
    this.selectedLanguageCode.set(this.languageService.currentLang());

    this.createForm();
    // Debounce input
    ["owned", "forTrade", "wishlist"].forEach(controlName => {
      this.debounceFormControl(controlName);
    });
    // Change the language version when the language select changes value
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

    // make sure owned card is for trade by default
    // TODO : decide if this is a dark pattern or not, forcing people to list their cards for trade ?
    this.collectionItemForm.get("owned")?.valueChanges.subscribe(owned => {
      const forTrade = this.collectionItemForm.get("forTrade")?.value as number;
      if (owned > forTrade) {
        if (owned > 2) {
          this.collectionItemForm.patchValue({ forTrade: owned - 2 });
        } else if (owned <= 2) {
          console.log("owned is less than 2");
          this.collectionItemForm.patchValue({ forTrade: 0 });
        }
      }
    });

    // make sure the user doesn't list cards for trade he doesn't have
    this.collectionItemForm.get("forTrade")?.valueChanges.subscribe(forTrade => {
      const owned = this.collectionItemForm.get("owned")?.value as number;
      if (forTrade > owned) {
        this.collectionItemForm.patchValue({ owned: forTrade });
      }
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
        this.collectionService
          .updateCollectionItem({
            cardId: this.collectionItem().id,
            languageCode: this.collectionItemForm.value.languageCode,
            owned: this.collectionItemForm.value.owned,
            forTrade: this.collectionItemForm.value.forTrade,
            wishlist: this.collectionItemForm.value.wishlist,
          })
          .subscribe({
            error: () => {
              this.toastService.showError(
                "There was an error updating your collection, refresh the page and try again"
              );
            },
          });
      });
  }

  ngOnChanges() {
    if (!this.collectionItemForm) return; // ngOnChanges CAN run before ngOnInit, so just making sure the form does exist
    this.collectionItemForm.patchValue(
      {
        owned: this.version().owned,
        forTrade: this.version().forTrade,
        wishlist: this.version().wishlist,
      },
      { emitEvent: false }
    );
  }
}
