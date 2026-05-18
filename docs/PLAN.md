# MVP Development & Bugfix Plan (Velo)

## 🎯 Objetivo
Implementar as funcionalidades do MVP e solucionar o bug crítico de carregamento de dados no frontend.

## 🐛 Fase 1: Resolução do Bug Crítico (Data Fetching)
**Problema:** Os dados do banco não carregam no frontend.
**Causa provável:** O `fetch` executado no lado do servidor (Next.js Server Actions) está falhando ao tentar acessar `http://localhost:3001` devido a resolução de DNS (IPv6 `::1` vs IPv4 `127.0.0.1`) ou problemas de cache do Next.js.
- **Passo 1.1:** Alterar a variável de ambiente `NEXT_PUBLIC_API_URL` para `http://127.0.0.1:3001/api/v1` no frontend para garantir a resolução correta.
- **Passo 1.2:** Melhorar o tratamento de erros no `fetchWrapper` (`api-client.ts`) para debugar falhas de rede com mais clareza.
- **Passo 1.3:** Garantir que o `getInstructorsAction` e outras Server Actions estão retornando e mapeando os dados corretamente (ex: lidando com o fato de que `response` pode não ser um array se ocorrer um erro).

## 🚀 Fase 2: Implementação das Funcionalidades do MVP

### 2.1 Cadastro e Perfil (Alunos e Instrutores)
- **Instrutores:** Suporte para os tipos "Credenciado" e "Autônomo".
- **Alunos (LADV):** 
  - Adicionar opção de upload/marcação de LADV no perfil.
  - **Aviso:** Criar componente visual de alerta no painel do aluno ("Faça o upload da LADV para ter mais chances de ser aceito pelos instrutores") se `ladvUploaded` for false.

### 2.2 Busca e Contato (WhatsApp)
- **Busca:** Garantir que a listagem e os filtros de instrutores na home do aluno funcionem com os dados reais do banco.
- **Contato:** Implementar o redirecionamento simulado para o WhatsApp do instrutor ao clicar no perfil dele.

### 2.3 Agendamento de Aulas
- Integrar a escolha de data e horário pelo aluno com a action `bookClass`, já verificando choque de horários (Feature implementada na API recentemente).

### 2.4 Controle de Frequência e Histórico
- **Check-in/Check-out:** Conectar os botões de iniciar/finalizar aula aos endpoints da API.
- Registro da aula com status (`in-progress`, `completed`).

### 2.5 Sistema de Avaliações
- Implementar formulário/modal para o aluno avaliar o instrutor e o instrutor avaliar o aluno após a conclusão da aula (`status === 'completed'`).

## 🛠️ Fase 3: Verificação e Testes
- Rodar o script de lint (`lint_runner.py`).
- Rodar o script de segurança (`security_scan.py`).