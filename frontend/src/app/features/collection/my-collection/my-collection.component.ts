import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { CardFilterBarComponent } from "../../../shared/components/card-filter-bar/card-filter-bar.component";
import { CollectionCardComponent } from "../collection-card/collection-card.component";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";

@Component({
  selector: "app-my-collection",
  templateUrl: "./my-collection.component.html",
  styleUrls: ["./my-collection.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    CardFilterBarComponent,
    CollectionCardComponent,
    ScrollListenerComponent,
    NoResultsComponent,
    EndOfDataComponent,
    RouterLink,
  ],
})
export class MyCollectionComponent implements OnInit {
  noResults = computed(() => this.collectionService.myCollection().length === 0);
  constructor(public collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.fetchMyCollection({ ...this.collectionService.myCollectionFilters() });
  }
}
