import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

const INSTRUCTOR_PROFILE = {
  id: "e2e-instructor-1",
  name: "Instrutor Teste E2E",
  email: "instrutor@teste.com",
  rating: 4.8,
  reviewsCount: 12,
  pricePerClass: 120,
  availability: [],
  busySlots: [],
  vehicles: [],
};

function mockInstructorProfile(page: any) {
  return page.route("**/instructors/me", (route: any) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: INSTRUCTOR_PROFILE }),
    }),
  );
}

// ─── I-2 — Dashboard do instrutor ────────────────────────────────────────────
// Heading real: "Olá, {firstName}" — não há texto "dashboard" na página.
// scheduledClasses é filtrado por instructorId + isToday(date); o mock de
// /lessons precisa incluir esses campos para aparecer na "Agenda de Hoje".

test("instrutor #2: dashboard carrega com heading de boas-vindas e seção de agenda", async ({ page }) => {
  await loginAs(page, "instrutor@teste.com", "123456", "instructor");

  const today = new Date();
  today.setHours(10, 0, 0, 0);

  await page.route("**/lessons*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: "l1",
            instructorId: "e2e-instructor-1",
            studentName: "Aluno Teste",
            date: today.toISOString(),
            scheduledAt: today.toISOString(),
            status: "scheduled",
            price: 120,
            paymentReleased: false,
          },
        ],
      }),
    }),
  );

  await page.goto("/app/instructor/dashboard");

  await expect(page.getByRole("heading", { name: /olá/i })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(/agenda de hoje/i)).toBeVisible({ timeout: 6_000 });
});

// ─── I-4 — Agenda completa / Disponibilidade ─────────────────────────────────
// A página /app/instructor/schedule exibe heading "Agenda Completa" (h1).
// Regex /agenda/ bate em 2 elementos; usar /agenda completa/ para ser preciso.

test("instrutor #4: tela de agenda completa renderiza com heading correto", async ({ page }) => {
  await loginAs(page, "instrutor@teste.com", "123456", "instructor");

  await page.route("**/instructors/*/availabilities", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.goto("/app/instructor/schedule");

  await expect(
    page.getByRole("heading", { name: /agenda completa/i }),
  ).toBeVisible({ timeout: 8_000 });
});

// ─── I-5 — Aceitar aula / estado vazio do dashboard ──────────────────────────
// O dashboard não expõe botões de "aceitar" — aulas já chegam com status
// definido pelo backend. Verifica que o dashboard carrega sem erros e exibe
// o estado vazio correto quando não há aulas.

test("instrutor #5: dashboard exibe estado vazio quando não há aulas hoje", async ({ page }) => {
  await loginAs(page, "instrutor@teste.com", "123456", "instructor");

  await page.route("**/lessons*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.goto("/app/instructor/dashboard");

  await expect(page.getByRole("heading", { name: /olá/i })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(/agenda de hoje/i)).toBeVisible({ timeout: 6_000 });
  await expect(page.getByText(/sem aulas para hoje/i)).toBeVisible({ timeout: 6_000 });
});

// ─── I-7 — Finanças ──────────────────────────────────────────────────────────
// Strict mode: "Transferências automáticas" e a descrição do bloco ambas batem
// em /automática/; usar texto exato para o título do bloco.

test("instrutor #7: tela de finanças exibe saldo e transferências automáticas", async ({ page }) => {
  await loginAs(page, "instrutor@teste.com", "123456", "instructor");

  await page.route("**/instructors/*/balance", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { pending: 240.0, available: 960.0, total: 1200.0 },
      }),
    }),
  );

  await page.goto("/app/instructor/finance");

  await expect(
    page.getByRole("heading", { name: /finanças|financeiro/i }),
  ).toBeVisible({ timeout: 8_000 });

  await expect(page.getByRole("button", { name: /sacar|transferir/i })).not.toBeVisible();
  await expect(page.getByText("Transferências automáticas")).toBeVisible({ timeout: 6_000 });
});

// ─── I-8 — Editar perfil do instrutor ────────────────────────────────────────
// /app/instructor/profile/edit tem o form com heading "Editar Perfil".

test("instrutor #8: editar perfil exibe formulário com heading correto", async ({ page }) => {
  await loginAs(page, "instrutor@teste.com", "123456", "instructor");
  await mockInstructorProfile(page);

  await page.route("**/instructors/*", (route) => {
    if (route.request().method() === "PATCH" || route.request().method() === "PUT") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: INSTRUCTOR_PROFILE }),
      });
    }
    route.continue();
  });

  await page.goto("/app/instructor/profile/edit");

  await expect(
    page.getByRole("heading", { name: /editar perfil/i }),
  ).toBeVisible({ timeout: 8_000 });

  // Formulário carrega com campos editáveis e botão de salvar
  await expect(page.getByRole("button", { name: /salvar/i })).toBeVisible({ timeout: 4_000 });
});
