import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class VerifyEmailComponent implements OnInit {
  verificationStatus: string = 'Verifying...';
  waitingForResponse: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      const token = params['token'];
      console.log('id: ', id);
      console.log('token: ', token);
      if (id && token) {
        this.verifyEmail(id, token);
      } else {
        this.verificationStatus = 'Invalid verification link!';
      }
    });
  }

  async verifyEmail(id: string, token: string) {
    this.waitingForResponse = true;
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/verify-email/${id}/${token}`
      );
      this.waitingForResponse = false;
      if (response.ok) {
        this.verificationStatus = 'Email verified!';
      } else {
        this.verificationStatus = 'Invalid verification link!';
      }

    } catch (e) {
      this.verificationStatus = 'Invalid verification link!';
    }
  }
}
