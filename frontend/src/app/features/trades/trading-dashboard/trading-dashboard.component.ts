import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { TradeOpportunitiesComponent } from "../trade-opportunities/trade-opportunities.component";
import { SentTradeOffersComponent } from "../sent-trade-offers/sent-trade-offers.component";
import { ReceivedTadeOffersComponent } from "../received-trade-offers/received-trade-offers.component";

@Component({
  selector: "app-trading-dashboard",
  templateUrl: "./trading-dashboard.component.html",
  styleUrls: ["./trading-dashboard.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatIcon,
    TradeOpportunitiesComponent,
    ReceivedTadeOffersComponent,
    SentTradeOffersComponent,
  ],
})
export class TradingDashboardComponent implements OnInit {
  selectedTabIndex = 0;

  // map index → child route
  private tabs = ["find", "incoming", "sent", "ongoing", "history"];

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
}
