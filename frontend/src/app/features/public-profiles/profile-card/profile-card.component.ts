import { Component, input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

interface UserPublicProfile {
  "username": string
  "tcgpId": string,
  "bio": string,
  "avatarUrl": string
}

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.scss"],
  imports: [CommonModule],
})
export class ProfileCardComponent implements OnInit {
  username = input<string | null>(null);

  ngOnInit(): void {
    console.log("PublicProfilePageComponent initialized, username :", this.username);
  }
}
