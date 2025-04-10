import { Injectable, signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  private _user = signal<string | null>(null);

  // Read-only signals for state access
  isAuthenticated = computed(() => this._isAuthenticated());
  user = computed(() => this._user());

  private apiUrl = environment.apiUrl;

  constructor(private router: Router) {}

  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) return false;

    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        this._isAuthenticated.set(true);
        this._user.set(email);
        this.router.navigate(["/dashboard"]);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async logout(): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/auth/logout`);
    if (response.ok) {
      this._isAuthenticated.set(false);
      this._user.set(null);
      this.router.navigate(["/login"]);
      return true;
    } else {
      return false;
    }
  }

  async verifyEmail(id: string, token: string): Promise<boolean> {
    if (!id || !token) return false;
    try {
      const response = await fetch(
        `${this.apiUrl}/auth/verify-email/${id}/${token}`
      );

      if (response.ok) {
        this._isAuthenticated.set(true);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async getUserDetails(): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/auth/user`);
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
