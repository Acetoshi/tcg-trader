import { Component, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TradeOpportunity } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  selector: "app-trade-opportunity",
  templateUrl: "./trade-opportunity.component.html",
  styleUrls: ["./trade-opportunity.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule],
})
export class TradeOpportunityComponent {
  opportunity = input.required<TradeOpportunity>();

  fileServerBaseUrl = environment.fileServerUrl;
}
