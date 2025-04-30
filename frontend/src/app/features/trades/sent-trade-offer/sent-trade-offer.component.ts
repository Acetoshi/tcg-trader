import { Component, computed, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TradeStatusUpdateRequestBody, TradeTransaction } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CancelSentTradeOfferDialogComponent } from "../delete-sent-trade-offer-dialog/delete-sent-trade-offer-dialog.component";
import { TradeService } from "../../../core/services/trade.service";
import { ToastService } from "../../../core/services/toast.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "app-sent-trade-offer",
  templateUrl: "./sent-trade-offer.component.html",
  styleUrls: ["./sent-trade-offer.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule],
})
export class SenttradeOfferComponent {
  sentOffer = input.required<TradeTransaction>();
  partnerUsername = input.required<string>();

  myCard = computed(() => this.sentOffer().offeredCard);
  theirCard = computed(() => this.sentOffer().requestedCard);

  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    private tradeService: TradeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(CancelSentTradeOfferDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        myCard: this.myCard(),
        theirCard: this.theirCard(),
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData:TradeStatusUpdateRequestBody= {
        tradeId:this.sentOffer().tradeId,
        newStatusCode:"Cancelled"
      }
      if (result) {
        this.tradeService.updateTrade(tradeData).subscribe({
          next: () => {
            this.toastService.showSuccess(`Offer sent to ${this.partnerUsername()}`);
          },
          error: () => {
            this.toastService.showError(`Error when sending offer to ${this.partnerUsername()}`);
          },
        });
      }
    });
  }
}
