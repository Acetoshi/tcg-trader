import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-no-results",
  templateUrl: "./no-results.component.html",
  styleUrls: ["./no-results.component.scss"],
  imports: [CommonModule, TranslateModule, MatIconModule],
})
export class NoResultsComponent {}
