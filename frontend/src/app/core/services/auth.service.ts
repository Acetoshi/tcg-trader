import { Injectable, signal, computed, Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { UpdatedUserResponse, User, UserUpdate } from "./auth.models";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  private _user = signal<User | null>(null);
  private _isUserLoaded = signal(false);
  private _loading = signal(false);

  // Read-only signals for state access
  isAuthenticated = computed(() => this._isAuthenticated());
  user = computed(() => this._user());
  isUserLoaded = computed(() => this._isUserLoaded()); // isUserLoaded is used here to memoize wether or not an API call was made to getUser
  loading = computed(() => this._loading());

  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!data.email || !data.password || !data.username)
      return { success: false, message: "Invalid email or password" };
    this._loading.set(true);

    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respData = await response.json();
      if (response.ok) {
        return { success: true, message: "Registration successful" };
      } else {
        const reason = respData.username || respData.email || respData.password || "Unknown reason";
        return { success: false, message: reason };
      }
    } catch {
      return { success: false, message: "Registration failed" };
    } finally {
      this._loading.set(false);
    }
  }

  async login(data: { identifier: string; password: string }): Promise<boolean> {
    if (!data.identifier || !data.password) return false;
    this._loading.set(true);

    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/auth/login`, data));
      await this.getUser();
      this.router.navigate(["/collection/owned"]);
      return true;
    } catch {
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<boolean> {
    this._loading.set(true);
    const response = await fetch(`${this.apiUrl}/auth/logout`);
    this._loading.set(false);
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
    this._loading.set(true);
    try {
      const response = await fetch(`${this.apiUrl}/auth/verify-email/${id}/${token}`);
      if (response.ok) {
        await this.getUser();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    if (!email) return false;

    try {
      const response = await fetch(`${this.apiUrl}/auth/forgotten-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async resetPassword(id: string, token: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!id || !token || !password) return { success: false, message: "Invalid input" };

    try {
      const response = await fetch(`${this.apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          token,
          password,
        }),
      });

      if (response.ok) {
        await this.getUser();
        return { success: true, message: "Password reset successful" };
      } else {
        const data = await response.json();
        const reason = data.password || "Unknown reason";
        return { success: false, message: reason };
      }
    } catch {
      return { success: false, message: "Password reset failed" };
    }
  }

  async getUser(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/user`);
      if (response.ok) {
        const data = await response.json();
        this._user.set(data as User);
        this._isAuthenticated.set(true);
        this._isUserLoaded.set(true);
        return true;
      } else {
        this._isAuthenticated.set(false);
        this._isUserLoaded.set(true);
        return false;
      }
    } catch {
      return false;
    }
  }

  updateUser(data: UserUpdate): Observable<UpdatedUserResponse> {
    const dataToUpdate: UserUpdate = {};
    if (data.username) dataToUpdate.username = data.username;
    if (data.tcgpId) dataToUpdate.tcgpId = data.tcgpId;
    if (data.bio) dataToUpdate.bio = data.bio;
    if (data.avatarUrl) dataToUpdate.avatarUrl = data.avatarUrl;

    return this.http.patch<UpdatedUserResponse>(`${this.apiUrl}/auth/user`, dataToUpdate).pipe(
      tap(newUserData => {
        const currentUser = this._user() as User; // current user won't be null here because the endpoint is authenticated
        this._user.set({ ...currentUser, ...newUserData });
      })
    );
  }
}
