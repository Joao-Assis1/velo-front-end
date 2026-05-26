// spec: specs/velo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cadastro do Instrutor', () => {
  test('deve bloquear avanço com campos obrigatórios vazios', async ({ page }) => {
    // 1. Navegar para /auth/register/instructor e clicar em Próximo sem preencher nada
    await page.goto('/auth/register/instructor');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Mensagem de erro exibida
    await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();

    // expect: Permanece no passo 1
    await expect(page.getByRole('heading', { name: 'Dados de acesso' })).toBeVisible();

    // 2. Preencher apenas nome sem sobrenome e clicar em Próximo
    await page.getByRole('textbox', { name: 'João da Silva' }).fill('Carlos');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Erro: 'Informe nome e sobrenome'
    await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();

    // 3. Preencher e-mail sem @ e clicar em Próximo
    await page.getByRole('textbox', { name: 'João da Silva' }).fill('Carlos Pereira');
    await page.getByRole('textbox', { name: 'seu@email.com' }).fill('emailsemarroba');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Erro: 'E-mail inválido'
    await expect(page.getByText('E-mail inválido.')).toBeVisible();

    // 4. Preencher senha com menos de 6 caracteres e clicar em Próximo
    await page.getByRole('textbox', { name: 'seu@email.com' }).fill('carlos@velo.com');
    await page.getByRole('textbox', { name: '••••••••' }).first().fill('abc');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Erro: 'Senha deve ter mínimo 6 caracteres'
    await expect(page.getByText('Senha deve ter mínimo 6')).toBeVisible();

    // 5. Preencher senhas diferentes e clicar em Próximo
    await page.getByRole('textbox', { name: '••••••••' }).first().fill('senha123');
    await page.getByRole('textbox', { name: '••••••••' }).nth(1).fill('diferente456');
    await page.getByRole('button', { name: 'Próximo →' }).click();

    // expect: Erro: 'As senhas não coincidem'
    await expect(page.getByText('As senhas não coincidem.')).toBeVisible();
  });
});
