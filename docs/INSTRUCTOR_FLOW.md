# Fluxo Completo do Instrutor — App Velo

Este documento detalha o fluxo completo do instrutor no app Velo, o passo a passo de todas as funcionalidades, conexões com o aluno e os modelos de dados necessários para o funcionamento desse fluxo.

---

## 1. Visão Geral do Fluxo do Instrutor

O instrutor usa o app para gerenciar seu perfil, disponibilidade, agenda de aulas, controle de sessão e feedback dos alunos.

O fluxo é controlado por `src/app/page.tsx` e pelo `AppContext` em `src/context/AppContext.tsx`.

Perfis envolvidos:

- `instructor` (Instrutor)
- `student` (Aluno)

---

## 2. Modelos de Dados do Instrutor

Os tipos principais usados no fluxo do instrutor estão em `src/types/index.ts`.

### 2.1. Instructor

Dados do instrutor:

- `id: string`
- `email: string`
- `name: string`
- `profilePicture?: string`
- `vehicleImage?: string`
- `vehicleModel?: string`
- `vehiclePlate?: string`
- `vehicleYear?: string`
- `rating: number`
- `reviewsCount: number`
- `pricePerClass?: number`
- `location?: string`
- `bio?: string`
- `transmission?: 'Manual' | 'Automatic'`
- `instructorType?: 'Credenciado' | 'Autônomo'`
- `vehicleId?: string`
- `availability?: Availability[]`
- `busySlots?: BusySlot[]`

### 2.2. Availability

Define a disponibilidade semanal:

- `id?: string`
- `dayOfWeek: number` (0-6)
- `startTime: string`
- `endTime: string`
- `isEnabled: boolean`

### 2.3. BusySlot

Bloqueios de horário do instrutor:

- `id: string`
- `date: Date`
- `startTime: string`
- `endTime: string`
- `reason?: string`

### 2.4. ScheduledClass

Dados das aulas sob responsabilidade do instrutor:

- `id`, `studentId`, `instructorId`
- `studentName?`, `studentImage?`
- `instructorName?`
- `date: Date`
- `startTime`, `endTime`
- `status`: `upcoming` | `in-progress` | `completed` | `cancelled`
- `price?`
- `studentFeedbackRating?`, `studentFeedbackText?`
- `instructorFeedback?`
- `checkInTime?`, `checkOutTime?`, `durationMinutes?`

---

## 3. Fluxo de Autenticação e Onboarding do Instrutor

Telas envolvidas:

- `splash`
- `onboarding`
- `auth` (`Login`)
- `register` (`Register`)

### 3.1. Passo a passo

1. `splash` inicializa a experiência.
2. `onboarding` permite escolher o papel `instructor`.
3. `auth` exibe a tela de login para instrutores.
4. `register` cadastra o instrutor com dados básicos.
5. após registro/login, o contexto define `userRole = 'instructor'` e navega para `instructor-dashboard`.

### 3.2. Regras de inicialização

- instrutor registra com dados mínimos.
- o app cria fallback para `availability` e `busySlots` vazios até o instrutor completar o perfil.
- as informações do perfil são salvas em `localStorage` para reconstrução de sessão.

---

## 4. Dashboard do Instrutor (`instructor-dashboard`)

Tela: `src/components/screens/instructor/Dashboard.tsx`

### 4.1. Funcionalidades

- resumo de ganhos totais
- número de alunos ativos
- visão rápida das aulas do dia
- acesso à agenda completa
- envio de feedback para alunos em aulas concluídas

### 4.2. Uso

1. instrutor abre a tela inicial.
2. vê estatísticas de receita e alunos ativos.
3. acompanha a agenda de hoje com horários e status.
4. clica em "Ver tudo" para ir à agenda completa ou envia feedback para alunos.

---

## 5. Agenda do Instrutor (`instructor-schedule`)

Tela: `src/components/screens/instructor/Schedule.tsx`

### 5.1. Funcionalidades

- lista de aulas futuras (`upcoming`, `in-progress`)
- histórico de aulas passadas (`completed`, `cancelled`)
- agrupamento de aulas por data
- controle de check-in
- controle de check-out

### 5.2. Passo a passo

1. instrutor acessa `instructor-schedule`.
2. o app agrupa aulas próximas por data.
3. instrutor encontra a aula do dia e confirma presença com `checkIn`.
4. a aula muda de `upcoming` para `in-progress`.
5. após encerrar a aula, instrutor usa `checkOut`.
6. o status se torna `completed` e `durationMinutes` é calculado no contexto.
7. instrutor pode enviar `instructorFeedback` sobre o aluno.

### 5.3. Controle de status

- `checkIn`: quando a aula começa, muda o status para `in-progress`.
- `checkOut`: encerra a aula e calcula duração.
- `completed`: aula finalizada com feedback possível.
- `cancelled`: aula removida se houver cancelamento.

---

## 6. Perfil e Configurações do Instrutor

Telas:

- `instructor-profile`
- `instructor-edit-profile`
- `instructor-vehicle`
- `instructor-availability`
- `instructor-finance`
- `instructor-settings`

### 6.1. Funcionalidades

- editar perfil e biografia
- gerenciar dados do veículo e imagens
- definir disponibilidade semanal
- acompanhar finanças e histórico de aulas
- ajustar configurações de conta

### 6.2. Disponibilidade

Tela: `src/components/screens/instructor/Availability.tsx`

- instrutor define se atende em cada dia
- configura horário de início e fim
- salva a disponibilidade com uma ação `updateInstructorAvailabilityAction`

### 6.3. Veículo

Tela: `src/components/screens/instructor/Vehicle.tsx`

- instrutor registra informações do carro
- veículo usado no agendamento aparece no perfil do aluno

---

## 7. Conexões Instrutor ↔ Aluno

### 7.1. Agendamento e disponibilidade

- o aluno seleciona instrutor baseado em disponibilidade e filtros.
- o instrutor deve manter sua disponibilidade atualizada para que o fluxo funcione.
- `busySlots` do instrutor previnem reservas em horários bloqueados.

### 7.2. Aulas como ponto central

A `ScheduledClass` representa a sessão do instrutor com o aluno.

- o instrutor vê o nome e imagem do aluno
- o status de aula informa se ela está agendada, em andamento ou concluída
- o instrutor acrescenta feedback após a aula

### 7.3. Feedback bilateral

- o instrutor envia `instructorFeedback` ao aluno em aulas concluídas
- o aluno envia `studentFeedbackRating` e `studentFeedbackText`
- o feedback é refletido tanto no histórico do aluno quanto no dashboard do instrutor

---

## 8. Observações Técnicas

### 8.1. AppContext

O `AppContext` expõe ações necessárias para o fluxo do instrutor:

- `checkIn`
- `checkOut`
- `giveFeedback`
- `bookClass` (mesmo que feito pelo aluno, cria a aula do instrutor)
- `setInstructorProfile`
- `setBusySlots`

### 8.2. LocalStorage

Dados salvos:

- `velo-screen`
- `velo-userRole`
- `velo-instructorProfile`
- `velo-studentProfile`
- `velo-hasLadv`

### 8.3. APIs usadas

- `auth.ts` para login e registro
- `lessons.ts` para check-in/out, criação de aula e feedback
- `instructors.ts` para buscar instrutores

---

## 9. Possíveis melhorias para o fluxo do instrutor

- permitir múltiplos veículos por instrutor
- validação de horários com regras de disponibilidade avançadas
- agendamento de bloqueios recorrentes e feriados
- incluir painel de desempenho por aluno e por tipo de aula
- oferecer notificações de início de aula e alertas de tempo real
