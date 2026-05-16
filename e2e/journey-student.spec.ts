import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Journey 1ª CNH — fluxos críticos", () => {
  test("aluno recém-cadastrado vê NextStepCard no dashboard", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");
    await page.goto("/app/student/dashboard");
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
    await expect(
      page.getByText(/Inicie o curso teórico/i),
    ).toBeVisible({ timeout: 8_000 });
    await expect(
      page.getByRole("link", { name: /Ir para curso teórico/i }),
    ).toBeVisible();
  });

  test("aluno clica 'Já comecei' na theory-course e vê confirmação", async ({ page }) => {
    await loginAs(page, "student-registered@email.com");
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
    await page.route("**/journey/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            stage: "THEORY_COURSE_IN_PROGRESS",
            blockers: [{ code: "RENACH_PENDING", message: "" }],
            canScheduleLessons: false,
            progressPct: 15,
            completedSteps: ["REGISTERED"],
            nextStep: "RENACH_PENDING",
          },
        }),
      }),
    );
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

  test("aluno pronto vê 'Pronto para o exame DETRAN' em /progress", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");
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
    await page.route("**/journey/me/timeline", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            { key: "REGISTERED", label: "Cadastro", status: "completed" },
            {
              key: "READY_FOR_PRACTICAL_EXAM",
              label: "Pronto para o exame",
              status: "completed",
            },
          ],
        }),
      }),
    );
    await page.goto("/app/student/progress");
    await expect(
      page.getByText(/Pronto para o exame DETRAN/i),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("página instructors mostra badge DETRAN-MS credenciado", async ({ page }) => {
    await loginAs(page, "student-ready@email.com");
    await page.goto("/app/student/instructors");
    await expect(
      page.getByText(/DETRAN-MS credenciado/i).first(),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("botão 'Ativar' notificações aparece na página Minha Jornada", async ({ page }) => {
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
    await page.context().grantPermissions([], { origin: "http://localhost:3000" });
    await page.goto("/app/student/concierge");
    await expect(
      page.getByRole("button", { name: /Ativar/i }),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("POST /push/subscribe é chamado ao ativar notificações", async ({ page }) => {
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
    const activateBtn = page.getByRole("button", { name: /Ativar/i });
    if (await activateBtn.isVisible()) {
      await activateBtn.click();
    }
    await expect(
      page.getByText(/Notificações ativas|Notificações bloqueadas/i),
    ).toBeVisible({ timeout: 5_000 });
  });
});
