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

@Component({
  standalone: true,
  selector: "app-received-trade-offer",
  templateUrl: "./received-trade-offer.component.html",
  styleUrls: ["./received-trade-offer.component.scss"],
  imports: [CommonModule, MatCardModule, MatIcon, MatButtonModule],
})
export class ReceivedTradeOfferComponent {
  receivedOffer = input.required<TradeTransaction>();
  partnerUsername = input.required<string>();

  myCard = computed(() => this.receivedOffer().offeredCard);
  theirCard = computed(() => this.receivedOffer().requestedCard);

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
        title: "Accept Trade Offer",
        message: `You're about to accept the offer ${this.partnerUsername()} sent you.`,
        confirmButtonLabel: "ACCEPT OFFER",
        cancelButtonLabel:"Cancel",
        myCard: this.myCard(),
        theirCard: this.theirCard(),
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData: TradeStatusUpdateRequestBody = {
        tradeId: this.receivedOffer().tradeId,
        newStatusCode: "Cancelled", // here we need to decide Accepted/Refused
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

  openRefuseDialog() {
    const dialogRef = this.dialog.open(ConfirmTradeActionDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
      data: {
        title: "Refuse Trade Offer",
        message: `You're about to refuse the offer ${this.partnerUsername()} sent you.`,
        confirmButtonLabel: "REFUSE OFFER",
        cancelButtonLabel:"Cancel",
        myCard: this.myCard(),
        theirCard: this.theirCard(),
        partnerUsername: this.partnerUsername(),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const tradeData: TradeStatusUpdateRequestBody = {
        tradeId: this.receivedOffer().tradeId,
        newStatusCode: "Cancelled", // here we need to decide Accepted/Refused
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
