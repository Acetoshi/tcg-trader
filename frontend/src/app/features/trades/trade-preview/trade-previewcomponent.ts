import { Component, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { TradePart } from "../../../core/services/trade.models";
import { MatIcon } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-trade-preview",
  templateUrl: "./trade-preview.component.html",
  styleUrls: ["./trade-preview.component.scss"],
  imports: [CommonModule, TranslateModule, MatIcon],
})
export class TradePreviewComponent {
  myCard = input.required<TradePart>();
  theirCard = input.required<TradePart>();

  fileServerBaseUrl = environment.fileServerUrl;
}
