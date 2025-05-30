import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { TradeService } from "../../../core/services/trade.service";
import { TradeOpportunityComponent } from "../trade-opportunity/trade-opportunity.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { EndOfDataComponent } from "../../../shared/components/end-of-data/end-of-data.component";

@Component({
  selector: "app-trade-opportunities",
  templateUrl: "./trade-opportunities.component.html",
  styleUrls: ["./trade-opportunities.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    MatIcon,
    RouterLink,
    TradeOpportunityComponent,
    ScrollListenerComponent,
    NoResultsComponent,
    EndOfDataComponent,
  ],
})
export class TradeOpportunitiesComponent implements OnInit {
  noResults = computed(() => this.tradeService.opportunities().length === 0);
  constructor(public tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.fetchTradeOpportunities();
  }
}
