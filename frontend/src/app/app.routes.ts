import { Routes } from "@angular/router";
import { HomepageComponent } from "./features/homepage/homepage.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { ForgottenPasswordComponent } from "./features/auth/forgotten-password/forgotten-password.component";
import { ResetPasswordComponent } from "./features/auth/reset-password/reset-password.component";
import { VerifyEmailComponent } from "./features/auth/verify-email/verify-email.component";
import { DashboardComponent } from "./features/dashboard/dashboard-frame/dashboard.component";
import { AccountComponent } from "./features/my-account/account.component";
import { CardsListComponent } from "./features/cards/cards-list/cards-list.component";
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgotten-password", component: ForgottenPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "verify-email", component: VerifyEmailComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "my-account", component: AccountComponent, canActivate: [AuthGuard] },
  { path: "cards", component: CardsListComponent },
];
