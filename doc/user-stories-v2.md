# Velo - Épicos e User Stories (Atualizado v2.0)

Este documento detalha os Épicos e User Stories do sistema Velo, integrando as funcionalidades core e os requisitos de conformidade com a Resolução CONTRAN nº 1.020/2025.

---

### ÉPICO 1: Acesso e Segurança

#### US01: Cadastro e Login
**Como** usuário (aluno ou instrutor), **quero** me cadastrar e fazer login **para** acessar a plataforma.
- **Cenário 1: Cadastro Válido**
  - *Dado que* preencho o formulário com dados válidos e aceito os Termos de Uso,
  - *Quando* envio o formulário,
  - *Então* a API (NestJS) salva o usuário no PostgreSQL com senha hash (bcrypt) e retorna 201.
- **Cenário 2: Login Autenticado**
  - *Dado que* insiro credenciais corretas,
  - *Quando* clico em "Entrar",
  - *Então* a API retorna um token JWT e o Frontend armazena o token e redireciona o usuário para seu dashboard específico.
- **Regras de Negócio:** Email único e aceite obrigatório dos Termos de Uso.

#### US02: Recuperação de Senha
**Como** usuário, **quero** recuperar minha senha por e-mail **para** retomar meu acesso.
- **Cenário 1: Solicitação de Reset**
  - *Dado que* informo meu e-mail,
  - *Quando* solicito a recuperação,
  - *Então* a API gera um token JWT temporário (1h) e simula o envio de link de recuperação.

#### US13: Bloqueio Automático de Credenciais (Segurança Jurídica)
**Como** plataforma, **quero** validar a data de vencimento da credencial do instrutor **para** impedir que profissionais irregulares ofereçam aulas.
- **Cenário 1: Credencial Vencida**
  - *Dado que* o sistema executa a verificação diária automática,
  - *Quando* identifica uma credencial expirada,
  - *Então* o status do `Instructor` muda para `inactive` e o perfil é ocultado do marketplace.

---

### ÉPICO 2: Jornada do Instrutor

#### US03: Editar Perfil e Documentos Legais
**Como** instrutor, **quero** editar meu perfil e anexar documentos **para** estar regularizado.
- **Cenário 1: Atualização de Dados**
  - *Dado que* altero bio, preço, região e insiro dados da CNH (com EAR),
  - *Quando* salvo,
  - *Então* o Prisma atualiza o registro e a API retorna os dados confirmados.

#### US04: Cadastrar Disponibilidade
**Como** instrutor, **quero** cadastrar horários de trabalho **para** agendamento.
- **Cenário 1: Criação de Grade**
  - *Dado que* seleciono dias e horários,
  - *Quando* salvo,
  - *Então* o sistema gera registros em `Availability` sem sobreposições.

#### US05: Gerenciar Veículo de Instrução
**Como** instrutor, **quero** cadastrar meu veículo **para** realizar as aulas.
- **Cenário 1: Cadastro de Veículo**
  - *Dado que* informo placa, modelo e ano,
  - *Quando* envio,
  - *Então* o sistema vincula o `Vehicle` ao `Instructor`.

#### US06: Visualizar Agenda Diária
**Como** instrutor, **quero** visualizar as aulas do dia **para** organização.
- **Cenário 1: Lista de Aulas**
  - *Dado que* acesso a Agenda,
  - *Quando* seleciono a data,
  - *Então* vejo as `Lessons` filtradas com os dados dos respectivos alunos.

#### US07: Dashboard de Ganhos
**Como** instrutor, **quero** ver métricas financeiras **para** controle.
- **Cenário 1: Soma de Ganhos**
  - *Dado que* abro o Dashboard,
  - *Quando* os dados carregam,
  - *Então* vejo a soma do campo `price` das aulas completadas no mês atual.

#### US14: Registro de Telemetria Inviolável (O Escudo)
**Como** instrutor, **quero** que os dados de GPS e velocidade sejam registrados com um hash de integridade **para** ter prova técnica em incidentes.
- **Cenário 1: Finalização de Aula com "Caixa Preta"**
  - *Dado que* a aula de 2 horas (mínimo legal) foi concluída,
  - *Quando* o sistema encerra o trajeto,
  - *Então* o backend gera um hash SHA-256 dos logs e vincula à `Lesson`.

#### US15: Validação de Aula (Conformidade 1.020/2025)
**Como** plataforma, **quero** exigir biometria e GPS no início e fim da aula **para** garantir cumprimento legal.
- **Cenário 1: Check-in/Check-out Biométrico**
  - *Dado que* o instrutor inicia a aula,
  - *Quando* o aluno realiza reconhecimento facial e o GPS valida a proximidade,
  - *Then* o cronômetro oficial é disparado.

---

### ÉPICO 3: Jornada do Aluno

#### US08: Status da LADV
**Como** aluno, **quero** validar minha LADV **para** agendar aulas práticas.
- **Cenário 1: Atualização de LADV**
  - *Dado que* envio o comprovante,
  - *Quando* o sistema valida,
  - *Então* o campo `ladvUploaded` muda para `true`.

#### US09: Buscar Instrutores
**Como** aluno, **quero** buscar instrutores **para** encontrar o ideal.
- **Cenário 1: Listagem com Filtros**
  - *Dado que* filtro por região e preço,
  - *Quando* busco,
  - *Então* vejo os cards de instrutores ativos e ordenados.

#### US10: Agendamento de Aula (Concorrência)
**Como** aluno, **quero** agendar um horário **para** garantir minha aula.
- **Cenário 1: Prevenção de Double Booking**
  - *Dado que* dois alunos tentam o mesmo horário simultaneamente,
  - *Quando* o backend processa,
  - *Então* uma transação de banco garante que apenas um agendamento seja salvo, retornando erro 409 para o outro.

#### US11: Histórico de Aulas
**Como** aluno, **quero** acompanhar meu progresso **para** ver aulas passadas e futuras.
- **Cenário 1: Listagem Mista**
  - *Dado que* acesso o Histórico,
  - *Então* vejo as `Lessons` agrupadas por status (`upcoming`, `completed`, `cancelled`).

#### US12: Avaliar Instrutor
**Como** aluno, **quero** avaliar o instrutor **para** manter a qualidade.
- **Cenário 1: Submissão de Feedback**
  - *Dado que* a aula terminou,
  - *Quando* envio nota e comentário,
  - *Então* o rating geral do instrutor é recalculado.

#### US16: Velo Academy (Teoria e Simulados)
**Como** aluno, **quero** acessar trilhas de estudo **para** me preparar para o DETRAN.
- **Cenário 1: Aproveitamento em Simulados**
  - *Dado que* realizo um simulado,
  - *Quando* acerto mais de 66.7% das questões,
  - *Então* recebo o status "Apto para Prova Teórica".

#### US17: Concierge Burocrático (O Navegador)
**Como** aluno, **quero** um checklist das etapas do DETRAN **para** guiar meu processo.
- **Cenário 1: Consulta de Etapas**
  - *Dado que* acesso o Navegador,
  - *Então* vejo informações sobre exames médicos e taxas próximas à minha localização.

---

### ÉPICO 4: Financeiro e Mediação

#### US18: Gestão de Disputas e Mediação
**Como** usuário, **quero** abrir uma disputa **para** que a plataforma medeie conflitos.
- **Cenário 1: Contestação de Pagamento**
  - *Dado que* uma aula não ocorreu conforme o esperado,
  - *Quando* abro disputa,
  - *Então* o pagamento fica bloqueado (`disputed`) até a análise técnica da telemetria.

#### US19: Transparência de Taxas
**Como** usuário, **quero** ver a discriminação de valores **para** clareza financeira.
- **Cenário 1: Detalhes do Pagamento**
  - *Dado que* finalizo um pagamento,
  - *Então* vejo a divisão entre o valor do instrutor e a taxa de intermediação do Velo.
