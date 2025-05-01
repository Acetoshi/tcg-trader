import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { TradeService } from "../../../core/services/trade.service";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { LanguageService } from "../../../core/services/language.service";
import { CollectionService } from "../../../core/services/collection.service";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    MatBadgeModule,
    MatTooltipModule,
  ],
})
export class NavbarComponent implements OnInit {
  constructor(
    public languageService: LanguageService,
    private authService: AuthService,
    private toastService: ToastService,
    private tradeService: TradeService,
    private collectionService: CollectionService
  ) {}

  myWishlistCount = computed<number>(() => 1);
  myCollectionCount = computed<number>(() => 1);
  receivedOffersCount = computed<number>(() => 0);
  ongoingTradesCount = computed<number>(() => 0);

  ngOnInit(): void {
    // needed to display a badge
    this.tradeService.fetchReceivedTradeOffers();
    this.tradeService.fetchOngoingTrades();

    this.collectionService.fetchMyCollection({ ...this.collectionService.myCollectionFilters(), owned: true });
    this.collectionService.fetchMyWishlist({ ...this.collectionService.myCollectionFilters(), wishlist: true });

    this.myWishlistCount = this.collectionService.myWishlistCount;
    this.myCollectionCount = this.collectionService.myCollectionCount;
    this.receivedOffersCount = this.tradeService.receivedOffersCount;
    this.ongoingTradesCount = this.tradeService.ongoingTradesCount;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  get user() {
    return this.authService.user();
  }

  async logout(): Promise<void> {
    const success = await this.authService.logout();
    if (success) this.toastService.showSuccess("Logged out successfully");
    if (!success) this.toastService.showError("Error logging out, try again");
  }

  protected changeLanguage(event: MouseEvent): void {
    event.stopPropagation(); // prevent menu from closing
    this.languageService.changeLanguage();
  }
}
