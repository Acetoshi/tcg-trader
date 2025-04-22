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
import { TranslateModule, TranslateService } from "@ngx-translate/core";

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
    TranslateModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginFailed = signal(false);
  loading = signal(false);
  passwordVisible = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.loginForm = this.fb.group({
      identifier: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(12), Validators.maxLength(64)]], // Password field with validations
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.set(!this.passwordVisible());
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.loginFailed.set(false);
      const success = await this.authService.login(this.loginForm.value);

      if (success) {
        this.loginFailed = signal(false);
        this.loading.set(false);
        this.toastService.showSuccess(this.translateService.instant("login.messages.loginSuccess"));
      } else {
        await new Promise(r => setTimeout(r, 2000)); // Simulate a delay to prevent bruteforce attacks on the frontend
        this.loginFailed.set(true);
        this.loading.set(false);
        this.toastService.showError(this.translateService.instant("login.messages.loginError"));
      }
    }
  }
}
