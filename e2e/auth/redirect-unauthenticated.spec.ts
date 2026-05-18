// spec: specs/velo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve redirecionar usuário não autenticado para /auth/login', async ({ page }) => {
    // 1. Limpar cookies e navegar para /app/student/dashboard
    //    (fresh browser context has no cookies by default)
    await page.goto('/app/student/dashboard');

    // expect: Redireciona para /auth/login
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', { name: 'Entrar no Velo' })).toBeVisible();

    // 2. Limpar cookies e navegar para /app/instructor/dashboard
    await page.context().clearCookies();
    await page.goto('/app/instructor/dashboard');

    // expect: Redireciona para /auth/login
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', { name: 'Entrar no Velo' })).toBeVisible();
  });
});
