# Smoke test manual — Journey 1ª CNH

Pré-condições:
- Backend rodando em http://127.0.0.1:3001 com seed completa
- Frontend rodando em http://localhost:3000
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` válida (ambiente Stripe test mode)
- Conta de teste Stripe com cartão 4242 4242 4242 4242

## Cenário 1 — Aluno recém-cadastrado avança até THEORY_COURSE
1. Login com `student-registered@email.com` / `123456`
2. Acessar `/app/student/dashboard` → ver NextStepCard "Inicie o curso teórico"
3. Clicar CTA → vai para `/app/student/theory-course`
4. Clicar "Já comecei o curso teórico" → ver mensagem de sucesso
5. Voltar ao dashboard → ver NextStepCard "Abra seu processo no DETRAN"

## Cenário 2 — RENACH
1. Login com `student-renach@email.com`
2. `/app/student/renach` → ver guide DETRAN-MS
3. Preencher número RENACH `MS-123456789`, data atual, UF `MS`
4. Submit → ver "RENACH MS-123456789 concluído"

## Cenário 3 — Exame médico
1. Login com `student-medical@email.com`
2. `/app/student/exams/medical` → ver clínicas em Campo Grande/MS
3. Selecionar uma → preencher data futura → confirmar agendamento
4. Upload de PDF dummy → ver laudoStatus PENDING e botão "Baixar protocolo"

## Cenário 4 — LADV
1. Login com `student-ladv@email.com`
2. `/app/student/ladv` → ver status `PASS`
3. Confirmar que `canScheduleLessons=true` em `/app/student/schedule`

## Cenário 5 — Schedule gate
1. Login com `student-renach@email.com`
2. `/app/student/schedule` → ver banner amarelo "LADV pendente" (ou bloqueio correspondente)
3. Botão de agendamento via instructors desabilitado

## Cenário 6 — Pagamentos
1. Qualquer aluno → `/app/student/payments`
2. Clicar "Adicionar novo cartão" → Stripe PaymentElement aparece
3. Preencher `4242 4242 4242 4242` + data futura + CVC `123`
4. Confirmar → ver cartão na lista
5. Definir como padrão → ver "padrão" no rótulo

## Cenário 7 — Ready for exam
1. Login com `student-ready@email.com`
2. `/app/student/progress` → JourneyStepper com último step "completed"
3. NextStepCard mostra "Pronto para o exame DETRAN"

Para cada cenário registrar: data, navegador (Chrome/Firefox/Safari mobile), resultado (OK/FALHOU), screenshot quando relevante.
