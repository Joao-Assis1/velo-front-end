// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Fase 4 — Edge Cases', () => {
  test('Mobile viewport 375x667 — sem overflow horizontal no formulário de cadastro', async ({ page }) => {
    // Set viewport to 375x667 (mobile)
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to /auth/register/instructor
    await page.goto('/auth/register/instructor');

    // Assert no horizontal scrollbar (scrollWidth <= clientWidth)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
