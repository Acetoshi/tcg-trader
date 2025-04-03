import { Component } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatCardHeader } from "@angular/material/card";
import { MatCardTitle } from "@angular/material/card";
import { MatCardSubtitle } from "@angular/material/card";
import { MatCardContent } from "@angular/material/card";
import { MatCardActions } from "@angular/material/card";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.css"],
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
  ],
})
export class HomepageComponent {}
