import { Component, computed, effect, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { CardFilterBarComponent } from "../../../shared/components/card-filter-bar/card-filter-bar.component";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";
import { PublicCollectionCardComponent } from "../public-collection-card/public-collection-card.component";

@Component({
  selector: "app-public-cards-for-trade",
  templateUrl: "./public-cards-for-trade.component.html",
  styleUrls: ["./public-cards-for-trade.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    CardFilterBarComponent,
    PublicCollectionCardComponent,
    ScrollListenerComponent,
    NoResultsComponent,
    EndOfDataComponent,
  ],
})
export class PublicCardsForTradeComponent {
  username = input<string | null>(null);

  noResults = computed(() => this.collectionService.targetUserCardsForTrade().length === 0);
  constructor(public collectionService: CollectionService) {
    effect(() => {
      this.fetchUserCardsForTrade(this.username());
    });
  }

  fetchUserCardsForTrade(username: string | null): void {
    if (!username) return;
    this.collectionService.fetchTargetUserCardsForTrade(this.username() as string, {
      ...this.collectionService.targetUserCardsForTradeFilters(),
    });
  }
}
