import { Component, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { AuthService } from "./core/services/auth.service";
import { LanguageService } from "./core/services/language.service";
import { CardFiltersService } from "./shared/components/card-filter-bar/card-filters.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "BulbaTrade";

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private cardFiltersService: CardFiltersService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.languageService.initializeLanguage(this.platformId);
    this.authService.getUser();
    this.cardFiltersService.fetchFiltersData();
  }
}
