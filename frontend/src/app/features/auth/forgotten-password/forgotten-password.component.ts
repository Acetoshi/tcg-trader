import { Component, signal, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { AuthService } from "../../../core/services/auth.service";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-forgotten-password",
  templateUrl: "./forgotten-password.component.html",
  styleUrls: ["./forgotten-password.component.scss"],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIcon,
  ],
})
export class ForgottenPasswordComponent implements OnInit {
  forgottenPasswordForm!: FormGroup;
  submissionFailed = signal(false);
  submissionSuccess = signal(false);
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.forgottenPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgottenPasswordForm.valid) {
      this.loading.set(true);
      this.submissionFailed.set(false);
      const { email } = this.forgottenPasswordForm.value;
      const success = await this.authService.sendPasswordResetEmail(email);

      if (success) {
        this.submissionSuccess.set(true);
        this.loading.set(false);
      } else {
        this.submissionFailed.set(true);
        this.loading.set(false);
        await new Promise(r => setTimeout(r, 3000));
        this.submissionFailed.set(false);
      }
    }
  }
}
