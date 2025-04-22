import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  imports: [CommonModule, TranslateModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
})
export class NavbarComponent implements OnInit {
  readonly locales = [
    { code: "en", flag: "🇬🇧" },
    { code: "fr", flag: "🇫🇷" },
  ];

  flag = "🇬🇧";

  constructor(
    public translateService: TranslateService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const detectedLang = this.translateService.getBrowserLang();
    if (this.locales.some(locale => locale.code === detectedLang)) {
      this.translateService.use(detectedLang as string);
    } else {
      this.translateService.use("en");
    }
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  get user() {
    return this.authService.user();
  }

  async logout(): Promise<void> {
    const success = await this.authService.logout();
    if (success) this.toastService.showSuccess("Logged out successfully");
    if (!success) this.toastService.showError("Error logging out, try again");
  }

  protected changeLanguage(): void {
    const currentIndex = this.locales.findIndex(locale => locale.code === this.translateService.currentLang);
    const nextIndex = (currentIndex + 1) % this.locales.length;
    const nextLocale = this.locales[nextIndex];

    this.translateService.use(nextLocale.code);
  }
}
