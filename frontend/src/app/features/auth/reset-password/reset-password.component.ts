import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from "../../../core/services/auth.service";
import { strongPasswordValidatorFactory } from "../utils/strong-password-validator.utils";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  imports: [
    MatProgressSpinner,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  message = "";
  submitFail = signal(false);
  submitSuccess = signal(false);
  loading = signal(false);
  passwordVisible = signal(false);

  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: ["", [Validators.required, strongPasswordValidatorFactory(this.translateService)]],
        passwordConfirmation: ["", [Validators.required]],
        id: [""],
        token: [""],
      },
      { validator: this.passwordMatchValidator }
    );

    this.route.queryParams.subscribe(params => {
      this.resetPasswordForm.get("id")?.setValue(params["id"]);
      this.resetPasswordForm.get("token")?.setValue(params["token"]);
    });
  }

  passwordMatchValidator(form: FormGroup): null | { mismatch: boolean } {
    const password = form.get("password")?.value;
    const passwordConfirmation = form.get("passwordConfirmation")?.value;

    return password === passwordConfirmation ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.set(!this.passwordVisible());
  }

  async onRegister(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      const formData = this.resetPasswordForm.value;
      try {
        this.loading.set(true);
        const { success } = await this.authService.resetPassword(formData.id, formData.token, formData.password);
        this.loading.set(false);

        if (success) {
          this.submitSuccess.set(true);
          this.submitFail.set(false);
          this.message = "Account successfully created, check your email for activation link.";
        } else {
          this.submitFail.set(true);
          this.submitSuccess.set(false);
          this.message = `Password reset failed, check your link and try again.`;
        }
      } catch {
        this.message = "An error occurred. Please try again later.";
      }
    }
  }
}
