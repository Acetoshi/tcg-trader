import { Component, signal, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
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
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
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
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginFailed = signal(false);
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(64)]], // Password field with validations
    });
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.loginFailed.set(false);
      const { email, password } = this.loginForm.value;
      const success = await this.authService.login(email, password);

      if (success) {
        this.loginFailed = signal(false);
        this.loading.set(false);
        this.toastService.showSuccess("Logged in successfully");
      } else {
        await new Promise(r => setTimeout(r, 2000)); // Simulate a delay to prevent bruteforce attacks on the frontend
        this.loginFailed.set(true);
        this.loading.set(false);
        this.toastService.showError("Login error, check credentials");
      }
    }
  }
}
