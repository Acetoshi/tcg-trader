import { Page, test as base } from "@playwright/test";
import { HomePage } from "./page-objects/home.page";
import { LoginPage } from "./page-objects/login.page";

export * from "@playwright/test";

export interface AppFixtures {
  homePage: HomePage;
  loginPage: LoginPage;
}

export const test = base.extend<AppFixtures>({
  homePage: declarePO(HomePage),
  loginPage: declarePO(LoginPage),
});

function declarePO(PageObject: { new (page: Page): void }) {
  return async ({ page }, use) => {
    await use(new PageObject(page));
  };
}
