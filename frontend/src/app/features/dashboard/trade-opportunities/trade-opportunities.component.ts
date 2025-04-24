import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { TradeService } from "../../../core/services/trade.service";

@Component({
  selector: "app-trade-opportunities",
  templateUrl: "./trade-opportunities.component.html",
  styleUrls: ["./trade-opportunities.component.scss"],
  imports: [CommonModule, ScrollListenerComponent, NoResultsComponent],
})
export class TradeOpportunitiesComponent implements OnInit {
  noResults = computed(() => this.tradeService.opportunities().length === 0);
  constructor(public tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.fetchTradeOpportunities();
  }
}
