// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Fase 1 — Jornada do Aluno', () => {
  test('Login — credencial inválida exibe erro e permanece em /auth/login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill in invalid email
    await page.locator('input[type="email"], input[placeholder*="email" i]').fill('invalid@example.com');

    // Fill in wrong password
    await page.locator('input[type="password"]').fill('wrongpassword');

    // Submit the login form
    await page.locator('button[type="submit"], button:has-text("Entrar")').click();

    // Assert error message is shown
    await expect(page.getByText('Credenciais inválidas')).toBeVisible();

    // Assert URL stays at /auth/login
    await expect(page).toHaveURL('/auth/login');
  });
});
