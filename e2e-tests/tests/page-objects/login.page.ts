import { Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    headerHomeLink() {
        return this.page.getByRole("link", {
            name: /login/,
        });
    }

    async go() {
        await this.page.goto("/login");
    }
}
