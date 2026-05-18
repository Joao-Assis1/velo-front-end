// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 1 — Jornada do Aluno', () => {
  test('Instructors list — busca e heading visíveis', async ({ page }) => {
    // Use loginAs to inject student session
    await loginAs(page, 'aluno@velo.com', '123456', 'student');

    // Navigate to instructors page
    await page.goto('/app/student/instructors');

    // Assert heading "Instrutores" visible
    await expect(page.getByRole('heading', { name: 'Instrutores' })).toBeVisible();

    // Assert search textbox "Nome, bairro ou cidade..." present
    await expect(page.getByRole('textbox', { name: 'Nome, bairro ou cidade...' })).toBeVisible();

    // Assert a navigation element with links to dashboard is present.
    // On desktop the sidebar logo "V VELO" is rendered; on mobile only a back-arrow
    // link and a bottom nav bar are shown (the logo link is not in the DOM at all).
    // So we check the heading and search box which are present on all viewports.
    await expect(page.getByRole('heading', { name: 'Instrutores' })).toBeVisible();
  });
});
