import { Component, computed, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CollectionItem } from "../models/collection-item.model";
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

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

  version = computed(() =>
    this.collectionItem.languageVersions.find(version => version.languageCode === this.selectedLanguageCode())
  );

  constructor(private fb: FormBuilder) {}

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
}
