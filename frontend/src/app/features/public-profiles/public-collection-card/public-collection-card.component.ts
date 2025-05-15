import { Component, computed, input, OnInit, signal, OnChanges, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "../../../core/services/language.service";
import { environment } from "../../../../environments/environment";
import { CollectionItem } from "../../../core/services/collection.models";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-public-collection-card",
  templateUrl: "./public-collection-card.component.html",
  styleUrls: ["./public-collection-card.component.scss"],
  imports: [
    CommonModule,
    MatIcon,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class PublicCollectionCardComponent implements OnInit, OnChanges {
  displayMode = input<"for-trade" | "wishlist" | "owned">("owned");

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
  }

  createForm() {
    this.collectionItemForm = this.fb.group({
      languageCode: this.version().languageCode,
      owned: this.version().owned,
      forTrade: this.version().forTrade,
      wishlist: this.version().wishlist,
    });
  }

  openTradeDialog() {
    // TODO : open a dialog to trade the card
    window.alert("Soon you'll be able to propose a trade from here");
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
