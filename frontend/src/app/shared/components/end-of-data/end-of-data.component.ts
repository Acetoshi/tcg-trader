import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-end-of-data",
  templateUrl: "./end-of-data.component.html",
  styleUrls: ["./end-of-data.component.scss"],
  encapsulation: ViewEncapsulation.None, // Needed to style ng-content
  imports: [CommonModule, TranslateModule, MatIconModule],
})
export class EndOfDataComponent {}
