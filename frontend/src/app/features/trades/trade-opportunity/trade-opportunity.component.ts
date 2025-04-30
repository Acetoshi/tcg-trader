import { Component, computed, input } from "@angular/core";
import { TradeService } from "../../../core/services/trade.service";
import { ToastService } from "../../../core/services/toast.service";
import { environment } from "../../../../environments/environment";
import { TradeOpportunity } from "../../../core/services/trade.models";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { SendTradeOfferDialogComponent } from "../send-trade-offer-dialog/send-trade-offer-dialog.component";

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

  constructor(
    private tradeService: TradeService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(SendTradeOfferDialogComponent, {
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
      if (result) {
        const offerData = {
          partnerUsername: this.partnerUsername(),
          offeredCardCollectionId: this.myCard().collectionId,
          requestedCardCollectionId: this.theirCard().collectionId,
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
