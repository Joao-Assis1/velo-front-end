// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Fase 1 — Jornada do Aluno', () => {
  test('Landing `/` redireciona para /auth/login', async ({ page }) => {
    // 1. Navigate to / — assert redirect to /auth/login
    await page.goto('/');
    await expect(page).toHaveURL('/auth/login');

    // Assert login page heading visible
    await expect(page.getByRole('heading', { name: 'Entrar no Velo' })).toBeVisible();
  });
});
