import { Component, signal, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-forgotten-password",
  templateUrl: "./forgotten-password.component.html",
  styleUrls: ["./forgotten-password.component.css"],
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
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.forgottenPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgottenPasswordForm.valid) {
      this.loading.set(true);
      this.submissionFailed.set(false);
      const { email } = this.forgottenPasswordForm.value;
      // const success = await this.authService.forgotten-password(email, password);

      // if (success) {
      //   this.submissionFailed = signal(false);
      //   this.loading.set(false);
      //   this.toastService.showSuccess("Logged in successfully");
      // } else {
      //   await new Promise(r => setTimeout(r, 2000)); // Simulate a delay to prevent bruteforce attacks on the frontend
      //   this.submissionFailed.set(true);
      //   this.loading.set(false);
      //   this.toastService.showError("Login error, check credentials");
      // }
    }
  }
}
