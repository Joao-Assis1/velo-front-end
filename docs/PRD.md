# 📄 Product Requirements Document (PRD) - VELO (MVP v1.0)

## 1. Visão Geral do Produto

O **VELO** é uma plataforma digital projetada para atuar como o novo **Ente Certificador Pedagógico** no processo de formação de condutores no Brasil. Criado em resposta à Resolução CONTRAN 1.020/2025 e ao PL 6.485/2019, que extinguiram a obrigatoriedade das autoescolas, o VELO conecta alunos e instrutores independentes.

**O Problema:** Com a desregulamentação, o Estado perdeu a camada física de fiscalização (CFCs) e o mercado foi inundado por apps de classificados (como EasyCNH e CNH Prime) e até um app do Governo (App CNH do Brasil) focados apenas em _matchmaking_. Isso gera risco de fraudes, insegurança jurídica para o instrutor e falta de métricas pedagógicas para o aluno.
**A Solução (Nosso Diferencial):** O VELO utiliza "vigilância algorítmica". Nós garantimos compliance legal com E-KYC, biometria e telemetria avançada, oferecemos seguro sob demanda para proteção civil do instrutor, e entregamos um dashboard baseado em dados (eliminando a subjetividade) para provar quando o aluno está pronto para o exame.

---

## 2. Escopo do MVP (Funcionalidades Essenciais)

A Versão 1 deve conter **estritamente** o necessário para viabilizar as aulas práticas com segurança legal e financeira.

### 2.1. Motor de Compliance e Antifraude (Core)

- **E-KYC e Liveness Detection:** Verificação de identidade com OCR de documentos cruzados via API (Serpro/Senatran). Integração com gov.br (níveis Prata/Ouro) para alunos e instrutores. Validação facial (prova de vida) no início e no fim de cada aula.
- **Protocolo de Telemetria:** Monitoramento via GPS e acelerômetro do smartphone para registrar a rota, velocidade média, acelerações e frenagens bruscas.
- **Provas de Presença:** Acionamento aleatório durante a rota (em momentos de parada segura) exigindo um toque ou rápida leitura biométrica conjunta para garantir a continuidade da presença no veículo.
- **Assinatura Digital Imutável:** Geração de um "bloco" de informações (hash da rota, identidades, carimbo de tempo) assinado digitalmente no check-out, garantindo imutabilidade para os órgãos de trânsito.

### 2.2. Matriz de Competências Pedagógicas

- **Checklist Digital:** Ao final da aula, o instrutor preenche rapidamente um formulário baseado nos dados da telemetria.
- **Gráfico de Evolução:** Avaliação de 4 pilares: _Domínio do Veículo, Sinalização e Regras, Manobras de Precisão e Percepção de Risco_. O sistema indica o % de prontidão do aluno para agendar a prova do DETRAN.

### 2.3. Seguro Sob Demanda e Pagamentos (Split)

- **API de Micro-seguro:** Ativação automática de seguro de responsabilidade civil e patrimonial (veículo e terceiros) restrito aos minutos exatos em que a aula validada ocorre.
- **Marketplace Transparente:** Agendamento em tempo real e pagamento de aulas fracionadas. Split automático no check-out: o app retém a taxa da plataforma e envia o saldo líquido para a carteira do instrutor.

---

## 3. Jornadas dos Usuários (User Journeys)

### Jornada do Aluno

1.  **Onboarding:** Cria conta, realiza E-KYC via gov.br e anexa a _Licença de Aprendizagem_ ativa (documento digital oficial exigido para aulas práticas).
2.  **Busca e Agendamento:** Filtra instrutores por localização, preço e avaliações. Seleciona horários disponíveis e realiza o pagamento via PIX/Cartão.
3.  **Realização da Aula:** No veículo, abre o app em "Modo Aula". A tela de espera exige a biometria cruzada com o instrutor para iniciar a gravação da telemetria e o seguro.
4.  **Pós-Aula:** Visualiza o Gráfico de Evolução, vê os _insights_ de onde errou (ex: frenagens bruscas registradas pelo acelerômetro) e avalia o instrutor.

### Jornada do Instrutor

1.  **Onboarding Rigoroso:** Cadastro exigindo 25+ anos de idade, mínimo de 3 anos de habilitação e credencial ativa do DETRAN (validação OCR/API).
2.  **Gestão de Negócio:** Configura sua disponibilidade no calendário, define o valor da hora/aula e vincula o veículo.
3.  **Realização da Aula:** Inicia o processo lendo o _QR Code_ ou ativando o _match_ de proximidade com o aluno. Realiza sua biometria.
4.  **Em Rota:** O app fica bloqueado em uma tela minimalista de telemetria. O instrutor foca apenas na aula e no acionamento de "paradas seguras" quando o app solicitar a prova de presença aleatória.
5.  **Check-out e Pagamento:** Finaliza a aula, faz biometria de saída, assina digitalmente, preenche o _checklist_ pedagógico do aluno e recebe a liberação financeira.

---

## 4. Mapeamento de Telas (Sitemap)

**Telas Públicas / Comuns:**

- `Landing Page:` Proposta de valor e conversão.
- `/auth/login` e `/auth/register`: Autenticação e integração Gov.br.

**Painel do Aluno (`/app/student`):**

- `/dashboard`: Resumo do "Gráfico de Prontidão", status da _Licença de Aprendizagem_ e card da próxima aula.
- `/marketplace`: Mapa/Lista de instrutores disponíveis na região.
- `/instructor/{id}`: Perfil do instrutor, avaliações, calendário interativo e checkout.
- `/lesson/{id}/live`: O "Modo Aula" do aluno (Liveness verification e status "Em andamento").

**Painel do Instrutor (`/app/instructor`):**

- `/dashboard`: Resumo financeiro (ganhos a liberar/liberados), aulas do dia.
- `/schedule`: Gestão de horários disponíveis.
- `/lesson/{id}/live`: O "Modo Aula" Master. Controla o botão "Iniciar" e "Finalizar", gerencia a biometria principal e a telemetria GPS/Acelerômetro.
- `/lesson/{id}/evaluation`: Tela de check-out para preenchimento da _Matriz de Competências_.

---

## 5. Stack Tecnológica e Arquitetura

Para garantir uma aplicação responsiva, altamente performática e segura:

- **Front-end Web/PWA:** Next.js (App Router), React, TypeScript.
  - _Estado:_ Zustand (para lidar com o estado complexo da telemetria e permissões no frontend).
- **Back-end (API):** NestJS estruturado em _Domain-Driven Design (DDD)_ para separar perfeitamente os contextos de: `Users`, `Lessons` (Core), `Telemetry`, `Payments`, `Insurance`.
  - _ORM e Banco de Dados:_ Prisma ORM conectado ao Neon (PostgreSQL Serverless) para escalabilidade elástica.
- **Storage & Arquivos:** AWS S3 (ou equivalente no Supabase/Neon) para armazenar hashes biométricos e fotos.
- **Integrações de Terceiros (Mocks para o MVP):**
  - API Gov.br / Serpro (Validação de identidade).
  - Gateway de Pagamento (Stripe ou Pagar.me para split de pagamentos).
  - API de Seguradora (Mock de emissão de apólice temporária).

---

## 6. Design System e Guidelines UI/UX

O VELO precisa transmitir **confiança institucional, transparência e modernidade**.

- **Framework UI:** ShadCN UI combinado com Tailwind CSS. Isso garantirá componentes acessíveis (Radix UI), padronizados e de rápida implementação.
- **Paleta de Cores (Sugestão):**
  - _Primary:_ Azul Institucional (transmite segurança e credibilidade legal).
  - _Secondary:_ Verde Esmeralda (sucesso, aprovação, evolução pedagógica).
  - _Warning/Error:_ Tons de amarelo e vermelho para alertas de fraude ou falhas de liveness.
  - _Background:_ Minimalista, tons de cinza claro (`slate-50`) com cards brancos para destacar os gráficos de dados.
- **Tipografia:** Inter ou Roboto (fontes limpas, altamente legíveis em dispositivos móveis sob a luz do sol, considerando o uso dentro de veículos).
- **UX do "Modo Aula":** A tela durante a condução deve possuir contraste ultra-alto, botões gigantes (hitboxes grandes) e _Dark Mode_ forçado, para evitar ofuscar a visão do instrutor e garantir rápida interação em "paradas seguras". O instrutor é proibido de usar aparelhos não relacionados à atividade durante a instrução.

---

## 7. Regras de Negócio Críticas para o Código

O Gemini deve estruturar a base do código garantindo as validações de **Compliance State**:

1.  **Blocker de Inicialização:** O endpoint `POST /lesson/{id}/start` deve obrigatoriamente falhar se: a _Licença de Aprendizagem_ do aluno estiver vencida, a biometria não bater, ou a localização (GPS) do instrutor e aluno tiverem uma diferença maior que 50 metros no momento do pareamento.
2.  **Seguro Síncrono:** A aula só muda o status para `IN_PROGRESS` na tabela `Lesson` após o _webhook/callback_ da API de seguro retornar que a apólice está `ACTIVE`.
3.  **Avaliação Imutável:** O endpoint `POST /lesson/{id}/complete` tranca a rota. A partir desse ponto, as notas pedagógicas inseridas não podem ser alteradas sem gerar um novo hash de auditoria.

---

**Dica de uso:** Entregue este PRD ao Gemini junto com o prompt anterior detalhado (que enviei na mensagem acima). Ao ler este documento, a IA compreenderá perfeitamente as dores que o produto resolve, o peso da regulamentação, e gerará um código maduro focado nas verdadeiras necessidades de negócio.
