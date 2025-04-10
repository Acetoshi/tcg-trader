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
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message = "";
  registerFail = signal(false);
  registerSuccess = signal(false);
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
          ],
        ],
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

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      try {
        this.loading.set(true);
        const { success, message } = await this.authService.register(
          formData.email,
          formData.password
        );
        this.loading.set(false);

        if (success) {
          this.registerSuccess.set(true);
          this.registerFail.set(false);
          this.message =
            "Account successfully created, check your email for activation link.";
        } else {
          this.registerFail.set(true);
          this.registerSuccess.set(false);
          this.message = `Registration failed: ${message}`;
        }
      } catch {
        this.message = "An error occurred. Please try again later.";
      }
    }
  }
}
