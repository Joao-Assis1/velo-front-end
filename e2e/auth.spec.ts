import { test, expect } from "@playwright/test";

// ─── helpers ─────────────────────────────────────────────────────────────────

async function fillStep1(page: any, opts: { name?: string; email?: string; password?: string; confirm?: string } = {}) {
  await page.getByLabel("Nome completo *").fill(opts.name ?? "João da Silva");
  await page.getByLabel("E-mail *").fill(opts.email ?? "joao@teste.com");
  await page.getByLabel("Senha *").fill(opts.password ?? "Senha123!");
  await page.getByLabel("Confirmar senha *").fill(opts.confirm ?? "Senha123!");
}

async function advanceToStep2(page: any) {
  await fillStep1(page);
  await page.getByRole("button", { name: /Próximo/i }).click();
}

async function fillStep2(page: any, opts: { cpf?: string; phone?: string; birthDate?: string; mother?: string; uf?: string } = {}) {
  await page.getByLabel("CPF *").fill(opts.cpf ?? "529.982.247-25");
  await page.getByLabel("Telefone *").fill(opts.phone ?? "(11) 99999-9999");
  await page.getByLabel("Data de nascimento *").fill(opts.birthDate ?? "1990-01-01");
  await page.getByLabel("Nome da mãe *").fill(opts.mother ?? "Maria da Silva");
  await page.getByLabel("UF de domicílio *").selectOption(opts.uf ?? "SP");
}

// ─── Cenário #1 — Landing ─────────────────────────────────────────────────────

test("#1 landing / redireciona para /auth/login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8_000 });
});

// ─── Cenário #2 — Register aluno ─────────────────────────────────────────────

test.describe("Cenário #2 — Registro de aluno", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/register/student");
  });

  test("step 1: campos vazios bloqueiam avanço", async ({ page }) => {
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/nome e sobrenome/i)).toBeVisible();
  });

  test("step 1: e-mail inválido bloqueia avanço", async ({ page }) => {
    await fillStep1(page, { email: "nao-e-email" });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/e-mail inválido/i)).toBeVisible();
  });

  test("step 1: senha muito curta bloqueia avanço", async ({ page }) => {
    await fillStep1(page, { password: "123", confirm: "123" });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/mínimo 6 caracteres/i)).toBeVisible();
  });

  test("step 1: senhas não coincidem bloqueiam avanço", async ({ page }) => {
    await fillStep1(page, { password: "Senha123!", confirm: "Outra123!" });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/senhas não coincidem/i)).toBeVisible();
  });

  test("step 2: CPF inválido (dígitos iguais) bloqueia avanço", async ({ page }) => {
    await advanceToStep2(page);
    await fillStep2(page, { cpf: "111.111.111-11" });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/cpf inválido/i)).toBeVisible();
  });

  test("step 2: CPF com comprimento errado bloqueia avanço", async ({ page }) => {
    await advanceToStep2(page);
    await fillStep2(page, { cpf: "123.456" });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/cpf inválido/i)).toBeVisible();
  });

  test("step 2: data de nascimento < 18 anos bloqueia avanço", async ({ page }) => {
    const under18 = new Date();
    under18.setFullYear(under18.getFullYear() - 17);
    const dateStr = under18.toISOString().split("T")[0];

    await advanceToStep2(page);
    await fillStep2(page, { birthDate: dateStr });
    await page.getByRole("button", { name: /Próximo/i }).click();
    await expect(page.getByText(/18 anos/i)).toBeVisible();
  });

  test("step 2: categoria B aparece como campo fixo (sem seleção)", async ({ page }) => {
    await advanceToStep2(page);
    await expect(page.getByText(/Veículo de passeio/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^A$/ })).not.toBeVisible();
  });

  test("step 2: CPF duplicado volta ao step 2 com mensagem", async ({ page }) => {
    await page.route("**/auth/register/student", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "CPF já cadastrado." }),
      }),
    );

    await advanceToStep2(page);
    await fillStep2(page);
    await page.getByRole("button", { name: /Próximo/i }).click();
    // Avança para step 3
    await page.getByRole("button", { name: /Simular envio/i }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Criar Conta/i }).click();

    await expect(page.getByText(/CPF já cadastrado/i)).toBeVisible({ timeout: 6_000 });
    // Voltou ao step 2
    await expect(page.getByLabel("CPF *")).toBeVisible();
  });

  test("registro completo redireciona para dashboard", async ({ page }) => {
    await page.route("**/auth/register/student", (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            access_token: "fake-token",
            user: { id: "u1", email: "joao@teste.com", name: "João da Silva", role: "student" },
          },
        }),
      }),
    );

    await advanceToStep2(page);
    await fillStep2(page);
    await page.getByRole("button", { name: /Próximo/i }).click();
    await page.getByRole("button", { name: /Simular envio/i }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Criar Conta/i }).click();

    await expect(page).toHaveURL(/\/app\/student\/dashboard/, { timeout: 10_000 });
  });
});

// ─── Cenário #3 — Login ───────────────────────────────────────────────────────

test.describe("Cenário #3 — Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("credencial inválida exibe mensagem de erro", async ({ page }) => {
    await page.route("**/auth/login/student", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Credenciais inválidas." }),
      }),
    );

    await page.getByLabel("E-mail").fill("errado@email.com");
    await page.getByLabel("Senha").fill("senhaErrada");
    await page.getByRole("button", { name: /Entrar/i }).click();

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible({ timeout: 6_000 });
  });

  test("login bem-sucedido como aluno redireciona para dashboard", async ({ page }) => {
    await page.route("**/auth/login/student", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            access_token: "tok-student",
            user: { id: "s1", email: "aluno@teste.com", name: "Aluno Teste", role: "student" },
          },
        }),
      }),
    );

    await page.getByLabel("E-mail").fill("aluno@teste.com");
    await page.getByLabel("Senha").fill("Senha123!");
    await page.getByRole("button", { name: /Entrar/i }).click();

    await expect(page).toHaveURL(/\/app\/student\/dashboard/, { timeout: 10_000 });
  });

  test("login bem-sucedido como instrutor redireciona para dashboard do instrutor", async ({ page }) => {
    await page.route("**/auth/login/instructor", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            access_token: "tok-instructor",
            user: { id: "i1", email: "instrutor@teste.com", name: "Instrutor Teste", role: "instructor" },
          },
        }),
      }),
    );

    await page.getByRole("button", { name: /instrutor/i }).click();
    await page.getByLabel("E-mail").fill("instrutor@teste.com");
    await page.getByLabel("Senha").fill("Senha123!");
    await page.getByRole("button", { name: /Entrar/i }).click();

    await expect(page).toHaveURL(/\/app\/instructor\/dashboard/, { timeout: 10_000 });
  });
});
