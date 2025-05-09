import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ProfileCardComponent } from "../profile-card/profile-card.component";

@Component({
  selector: "app-public-profile-page",
  templateUrl: "./public-profile-page.component.html",
  styleUrls: ["./public-profile-page.component.scss"],
  imports: [CommonModule, ProfileCardComponent],
})
export class PublicProfilePageComponent implements OnInit {
  username = signal<string | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username.set(params.get("username"));
    });
  }
}
