import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MyCollectionComponent } from "../my-collection/my-collection.component";
import { TranslateModule } from "@ngx-translate/core";
import { TradeOpportunitiesComponent } from "../trade-opportunities/trade-opportunities.component";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  imports: [CommonModule, TranslateModule, MatTabsModule, MyCollectionComponent, TradeOpportunitiesComponent],
})
export class DashboardComponent implements OnInit {
  selectedTabIndex = 0;

  // map index → child route
  private tabs = ["my-collection", "wishlist", "trade-finder", "trade-history"];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // when the child route changes, set selectedTabIndex
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const child = this.route.firstChild?.snapshot.url[0]?.path;
      this.selectedTabIndex = this.tabs.indexOf(child || "");
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabPath = this.tabs[event.index];
    this.router.navigate([tabPath], { relativeTo: this.route });
  }
}
