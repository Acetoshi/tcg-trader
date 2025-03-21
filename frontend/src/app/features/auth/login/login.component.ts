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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
})

export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form group with form controls
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]], // Username field with validations
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field with validations
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log(formData);
    }
  }
}
