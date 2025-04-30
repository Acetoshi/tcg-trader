import { Component, computed, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TradeOpportunity } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  selector: "app-sent-trade-offer",
  templateUrl: "./sent-trade-offer.component.html",
  styleUrls: ["./sent-trade-offer.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule],
})
export class SenttradeOfferComponent {
  sentOffer = input.required<TradeOpportunity>();
  partnerUsername = input.required<string>();

  myCard = computed(() => this.sentOffer().offeredCard);
  theirCard = computed(() => this.sentOffer().requestedCard);

  fileServerBaseUrl = environment.fileServerUrl;
}
