# BUGS.md — Registro de Bugs (Teste Manual)

> Criado em 2026-05-17 | Branch: develop

---

<!-- Template para novos bugs:

## BUG-XXX — [título curto]

- **Severidade:** crítico | alto | médio | baixo
- **Fase:** aluno / instrutor / pagamento / edge
- **Repro:**
  1. ...
- **Esperado:** ...
- **Observado:** ...
- **Console/Network:** [erro relevante]
- **Status:** 🔴 aberto | 🟡 em fix | ✅ corrigido | 🧪 a regredir

---
-->

## BUG-001 — CPF inválido aceito no registro de aluno

- **Severidade:** alto
- **Fase:** aluno
- **Repro:**
  1. `/auth/register/student` → Step 2
  2. Digitar CPF inválido com dígitos repetidos (ex: `111.111.111-11`)
  3. Clicar "Próximo"
- **Esperado:** erro "CPF inválido."
- **Observado:** validação passou (só checava comprimento, não o algoritmo)
- **Console/Network:** —
- **Status:** ✅ corrigido — adicionada função `isValidCPF` com algoritmo de dígitos verificadores

---

## BUG-002 — /app/student/concierge fica em loading infinito quando /journey/me retorna 401

- **Severidade:** crítico
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/concierge` com token inválido ou expirado
- **Esperado:** estado de erro amigável ("Não foi possível carregar sua jornada. Tente novamente.")
- **Observado:** "Carregando jornada…" permanece indefinidamente — 6 erros no console, sem fallback
- **Console/Network:** `GET /api/v1/journey/me → 401 Unauthorized`
- **Status:** ✅ corrigido — page já exibe fallback de erro; adicionado `retry: false` para 401 em `useJourney` / `useJourneyTimeline` para que o erro apareça imediatamente sem aguardar 3 retentas

---

## BUG-003 — Payments exibe mensagem HTTP "Unauthorized" diretamente na UI

- **Severidade:** alto
- **Fase:** aluno / pagamento
- **Repro:**
  1. Acessar `/app/student/payments` com token inválido
- **Esperado:** estado vazio "Nenhum cartão salvo" ou toast "Sessão expirada, faça login novamente"
- **Observado:** `<alert>Unauthorized</alert>` exposto diretamente na página
- **Console/Network:** `GET /api/v1/payments → 401 Unauthorized`
- **Status:** ✅ corrigido — `friendlyError()` em `payments/page.tsx` mapeia 401 → "Sessão expirada. Faça login novamente."; mesmo mapeamento em `AddCardStripe.tsx`

---

## BUG-004 — /app/student/academy renderiza página vazia (apenas header)

- **Severidade:** alto
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/academy`
- **Esperado:** lista de módulos, progresso e quizzes
- **Observado:** apenas heading "Velo Academy" — sem conteúdo algum
- **Console/Network:** `GET /api/v1/academy/simulado → 200 OK` (dados chegam mas não são renderizados)
- **Status:** ✅ corrigido — `getAcademyModulesAction` agora usa `res.data` para desempacotar o envelope `{ success, message, data }` do backend; antes tentava `.map()` diretamente no objeto wrapper, lançando TypeError silencioso

---

## BUG-005 — Rota /app/student/disputes não existe (404)

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. Navegar para `/app/student/disputes`
- **Esperado:** página de disputas do aluno
- **Observado:** 404 — "This page could not be found"
- **Console/Network:** —
- **Status:** ✅ corrigido — criada `src/app/app/student/disputes/page.tsx` com empty state

---

## BUG-006 — Dashboard mostra "Próxima Aula" com dados mockados para aluno sem aulas

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/dashboard` como aluno recém-cadastrado sem aulas
- **Esperado:** card "Próxima Aula" ausente ou com "Nenhuma aula agendada"
- **Observado:** exibe "Direção Defensiva — 12 de Maio — 14:00-15:40 — Unidade Centro" (dado fixo)
- **Console/Network:** —
- **Status:** ✅ corrigido — código atual usa `scheduledClasses` do AppContext (carregado do backend); card só renderiza se `nextLesson != null` (`{nextLesson && ...}`); mock data não existe mais

---

## BUG-007 — Dashboard exibe "Velo Academy 65% concluído" sem buscar do backend

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/dashboard` como aluno novo (sem progresso no curso)
- **Esperado:** progresso real do aluno (0% para novo cadastro)
- **Observado:** card sempre exibe "65% concluído" — valor hardcoded
- **Console/Network:** —
- **Status:** ✅ corrigido — `academyProgress` calculado dinamicamente via `academyModules` do AppContext; corrigido pelo fix do BUG-004 que resolve o carregamento dos módulos

---

## BUG-008 — Instrutor: campos de declaração enviados ao backend causam erro de validação

- **Severidade:** alto
- **Fase:** instrutor
- **Repro:**
  1. Completar cadastro de instrutor (4 passos) e clicar "Criar Conta"
- **Esperado:** cadastro realizado com sucesso
- **Observado:** backend rejeita com `property noGravissima should not exist`, `hasInstructorCourse should not exist`, `noCassacao should not exist`, `hasDoubleCommand should not exist`, `vehicleYear must be a string`
- **Console/Network:** `POST /api/v1/auth/register/instructor → 400 Bad Request`
- **Status:** ✅ corrigido — campos frontend-only removidos do payload; `vehicleYear` enviado como string

---

## BUG-009 — Checkboxes sr-only no passo 3 do cadastro do instrutor causam scroll automático

- **Severidade:** médio
- **Fase:** instrutor
- **Repro:**
  1. Navegar para `/auth/register/instructor` → passo 3
  2. Clicar em qualquer checkbox de declaração
- **Esperado:** checkbox marca sem rolar a página
- **Observado:** página dá scroll automático (browser foca o input `sr-only` e rola até ele)
- **Console/Network:** —
- **Status:** ✅ corrigido — substituídos por `<div role="checkbox">` sem input nativo

---

## BUG-010 — Marketplace exibe location "Belo Horizonte, MG" hardcoded

- **Severidade:** baixo
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/instructors` com aluno sem location definida
- **Esperado:** location do aluno ou campo vazio solicitando configuração
- **Observado:** exibe "Belo Horizonte, MG" fixo independente do perfil
- **Console/Network:** —
- **Status:** ✅ corrigido — "Belo Horizonte, MG" aparece apenas como placeholder de input em `InstructorFilter`; não há location hardcoded exibida como dado real no código atual

---

## BUG-011 — Cadastro de aluno step 3: checkbox de termos causa scroll automático

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. `/auth/register/student` → Step 3
  2. Clicar na área do checkbox "Li e aceito os Termos de Uso..."
- **Esperado:** checkbox marca sem rolar a página
- **Observado:** página dá scroll automático (browser foca o `<input class="sr-only">` dentro do `<label>` e rola até ele)
- **Console/Network:** —
- **Status:** ✅ corrigido — substituído por `<div role="checkbox">` sem input nativo, mesmo padrão do BUG-009

---

## BUG-012 — /app/student/exams/medical e /psychological: TypeError ao renderizar lista de clínicas

- **Severidade:** alto
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/exams/medical` ou `/app/student/exams/psychological`
- **Esperado:** lista de clínicas disponíveis
- **Observado:** RuntimeError "This page couldn't load" — `(catalog.data ?? []).map is not a function`
- **Console/Network:** `TypeError: (catalog.data ?? []).map is not a function` — backend retorna `{ items, page, pageSize, total }` (paginado), mas `listClinics` retornava `res.data` (o objeto paginado, não o array)
- **Status:** ✅ corrigido — `src/lib/api/clinics.ts`: tipo atualizado para `Wrapped<Paginated<Clinic>>` e retorno alterado para `res.data?.items ?? []`

---

## BUG-013 — /app/student/renach: exibe alerta bruto "RENACH process not found"

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/renach` como aluno recém-cadastrado (sem RENACH aberto)
- **Esperado:** estado informativo "Nenhum processo RENACH encontrado. Abra seu processo no DETRAN." ou campo vazio limpo
- **Observado:** `<alert>RENACH process not found</alert>` com texto bruto de erro do backend exposto na UI
- **Console/Network:** —
- **Status:** ✅ corrigido — `renach/page.tsx`: trocado `Promise.all` por `Promise.allSettled`; 404 do `getMyRenach` é silenciado (aluno sem RENACH é estado esperado) e `getRenachGuide` carrega independentemente

---

## BUG-014 — /app/student/ladv: RuntimeError idêntico ao BUG-013 (Promise.all + instructions)

- **Severidade:** alto
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/ladv` como aluno recém-cadastrado (sem LADV ainda)
- **Esperado:** instruções de como obter a LADV + formulário de upload
- **Observado:** RuntimeError — `Cannot read properties of undefined (reading 'map')` — `getLadvGuide` retornava `guide.instructions` mas backend retorna `steps`; `Promise.all` rejeitava completamente quando `getMyLadv` retornava 404
- **Console/Network:** `TypeError: Cannot read properties of undefined (reading 'map')`
- **Status:** ✅ corrigido — `LadvGuide.instructions` renomeado para `steps` em `stages.ts` e `ladv/page.tsx`; `Promise.all` substituído por `Promise.allSettled`

---

## BUG-015 — /app/student/concierge: RuntimeError em JourneyStepper (status 'locked' não mapeado)

- **Severidade:** crítico
- **Fase:** aluno
- **Repro:**
  1. Acessar `/app/student/concierge` com Journey inicializada
- **Esperado:** timeline da jornada com etapas e status
- **Observado:** RuntimeError — `Element type is invalid` — backend retorna `status: 'locked'` mas frontend mapeava apenas `completed | in_progress | blocked | upcoming`; `icons['locked']` era `undefined`
- **Console/Network:** `Error: Element type is invalid: expected a string or class/function but got: undefined. Check the render method of JourneyStepper.`
- **Status:** ✅ corrigido — `getTimeline()` em `journey.ts` mapeia `'locked' → 'upcoming'` antes de retornar os steps

---

## BUG-016 — processPaymentAction chamava endpoint inexistente `/payments/process`

- **Severidade:** crítico
- **Fase:** aluno / pagamento
- **Repro:**
  1. Agendar aula com instrutor (Cenário 10)
  2. Confirmar agendamento no modal
- **Esperado:** pagamento processado e aula confirmada
- **Observado:** `Error: Cannot POST /api/v1/payments/process` — backend migrou para Stripe (`/payments-stripe/charge`) mas frontend permaneceu com rota ASAAS antiga
- **Console/Network:** `Failed to book class: Error: Cannot POST /api/v1/payments/process`
- **Status:** ✅ corrigido — `src/lib/actions/payments.ts`: endpoint alterado para `/payments-stripe/charge`; body agora envia apenas `{ lessonId, paymentMethodId }` conforme `ChargeDto` do backend

---

## BUG-017 — `hasLadv` e `hasPaymentMethod` só atualizam em login, nunca em re-fetch

- **Severidade:** médio
- **Fase:** aluno
- **Repro:**
  1. Adicionar cartão ou LADV sem fazer logout/login
  2. Tentar agendar aula — gates de LADV e cartão bloqueiam mesmo com dados válidos no banco
- **Esperado:** `hasLadv` e `hasPaymentMethod` refletem o estado atual do banco sempre que o perfil for recarregado
- **Observado:** AppContext só chama `setHasLadv((res.data as any).ladvUploaded)` dentro de `login()` — navegação interna usa valor em cache do localStorage indefinidamente
- **Console/Network:** —
- **Status:** 🔴 aberto — `setHasLadv` e derivação de `hasPaymentMethod` precisam ser atualizados também no refresh de perfil do AppContext

---

## BUG-018 — `submitBiometryAction` enviava payload errado para o backend

- **Severidade:** crítico
- **Fase:** instrutor / aluno (Cenário 12)
- **Repro:**
  1. Iniciar aula (check-in)
  2. Capturar biometria em qualquer dos 3 estágios (início, meio, fim)
- **Esperado:** `POST /lessons/:id/biometry` com `{ lat, lng, status, step }` conforme `RegisterBiometryDto` do backend
- **Observado:** action enviava `{ stage, imageHash }` — campos não reconhecidos pelo backend; geofencing não recebia coordenadas GPS
- **Status:** ✅ corrigido — `src/lib/actions/lessons.ts`: assinatura atualizada para `(id, stage, coords, status)`; `BiometryOverlay.tsx`: GPS capturado via `getCurrentPosition()` antes de submeter

---

## BUG-019 — TelemetryHUD enviava campos errados no batch de telemetria

- **Severidade:** alto
- **Fase:** instrutor (durante aula)
- **Repro:**
  1. Iniciar aula (check-in) — TelemetryHUD fica ativo
  2. GPS registra pontos durante a aula
- **Esperado:** cada ponto enviado como `{ lat, lng, velocity, timestamp }` conforme `TelemetryPointDto`
- **Observado:** pontos enviados como `{ latitude, longitude, speed, timestamp }` — backend rejeitava ou ignorava coordenadas; geofencing da biometria nunca tinha pontos válidos para comparar
- **Status:** ✅ corrigido — `src/components/features/TelemetryHUD.tsx`: mapeamento `latitude→lat`, `longitude→lng`, `speed→velocity`

---
