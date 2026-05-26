// spec: docs/plano-teste-navegador.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Fase 1 — Jornada do Aluno', () => {
  test('Theory Course — conteúdo e botão "Já comecei" visíveis', async ({ page }) => {
    // Use loginAs to inject student session
    await loginAs(page, 'aluno@velo.com', '123456', 'student');

    // Navigate to theory course page
    await page.goto('/app/student/theory-course');

    // Assert heading "Curso teórico oficial" visible
    await expect(page.getByRole('heading', { name: 'Curso teórico oficial' })).toBeVisible();

    // Assert list with 4 instructions visible
    await expect(page.locator('body')).toMatchAriaSnapshot(`
- list:
  - listitem: "Baixe o app oficial CNH do Brasil na loja do seu celular."
  - listitem: "Faça login com sua conta gov.br nível ouro/prata."
  - listitem: "Conclua os módulos teóricos no próprio app (45 horas mínimas)."
`);

    // Assert link to gov.br present (href contains "gov.br")
    const govLink = page.getByRole('link', { name: 'Saiba mais sobre o app oficial' });
    await expect(govLink).toBeVisible();
    await expect(govLink).toHaveAttribute('href', /gov\.br/);

    // Assert button "Já comecei o curso teórico" visible
    await expect(page.getByRole('button', { name: 'Já comecei o curso teórico' })).toBeVisible();
  });
});
