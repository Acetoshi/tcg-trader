import { Component, computed, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CollectionItem, LanguageVersion } from "../models/collection-item.model";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs";
import { CollectionService } from "../../../core/services/collection.service";

@Component({
  selector: "app-collection-item",
  templateUrl: "./collection-item.component.html",
  styleUrls: ["./collection-item.component.scss"],
  imports: [CommonModule, MatCardModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
})
export class CollectionItemComponent implements OnInit {
  @Input({ required: true }) collectionItem!: CollectionItem;

  collectionItemForm!: FormGroup;

  fileServerBaseUrl = environment.fileServerUrl;

  defaultLanguageCode = "EN"; // This needs to be changed when i18n is handled
  selectedLanguageCode = signal(this.defaultLanguageCode);
  availableLanguagesCodes = computed(() => this.collectionItem.languageVersions.map(version => version.languageCode));

  // TODO : fallback to english if the default user's language isn't available
  version = computed(
    () =>
      this.collectionItem.languageVersions.find(
        version => version.languageCode === this.selectedLanguageCode()
      ) as LanguageVersion
  );

  constructor(
    private collectionService: CollectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    // Debounce input
    Object.keys(this.collectionItemForm.value).forEach(controlName => {
      this.debounceFormControl(controlName);
    });
  }

  createForm() {
    this.collectionItemForm = this.fb.group({
      languageCode: this.version().languageCode,
      owned: this.version().owned,
      forTrade: this.version().forTrade,
      desired: this.version().desired,
    });
  }

  private debounceFormControl(controlName: string): void {
    this.collectionItemForm
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.collectionService.updateCollectionItem({
          cardId: this.collectionItem.id,
          languageId: 2, // TODO : backend needs to be adjusted, and naming needs to be more normalized as well
          quantityOwned: this.collectionItemForm.value.owned,
          quantityForTrade: this.collectionItemForm.value.forTrade,
          desiredQuantity: this.collectionItemForm.value.desired,
        });
      });
  }
}
