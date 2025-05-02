import { Component, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-end-of-data",
  templateUrl: "./end-of-data.component.html",
  styleUrls: ["./end-of-data.component.scss"],
  imports: [CommonModule, TranslateModule, MatIconModule],
})
export class EndOfDataComponent {
  message = input<string>();
  isVisible = input<boolean>();
}
