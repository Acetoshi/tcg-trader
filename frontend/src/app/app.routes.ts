import { Routes } from "@angular/router";
import { HomepageComponent } from "./features/home/homepage/homepage.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { ForgottenPasswordComponent } from "./features/auth/forgotten-password/forgotten-password.component";
import { ResetPasswordComponent } from "./features/auth/reset-password/reset-password.component";
import { VerifyEmailComponent } from "./features/auth/verify-email/verify-email.component";
import { TradingDashboardComponent } from "./features/trades/trading-dashboard/trading-dashboard.component";
import { AccountComponent } from "./features/account-settings/my-account/account.component";
import { CardsListComponent } from "./features/cards/cards-list/cards-list.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { CollectionDashboardComponent } from "./features/collection/collection-dashboard/collection-dashboard.component";
import { PublicProfilePageComponent } from "./features/public-profiles/public-profile-page/public-profile-page.component";

export const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgotten-password", component: ForgottenPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "verify-email", component: VerifyEmailComponent },
  {
    path: "trades",
    component: TradingDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "find", component: TradingDashboardComponent }, //This looks stupid but is needed to route to mat-tabs
      { path: "received", component: TradingDashboardComponent },
      { path: "sent", component: TradingDashboardComponent },
      { path: "ongoing", component: TradingDashboardComponent },
      { path: "history", component: TradingDashboardComponent },
    ],
  },
  {
    path: "collection",
    component: CollectionDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "all-cards", component: CollectionDashboardComponent },
      { path: "owned", component: CollectionDashboardComponent },
      { path: "wishlist", component: CollectionDashboardComponent },
    ],
  },
  { path: "my-account", component: AccountComponent, canActivate: [AuthGuard] },
  { path: "cards", component: CardsListComponent },
  {
    path: "profiles/:username",
    component: PublicProfilePageComponent,
    children: [
      { path: "cards-for-trade", component: PublicProfilePageComponent },
      { path: "collection", component: PublicProfilePageComponent },
      { path: "wishlist", component: PublicProfilePageComponent },
    ],
  },
];
