// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 2 — Jornada do Instrutor', () => {
  test('Profile — nome, seções e botão Sair visíveis', async ({ page }) => {
    // Use loginAs to inject instructor session
    await loginAs(page, 'instrutor@velo.com', '123456', 'instructor');

    // Navigate to instructor profile page
    await page.goto('/app/instructor/profile');

    // Assert instructor name visible
    await expect(page.getByRole('heading', { name: 'Instrutor Teste E2E' })).toBeVisible();

    // Assert button "Dados Profissionais" present
    await expect(page.getByRole('button', { name: 'Dados Profissionais' })).toBeVisible();

    // Assert button "Veículo" present
    await expect(page.getByRole('button', { name: 'Veículo' })).toBeVisible();

    // Assert button "Financeiro" present
    await expect(page.getByRole('button', { name: 'Financeiro' })).toBeVisible();

    // Assert button "Configurações" present
    await expect(page.getByRole('button', { name: 'Configurações' })).toBeVisible();

    // Assert "Sair da Conta" button present (use first() since the button appears in both sidebar and main)
    await expect(page.getByRole('button', { name: 'Sair da Conta' }).first()).toBeVisible();
  });
});
