import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardFilterBarComponent } from "../../cards/card-filter-bar/card-filter-bar.component";
import { CardFilters, defaultFilters } from "../../cards/models/cards-filters.model";
import { CollectionService } from "../../../core/services/collection.service";
import { CollectionItemComponent } from "../collection-item/collection-item.component";

@Component({
  selector: "app-my-collection",
  templateUrl: "./my-collection.component.html",
  styleUrls: ["./my-collection.component.scss"],
  imports: [CommonModule, CardFilterBarComponent, CollectionItemComponent],
})
export class MyCollectionComponent implements OnInit {
  filters = signal<CardFilters>(defaultFilters);

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.fetchMyCollection(this.filters());
  }

  get myCollection() {
    return this.collectionService.myCollection();
  }

  updateFilters(updatedFilters: Partial<CardFilters>) {
    this.filters.set({ ...this.filters(), ...updatedFilters });
  }
}
