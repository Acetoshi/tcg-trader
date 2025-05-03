import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";
import { MatTabChangeEvent, MatTabsModule } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { MyCollectionComponent } from "../my-collection/my-collection.component";
import { MyWishlistComponent } from "../my-wishlist/my-wishlist.component";
import { AllCardsComponent } from "../all-cards/all-cards.component";

@Component({
  selector: "app-my-collection-dashboard",
  templateUrl: "./my-collection-dashboard.component.html",
  styleUrls: ["./my-collection-dashboard.component.scss"],
  imports: [CommonModule, TranslateModule, MatTabsModule, MatIcon, AllCardsComponent, MyCollectionComponent, MyWishlistComponent],
})
export class MyCollectionDashboardComponent implements OnInit {
  selectedTabIndex = 0;

  // map index → child route
  private tabs = ["all-cards", "owned", "wishlist"];

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
