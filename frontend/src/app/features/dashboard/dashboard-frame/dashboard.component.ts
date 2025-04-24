import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MyCollectionComponent } from "../my-collection/my-collection.component";
import { TranslateModule } from "@ngx-translate/core";
import { TradeOpportunitiesComponent } from "../trade-opportunities/trade-opportunities.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  imports: [CommonModule, TranslateModule, MatTabsModule, MyCollectionComponent, TradeOpportunitiesComponent],
})
export class DashboardComponent {}
