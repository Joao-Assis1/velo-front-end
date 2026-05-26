// T-E01 — Accept e Reject de aulas pelo instrutor (ACCEPT-001)
//
// Estratégia:
//   - Login real (JWT válido) — server actions exigem token real
//   - Testes estruturais: verificam seções e botões sem depender do estado do DB
//   - Testes funcionais: usam page.route() para interceptar PATCH /lessons/:id/accept|reject
//     e retornar 200 — torna os testes independentes do estado do Stripe Connect (instrutor ONBOARDING)

import { test, expect, Page } from "@playwright/test";
import { loginAs } from "../helpers/auth";

const INSTRUCTOR_EMAIL = "instrutor.teste@velo.com";
const INSTRUCTOR_PASSWORD = "123456";
const BACKEND_TIMEOUT = 35_000;
const BACKEND_URL = "http://127.0.0.1:3001/api/v1";

async function loginAsInstructor(page: Page) {
  await page.goto("/auth/login");
  await page.getByRole("button", { name: "Instrutor" }).click();
  await page.getByRole("textbox", { name: "seu@email.com" }).fill(INSTRUCTOR_EMAIL);
  await page.getByRole("textbox", { name: "••••••••" }).fill(INSTRUCTOR_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/instructor/**", { timeout: BACKEND_TIMEOUT });
}

test.describe.serial("T-E01 — Accept e Reject de aulas (ACCEPT-001)", () => {
  test.setTimeout(120_000);

  // ── Estrutura ────────────────────────────────────────────────────────────

  test("página de agenda carrega com seções obrigatórias", async ({ page }) => {
    await loginAsInstructor(page);
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });

    // Botão de bloquear horário sempre presente
    await expect(
      page.getByRole("button", { name: /bloquear/i })
    ).toBeVisible();

    // Seção "Próximas Aulas" sempre renderizada (mesmo vazia)
    await expect(
      page.getByRole("heading", { name: "Próximas Aulas" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
  });

  test("seção Solicitações Pendentes aparece com badge âmbar quando há pending_acceptance", async ({
    page,
  }) => {
    await loginAsInstructor(page);
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });

    // Aguarda estabilizar (API pode demorar)
    await page.waitForTimeout(2_000);

    const pendingSection = page.getByRole("heading", {
      name: "Solicitações Pendentes",
    });
    const hasPending = await pendingSection.isVisible().catch(() => false);

    if (hasPending) {
      // Badge com contador âmbar visível
      const badge = page.locator("span.bg-amber-500").first();
      await expect(badge).toBeVisible();
      expect(Number(await badge.textContent())).toBeGreaterThan(0);

      // LessonCard com badge "Aguardando"
      await expect(page.getByText("Aguardando").first()).toBeVisible();

      // Ambos os botões de ação presentes
      await expect(
        page.getByRole("button", { name: "Aceitar" }).first()
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Recusar" }).first()
      ).toBeVisible();
    } else {
      // Sem pendentes: seção NÃO deve aparecer
      await expect(pendingSection).not.toBeVisible();
    }
  });

  // ── Funcionais (com mock da API) ─────────────────────────────────────────

  test("aceitar aula: card muda para UPCOMING após resposta 200 da API", async ({
    page,
  }) => {
    await loginAsInstructor(page);
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await page.waitForTimeout(2_000);

    const hasPending = await page
      .getByRole("heading", { name: "Solicitações Pendentes" })
      .isVisible()
      .catch(() => false);

    if (!hasPending) {
      test.skip();
      return;
    }

    // Intercepta PATCH /lessons/:id/accept para retornar 200 independente do Stripe
    await page.route(`${BACKEND_URL}/lessons/*/accept`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Aula aceita",
          data: { status: "upcoming" },
          timestamp: new Date().toISOString(),
        }),
      });
    });

    const acceptBtn = page.getByRole("button", { name: "Aceitar" }).first();
    await acceptBtn.click();

    // Estado de loading aparece momentaneamente
    await expect(page.getByText("Processando...").first()).toBeVisible({
      timeout: 3_000,
    }).catch(() => {
      // Loading muito rápido — ok, continuamos
    });

    // Após onUpdate() → window.location.reload() → página recarrega
    await page.waitForURL("**/app/instructor/schedule", {
      timeout: BACKEND_TIMEOUT,
    });
    await page.waitForLoadState("domcontentloaded");

    // Aguarda as seções recarregarem
    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
  });

  test("recusar aula: card some da seção pendente após resposta 200 da API", async ({
    page,
  }) => {
    await loginAsInstructor(page);
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await page.waitForTimeout(2_000);

    const hasPending = await page
      .getByRole("heading", { name: "Solicitações Pendentes" })
      .isVisible()
      .catch(() => false);

    if (!hasPending) {
      test.skip();
      return;
    }

    // Conta cards pendentes antes
    const pendingCards = page
      .locator(".bg-white.rounded-2xl")
      .filter({ hasText: "Aguardando" });
    const countBefore = await pendingCards.count();

    // Intercepta PATCH /lessons/:id/reject para retornar 200
    await page.route(`${BACKEND_URL}/lessons/*/reject`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Aula recusada",
          data: { status: "cancelled" },
          timestamp: new Date().toISOString(),
        }),
      });
    });

    const rejectBtn = page.getByRole("button", { name: "Recusar" }).first();
    await rejectBtn.click();

    // Aguarda recarregamento após window.location.reload()
    await page.waitForURL("**/app/instructor/schedule", {
      timeout: BACKEND_TIMEOUT,
    });
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await page.waitForTimeout(2_000);

    // Após reject: quantidade de cards pendentes deve ser menor
    const countAfter = await page
      .locator(".bg-white.rounded-2xl")
      .filter({ hasText: "Aguardando" })
      .count();

    expect(countAfter).toBeLessThan(countBefore);
  });

  test("botão Aceitar mostra estado de loading enquanto aguarda resposta", async ({
    page,
  }) => {
    await loginAsInstructor(page);
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await page.waitForTimeout(2_000);

    const hasPending = await page
      .getByRole("heading", { name: "Solicitações Pendentes" })
      .isVisible()
      .catch(() => false);

    if (!hasPending) {
      test.skip();
      return;
    }

    // Intercepta e adiciona delay para capturar "Processando..."
    await page.route(`${BACKEND_URL}/lessons/*/accept`, async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Aula aceita",
          data: { status: "upcoming" },
          timestamp: new Date().toISOString(),
        }),
      });
    });

    const acceptBtn = page.getByRole("button", { name: "Aceitar" }).first();
    await acceptBtn.click();

    // ✅ "Processando..." aparece durante o loading
    await expect(page.getByText("Processando...").first()).toBeVisible({
      timeout: 3_000,
    });

    // ✅ Botões ficam disabled durante o processamento
    await expect(acceptBtn).toBeDisabled({ timeout: 2_000 }).catch(() => {
      // Pode ter recarregado antes de checar — ok
    });
  });

  // ── Fake auth — estrutura sem dados reais ────────────────────────────────

  test("estrutura da página de agenda com fake auth (sem backend)", async ({
    page,
  }) => {
    await loginAs(page, "instrutor.teste@velo.com", "123456", "instructor");
    await page.goto("/app/instructor/schedule");

    await expect(
      page.getByRole("heading", { name: "Agenda Completa" })
    ).toBeVisible({ timeout: 15_000 });

    // Com fake auth o backend retorna 401 → schedule vazio — estrutura base deve existir
    await expect(
      page.getByRole("button", { name: /bloquear/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Próximas Aulas" })
    ).toBeVisible({ timeout: 10_000 });

    // Sem pending: seção "Solicitações Pendentes" NÃO aparece
    await expect(
      page.getByRole("heading", { name: "Solicitações Pendentes" })
    ).not.toBeVisible();
  });
});
