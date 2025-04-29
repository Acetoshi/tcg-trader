import { Component, computed, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TradeOpportunity } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { SendTradeOfferDialogComponent } from "../send-trade-offer-dialog/send-trade-offer-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "app-trade-opportunity",
  templateUrl: "./trade-opportunity.component.html",
  styleUrls: ["./trade-opportunity.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule],
})
export class TradeOpportunityComponent {
  opportunity = input.required<TradeOpportunity>();
  partnerUsername = input.required<string>();

  myCard = computed(() => this.opportunity().offeredCard);
  theirCard = computed(() => this.opportunity().requestedCard);

  fileServerBaseUrl = environment.fileServerUrl;

  constructor(private dialog: MatDialog) {}

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(SendTradeOfferDialogComponent, {
      maxWidth: '95vw',
      autoFocus: false,
      backdropClass: 'blurred-dialog-backdrop',
      data: {
        myCard: this.myCard(),
        theirCard: this.theirCard(),
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        console.group("offer was validated")
        //this.sendOffer(); // Your method to actually create the trade
      }
    });
  }
}
