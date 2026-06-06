// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers/auth";

test.describe("Fase 2 — Jornada do Instrutor", () => {
  test("Finance — heading, filtros mês/ano, aviso conta e link configurações", async ({
    page,
  }) => {
    // loginAs injeta instrutor sem stripePayoutsEnabled — garante banner de aviso
    await loginAs(page, "instrutor@velo.com", "123456", "instructor");

    await page.goto("/app/instructor/finance");

    await expect(
      page.getByRole("heading", { name: "Financeiro" }),
    ).toBeVisible();

    const monthSelect = page.locator("select").first();
    const yearSelect = page.locator("select").nth(1);
    await expect(monthSelect).toBeVisible();
    await expect(yearSelect).toBeVisible();

    await expect(page.getByText("chave PIX não configurada")).toBeVisible();

    const configLink = page.getByRole("link", { name: "Configurar agora" });
    await expect(configLink).toBeVisible();
    await expect(configLink).toHaveAttribute(
      "href",
      "/app/instructor/settings",
    );
  });
});
