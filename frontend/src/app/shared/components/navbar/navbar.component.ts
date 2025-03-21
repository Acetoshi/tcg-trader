import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [MatToolbarModule, MatButtonModule],
})
export class NavbarComponent {
  isLoggedIn = false;

  login() {
    this.isLoggedIn = true;
    console.log('User logged in');
  }
}
