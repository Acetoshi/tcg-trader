import { computed, Injectable, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { isPlatformBrowser } from "@angular/common";
import translationsEN from "../../../../public/i18n/en.json";
import translationsFR from "../../../../public/i18n/fr.json";

export interface Locale {
  code: string;
  flag: string;
}

//this service is used to wrap ngx-translate service and make it work with signals.
@Injectable({ providedIn: "root" })
export class LanguageService {
  private _currentLang = signal<string>("en"); // default language
  readonly locales: Locale[] = [
    { code: "en", flag: "🇬🇧" },
    { code: "fr", flag: "🇫🇷" },
  ];

  constructor(private translate: TranslateService) {
    // initialize ngx-translate
    this.translate.setTranslation("en", translationsEN);
    this.translate.setTranslation("fr", translationsFR);
    this.translate.setDefaultLang(this._currentLang());
    this.translate.use(this._currentLang());
  }

  currentLang = computed(() => this._currentLang());

  setLang(lang: string) {
    this._currentLang.set(lang);
    this.translate.use(lang); // update ngx-translate too
  }

  initializeLanguage(platformId: object) {
    if (isPlatformBrowser(platformId)) {
      const detectedLang = this.translate.getBrowserLang();
      if (this.locales.some(locale => locale.code === detectedLang)) {
        this.setLang(detectedLang as string);
      } else {
        this.setLang("en");
      }
    }
  }

  changeLanguage(): void {
    const currentIndex = this.locales.findIndex(locale => locale.code === this._currentLang());
    const nextIndex = (currentIndex + 1) % this.locales.length;
    const nextLocale = this.locales[nextIndex];
    this.setLang(nextLocale.code);
  }

  getCurrentFlag(): string {
    const currentLocale = this.locales.find(locale => locale.code === this._currentLang());
    return currentLocale?.flag || "🇬🇧";
  }
}
