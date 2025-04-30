import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

export interface TradeDialogData {
  myCard: {
    cardRef: string;
    languageCode: string;
    imgUrl: string;
  };
  theirCard: {
    cardRef: string;
    languageCode: string;
    imgUrl: string;
  };
  partnerUsername: string;
}

@Component({
  selector: "app-delete-sent-trade-offer-dialog",
  templateUrl: "./delete-sent-trade-offer-dialog.component.html",
  styleUrls: ["./delete-sent-trade-offer-dialog.component.scss"],
  imports: [CommonModule, MatDialogModule, MatIcon, MatButtonModule],
})
export class CancelSentTradeOfferDialogComponent {
  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    public dialogRef: MatDialogRef<CancelSentTradeOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeDialogData
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
