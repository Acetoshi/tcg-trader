import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { AuthService } from "./core/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import translationsEN from "../../public/i18n/en.json";
import translationsFR from "../../public/i18n/fr.json";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "BulbaTrade";

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.translateService.setTranslation("en", translationsEN);
    this.translateService.setTranslation("fr", translationsFR);
    this.translateService.setDefaultLang("en");
    if (isPlatformBrowser(this.platformId)) {
      // Only check User Auth on browser
      this.authService.getUser();
    }
  }
}
