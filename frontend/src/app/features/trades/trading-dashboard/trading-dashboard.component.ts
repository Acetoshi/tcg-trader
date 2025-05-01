import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { TradeOpportunitiesComponent } from "../trade-opportunities/trade-opportunities.component";
import { SentTradeOffersComponent } from "../sent-trade-offers/sent-trade-offers.component";
import { ReceivedTadeOffersComponent } from "../received-trade-offers/received-trade-offers.component";
import { TradeService } from "../../../core/services/trade.service";

@Component({
  selector: "app-trading-dashboard",
  templateUrl: "./trading-dashboard.component.html",
  styleUrls: ["./trading-dashboard.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatIcon,
    MatBadgeModule,
    TradeOpportunitiesComponent,
    ReceivedTadeOffersComponent,
    SentTradeOffersComponent,
  ],
})
export class TradingDashboardComponent implements OnInit {
  selectedTabIndex = 0;

  // map index → child route
  private tabs = ["find", "received", "sent", "ongoing", "history"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tradeService: TradeService
  ) {}

  ngOnInit() {
    //on hard refresh, show the right tab
    this.setTabFromUrl();

    // when the child route changes, set selectedTabIndex
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.setTabFromUrl());
  }

  setTabFromUrl() {
    const child = this.route.firstChild?.snapshot.url[0]?.path;
    this.selectedTabIndex = this.tabs.indexOf(child || "");
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabPath = this.tabs[event.index];
    this.router.navigate([tabPath], { relativeTo: this.route });
  }

  getOpportunitiesCount(): number {
    return this.tradeService.opportunitiesCount();
  }

  getSentOffersCount(): number {
    return this.tradeService.sentOffersCount();
  }

  getReceivedOffersCount(): number {
    return this.tradeService.receivedOffersCount();
  }
}
