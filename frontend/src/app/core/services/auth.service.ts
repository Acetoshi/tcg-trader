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

  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) return false;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username:email, password }),
      });

      if (response.ok) {
        this._isAuthenticated.set(true);
        this._user.set(email);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async logout(): Promise<boolean> {
    const response = await fetch('http://localhost:5000/api/auth/logout');
    if (response.ok) {
      this._isAuthenticated.set(false);
      this._user.set(null);
      return true;
    } else {
      return false;
    }
  }

  async verifyEmail(id: string, token: string): Promise<boolean> {
    if (!id || !token) return false;
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/verify-email/${id}/${token}`
      );

      if (response.ok) {
        this._isAuthenticated.set(true);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async getUserDetails(): Promise<boolean> {
    const response = await fetch('http://localhost:5000/api/auth/user');
    if (response.ok) {
      const data = await response.json();
      this._user.set(data.email);
      this._isAuthenticated.set(true);
      return true;
    } else {
      this._isAuthenticated.set(false);
      return false;
    }
  }
}
