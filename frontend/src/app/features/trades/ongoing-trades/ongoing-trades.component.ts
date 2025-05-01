import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { TradeService } from "../../../core/services/trade.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-ongoing-trades",
  templateUrl: "./ongoing-trades.component.html",
  styleUrls: ["./ongoing-trades.component.scss"],
  imports: [CommonModule, MatExpansionModule, RouterLink, ScrollListenerComponent, NoResultsComponent],
})
export class OngoingTradesComponent implements OnInit {
  noResults = computed(() => this.tradeService.ongoingTrades().length === 0);
  constructor(public tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.fetchOngoingTrades();
  }
}
