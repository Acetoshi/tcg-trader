import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { ProfileCardComponent } from "../profile-card/profile-card.component";
import { PublicWishlistComponent } from "../public-wishlist/public-wishlist.component";
import { PublicCollectionComponent } from "../public-collection/public-collection.component";
import { PublicCardsForTradeComponent } from "../public-cards-for-trade/public-cards-for-trade.component";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";

@Component({
  selector: "app-public-profile-page",
  templateUrl: "./public-profile-page.component.html",
  styleUrls: ["./public-profile-page.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatIcon,
    ProfileCardComponent,
    PublicCollectionComponent,
    PublicWishlistComponent,
    PublicCardsForTradeComponent,
  ],
})
export class PublicProfilePageComponent implements OnInit {
  username = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    public collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get("username"));
    });
  }
}
