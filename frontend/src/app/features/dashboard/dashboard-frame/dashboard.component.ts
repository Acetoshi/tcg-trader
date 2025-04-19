import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MyCollectionComponent } from "../my-collection/my-collection.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  imports: [CommonModule, MatTabsModule, MyCollectionComponent],
})
export class DashboardComponent {}
