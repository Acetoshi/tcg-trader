import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cards-list',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent {
  private apiUrl = environment.apiUrl;
  fileServerBaseUrl = environment.fileServerUrl;
  cards = signal([{ id: 0, image: [{ url: 'gino' }] }]);
  loading = signal(true);

  ngOnInit() {
    this.fetchCards();
  }

  async fetchCards() {
    this.loading.set(true);
    const response = await fetch(`${this.apiUrl}/cards`);
    const data = await response.json();
    this.cards.set(data.results);
    this.loading.set(false);
    console.log(this.cards());
  }
}
