import { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  headerHomeLink() {
    return this.page.getByRole("link", {
      name: /home/i,
    });
  }

  headerLoginLink() {
    return this.page.getByRole("link", {
      name: /login/i,
    });
  }

//   headerLoginLink() {
//     return this.page.getByText("Login");
//   }

  async go() {
    await this.page.goto("/");
  }
}
