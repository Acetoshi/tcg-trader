import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterLink],
})
export class NavbarComponent {
  constructor(private authService: AuthService, private toastService:ToastService) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  async logout(): Promise<void> {
    const success = await this.authService.logout();
    if(success) this.toastService.showSuccess('Logged out successfully');
    if(!success) this.toastService.showError('Error logging out, try again');
  }
}
