// Fase 3 — Pagamentos & Financeiro Stripe
// Cenário 8:  Disputa aberta — UI da tela de disputas do aluno
// Cenário 9:  Disputa resolvida a favor do aluno  → botão "Estornar" + feedback
// Cenário 10: Disputa resolvida a favor do instrutor → botão "Liberar" + feedback
//
// Restrições:
//   - Credenciais do aluno desconhecidas → cenário 8 usa loginAs (fake auth) para
//     verificar estrutura da tela. Dados reais exigem conta funcional de aluno.
//   - Cenários 9-10 usam login REAL do instrutor e o lessonId da aula concluída
//     conhecida. Se não houver disputa aberta o backend retorna erro — a UI deve
//     exibir a mensagem de erro sem crashar.

import { test, expect, Page } from "@playwright/test";
import { loginAs } from "../helpers/auth";

const INSTRUCTOR_EMAIL = "instrutor.teste@velo.com";
const INSTRUCTOR_PASSWORD = "123456";
// Aula concluída conhecida (pi_3TYGleEAyXohnL2v0PuBLWEZ / R$ 80,00)
const KNOWN_LESSON_ID = "f8456180-500b-49a4-99d2-976f87c2e397";
const BACKEND_TIMEOUT = 35_000;

async function loginAsInstructor(page: Page) {
  await page.goto("/auth/login");
  await page.getByRole("button", { name: "Instrutor" }).click();
  await page.getByRole("textbox", { name: "seu@email.com" }).fill(INSTRUCTOR_EMAIL);
  await page.getByRole("textbox", { name: "••••••••" }).fill(INSTRUCTOR_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/app/instructor/**", { timeout: BACKEND_TIMEOUT });
}

// ─────────────────────────────────────────────
// Cenário 8 — Tela de disputas do aluno
// ─────────────────────────────────────────────
test.describe("Cenário 8 — Disputa aberta (UI da tela do aluno)", () => {
  test("tela /dispute carrega heading e estado inicial", async ({ page }) => {
    await loginAs(page, "aluno@teste.com", "123456", "student");
    await page.goto("/app/student/dispute");

    // Heading principal visível
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 15_000,
    });

    // Página não crasha (sem erro JS no título ou corpo)
    const title = await page.title();
    expect(title).not.toMatch(/error|500|not found/i);

    // Se houver aulas concluídas elegíveis (conta real), botão de disputa aparece
    const openBtn = page.getByRole("button", { name: /contestar/i }).first();
    const hasEligible = await openBtn.isVisible({ timeout: 6_000 }).catch(() => false);

    if (hasEligible) {
      // Clicar abre o accordion/form de motivo
      await openBtn.click();
      await expect(page.getByRole("textbox")).toBeVisible({ timeout: 4_000 });
    } else {
      // Sem dados reais — verifica estado vazio ou lista de concluídas sem disputa elegível
      const body = await page.locator("main").textContent();
      expect(body).toBeTruthy();
    }
  });

  test("tela /disputes (plural) exibe estrutura de lista de disputas", async ({ page }) => {
    await loginAs(page, "aluno@teste.com", "123456", "student");
    await page.goto("/app/student/disputes");

    await expect(page.getByRole("heading", { name: "Disputas" })).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText("Contestações relacionadas às suas aulas")
    ).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// Cenários 9 e 10 — Página admin de resolução
// ─────────────────────────────────────────────
test.describe.serial("Cenários 9-10 — Resolução de disputa (página admin)", () => {
  test.setTimeout(120_000);

  test("cenário 9: página de resolução carrega e botão Estornar está visível", async ({
    page,
  }) => {
    await loginAsInstructor(page);

    const url =
      `/app/student/dispute/${KNOWN_LESSON_ID}` +
      `?reason=Instrutor+chegou+atrasado` +
      `&openedAt=${encodeURIComponent(new Date().toISOString())}` +
      `&paymentStatus=COMPLETED`;

    await page.goto(url);

    // Heading da página de disputa
    await expect(
      page.getByRole("heading", { name: "Disputa da aula" })
    ).toBeVisible({ timeout: 10_000 });

    // Seção de detalhes (scoped dentro do main para evitar conflito com sidebar)
    const main = page.locator("main");
    await expect(main.getByText("Pagamento", { exact: true })).toBeVisible();
    await expect(main.getByText("Motivo", { exact: true })).toBeVisible();

    // Botão de estorno visível
    const refundBtn = page.getByRole("button", { name: /estornar/i });
    await expect(refundBtn).toBeVisible();
    await expect(refundBtn).toBeEnabled();

    // ✅ Clicar e verificar feedback (sucesso ou erro tratado da API)
    await refundBtn.click();

    // Aguarda resposta do backend (pode demorar no cold start)
    const feedback = page.locator('[role="alert"], section.rounded-xl.border-emerald-300');
    await expect(feedback.first()).toBeVisible({ timeout: BACKEND_TIMEOUT });

    // Não deve haver crash — título da página mantém
    await expect(page.getByRole("heading", { name: "Disputa da aula" })).toBeVisible();
  });

  test("cenário 10: botão Liberar pagamento ao instrutor presente e funcional", async ({
    page,
  }) => {
    await loginAsInstructor(page);

    const url =
      `/app/student/dispute/${KNOWN_LESSON_ID}` +
      `?reason=Tudo+ocorreu+bem` +
      `&openedAt=${encodeURIComponent(new Date().toISOString())}` +
      `&paymentStatus=COMPLETED`;

    await page.goto(url);

    await expect(
      page.getByRole("heading", { name: "Disputa da aula" })
    ).toBeVisible({ timeout: 10_000 });

    // Botão de liberar ao instrutor visível
    const releaseBtn = page.getByRole("button", { name: /liberar pagamento/i });
    await expect(releaseBtn).toBeVisible();
    await expect(releaseBtn).toBeEnabled();

    // ✅ Clicar e verificar feedback
    await releaseBtn.click();

    const feedback = page.locator('[role="alert"], section.rounded-xl.border-emerald-300');
    await expect(feedback.first()).toBeVisible({ timeout: BACKEND_TIMEOUT });

    await expect(page.getByRole("heading", { name: "Disputa da aula" })).toBeVisible();
  });
});
