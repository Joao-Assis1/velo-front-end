// Testa o fluxo de onboarding Stripe Connect na tela de Configurações do instrutor.
// O token fake do loginAs faz GET /payments-stripe/connect/status retornar 401.
// O catch em getConnectStatusAction chama setLoading(false) sem setar status,
// resultando no estado PENDING (default) — "conta não conectada".
// O backend Render.com tem latência ~5-10s, por isso os timeouts são maiores.

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

const BACKEND_TIMEOUT = 15_000;

test.describe('Settings — Stripe Connect', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'instrutor.teste@velo.com', '123456', 'instructor');
    await page.goto('/app/instructor/settings');
  });

  test('exibe heading e seção conta de recebimento', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible();
    await expect(page.getByText('Conta de Recebimento')).toBeVisible();
  });

  test('estado PENDING — botão conectar conta visível após resolver loading', async ({ page }) => {
    // Aguarda o skeleton desaparecer: API retorna erro com token fake → estado PENDING
    const connectBtn = page.getByRole('button', { name: /conectar conta bancária via stripe/i });
    await expect(connectBtn).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await expect(connectBtn).toBeEnabled();
    await expect(page.getByText(/redirecionado ao stripe/i)).toBeVisible();
  });

  test('estado PENDING — seção senha coexiste com seção connect', async ({ page }) => {
    // Aguarda o connect resolver antes de checar os outros elementos
    await expect(page.getByRole('button', { name: /conectar conta bancária via stripe/i })).toBeVisible({ timeout: BACKEND_TIMEOUT });
    await expect(page.getByRole('button', { name: /redefinir senha/i })).toBeVisible();
  });

  test('botão conectar entra em loading ao clicar', async ({ page }) => {
    const connectBtn = page.getByRole('button', { name: /conectar conta bancária via stripe/i });
    await expect(connectBtn).toBeVisible({ timeout: BACKEND_TIMEOUT });

    // Clica — o botão deve ficar disabled imediatamente (estado loading)
    await connectBtn.click();
    await expect(connectBtn).toBeDisabled();
  });
});
