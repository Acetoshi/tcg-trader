import { Component, computed, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollectionService } from "../../../core/services/collection.service";
import { CardFilterBarComponent } from "../../cards/card-filter-bar/card-filter-bar.component";
import { CollectionItemComponent } from "../collection-item/collection-item.component";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";

@Component({
  selector: "app-my-collection",
  templateUrl: "./my-collection.component.html",
  styleUrls: ["./my-collection.component.scss"],
  imports: [CommonModule, CardFilterBarComponent, CollectionItemComponent, ScrollListenerComponent, NoResultsComponent],
})
export class MyCollectionComponent implements OnInit {
  noResults = computed(() => this.collectionService.myCollection().length === 0);
  constructor(public collectionService: CollectionService) {}

  collectionViewMode= signal<'all'|'owned'>('all');

  ngOnInit(): void {
    this.collectionService.fetchMyCollection(this.collectionService.filters());
  }
}
