import { Component, computed, effect, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";
import { CardFilterBarComponent } from "../../../shared/components/card-filter-bar/card-filter-bar.component";
import { PublicCollectionCardComponent } from "../public-collection-card/public-collection-card.component";

@Component({
  selector: "app-public-collection",
  templateUrl: "./public-collection.component.html",
  styleUrls: ["./public-collection.component.scss"],
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
export class PublicCollectionComponent {
  username = input<string | null>(null);

  noResults = computed(() => this.collectionService.targetUserCollection().length === 0);
  constructor(public collectionService: CollectionService) {
    effect(() => {
      this.fetchTargetUserCollection(this.username());
    });
  }

  fetchTargetUserCollection(username: string | null): void {
    if (!username) return;
    this.collectionService.fetchTargetUserCollection(this.username() as string, {
      ...this.collectionService.targetUserCollectionFilters(),
    });
  }
}
