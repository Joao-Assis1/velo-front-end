// spec: specs/velo-test-plan.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Dashboard do Aluno', () => {
  test('deve exibir jornada com 5 etapas e aviso de cadastro incompleto', async ({ page }) => {
    // 1. Logar como aluno e navegar para /app/student/dashboard
    await loginAs(page, 'aluno@velo.com', '123456', 'student');
    await page.goto('/app/student/dashboard');

    // expect: Exibe 'Bem-vindo de volta'
    await expect(page.getByText('Bem-vindo de volta,')).toBeVisible();

    // expect: Exibe nome do aluno
    await expect(page.getByRole('heading', { name: 'Aluno Teste E2E' })).toBeVisible();

    // expect: Card 'Cadastro Incompleto' exibido para novo aluno
    await expect(page.getByRole('heading', { name: 'Cadastro Incompleto' })).toBeVisible();

    // expect: Progresso 0% Concluído
    await expect(page.getByText('% Concluído')).toBeVisible();

    // expect: Barra de jornada com 5 etapas visível
    // Use exact:true on paragraphs within the journey stepper to avoid strict mode violations
    // with sidebar links that may share similar text (e.g. "Exame médico" link in sidebar vs
    // "Exame Médico" paragraph in journey stepper)
    await expect(page.getByText('Cadastro/RENACH', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Exame Médico', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Psicotécnico', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Curso Teórico', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('LADV & Aulas', { exact: true }).first()).toBeVisible();

    // expect: Navigation links present in DOM (sidebar on desktop, bottom nav on mobile)
    // Use page-level search without scoping to a specific nav landmark so the
    // assertion works regardless of which nav is rendered (sidebar vs bottom bar).
    await expect(page.getByRole('link', { name: 'Início' }).first()).toBeAttached();
    await expect(page.getByRole('link', { name: 'Agenda' }).first()).toBeAttached();
    await expect(page.getByRole('link', { name: 'Instrutores' }).first()).toBeAttached();
    await expect(page.getByRole('link', { name: 'Pagamentos' }).first()).toBeAttached();
    await expect(page.getByRole('link', { name: /Perfil/ }).first()).toBeAttached();
  });
});
