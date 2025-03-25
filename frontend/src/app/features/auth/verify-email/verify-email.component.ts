import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule,MatIconModule],
})
export class VerifyEmailComponent implements OnInit {
  verificationStatus: boolean = false;
  waitingForResponse: boolean = true;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      const token = params['token'];
      console.log('id: ', id);
      console.log('token: ', token);
      if (id && token) {
        this.verifyEmail(id, token);
      } 
    });
  }

  async verifyEmail(id: string, token: string) {
    this.waitingForResponse = true;
    const success = await this.authService.verifyEmail(id, token);
    this.verificationStatus = success
    this.waitingForResponse = false;
  }
}
