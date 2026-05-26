// spec: specs/velo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cadastro do Instrutor', () => {
  // test.fixme: This test requires a real backend to create an account.
  // The e2e-test-token is not accepted by the backend, so POST /auth/register/instructor
  // returns 4xx and the form never redirects to /app/instructor/dashboard.
  // Additionally, getByText('Acesso') causes a strict mode violation because it matches
  // both the step indicator generic element and the heading "Dados de acesso".
  test.fixme('deve completar o cadastro de 4 passos com dados válidos', async ({ page }) => {
    // 1. Navegar para /auth/register/instructor
    await page.goto('/auth/register/instructor');

    // expect: Página exibe título 'Cadastro de Instrutor'
    await expect(page.getByRole('heading', { name: 'Cadastro de Instrutor' })).toBeVisible();

    // expect: Indicador de passo mostra '1 Acesso' ativo
    await expect(page.getByText('Acesso', { exact: true }).first()).toBeVisible();

    // 2. Preencher nome, e-mail, senha e confirmar senha no passo 1 e clicar em Próximo
    await page.getByRole('textbox', { name: 'João da Silva' }).fill('Carlos Pereira');
    // Use timestamp-based unique email to avoid duplicate conflicts with backend
    const uniqueEmail = `instrutor+${Date.now()}@velo.com`;
    await page.getByRole('textbox', { name: 'seu@email.com' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: '••••••••' }).first().fill('senha123');
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill('senha123');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Indicador avança para passo 2 Perfil
    await expect(page.getByRole('heading', { name: 'Dados pessoais e profissionais' })).toBeVisible();
    await expect(page.getByText('Perfil')).toBeVisible();

    // 3. Preencher CPF, telefone, data de nascimento, escolaridade, cidade e valor por aula no passo 2 e clicar em Próximo
    await page.getByRole('textbox', { name: '-00' }).fill('12345678901');
    await page.getByRole('textbox', { name: '(11) 99999-' }).fill('11987654321');
    await page.locator('input[type="date"]').fill('1990-05-15');
    await page.getByRole('combobox').selectOption(['Médio Completo']);
    await page.getByRole('textbox', { name: 'Ex: São Paulo - SP, Vila' }).fill('São Paulo - SP');
    await page.getByPlaceholder('80,00').fill('120');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Indicador avança para passo 3 Habilitação
    await expect(page.getByRole('heading', { name: 'Habilitação e Credencial' })).toBeVisible();

    // 4. Marcar as 3 declarações obrigatórias, preencher CNH, categoria, validade, RENACH,
    //    selecionar EAR e tipo de instrutor, preencher certidão negativa e clicar em Próximo
    await page.getByRole('checkbox', { name: 'Não cometi infração graví' }).click();
    await page.getByRole('checkbox', { name: 'Possuo certificado de curso' }).click();
    await page.getByRole('checkbox', { name: 'Não sofri penalidade de cassa' }).click();
    await page.getByRole('textbox', { name: '00000000000' }).first().fill('12345678901');
    await page.getByRole('combobox').selectOption(['B']);
    await page.locator('input[type="date"]').fill('2030-12-31');
    await page.getByRole('textbox', { name: '00000000000' }).nth(1).fill('98765432100');
    await page.getByRole('button', { name: '🚗 Autônomo' }).click();
    await page.getByRole('textbox', { name: 'Nº ou protocolo da Certidão' }).fill('CERT-2024-001234');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Indicador avança para passo 4 Veículo
    await expect(page.getByRole('heading', { name: 'Veículo de instrução' })).toBeVisible();

    // 5. Preencher placa, ano, modelo, selecionar câmbio Manual e aceitar os Termos de Uso e clicar em Criar Conta
    await page.getByRole('textbox', { name: 'ABC-1234 ou ABC1D23' }).fill('ABC1234');
    await page.getByPlaceholder('2018').fill('2020');
    await page.getByRole('textbox', { name: 'Ex: Volkswagen Polo' }).fill('Volkswagen Polo 1.0');
    await page.getByRole('button', { name: '⚙️ Manual' }).click();
    await page.getByRole('checkbox', { name: 'Declaro que as informações sã' }).click();
    await page.getByRole('button', { name: '✓ Criar Conta' }).click();

    // expect: Redireciona para /app/instructor/dashboard
    await expect(page).toHaveURL('/app/instructor/dashboard');

    // expect: Dashboard exibe 'Olá, Carlos'
    await expect(page.getByText('Olá, Carlos')).toBeVisible();
  });
});
