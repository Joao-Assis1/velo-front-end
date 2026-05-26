// spec: specs/velo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Dashboard do Instrutor', () => {
  test('deve exibir dashboard com saldos e agenda vazia para novo instrutor', async ({ page }) => {
    // 1. Logar como instrutor e navegar para /app/instructor/dashboard
    await loginAs(page, 'instrutor@velo.com', '123456', 'instructor');
    await page.goto('/app/instructor/dashboard');

    // expect: Exibe nome do instrutor no heading com 'Olá,'
    await expect(page.getByRole('heading', { name: /Olá, Instrutor/ })).toBeVisible();

    // expect: Disponível R$ 0,00
    await expect(page.getByText('Disponível')).toBeVisible();

    // expect: A Liberar R$ 0,00
    await expect(page.getByText('A Liberar')).toBeVisible();

    // expect: Ganhos acumulados / Este Mês R$ 0,00
    await expect(page.getByText('Este Mês')).toBeVisible();

    // expect: Mensagem 'Sem aulas para hoje'
    await expect(page.getByRole('heading', { name: 'Sem aulas para hoje' })).toBeVisible();

    // expect: Navigation links present in DOM (sidebar on desktop, bottom nav on mobile).
    // Desktop sidebar: Início, Agenda, Financeiro, Meu Perfil, Configurações
    // Mobile bottom nav: Início, Agenda, Finanças, Perfil, Config
    // Use page-level search for shared links to cover both layouts.
    const anyNav = page.getByRole('navigation').first();
    await expect(anyNav.getByRole('link', { name: 'Início' })).toBeAttached();
    await expect(anyNav.getByRole('link', { name: 'Agenda' })).toBeAttached();
    // Finance link label differs by viewport (Financeiro on desktop, Finanças on mobile)
    await expect(page.getByRole('link', { name: /Finan/ }).first()).toBeAttached();
    // Profile link label differs by viewport (Meu Perfil on desktop, Perfil on mobile)
    await expect(page.getByRole('link', { name: /Perfil/ }).first()).toBeAttached();
    // Settings link label differs by viewport (Configurações on desktop, Config on mobile)
    await expect(page.getByRole('link', { name: /Config/ }).first()).toBeAttached();
  });
});
