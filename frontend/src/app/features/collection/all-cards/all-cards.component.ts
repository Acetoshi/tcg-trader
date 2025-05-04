import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { CardFilterBarComponent } from "../../cards/card-filter-bar/card-filter-bar.component";
import { CollectionItemComponent } from "../collection-item/collection-item.component";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";

@Component({
  selector: "app-all-cards",
  templateUrl: "./all-cards.component.html",
  styleUrls: ["./all-cards.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    CardFilterBarComponent,
    CollectionItemComponent,
    ScrollListenerComponent,
    NoResultsComponent,
    EndOfDataComponent,
  ],
})
export class AllCardsComponent implements OnInit {
  noResults = computed(() => this.collectionService.allCards().length === 0);
  constructor(public collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.fetchAllCards({ ...this.collectionService.allCardsFilters() });
  }
}
