import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { NoResultsComponent } from "../../../shared/components/no-results/no-results.component";
import { TradeService } from "../../../core/services/trade.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { ReceivedTradeOfferComponent } from "../received-trade-offer/received-trade-offer.component";

@Component({
  selector: "app-received-trade-offers",
  templateUrl: "./received-trade-offers.component.html",
  styleUrls: ["./received-trade-offers.component.scss"],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIcon,
    RouterLink,
    ReceivedTradeOfferComponent,
    ScrollListenerComponent,
    NoResultsComponent,
  ],
})
export class ReceivedTadeOffersComponent implements OnInit {
  noResults = computed(() => this.tradeService.receivedOffers().length === 0);
  constructor(public tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.fetchReceivedTradeOffers();
  }
}
