//Logic
import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CollectionService } from "../../../core/services/collection.service";
//UI
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { ProfileCardComponent } from "../profile-card/profile-card.component";
import { PublicWishlistComponent } from "../public-wishlist/public-wishlist.component";
import { PublicCollectionComponent } from "../public-collection/public-collection.component";
import { PublicCardsForTradeComponent } from "../public-cards-for-trade/public-cards-for-trade.component";
import { filter } from "rxjs";

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

  // map index → child route
  private tabs = ["cards-for-trade", "wishlist", "collection"];
  selectedTabIndex = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.setUsernameFromUrl();

    //on hard refresh, show the right tab
    this.setTabFromUrl();

    // when the child route changes, set selectedTabIndex
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.setTabFromUrl();
    });
  }

  setTabFromUrl() {
    const child = this.route.firstChild?.snapshot.url[2]?.path;
    this.selectedTabIndex = this.tabs.indexOf(child || "");
  }

  setUsernameFromUrl() {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get("username"));
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabPath = this.tabs[event.index];
    this.router.navigate([tabPath], { relativeTo: this.route });
  }
}
