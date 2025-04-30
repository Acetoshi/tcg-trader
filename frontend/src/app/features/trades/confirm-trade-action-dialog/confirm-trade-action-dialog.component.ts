import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

export interface TradeDialogData {
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel?: string;
  myCard: CardInfo;
  theirCard: CardInfo;
  partnerUsername: string;
}

interface CardInfo {
  cardRef: string;
  languageCode: string;
  imgUrl: string;
}

@Component({
  selector: "app-confirm-trade-action-dialog",
  templateUrl: "./confirm-trade-action-dialog.component.html",
  styleUrls: ["./confirm-trade-action-dialog.component.scss"],
  imports: [CommonModule, MatDialogModule, MatIcon, MatButtonModule],
})
export class ConfirmTradeActionDialogComponent {
  fileServerBaseUrl = environment.fileServerUrl;

  constructor(
    public dialogRef: MatDialogRef<ConfirmTradeActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeDialogData
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
