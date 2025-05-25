import { test, expect } from "./fixtures";

test("has title", async ({ page, homePage }) => {
  await homePage.go();
  await expect(page).toHaveTitle("BulbaTrade");
});

test("login button should be present and lead to login page", async ({ page, homePage }) => {
  await homePage.go();
  await expect(homePage.navbarLoginLink()).toBeVisible();
  await homePage.navbarLoginLink().click();
  expect(page.url()).toContain("/login")
});

test("register button should be present and lead to register page", async ({ page, homePage }) => {
  await homePage.go();
  await expect(homePage.navbarRegisterLink()).toBeVisible();
  await homePage.navbarRegisterLink().click();
  expect(page.url()).toContain("/register")
});
