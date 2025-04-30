import { Component, computed, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { TradeStatusUpdateRequestBody, TradeTransaction } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ConfirmTradeActionDialogComponent } from "../confirm-trade-action-dialog/confirm-trade-action-dialog.component";
import { TradeService } from "../../../core/services/trade.service";
import { ToastService } from "../../../core/services/toast.service";
import { MatDialog } from "@angular/material/dialog";
import { TradePreviewComponent } from "../trade-preview/trade-previewcomponent";

@Component({
  standalone: true,
  selector: "app-sent-trade-offer",
  templateUrl: "./sent-trade-offer.component.html",
  styleUrls: ["./sent-trade-offer.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule, TradePreviewComponent],
})
export class SentTradeOfferComponent {
  sentOffer = input.required<TradeTransaction>();
  partnerUsername = input.required<string>();

  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    private tradeService: TradeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmTradeActionDialogComponent , {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        title: "Cancel Trade Offer",
        message: `You’re about to revoke the offer you made to ${this.partnerUsername()}.`,
        confirmButtonLabel: "CANCEL OFFER",
        cancelButtonLabel:"I changed my mind",
        myCard: this.sentOffer().offeredCard,
        theirCard: this.sentOffer().requestedCard,
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData: TradeStatusUpdateRequestBody = {
        tradeId: this.sentOffer().tradeId,
        newStatusCode: "Cancelled",
      };
      if (result) {
        this.tradeService.updateTrade(tradeData).subscribe({
          next: () => {
            this.toastService.showSuccess(`Offer cancelled with success`);
          },
          error: () => {
            this.toastService.showError(`Error cancelling the offer, try again`);
          },
        });
      }
    });
  }
}
