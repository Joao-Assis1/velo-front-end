# Velo App — Plano de Testes E2E

## Application Overview

Velo é um sistema de gestão de autoescola com dois perfis: aluno e instrutor. Frontend Next.js 16 (App Router) + React 19 + Tailwind CSS v4. Backend REST em localhost:3001. Autenticação via cookie velo-token (Better Auth). Pagamentos via Stripe sandbox. Rotas públicas: /auth/login, /auth/register/student, /auth/register/instructor. Rotas protegidas: /app/student/* e /app/instructor/*.

## Test Scenarios

### 1. 1. Cadastro do Instrutor

**Seed:** `e2e/seed.spec.ts`

#### 1.1. deve completar o cadastro de 4 passos com dados válidos

**File:** `e2e/instructor/register-happy-path.spec.ts`

**Steps:**
  1. Navegar para /auth/register/instructor
    - expect: Página exibe título 'Cadastro de Instrutor'
    - expect: Indicador de passo mostra '1 Acesso' ativo
  2. Preencher nome, e-mail, senha e confirmar senha no passo 1 e clicar em Próximo
    - expect: Indicador avança para passo 2 Perfil
  3. Preencher CPF, telefone, data de nascimento (≥21 anos), escolaridade, cidade e valor por aula no passo 2 e clicar em Próximo
    - expect: Indicador avança para passo 3 Habilitação
  4. Marcar as 3 declarações obrigatórias, preencher CNH, categoria, validade, RENACH, selecionar EAR e tipo de instrutor, preencher certidão negativa e clicar em Próximo
    - expect: Nenhum scroll automático ao marcar checkboxes
    - expect: Indicador avança para passo 4 Veículo
  5. Preencher placa, ano, modelo, selecionar câmbio Manual e aceitar os Termos de Uso e clicar em Criar Conta
    - expect: Redireciona para /app/instructor/dashboard
    - expect: Dashboard exibe 'Olá, [nome]'

#### 1.2. deve bloquear avanço com campos obrigatórios vazios

**File:** `e2e/instructor/register-validation.spec.ts`

**Steps:**
  1. Navegar para /auth/register/instructor e clicar em Próximo sem preencher nada
    - expect: Mensagem de erro exibida
    - expect: Permanece no passo 1
  2. Preencher apenas nome sem sobrenome e clicar em Próximo
    - expect: Erro: 'Informe nome e sobrenome'
  3. Preencher e-mail sem @ e clicar em Próximo
    - expect: Erro: 'E-mail inválido'
  4. Preencher senha com menos de 6 caracteres e clicar em Próximo
    - expect: Erro: 'Senha deve ter mínimo 6 caracteres'
  5. Preencher senhas diferentes e clicar em Próximo
    - expect: Erro: 'As senhas não coincidem'

#### 1.3. deve bloquear avançar no passo 2 com idade menor que 21 anos

**File:** `e2e/instructor/register-age-validation.spec.ts`

**Steps:**
  1. Completar passo 1 e no passo 2 informar data de nascimento com menos de 21 anos
    - expect: Erro: 'Instrutor deve ter no mínimo 21 anos'

#### 1.4. deve bloquear avanço no passo 3 sem marcar todas as declarações

**File:** `e2e/instructor/register-declarations.spec.ts`

**Steps:**
  1. Completar passos 1 e 2 e tentar avançar do passo 3 sem marcar as declarações
    - expect: Erro de validação exibido
  2. Marcar as 3 declarações e verificar comportamento dos checkboxes
    - expect: Nenhum scroll automático da página ao marcar
    - expect: Checkboxes visuais atualizam estado corretamente

### 2. 2. Autenticação

**Seed:** `e2e/seed.spec.ts`

#### 2.1. deve redirecionar usuário não autenticado para /auth/login

**File:** `e2e/auth/redirect-unauthenticated.spec.ts`

**Steps:**
  1. Limpar cookies e navegar para /app/student/dashboard
    - expect: Redireciona para /auth/login
  2. Limpar cookies e navegar para /app/instructor/dashboard
    - expect: Redireciona para /auth/login

#### 2.2. deve fazer login com credenciais válidas de instrutor

**File:** `e2e/auth/login-instructor.spec.ts`

**Steps:**
  1. Navegar para /auth/login, preencher e-mail e senha de instrutor válido e submeter
    - expect: Cookie velo-token criado
    - expect: Redireciona para /app/instructor/dashboard

#### 2.3. deve exibir erro com credenciais inválidas

**File:** `e2e/auth/login-invalid.spec.ts`

**Steps:**
  1. Navegar para /auth/login, preencher e-mail e senha incorretos e submeter
    - expect: Mensagem de erro exibida
    - expect: Permanece em /auth/login

#### 2.4. deve redirecionar usuário autenticado que tenta acessar /auth/login

**File:** `e2e/auth/redirect-authenticated.spec.ts`

**Steps:**
  1. Com cookie velo-token válido navegar para /auth/login
    - expect: Redireciona para dashboard do perfil correspondente

### 3. 3. Dashboard do Instrutor

**Seed:** `e2e/seed.spec.ts`

#### 3.1. deve exibir dashboard com saldos e agenda vazia para novo instrutor

**File:** `e2e/instructor/dashboard.spec.ts`

**Steps:**
  1. Logar como instrutor e navegar para /app/instructor/dashboard
    - expect: Exibe nome do instrutor no heading
    - expect: Disponível R$ 0,00
    - expect: A Liberar R$ 0,00
    - expect: Ganhos acumulados R$ 0,00
    - expect: Mensagem 'Sem aulas para hoje'

#### 3.2. deve navegar entre as 5 abas do bottom nav

**File:** `e2e/instructor/navigation.spec.ts`

**Steps:**
  1. Clicar em Agenda no bottom nav
    - expect: URL muda para /app/instructor/schedule
    - expect: Exibe 'Agenda Completa'
  2. Clicar em Finanças no bottom nav
    - expect: URL muda para /app/instructor/finance
    - expect: Exibe 'Financeiro' com filtro de mês/ano
  3. Clicar em Perfil no bottom nav
    - expect: URL muda para /app/instructor/profile
    - expect: Exibe nome do instrutor e botões de seção
  4. Clicar em Config no bottom nav
    - expect: URL muda para /app/instructor/settings
    - expect: Exibe opção Redefinir Senha

### 4. 4. Finanças do Instrutor

**Seed:** `e2e/seed.spec.ts`

#### 4.1. deve exibir aviso de PIX não cadastrado e link para configurações

**File:** `e2e/instructor/finance-no-pix.spec.ts`

**Steps:**
  1. Navegar para /app/instructor/finance sem PIX cadastrado
    - expect: Exibe 'Chave PIX não cadastrada'
    - expect: Link 'Configurar agora' aponta para /app/instructor/settings

#### 4.2. deve filtrar ganhos por mês e ano

**File:** `e2e/instructor/finance-filter.spec.ts`

**Steps:**
  1. Navegar para /app/instructor/finance e alterar o mês no select
    - expect: Select reflete novo mês selecionado
  2. Alterar o ano no select
    - expect: Select reflete novo ano selecionado

### 5. 5. Dashboard do Aluno

**Seed:** `e2e/seed.spec.ts`

#### 5.1. deve exibir jornada com 5 etapas e aviso de cadastro incompleto

**File:** `e2e/student/dashboard.spec.ts`

**Steps:**
  1. Logar como aluno e navegar para /app/student/dashboard
    - expect: Exibe 'Bem-vindo de volta'
    - expect: Barra de jornada com 5 etapas visível
    - expect: Card 'Cadastro Incompleto' exibido para novo aluno
    - expect: Progresso 0% Concluído

#### 5.2. deve exibir card Velo Academy com progresso

**File:** `e2e/student/dashboard-academy.spec.ts`

**Steps:**
  1. Navegar para /app/student/dashboard e localizar card Velo Academy
    - expect: Card exibe percentual de progresso do curso teórico
    - expect: Link aponta para /app/student/academy

#### 5.3. deve navegar entre as 5 abas do bottom nav do aluno

**File:** `e2e/student/navigation.spec.ts`

**Steps:**
  1. Clicar em Agenda no bottom nav
    - expect: URL muda para /app/student/schedule
  2. Clicar em Instrutores no bottom nav
    - expect: URL muda para /app/student/instructors
  3. Clicar em Pagamentos no bottom nav
    - expect: URL muda para /app/student/payments
  4. Clicar em Perfil no bottom nav
    - expect: URL muda para /app/student/profile

### 6. 6. Cadastro do Aluno

**Seed:** `e2e/seed.spec.ts`

#### 6.1. deve registrar novo aluno com dados válidos

**File:** `e2e/student/register-happy-path.spec.ts`

**Steps:**
  1. Limpar cookies e navegar para /auth/register/student
    - expect: Formulário de cadastro de aluno exibido
  2. Preencher nome, CPF, e-mail, telefone, data de nascimento, senha e confirmar e submeter
    - expect: Cookie velo-token criado
    - expect: Redireciona para /app/student/dashboard

#### 6.2. deve validar CPF inválido no cadastro do aluno

**File:** `e2e/student/register-cpf-validation.spec.ts`

**Steps:**
  1. Preencher CPF com menos de 11 dígitos e tentar submeter
    - expect: Mensagem de erro sobre CPF inválido

### 7. 7. Edge Cases

**Seed:** `e2e/seed.spec.ts`

#### 7.1. deve redirecionar para login ao acessar rota protegida sem token

**File:** `e2e/edge/no-token-redirect.spec.ts`

**Steps:**
  1. Remover cookie velo-token e navegar para /app/instructor/finance
    - expect: Redireciona para /auth/login

#### 7.2. deve exibir formulários responsivos em viewport mobile 375x667

**File:** `e2e/edge/mobile-viewport.spec.ts`

**Steps:**
  1. Definir viewport 375x667 e navegar para /auth/register/instructor
    - expect: Formulário renderiza sem overflow horizontal
    - expect: Botões com área mínima de toque visível
