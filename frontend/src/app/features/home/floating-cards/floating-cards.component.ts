import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-floating-cards",
  imports: [CommonModule],
  templateUrl:"./floating-cards.component.html",
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

      let newImgUrl=this.getRandomCardImg()
      while (this.cards.some(card=>card.imgUrl===newImgUrl)){
        newImgUrl=this.getRandomCardImg()
      }

      const newCard = {
        imgUrl: newImgUrl,
        direction: Math.random() > 0.5 ? "right" : "left",
        duration: 3000 + Math.random() * 2000,
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
      "/fr/A1/A1-233.webp",
      "/fr/A1/A1-096.webp",
      "/fr/A2a/A2a-010.webp",
      "/fr/PROMO/PROMO-024.webp",
      "/fr/A1/A1-277.webp",
      "/en/A1/A1-286.webp",
      "/fr/A1a/A1a-084.webp",
      "/fr/A2a/A2a-092.webp",
      "/en/A2/A2-084.webp",
      "/fr/A1a/A1a-062.webp",
      "/fr/PROMO/PROMO-001.webp",
      "/en/PROMO/PROMO-007.webp",
      "/fr/PROMO/PROMO-013.webp",
    ];

    const randomIndex = Math.floor(Math.random() * cards.length)

    return `${this.fileServerBaseUrl}/images/cards${cards[randomIndex]};
  }
}
