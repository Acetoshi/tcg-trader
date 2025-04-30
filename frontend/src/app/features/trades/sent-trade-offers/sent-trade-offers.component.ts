import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { TradeService } from "../../../core/services/trade.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { SenttradeOfferComponent } from "../sent-trade-offer/sent-trade-offer.component";

@Component({
  selector: "app-sent-trade-offers",
  templateUrl: "./sent-trade-offers.component.html",
  styleUrls: ["./sent-trade-offers.component.scss"],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIcon,
    RouterLink,
    SenttradeOfferComponent,
    ScrollListenerComponent,
    NoResultsComponent,
  ],
})
export class SentTradeOffersComponent implements OnInit {
  noResults = computed(() => this.tradeService.sentOffers().length === 0);
  constructor(public tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.fetchSentTradeOffers();
  }
}
