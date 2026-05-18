## 3. Épicos e User Stories (Com Critérios de Aceite BDD)

### ÉPICO 1: Acesso e Segurança

#### US01: Cadastro e Login

**Como** usuário (aluno ou instrutor), **quero** me cadastrar e fazer login **para** acessar a plataforma.

- **Cenário 1: Cadastro Válido**
  - _Dado que_ preencho o formulário com dados válidos e aceito os Termos de Uso (Aluno ou Instrutor),
  - _Quando_ envio o formulário,
  - _Então_ a API (NestJS) salva o usuário no PostgreSQL com senha hash (bcrypt) e retorna 201.
- **Cenário 2: Login Autenticado**
  - _Dado que_ insiro credenciais corretas,
  - _Quando_ clico em Entrar,
  - _Então_ a API retorna um token JWT e o Frontend (Next.js) armazena o token e redireciona (Aluno para Busca, Instrutor para Dashboard).
- **Regras de Negócio Específicas:** Email deve ser único. O aceite do Termo de Uso é obrigatório para conformidade legal.

#### US02: Recuperação de Senha

**Como** usuário, **quero** recuperar minha senha por e-mail **para** retomar meu acesso.

- **Cenário 1: Solicitação de Reset**
  - _Dado que_ informo meu e-mail,
  - _Quando_ solicito a recuperação,
  - _Então_ a API gera um token JWT temporário (1h) e simula envio de link.

---

### ÉPICO 2: Jornada do Instrutor

#### US03: Editar Perfil e Documentos Legais

**Como** instrutor, **quero** editar meu perfil público e anexar documentos **para** estar regularizado na plataforma.

- **Cenário 1: Atualização de Dados**
  - _Dado que_ altero bio, preço por hora, região e insiro dados da CNH (com EAR) e Certidão Negativa,
  - _Quando_ clico em "Salvar Perfil",
  - _Então_ o Prisma atualiza o registro no PostgreSQL e a API retorna os dados atualizados.

#### US04: Cadastrar Disponibilidade

**Como** instrutor, **quero** cadastrar horários de trabalho **para** os alunos agendarem.

- **Cenário 1: Criação de Grade**
  - _Dado que_ seleciono `dayOfWeek`, `startTime` e `endTime`,
  - _Quando_ salvo a grade,
  - _Então_ o sistema gera os registros em `Availability` garantindo que não existam horários sobrepostos para o mesmo dia.

#### US05: Gerenciar Veículo de Instrução

**Como** instrutor, **quero** cadastrar meu veículo **para** realizar as aulas.

- **Cenário 1: Cadastro de Veículo**
  - _Dado que_ informo Placa, Modelo, Ano e Transmissão,
  - _Quando_ envio os dados,
  - _Então_ o sistema vincula o `Vehicle` ao `Instructor` no banco. (Frontend deve aplicar máscara na placa).

#### US06: Visualizar Agenda Diária

**Como** instrutor, **quero** visualizar as aulas do dia **para** me organizar.

- **Cenário 1: Lista de Aulas**
  - _Dado que_ acesso a aba Agenda,
  - _Quando_ seleciono uma data,
  - _Então_ a API retorna as `Lessons` do dia filtradas por `instructorId`, incluindo os dados do aluno.

#### US07: Dashboard de Ganhos

**Como** instrutor, **quero** ver métricas **para** controle financeiro.

- **Cenário 1: Soma de Ganhos**
  - _Dado que_ abro o Dashboard,
  - _Quando_ o componente monta,
  - _Então_ a API (via Prisma aggregation) soma o campo `price` das `Lessons` com status `completed` do mês atual.

---

### ÉPICO 3: Jornada do Aluno

#### US08: Status da LADV

**Como** aluno, **quero** marcar minha LADV como validada **para** poder agendar aulas.

- **Cenário 1: Atualização de LADV**
  - _Dado que_ envio o comprovante da LADV,
  - _Quando_ o sistema processa,
  - _Então_ o campo `ladvUploaded` do Student muda para `true`.

#### US09: Buscar Instrutores

**Como** aluno, **quero** buscar instrutores **para** encontrar o ideal.

- **Cenário 1: Listagem com Filtros**
  - _Dado que_ digito a região e seleciono ordem de preço,
  - _Quando_ busco,
  - _Então_ a API retorna os instrutores ativos ordenados pelo critério escolhido. O Frontend renderiza cards usando ShadCN.

#### US10: Agendamento de Aula (Core Business - Concorrência)

**Como** aluno, **quero** agendar um horário **para** garantir minha aula.

- **Cenário 1: Agendamento com Sucesso**
  - _Dado que_ escolho um horário livre do instrutor e minha LADV é `true`,
  - _Quando_ confirmo,
  - _Então_ o sistema cria a `Lesson` com status `upcoming`.
- **Cenário 2: Prevenção de Double Booking (Race Condition)**
  - _Dado que_ eu e outro aluno tentamos agendar o mesmo horário no mesmo milissegundo,
  - _Quando_ o backend processa,
  - _Então_ o NestJS deve usar uma transação do Prisma (Prisma `$transaction`) para garantir que apenas 1 agendamento seja salvo. O segundo recebe HTTP 409 (Conflict).

#### US11: Histórico de Aulas

**Como** aluno, **quero** ver minhas aulas passadas e futuras **para** acompanhar o progresso.

- **Cenário 1: Listagem Mista**
  - _Dado que_ acesso o Histórico,
  - _Quando_ a tela carrega,
  - _Então_ vejo a lista de `Lessons` agrupadas por status (`upcoming`, `completed`, `cancelled`).

#### US12: Avaliar Instrutor

**Como** aluno, **quero** dar uma nota ao instrutor após a aula **para** manter a qualidade da plataforma.

- **Cenário 1: Submissão de Feedback**
  - _Dado que_ a aula tem status `completed`,
  - _Quando_ envio uma nota de 1 a 5 (`studentFeedbackRating`),
  - _Então_ a API atualiza a `Lesson` e recalcula o `rating` geral do `Instructor` no banco.
