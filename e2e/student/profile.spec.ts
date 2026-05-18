// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 1 — Jornada do Aluno', () => {
  test('Profile — seções e botão Sair visíveis', async ({ page }) => {
    // Use loginAs to inject student session
    await loginAs(page, 'aluno@velo.com', '123456', 'student');

    // Navigate to student profile page
    await page.goto('/app/student/profile');

    // Assert student name heading visible
    await expect(page.getByRole('heading', { name: 'Aluno Teste E2E' })).toBeVisible();

    // Assert button "Dados Pessoais" present
    await expect(page.getByRole('button', { name: 'Dados Pessoais' })).toBeVisible();

    // Assert button "Pagamentos" present
    await expect(page.getByRole('button', { name: 'Pagamentos' })).toBeVisible();

    // Assert button "Configurações" present
    await expect(page.getByRole('button', { name: 'Configurações' })).toBeVisible();

    // Assert "Sair da Conta" button present in main content
    // (button also exists in sidebar, so scope to main to avoid strict mode violation)
    await expect(page.getByRole('main').getByRole('button', { name: 'Sair da Conta' })).toBeVisible();
  });
});
