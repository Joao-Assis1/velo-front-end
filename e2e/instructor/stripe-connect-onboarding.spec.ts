// spec: Stripe Connect onboarding flow - instructor settings visual test

import { test, expect } from "@playwright/test";

test.describe("Stripe Connect Onboarding - Instrutor", () => {
  test("Verifica seção chave PIX e banner financeiro", async ({ page }) => {
    // 1. Navigate to login page
    await page.goto("http://localhost:3000/auth/login");

    // 2. Select Instrutor profile
    await page.getByRole("button", { name: "Instrutor" }).click();

    // 3. Type email address
    await page
      .getByRole("textbox", { name: "seu@email.com" })
      .fill("instrutor.teste@velo.com");

    // 4. Type password
    await page.getByRole("textbox", { name: "••••••••" }).fill("123456");

    // 5. Click Entrar button to login and wait for redirect to dashboard
    await page.getByRole("button", { name: "Entrar" }).click();
    await new Promise((f) => setTimeout(f, 8 * 1000));
    await expect(page).toHaveURL(/\/app\/instructor\/dashboard/);

    // 6. Navigate to instructor settings page
    await page.goto("http://localhost:3000/app/instructor/settings");

    // 7. Wait for Stripe status to fully load (backend no Render.com pode demorar até 10s)
    await new Promise((f) => setTimeout(f, 5 * 1000));

    // 8. Verify "chave PIX" section is visible
    await expect(page.getByText("chave PIX")).toBeVisible();

    // 9. Verify ONBOARDING state — "Cadastro em análise pelo Stripe"
    await expect(
      page.getByText("Cadastro em análise pelo Stripe"),
    ).toBeVisible();

    // 10. Verify "Continuar cadastro no Stripe" action button is visible
    await expect(
      page.getByRole("button", { name: "Continuar cadastro no Stripe" }),
    ).toBeVisible();

    // 11. Verify "Atualizar" button is visible alongside the status
    await expect(page.getByRole("button", { name: "Atualizar" })).toBeVisible();

    // 12. Click Atualizar to refresh the Stripe status and wait for response
    await page.getByRole("button", { name: "Atualizar" }).click();
    await new Promise((f) => setTimeout(f, 8 * 1000));

    // Estado deve permanecer ONBOARDING após refresh
    await expect(
      page.getByText("Cadastro em análise pelo Stripe"),
    ).toBeVisible();

    // 13. Navigate to instructor finance page
    await page.goto("http://localhost:3000/app/instructor/finance");
    await new Promise((f) => setTimeout(f, 8 * 1000));

    // 14. Verify finance banner — "chave PIX não configurada"
    await expect(page.getByText("chave PIX não configurada")).toBeVisible();

    // 15. Verify banner description text
    await expect(
      page.getByText(
        "Conecte sua conta bancária para receber os pagamentos das suas aulas.",
      ),
    ).toBeVisible();

    // 16. Verify "Configurar agora" link is visible and points to settings
    const configurarLink = page.getByRole("link", { name: "Configurar agora" });
    await expect(configurarLink).toBeVisible();
    await expect(configurarLink).toHaveAttribute(
      "href",
      "/app/instructor/settings",
    );
  });
});
