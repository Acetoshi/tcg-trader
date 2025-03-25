import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
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
export class RegisterComponent {
  registerForm!: FormGroup;
  waitingForResponse: boolean = false;
  accountCreated: boolean = false;
  accountcreationFailed: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
          ],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup): null | { mismatch: boolean } {
    const password = form.get('password')?.value;
    const passwordConfirmation = form.get('passwordConfirmation')?.value;

    return password === passwordConfirmation ? null : { mismatch: true };
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      try {
        this.waitingForResponse = true;
        const response = await fetch(
          'http://localhost:5000/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        this.waitingForResponse = false;
        const data = await response.json();

        console.log('response status:',response.ok)

        console.log(data);

        if (response.ok) {
          this.accountCreated = true;
          this.accountcreationFailed = false;
          this.message =
            'Account successfully created, check your email for activation link.';
        } else {
          this.accountcreationFailed = true;
          this.accountCreated = false;
          if (data.password) {
            this.message = `Registration failed : ${data.password}`;
          } else if (data.email) {
            this.message = `Registration failed : ${data.email}`;
          }
        }
      } catch (error) {
        this.message = 'An error occurred. Please try again later.';
      }
    }
  }
}
