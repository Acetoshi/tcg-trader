import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-floating-cards",
  imports: [CommonModule],
  template: `
    <div class="floating-container">
      @for (card of cards; track card) {
        <div
          class="floating-card"
          [ngClass]="card.direction"
          [ngStyle]="{
            top: card.top + '%',
            animationDuration: card.duration + 'ms',
          }">
          <img [src]="card.imgUrl" />
        </div>
      }
    </div>
  `,
  styleUrls: ["./floating-cards.component.scss"],
})
export class FloatingCardsComponent implements OnInit {
  cards: any[] = [];
  fileServerBaseUrl = environment.fileServerUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.spawnCards();
  }

  spawnCards() {
    setInterval(() => {
      const newCard = {
        imgUrl: `${this.fileServerBaseUrl}${this.getRandomCardImg()}`,
        direction: Math.random() > 0.5 ? "right" : "left",
        duration: 4000 + Math.random() * 4000,
        top: Math.random() * 80,
      };

      this.cards.push(newCard);

      // Remove card after it finishes animating
      setTimeout(() => {
        this.cards.shift();
      }, newCard.duration + 1000);
    }, 1000);
  }

  getRandomCardImg() {
    const cards = [
      "/images/cards/fr/A1/A1-233.webp",
      "/images/cards/fr/A1/A1-096.webp",
      "/images/cards/fr/A2a/A2a-010.webp",
      "/images/cards/fr/PROMO/PROMO-024.webp",
      "/images/cards/fr/A1/A1-277.webp",
      "/images/cards/fr/A1/A1-286.webp",
      "/images/cards/fr/A1a/A1a-084.webp",
      "/images/cards/fr/A2a/A2a-092.webp",
    ];
    return cards[Math.floor(Math.random() * cards.length)];
  }
}
