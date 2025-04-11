import { Component, signal, OnInit, computed } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from "../../../core/services/auth.service";
import { hasUppercase, hasLowercase, hasDigit, hasSpecialChar } from "../utils/password-validators.utils";

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
  passwordStrengthErrors = computed(() => {
    const errors = [];
    if (this.resetPasswordForm.get("password")?.hasError("minlength")) errors.push("12 characters");
    if (this.resetPasswordForm.get("password")?.hasError("missingSpecialChar")) errors.push("one special character");
    if (this.resetPasswordForm.get("password")?.hasError("missingUppercase")) errors.push("one uppercase letter");
    if (this.resetPasswordForm.get("password")?.hasError("missingLowercase")) errors.push("one lowercase letter");
    if (this.resetPasswordForm.get("password")?.hasError("missingDigit")) errors.push("one digit");
    return errors.join(", ");
  });

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(64),
            hasUppercase,
            hasLowercase,
            hasDigit,
            hasSpecialChar,
          ],
        ],
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

  async onRegister(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      const formData = this.resetPasswordForm.value;
      try {
        this.loading.set(true);
        const { success, message } = await this.authService.resetPassword(
          formData.id,
          formData.token,
          formData.password
        );
        this.loading.set(false);

        if (success) {
          this.submitSuccess.set(true);
          this.submitFail.set(false);
          this.message = "Account successfully created, check your email for activation link.";
        } else {
          this.submitFail.set(true);
          this.submitSuccess.set(false);
          this.message = `Registration failed: ${message}`;
        }
      } catch {
        this.message = "An error occurred. Please try again later.";
      }
    }
  }
}
