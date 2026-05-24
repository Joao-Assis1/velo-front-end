# Velo Front

Interface web do sistema de gestão de autoescola Velo — conecta alunos e instrutores para agendamento de aulas, pagamentos e acompanhamento de progresso.

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # configure as variáveis abaixo
npm run dev
```

Acesse `http://localhost:3000`.

## Features

**Aluno**
- Busca e filtro de instrutores por preço, localização e tipo de CNH
- Agendamento de aulas com calendário de disponibilidade em tempo real
- Pagamento via cartão de crédito (Stripe sandbox)
- Histórico de aulas, pagamentos e notas de feedback
- Central de disputas (até 48h após conclusão da aula)
- Simulados teóricos — Velo Academy
- Acompanhamento de etapas do processo de habilitação (DETRAN)

**Instrutor**
- Dashboard com KPIs de receita e aulas do dia
- Gestão de disponibilidade semanal
- Aceite/recusa de agendamentos
- Ficha do veículo (modelo, placa, transmissão)
- Extrato financeiro com histórico de recebimentos (transferência automática via Stripe)
- Onboarding Stripe Connect para recebimento de pagamentos

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 + shadcn + Base UI |
| Estado | React Context + TanStack Query v5 |
| Formulários | React Hook Form + Zod v4 |
| Pagamentos | Stripe |
| Auth | Better Auth (cookie `velo-token`) |
| Testes | Vitest + Testing Library + Playwright (E2E) |
| Linguagem | TypeScript 5.8 |

## Configuração

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API (`velo-back`), ex: `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe (sandbox) |
| `BETTER_AUTH_SECRET` | Secret para assinatura de sessões Better Auth |
| `BETTER_AUTH_URL` | URL base do frontend, ex: `http://localhost:3000` |

## Scripts

```bash
npm run dev                              # desenvolvimento (hot reload)
npm run dev -- --hostname 0.0.0.0       # expor na rede local (teste mobile)
npm run build                            # build de produção (inclui lint + tsc)
npm run start                            # servidor de produção
npm run clean                            # limpa cache .next/
npm run test                             # testes unitários (Vitest)
npm run test:watch                       # testes em modo watch
npm run test:coverage                    # cobertura de testes
npm run test:e2e                         # testes E2E (Playwright)
npm run test:e2e:ui                      # Playwright com interface visual
```

## Estrutura

```
src/
├── app/                  # Rotas (Next.js App Router)
│   ├── auth/             # login, register, onboarding, forgot-password
│   └── app/
│       ├── student/      # dashboard, schedule, payments, profile...
│       └── instructor/   # dashboard, schedule, finance, vehicle...
├── components/
│   ├── screens/          # componentes de página completa
│   ├── features/         # módulos isolados (QuizModule, InstructorCard...)
│   ├── journey/          # componentes do fluxo de habilitação
│   ├── layout/           # shell (MainLayout, BottomNav, Sidebar)
│   ├── ui/               # componentes shadcn
│   └── ui-custom/        # componentes próprios (SwipeButton, EmptyState...)
├── context/              # AppContext — estado global
├── lib/
│   ├── actions/          # chamadas ao backend (Server Actions)
│   ├── api-client.ts     # fetchWrapper com injeção de token
│   ├── utils/            # cn(), masks, dates
│   └── validations/      # schemas Zod
└── types/                # tipos TypeScript globais
```

## Relacionado

- [velo-back](https://github.com/Joao-Assis1/velo-api-back) — API REST NestJS que alimenta este frontend
