import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // isUserLoaded is used here to memoize wether or not an API call was made to check cookies
    if (!this.authService.isUserLoaded()) {
      await this.authService.getUser();
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return false;
    }

    return true;
  }
}
