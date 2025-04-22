import { Component, signal, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from "../../../core/services/auth.service";
import { isStrongPassword } from "../utils/password-validators.utils";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone: true,
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
    TranslateModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message = "";
  registerFail = signal(false);
  registerSuccess = signal(false);
  loading = signal(false);
  passwordVisible = signal(false);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, isStrongPassword]],
        passwordConfirmation: ["", [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
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
    if (this.registerForm.valid) {
      try {
        this.loading.set(true);
        const userData = {
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
        };
        const { success, message } = await this.authService.register(userData);
        this.loading.set(false);

        if (success) {
          this.registerSuccess.set(true);
          this.registerFail.set(false);
          this.message =
            this.translateService.instant("register.messages.success.title") +
            ", " +
            this.translateService.instant("register.messages.success.description");
        } else {
          this.registerFail.set(true);
          this.registerSuccess.set(false);
          this.message = this.translateService.instant("register.messages.error.registrationFailed", { message });
        }
      } catch {
        this.message = this.translateService.instant("register.messages.error.genericError");
      }
    }
  }
}
