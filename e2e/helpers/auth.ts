import { Page } from "@playwright/test";

export async function loginAs(
  page: Page,
  email: string,
  password = "123456",
) {
  await page.goto("/auth/login");
  await page.getByLabel(/e-?mail/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForURL("**/student/dashboard", { timeout: 10_000 });
}
