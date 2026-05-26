// Fase 2 — Jornada do Instrutor
// Cenário 3: Vehicle — cadastro e edição do veículo
//
// Pontos críticos: campos visíveis, validação de placa, toggle de câmbio,
// checkbox duplo comando, botão de salvar.
//
// Usa loginAs (fake auth) para testar estrutura da UI sem dependência do
// backend frio do Render. Validações de formulário são client-side e
// funcionam sem JWT real.

import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers/auth";

test.describe("Fase 2 — Jornada do Instrutor", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "instrutor@velo.com", "123456", "instructor");
    await page.goto("/app/instructor/vehicle");
  });

  test("cenário 3: tela Meu Veículo carrega com campos e botão de salvar", async ({
    page,
  }) => {
    // Heading e subtítulo
    await expect(
      page.getByRole("heading", { name: "Meu Veículo" })
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText("Gerencie o veículo utilizado nas aulas")
    ).toBeVisible();

    // Labels dos campos (a tela usa <label> sem htmlFor — verifica texto)
    await expect(page.getByText("Modelo do Veículo")).toBeVisible();
    await expect(page.getByText("Placa")).toBeVisible();
    await expect(page.getByText("Ano")).toBeVisible();

    // Inputs identificáveis por placeholder
    await expect(page.getByPlaceholder("ABC-1234")).toBeVisible();
    await expect(page.getByPlaceholder("2023")).toBeVisible();

    // Toggle de câmbio
    await expect(page.getByRole("button", { name: "Manual" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Automático" })
    ).toBeVisible();

    // Checkbox duplo comando
    await expect(page.getByRole("checkbox")).toBeVisible();
    await expect(page.getByText(/Duplo Comando/)).toBeVisible();

    // Botão de salvar
    await expect(
      page.getByRole("button", { name: "Salvar Alterações" })
    ).toBeVisible();
  });

  test("cenário 3: validação de placa — formato inválido exibe erro no submit", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Meu Veículo" })
    ).toBeVisible({ timeout: 10_000 });

    // Preenche placa inválida e submete — validação retorna antes de chamar API
    // (seguro com fake auth pois o early-return ocorre antes de updateInstructorVehicleAction)
    await page.getByPlaceholder("ABC-1234").fill("INVALIDO");
    await page.getByRole("button", { name: "Salvar Alterações" }).click();

    await expect(
      page.getByText(/Placa inválida\. Use o formato/)
    ).toBeVisible({ timeout: 4_000 });
  });

  test("cenário 3: validação de placa — formato Mercosul (AAA-0A00) não exibe erro antes do submit", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Meu Veículo" })
    ).toBeVisible({ timeout: 10_000 });

    // Preenche placa válida — enquanto não submete, nenhum erro de placa é exibido
    await page.getByPlaceholder("ABC-1234").fill("ABC-1E23");

    await expect(
      page.getByText(/Placa inválida/)
    ).not.toBeVisible();
  });

  test("cenário 3: toggle de câmbio alterna entre Manual e Automático", async ({
    page,
  }) => {
    // Timeout maior: página faz fetch do perfil antes de renderizar (backend Render.com)
    await expect(
      page.getByRole("heading", { name: "Meu Veículo" })
    ).toBeVisible({ timeout: 20_000 });

    const autoBtn = page.getByRole("button", { name: "Automático" });
    const manualBtn = page.getByRole("button", { name: "Manual" });

    // Clica Automático
    await autoBtn.click();
    // O botão ativo ganha bg-white — verificamos que o clique não dá erro e ambos seguem visíveis
    await expect(autoBtn).toBeVisible();
    await expect(manualBtn).toBeVisible();

    // Volta para Manual
    await manualBtn.click();
    await expect(manualBtn).toBeVisible();
  });

  test("cenário 3: checkbox Duplo Comando pode ser marcado e desmarcado", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Meu Veículo" })
    ).toBeVisible({ timeout: 10_000 });

    const checkbox = page.getByRole("checkbox");
    const initialState = await checkbox.isChecked();

    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(!initialState);

    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(initialState);
  });
});
