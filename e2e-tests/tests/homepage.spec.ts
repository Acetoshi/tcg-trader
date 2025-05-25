import { test, expect } from "./fixtures";

test("has title", async ({ page, homePage }) => {
  await homePage.go();
  await expect(page).toHaveTitle("BulbaTrade");
});

test("login button should be present and lead to login page", async ({ page, homePage }) => {
  await homePage.go();
  await expect(homePage.headerLoginLink()).toBeVisible();
  await homePage.headerLoginLink().click();
  expect(page.url()).toContain("/login")
});
