import { Component, input } from "@angular/core";
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
  selector: "app-ongoing-trade",
  templateUrl: "./ongoing-trade.component.html",
  styleUrls: ["./ongoing-trade.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule, MatIcon, TradePreviewComponent],
})
export class OngoingTradeComponent {
  ongoingTrade = input.required<TradeTransaction>();
  partnerUsername = input.required<string>();

  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    private tradeService: TradeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  openAcceptDialog() {
    const dialogRef = this.dialog.open(ConfirmTradeActionDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        title: "Mark your card as sent",
        message: `This means you sent #${this.ongoingTrade().offeredCard.cardRef} (${this.ongoingTrade().offeredCard.languageCode}) to ${this.partnerUsername()} in Pokemon TCGP Pocket's exchange system`,
        confirmButtonLabel: "YES, I DID",
        cancelButtonLabel: "Not yet",
        myCard: this.ongoingTrade().offeredCard,
        theirCard: this.ongoingTrade().requestedCard,
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData: TradeStatusUpdateRequestBody = {
        tradeId: this.ongoingTrade().tradeId,
        newStatusCode: "Accepted",
      };
      if (result) {
        this.tradeService.updateTrade(tradeData).subscribe({
          next: () => {
            this.toastService.showSuccess(`Offer accepted, proceed with the trade`);
          },
          error: () => {
            this.toastService.showError(`Error accepting the offer, try again`);
          },
        });
      }
    });
  }

  openRefuseDialog() {
    const dialogRef = this.dialog.open(ConfirmTradeActionDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        title: "Cancel Trade",
        message: `You're about to cancel the trade with ${this.partnerUsername()}, this is irreversible and if you change your mind, you'll need to send a new offer to ${this.partnerUsername()}`,
        confirmButtonLabel: "YES, CANCEL",
        cancelButtonLabel: "I'm not sure",
        myCard: this.ongoingTrade().offeredCard,
        theirCard: this.ongoingTrade().requestedCard,
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData: TradeStatusUpdateRequestBody = {
        tradeId: this.ongoingTrade().tradeId,
        newStatusCode: "Cancelled",
      };
      if (result) {
        this.tradeService.updateTrade(tradeData).subscribe({
          next: () => {
            this.toastService.showSuccess(`Offer cancelled`);
          },
          error: () => {
            this.toastService.showError(`Error refusing the offer, try again`);
          },
        });
      }
    });
  }
}
