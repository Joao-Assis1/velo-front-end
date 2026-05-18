# Fluxo Completo do App Velo

Este documento descreve o fluxo completo do aplicativo Velo, alinhado ao front-end atual em `velo-front`. Ele cobre os papéis, telas, ações, conexões entre Alunos e Instrutores, e os modelos de dados usados pelo código.

---

## 1. Visão Geral do Produto

O Velo conecta dois perfis de usuário:

- `student` (Aluno)
- `instructor` (Instrutor)

O app permite:

- descoberta de instrutores
- agendamento de aulas práticas
- gestão de agenda
- check-in/check-out por parte do instrutor
- avaliações mútuas entre aluno e instrutor
- perfil e configurações de conta

O fluxo de navegação principal está definido em `src/app/page.tsx` e cuida da troca de telas conforme o estado do `AppContext`.

---

## 2. Modelos de Dados Principais

Os modelos definidos em `src/types/index.ts` representam as entidades usadas pelo app.

### 2.1. Availability

Define a disponibilidade semanal do instrutor:

- `id?: string`
- `dayOfWeek: number` (0-6, dom-sáb)
- `startTime: string` (`08:00`)
- `endTime: string` (`18:00`)
- `isEnabled: boolean`

### 2.2. BusySlot

Registra bloqueios ou horários indisponíveis do instrutor:

- `id: string`
- `date: Date`
- `startTime: string`
- `endTime: string`
- `reason?: string`

### 2.3. Instructor

Dados do instrutor usados na listagem, perfil e agendamento:

- `id`, `email`, `name`
- `profilePicture?`, `vehicleImage?`, `vehicleModel?`, `vehiclePlate?`, `vehicleYear?`
- `rating`, `reviewsCount`
- `pricePerClass?`, `location?`, `bio?`
- `transmission?` (`Manual` | `Automatic`)
- `instructorType?` (`Credenciado` | `Autônomo`)
- `availability?`
- `busySlots?`

### 2.4. Student

Dados do aluno usados na autenticação e perfil:

- `id?`, `name`, `email`
- `phone?`, `cpf?`, `profilePicture?`
- `ladvUploaded: boolean`

### 2.5. ScheduledClass

Entidade central do agendamento de aula:

- `id`, `studentId`, `instructorId`
- `instructorName?`, `studentName?`, `studentImage?`
- `vehicleId?`
- `date: Date`
- `startTime`, `endTime`
- `status`: `upcoming` | `in-progress` | `completed` | `cancelled`
- `price?`
- `studentFeedbackRating?`, `studentFeedbackText?`
- `instructorFeedback?`
- `checkInTime?`, `checkOutTime?`, `durationMinutes?`

---

## 3. Arquitetura de Estado e Regras de Negócio

O `AppContext` em `src/context/AppContext.tsx` oferece:

- estado da tela atual (`screen`)
- papel do usuário (`userRole`)
- perfil de aluno e instrutor
- lista de `scheduledClasses`
- `busySlots` globais
- status de `hasLadv`
- ações de login, registro, logout
- fluxo de agendamento e feedback
- check-in/check-out para instrutores

### 3.1. Persistência e inicialização

O contexto persiste em `localStorage`:

- `velo-screen`
- `velo-userRole`
- `velo-instructorProfile`
- `velo-studentProfile`
- `velo-hasLadv`

Ao carregar, ele restaura esses valores e busca as aulas com `getLessonsAction` para o aluno ou instrutor logado.

### 3.2. Regras de booking e disponibilidade

O fluxo de agendamento considera:

- disponibilidade do instrutor em `instructor.availability`
- bloqueios do instrutor em `instructor.busySlots`
- bloqueios globais em `busySlots` do contexto

O `InstructorProfileView` calcula horários a partir desses dados e só permite reservar times válidos.

### 3.3. Regras de feedback e ciclo de valor

- Aluno avalia o instrutor após aula concluída com `rateClass`
- Instrutor envia feedback ao aluno em aulas concluídas com `giveFeedback`
- O aluno não realiza `checkIn` ou `checkOut`
- O instrutor altera o status da aula para `in-progress` e depois `completed`

---

## 4. Fluxo de Autenticação e Onboarding

Telas relacionadas em `src/app/page.tsx` e componentes de `src/components/screens/auth`:

1. `splash`
2. `onboarding`
3. `auth` (login)
4. `register`

### 4.1. Registro

- Aluno: cria perfil com nome, email, CPF, telefone e senha.
- Instrutor: cria perfil com dados básicos e recebe fallback para `availability` e `busySlots` vazios até completar o onboarding.

### 4.2. Redirecionamento

- Aluno vai para `student-home`
- Instrutor vai para `instructor-dashboard`

---

## 5. Fluxo e Funcionalidades do Aluno

### 5.1. `student-home`

Tela de descoberta de instrutores em `src/components/screens/student/Home.tsx`.

Funcionalidades:

- busca por nome ou localização
- filtros por preço, rating, transmissão e tipo de instrutor
- aviso de upload de LADV quando necessário
- seleção do instrutor para ver o perfil detalhado

### 5.2. `instructor-profile-view`

Tela de perfil do instrutor em `src/components/screens/student/InstructorProfile.tsx`.

Funcionalidades:

- exibe foto, avaliação, tipo de instrutor, veículo e preço
- mostra calendário e horários disponíveis
- usa `busySlots` e `availability` para bloquear horários
- permite upload de LADV antes de reservar
- reserva aula com `bookClass`

### 5.3. `student-schedule`

Tela de gerenciamento de aulas em `src/components/screens/student/Schedule.tsx`.

Funcionalidades:

- separa aulas futuras (`upcoming` / `in-progress`) de aulas passadas (`completed` / `cancelled`)
- permite cancelar aulas futuras
- permite avaliar aulas concluídas
- exibe feedback do instrutor quando disponível

### 5.4. `student-progress`

Tela de progresso do aluno em `src/components/screens/student/Progress.tsx`.

- mostra evolução e feedback do instrutor
- organiza histórico por status de aulas

### 5.5. Perfil do aluno

Telas em `src/components/screens/student`:

- `student-profile`
- `student-personal-data`
- `student-payments`
- `student-settings`

Funcionalidades:

- editar nome, e-mail, telefone e CPF
- gerenciar pagamentos
- ajustar configurações de conta

---

## 6. Fluxo e Funcionalidades do Instrutor

### 6.1. `instructor-dashboard`

Tela inicial do instrutor em `src/components/screens/instructor/Dashboard.tsx`.

Funcionalidades:

- resumo de ganhos e alunos ativos
- visualização rápida da agenda do dia
- acesso para ver agenda completa
- envio de feedback para alunos de aulas concluídas

### 6.2. `instructor-schedule`

Tela de agenda em `src/components/screens/instructor/Schedule.tsx`.

Funcionalidades:

- lista de aulas futuras e passadas
- agrupamento por data
- botões de `checkIn` e `checkOut` para o instrutor
- exibição de status de cada aula
- histórico de aulas concluídas e canceladas

### 6.3. Configuração de perfil e trabalho

Telas em `src/components/screens/instructor`:

- `instructor-profile`
- `instructor-edit-profile`
- `instructor-vehicle`
- `instructor-availability`
- `instructor-finance`
- `instructor-settings`

Funcionalidades:

- editar perfil e biografia
- atualizar dados do veículo e fotos
- configurar disponibilidade semanal
- acompanhar finanças e histórico de aulas
- ajustar configurações de conta

### 6.4. Controle de aula

O instrutor controla a aula com:

- `checkIn` para marcar a aula como `in-progress`
- `checkOut` para marcar como `completed` e calcular `durationMinutes`
- `giveFeedback` para enviar comentários ao aluno

---

## 7. Conexões entre Aluno e Instrutor

### 7.1. Sincronização de disponibilidade

A geração de horários livres combina:

- `instructor.availability`
- `instructor.busySlots`
- `busySlots` gerais do contexto

### 7.2. Agendamento de aula

O `bookClass` cria uma `ScheduledClass` usando `createLessonAction` em `src/context/AppContext.tsx`.

Dados enviados incluem:

- `studentId`
- `instructorId`
- `date`
- `startTime`
- `endTime`
- `price`
- `vehicleId`

### 7.3. Ciclo de feedback

- Aula concluída pelo instrutor
- Instrutor adiciona feedback textual pelo app
- Aluno avalia com nota e comentário
- Ambos os lados acumulam histórico para futuro uso

---

## 8. Observações Técnicas

### 8.1. LocalStorage

O app usa `localStorage` para manter sessão e perfil, inclusive:

- `velo-token`
- `velo-screen`
- `velo-userRole`
- `velo-instructorProfile`
- `velo-studentProfile`
- `velo-hasLadv`

### 8.2. API Actions

As ações de backend são invocadas a partir de `src/lib/actions`:

- `auth.ts` (login/register)
- `lessons.ts` (criar aula, check-in/out, feedback)
- `instructors.ts` (buscar instrutores)

### 8.3. Navegação baseada em estado

A renderização de telas é controlada por `screen` no contexto e não por rotas Next.js tradicionais. Isso deixa a navegação interna fluida e baseada em fluxo.

---

## 9. Sugestões de Evolução

- registrar `busySlots` também para alunos, se quiser controlar indisponibilidade do aluno
- implementar validação de LADV no backend e refletir no fluxo de agendamento
- adicionar suporte a múltiplos veículos por instrutor
- permitir cancelamento com motivo e regras de penalidade
- incluir dashboard de performance para aluno e instrutor
