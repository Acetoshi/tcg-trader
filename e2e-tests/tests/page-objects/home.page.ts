import { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  navbarHomeLink() {
    return this.page.getByRole("link", {
      name: /home/i,
    });
  }

  navbarLoginLink() {
    return this.page.getByRole("link", {
      name: /login/i,
    });
  }

  navbarRegisterLink() {
    return this.page.getByRole("link", {
      name: /register/i,
    });
  }

  async go() {
    await this.page.goto("/");
  }
}
