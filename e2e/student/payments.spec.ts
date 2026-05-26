// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 3 — Pagamentos Stripe', () => {
  test('Payments — heading e botão "Adicionar novo cartão" visíveis, sem "Unauthorized" bruto (BUG-003)', async ({ page }) => {
    // Use loginAs to inject student session
    await loginAs(page, 'aluno@velo.com', '123456', 'student');

    // Navigate to student payments page
    await page.goto('/app/student/payments');

    // Assert heading "Métodos de pagamento" visible
    await expect(page.getByRole('heading', { name: 'Métodos de pagamento' })).toBeVisible();

    // Assert "Adicionar novo cartão" section heading visible
    await expect(page.getByRole('heading', { name: 'Adicionar novo cartão' })).toBeVisible();

    // Assert NO raw "Unauthorized" text visible in main content (BUG-003 regression)
    // A raw HTTP status message must never be exposed directly in the UI
    await expect(page.getByRole('main').filter({ hasText: 'Unauthorized' }).locator('p, h1, h2, h3, span').filter({ hasText: /^Unauthorized$/ })).not.toBeVisible();
  });
});
