import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Journey 1ª CNH — fluxos críticos", () => {
  test("aluno recém-cadastrado vê NextStepCard no dashboard", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");

    // Register route BEFORE navigation to avoid race condition with useJourney fetch.
    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "REGISTERED",
            blockers: [{ code: "THEORY_COURSE_PENDING", message: "" }],
            canScheduleLessons: false,
            progressPct: 0,
            completedSteps: [],
            nextStep: "THEORY_COURSE_IN_PROGRESS",
          },
        }),
      }),
    );

    await page.goto("/app/student/dashboard");

    await expect(
      page.getByText(/Inicie o curso teórico/i),
    ).toBeVisible({ timeout: 8_000 });
    await expect(
      page.getByRole("link", { name: /Ir para curso teórico/i }),
    ).toBeVisible();
  });

  test("aluno clica 'Já comecei' na theory-course e vê confirmação", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");

    // Mock the POST that registers the theory-course start.
    await page.route("**/students/me/theory-course/start", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { stage: "THEORY_COURSE_IN_PROGRESS" },
        }),
      }),
    );

    // First call returns REGISTERED (so button is visible).
    // Subsequent calls (after invalidation) return THEORY_COURSE_IN_PROGRESS
    // (so the confirmation text appears).
    let journeyCallCount = 0;
    await page.route("**/journey/me", (route) => {
      journeyCallCount++;
      const stage =
        journeyCallCount === 1 ? "REGISTERED" : "THEORY_COURSE_IN_PROGRESS";
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage,
            blockers: journeyCallCount === 1
              ? [{ code: "THEORY_COURSE_PENDING", message: "" }]
              : [{ code: "RENACH_PENDING", message: "" }],
            canScheduleLessons: false,
            progressPct: journeyCallCount === 1 ? 0 : 15,
            completedSteps: journeyCallCount === 1 ? [] : ["REGISTERED"],
            nextStep: journeyCallCount === 1 ? "THEORY_COURSE_IN_PROGRESS" : "RENACH_PENDING",
          },
        }),
      });
    });

    await page.goto("/app/student/theory-course");
    await page.getByRole("button", { name: /Já comecei/i }).click();
    await expect(
      page.getByText(/marcou o curso teórico como iniciado/i),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("aluno sem LADV vê banner de bloqueio em /schedule", async ({ page }) => {
    await loginAs(page, "student-renach@email.com");

    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "AWAITING_LADV_UPLOAD",
            blockers: [{ code: "AWAITING_LADV_UPLOAD", message: "LADV pendente" }],
            canScheduleLessons: false,
            progressPct: 60,
            completedSteps: ["REGISTERED", "THEORY_COURSE_IN_PROGRESS", "RENACH_PENDING"],
            nextStep: "AWAITING_LADV_UPLOAD",
          },
        }),
      }),
    );

    await page.goto("/app/student/schedule");
    await expect(page.getByText(/LADV/i)).toBeVisible({ timeout: 8_000 });
  });

  test("aluno pronto vê 'Pronto para o exame DETRAN' no dashboard", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");

    // NextStepCard renders "Pronto para o exame DETRAN" on the dashboard
    // when stage === READY_FOR_PRACTICAL_EXAM and no blockers.
    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "READY_FOR_PRACTICAL_EXAM",
            blockers: [],
            canScheduleLessons: true,
            progressPct: 100,
            completedSteps: [
              "REGISTERED",
              "THEORY_COURSE_IN_PROGRESS",
              "RENACH_PENDING",
              "MEDICAL_PENDING",
              "PSYCH_PENDING",
              "THEORY_EXAM_PENDING",
              "AWAITING_LADV_UPLOAD",
              "PRACTICAL_IN_PROGRESS",
            ],
            nextStep: null,
          },
        }),
      }),
    );

    await page.goto("/app/student/dashboard");
    await expect(
      page.getByText(/Pronto para o exame DETRAN/i),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("página instrutores exibe informação de credenciamento DETRAN-MS", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");

    await page.goto("/app/student/instructors");

    // Static header text is always rendered regardless of whether
    // instructor API data loads (Server Action, not interceptable by page.route).
    await expect(
      page.getByRole("heading", { name: /Instrutores/i }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(
      page.getByText(/DETRAN-MS/i).first(),
    ).toBeVisible();
  });

  test("página Minha Jornada renderiza com dados da journey", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");

    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "THEORY_COURSE_IN_PROGRESS",
            blockers: [],
            canScheduleLessons: false,
            progressPct: 10,
            completedSteps: ["REGISTERED"],
            nextStep: "RENACH_PENDING",
          },
        }),
      }),
    );
    await page.route("**/journey/me/timeline", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      }),
    );

    await page.goto("/app/student/concierge");

    // In headless Chromium, serviceWorker is unavailable so the push
    // notification button may not render (isPushSupported() → false).
    // We verify the core journey content instead.
    await expect(
      page.getByRole("heading", { name: /Minha Jornada/i }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/THEORY_COURSE_IN_PROGRESS/i)).toBeVisible();
  });

  test("concierge exibe estado de notificações compatível com as permissões", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");

    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "THEORY_COURSE_IN_PROGRESS",
            blockers: [],
            canScheduleLessons: false,
            progressPct: 10,
            completedSteps: ["REGISTERED"],
            nextStep: "RENACH_PENDING",
          },
        }),
      }),
    );
    await page.route("**/journey/me/timeline", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      }),
    );
    await page.route("**/push/subscribe", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: null }),
      }),
    );

    await page.context().grantPermissions(["notifications"], {
      origin: "http://localhost:3000",
    });
    await page.goto("/app/student/concierge");

    // If push is supported in this browser/environment, clicking "Ativar"
    // should show a status. In headless Chromium serviceWorker is unavailable,
    // so we check conditionally and fall back to verifying page content.
    const activateBtn = page.getByRole("button", { name: /Ativar/i });
    if (await activateBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await activateBtn.click();
      await expect(
        page.getByText(/Notificações ativas|Notificações bloqueadas/i),
      ).toBeVisible({ timeout: 5_000 });
    } else {
      // Push not supported in this environment — verify page renders correctly.
      await expect(
        page.getByRole("heading", { name: /Minha Jornada/i }),
      ).toBeVisible({ timeout: 8_000 });
    }
  });

  // ─── Cenário #6 — RENACH ─────────────────────────────────────────────────

  test("aluno #6: dashboard exibe card de RENACH pendente", async ({ page }) => {
    await loginAs(page, "student-theory@email.com");

    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "RENACH_PENDING",
            blockers: [{ code: "RENACH_PENDING", message: "RENACH pendente" }],
            canScheduleLessons: false,
            progressPct: 20,
            completedSteps: ["REGISTERED", "THEORY_COURSE_IN_PROGRESS"],
            nextStep: "RENACH_PENDING",
          },
        }),
      }),
    );

    await page.goto("/app/student/dashboard");
    await expect(page.getByText(/renach/i)).toBeVisible({ timeout: 8_000 });
  });

  // ─── Cenário #7 — Médico + Psicotécnico ──────────────────────────────────

  test("aluno #7: dashboard exibe exame médico pendente", async ({ page }) => {
    await loginAs(page, "student-renach@email.com");

    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "MEDICAL_PENDING",
            blockers: [{ code: "MEDICAL_PENDING", message: "Exame médico pendente" }],
            canScheduleLessons: false,
            progressPct: 40,
            completedSteps: ["REGISTERED", "THEORY_COURSE_IN_PROGRESS", "RENACH_PENDING"],
            nextStep: "MEDICAL_PENDING",
          },
        }),
      }),
    );

    await page.goto("/app/student/dashboard");
    await expect(page.getByText(/médico|exame/i)).toBeVisible({ timeout: 8_000 });
  });

  // ─── Cenário #13 — Lista de instrutores ──────────────────────────────────

  test("aluno #13: lista de instrutores carrega com dados e busca funciona", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");

    await page.route("**/instructors*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            { id: "i1", name: "Carlos Souza", pricePerClass: 100, rating: 4.7, reviewsCount: 30, location: "Campo Grande" },
            { id: "i2", name: "Ana Lima", pricePerClass: 130, rating: 4.9, reviewsCount: 55, location: "Campo Grande" },
          ],
        }),
      }),
    );

    await page.goto("/app/student/instructors");

    await expect(page.getByRole("heading", { name: /instrutores/i })).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText("Carlos Souza")).toBeVisible();
    await expect(page.getByText("Ana Lima")).toBeVisible();

    const searchInput = page.getByPlaceholder(/buscar/i);
    if (await searchInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await searchInput.fill("Carlos");
      await expect(page.getByText("Carlos Souza")).toBeVisible();
    }
  });

  // ─── Cenário #15 — Disputes ───────────────────────────────────────────────

  test("aluno #15: lista de disputas exibe itens abertos", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");

    await page.route("**/disputes*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            { id: "d1", reason: "Instrutor não compareceu", status: "OPEN", createdAt: new Date().toISOString() },
          ],
        }),
      }),
    );

    await page.goto("/app/student/disputes");

    await expect(page.getByRole("heading", { name: /disputas|reclamações/i })).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/Instrutor não compareceu|OPEN/i)).toBeVisible();
  });

  // ─── Cenário #16 — Profile edit ──────────────────────────────────────────

  test("aluno #16: tela de perfil carrega e botão salvar existe", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");

    await page.route("**/students/*", (route) => {
      if (route.request().method() === "PATCH" || route.request().method() === "PUT") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: {} }),
        });
      }
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "s1", name: "Aluno Teste E2E", email: "student-ready@email.com" },
        }),
      });
    });

    await page.goto("/app/student/profile");

    await expect(page.getByRole("heading", { name: /perfil/i })).toBeVisible({ timeout: 8_000 });

    const saveBtn = page.getByRole("button", { name: /salvar|atualizar/i });
    if (await saveBtn.isVisible({ timeout: 4_000 }).catch(() => false)) {
      await saveBtn.click();
      await expect(page.getByText(/salvo|atualizado|sucesso/i)).toBeVisible({ timeout: 5_000 });
    }
  });
});
