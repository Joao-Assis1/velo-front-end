// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 2 — Jornada do Instrutor', () => {
  test('Schedule — agenda, bloquear e histórico visíveis', async ({ page }) => {
    // Use loginAs to inject instructor session
    await loginAs(page, 'instrutor@velo.com', '123456', 'instructor');

    // Navigate to instructor schedule page
    await page.goto('/app/instructor/schedule');

    // Assert heading "Agenda Completa" visible
    await expect(page.getByRole('heading', { name: 'Agenda Completa' })).toBeVisible();

    // Assert "Bloquear" button visible
    await expect(page.getByRole('button', { name: 'Bloquear' })).toBeVisible();

    // Assert "Próximas Aulas" section visible
    await expect(page.getByRole('heading', { name: 'Próximas Aulas' })).toBeVisible();

    // Assert "Histórico Recente" section visible
    await expect(page.getByRole('heading', { name: 'Histórico Recente' })).toBeVisible();
  });
});
