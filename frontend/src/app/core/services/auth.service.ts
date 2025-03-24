import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  private _user = signal<string | null>(null);

  // Read-only signals for state access
  isAuthenticated = computed(() => this._isAuthenticated());
  user = computed(() => this._user());

  constructor() {}

  login(email: string, password: string) {
    if (email && password) {
      fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      this._isAuthenticated.set(true);
      this._user.set(email);
    }
  }

  logout() {
    this._isAuthenticated.set(false);
    this._user.set(null);
  }
}
