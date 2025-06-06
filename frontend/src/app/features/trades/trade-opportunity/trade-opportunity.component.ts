import { Component, input } from "@angular/core";
import { TradeService } from "../../../core/services/trade.service";
import { ToastService } from "../../../core/services/toast.service";
import { environment } from "../../../../environments/environment";
import { TradeOpportunity } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmTradeActionDialogComponent } from "../confirm-trade-action-dialog/confirm-trade-action-dialog.component";
import { TradePreviewComponent } from "../trade-preview/trade-previewcomponent";

@Component({
  standalone: true,
  selector: "app-trade-opportunity",
  templateUrl: "./trade-opportunity.component.html",
  styleUrls: ["./trade-opportunity.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule, TradePreviewComponent],
})
export class TradeOpportunityComponent {
  opportunity = input.required<TradeOpportunity>();
  partnerUsername = input.required<string>();

  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    private tradeService: TradeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmTradeActionDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        title: "Send Trade Offer",
        message: `You’re about to send this offer to ${this.partnerUsername()}.`,
        confirmButtonLabel: "SEND OFFER",
        cancelButtonLabel: "Cancel",
        myCard: this.opportunity().offeredCard,
        theirCard: this.opportunity().requestedCard,
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const offerData = {
          partnerUsername: this.partnerUsername(),
          offeredCardCollectionId: this.opportunity().offeredCard.collectionId,
          requestedCardCollectionId: this.opportunity().requestedCard.collectionId,
        };
        this.tradeService.sendOffer(offerData).subscribe({
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
