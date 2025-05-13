import { Component, computed, input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
import { CardFilterBarComponent } from "../../cards/card-filter-bar/card-filter-bar.component";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";
import { CollectionItemComponent } from "../../collection/collection-item/collection-item.component";

@Component({
  selector: "app-public-wishlist",
  templateUrl: "./public-wishlist.component.html",
  styleUrls: ["./public-wishlist.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    CardFilterBarComponent,
    CollectionItemComponent,
    ScrollListenerComponent,
    NoResultsComponent,
    EndOfDataComponent,
    RouterLink,
  ],
})
export class PublicWishlistComponent implements OnInit {
  username = input<string | null>(null);

  noResults = computed(() => this.collectionService.targetUserWishlist().length === 0);
  constructor(public collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.fetchTargetUserWishlist(this.username() as string, {
      ...this.collectionService.targetUserWishlistFilters(),
    });
  }
}
