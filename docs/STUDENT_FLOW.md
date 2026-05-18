# Fluxo Completo do Aluno — App Velo

Este documento detalha o fluxo completo do aluno no app Velo, o passo a passo de todas as funcionalidades, conexões com o instrutor e os modelos de dados necessários para o funcionamento desse fluxo.

---

## 1. Visão Geral do Fluxo do Aluno

O aluno navega com uma barra de abas e usa o app para encontrar instrutores, agendar aulas, acompanhar suas sessões e gerenciar seu perfil.

O fluxo é controlado por `src/app/page.tsx` e pelo `AppContext` em `src/context/AppContext.tsx`.

Perfis envolvidos:

- `student` (Aluno)
- `instructor` (Instrutor)

---

## 2. Modelos de Dados do Aluno

Os tipos principais usados no fluxo do aluno estão em `src/types/index.ts`.

### 2.1. Student

Dados do aluno:

- `id?: string`
- `name: string`
- `email: string`
- `phone?: string`
- `cpf?: string`
- `profilePicture?: string`
- `ladvUploaded: boolean`

### 2.2. Instructor

Dados do instrutor necessários para a descoberta e agendamento:

- `id`, `name`, `profilePicture?`, `rating`, `reviewsCount`
- `pricePerClass?`, `location?`, `bio?`
- `transmission?`, `instructorType?`
- `vehicleModel?`, `vehicleImage?`, `vehicleId?`
- `availability?`, `busySlots?`

### 2.3. ScheduledClass

A aula agendada representa a conexão entre aluno e instrutor:

- `id`, `studentId`, `instructorId`
- `instructorName?`, `studentName?`, `studentImage?`
- `date: Date`, `startTime`, `endTime`
- `status`: `upcoming` | `in-progress` | `completed` | `cancelled`
- `price?`
- `studentFeedbackRating?`, `studentFeedbackText?`
- `instructorFeedback?`
- `checkInTime?`, `checkOutTime?`, `durationMinutes?`

### 2.4. Availability e BusySlot

Esses dados são usados para gerar horários disponíveis:

- `Availability`: dia da semana, horário de início e fim e se o instrutor atende naquele dia
- `BusySlot`: data, horário de início e fim, e razão opcional para bloqueio

---

## 3. Fluxo de Autenticação e Onboarding do Aluno

Telas envolvidas:

- `splash`
- `onboarding`
- `auth` (`Login`)
- `register` (`Register`)

### 3.1. Passo a passo

1. `splash` inicializa a experiência.
2. `onboarding` permite escolher o papel `student`.
3. `auth` exibe a tela de login para alunos.
4. `register` cadastra o aluno com nome, email, CPF, telefone e senha.
5. Após registro/login, o contexto define `userRole = 'student'` e navega para `student-home`.

### 3.2. Regras de entrada

- o aluno pode ser redirecionado para `student-home` após login ou cadastro
- o app também armazena sessão em `localStorage` para manter o estado entre recarregamentos

---

## 4. Descoberta de Instrutores (`student-home`)

Tela: `src/components/screens/student/Home.tsx`

### 4.1. Funcionalidades

- busca por nome do instrutor ou localização
- filtros por preço, avaliação, transmissão e tipo de instrutor
- exibição dos instrutores disponíveis em cards
- aviso de upload de LADV quando `hasLadv` for falso

### 4.2. Lógica

- o componente usa `getInstructorsAction` para carregar instrutores
- `hasLadv` vem do contexto global
- ao selecionar um instrutor, `selectInstructor` define `selectedInstructorId` e vai para `instructor-profile-view`

---

## 5. Perfil do Instrutor e Agendamento (`instructor-profile-view`)

Tela: `src/components/screens/student/InstructorProfile.tsx`

### 5.1. Passo a passo

1. aluno escolhe o instrutor na listagem.
2. o perfil exibe dados do instrutor, veículo, avaliação, tipo e localização.
3. o aluno escolhe uma data no calendário.
4. o sistema calcula horários disponíveis considerando:
   - `instructor.availability`
   - `instructor.busySlots`
   - `busySlots` globais no contexto
5. o aluno seleciona horário disponível.
6. se `hasLadv` for falso, o app solicita upload da LADV antes de concluir.
7. o aluno confirma o agendamento com `bookClass`.
8. `bookClass` chama `createLessonAction` e adiciona `ScheduledClass` ao contexto.

### 5.2. Regras importantes

- o horário não pode ser reservado se não estiver no intervalo de disponibilidade do instrutor
- o horário também deve estar livre de bloqueios gerais e específicos
- a aula é criada com `status = upcoming`

---

## 6. Gerenciamento de Aulas do Aluno (`student-schedule`)

Tela: `src/components/screens/student/Schedule.tsx`

### 6.1. Funcionalidades

- exibe `Próximas Aulas` com status `upcoming` ou `in-progress`
- exibe `Histórico` com aulas `completed` ou `cancelled`
- permite cancelar aulas futuras (`cancelClass`)
- permite avaliar aulas concluídas (`rateClass`)
- mostra feedback do instrutor quando presente

### 6.2. Passo a passo de uso

1. aluno acessa `student-schedule` via navegação.
2. o app separa as aulas em duas listas ordenadas por data.
3. o aluno pode cancelar uma aula futura.
4. após aula concluída, o aluno pode abrir o modal de avaliação.
5. ao enviar nota e comentário, `rateClass` chama `submitStudentFeedbackAction`.
6. o contexto atualiza a `ScheduledClass` com `studentFeedbackRating` e `studentFeedbackText`.

---

## 7. Progresso do Aluno (`student-progress`)

Tela: `src/components/screens/student/Progress.tsx`

### 7.1. Funcionalidades

- exibe histórico de feedback recebido do instrutor
- mostra evolução das aulas concluídas
- organiza as sessões por status

### 7.2. Objetivo

Permitir que o aluno veja suas avaliações, compare desempenho e entenda seu progresso ao longo do tempo.

---

## 8. Perfil e Configurações do Aluno

Telas:

- `student-profile`
- `student-personal-data`
- `student-payments`
- `student-settings`

### 8.1. Funcionalidades principais

- editar dados pessoais do aluno
- gerenciar informações de pagamento
- ajustar notificações e preferências do app
- fazer logout

### 8.2. Fluxo de edição

1. aluno abre `student-profile`.
2. navega para `student-personal-data` para atualizar informações.
3. salva alterações usando `setStudentProfile` no contexto.
4. retorna para `student-profile`.

---

## 9. Conexão Aluno ↔ Instrutor

### 9.1. Agendamento como ponto de contato

A `ScheduledClass` é o principal vínculo entre aluno e instrutor.

Ela registra:

- dados de ambos os perfis
- data e horário da aula
- status de execução
- feedback entre aluno e instrutor

### 9.2. Feedback bilateral

- instrutor pode enviar `instructorFeedback` após a aula.
- aluno pode enviar `studentFeedbackRating` e `studentFeedbackText`.

### 9.3. Controle de disponibilidade

O aluno só vê horários livres quando:

- o instrutor está habilitado no dia solicitado
- não há bloqueios no horário selecionado
- a data não está no passado

---

## 10. Observações Técnicas

- a navegação do aluno é baseada em estado (`screen`) e não em rotas separadas.
- o estado global é mantido no `AppProvider`.
- as ações de API relevantes estão em `src/lib/actions/auth.ts`, `src/lib/actions/lessons.ts` e `src/lib/actions/instructors.ts`.
- o fluxo de agendamento depende de `instructor.availability` e `busySlots`.

---

## 11. Possíveis melhorias para o fluxo do aluno

- permitir que o aluno visualize a disponibilidade real do instrutor em intervalos de 30 minutos
- adicionar confirmação de pagamento ou pré-autorização ao agendar
- permitir cancelar aulas com motivo e prazo de aviso
- incluir um resumo de progresso visual mais detalhado
