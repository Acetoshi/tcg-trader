import { Component, effect, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

interface UserPublicProfile {
  username: string;
  tcgpId: string;
  bio: string;
  avatarUrl: string;
}

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.scss"],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class ProfileCardComponent {
  username = input<string | null>(null);

  private apiUrl = environment.apiUrl;
  fileServerUrl = environment.fileServerUrl;

  copyTrainerIdIcon = signal<string>("content_copy");

  userInfo = signal<UserPublicProfile>({
    username: "loading ...",
    tcgpId: "loading ...",
    bio: "loading ...",
    avatarUrl: "loading ...",
  });

  constructor(private http: HttpClient) {
    effect(() => {
      this.fetchUserInfo(this.username());
    });
  }

  fetchUserInfo(username: string | null) {
    if (!username) return;
    this.http.get<UserPublicProfile>(`${this.apiUrl}/users/${username}/info`).subscribe({
      next: data => {
        this.userInfo.set(data);
      },
      error: error => {
        console.error("Error fetching user data:", error);
      },
    });
  }

  copyTrainerId() {
    if (!this.userInfo().tcgpId) return;
    navigator.clipboard.writeText(this.userInfo().tcgpId);
    this.copyTrainerIdIcon.set("check");
    setTimeout(() => {
      this.copyTrainerIdIcon.set("content_copy");
    }, 1500);
  }
}
