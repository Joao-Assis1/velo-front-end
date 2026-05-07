# Velo Frontend - Arquitetura de UI e Design System (MVP v2)

Este guia serve como instrução para o desenvolvimento da interface visual do Velo, utilizando Next.js, Tailwind CSS e ShadCN UI.

## 1. Identidade Visual e Design System
A interface deve transmitir **confiança, clareza e agilidade**, focando em acessibilidade (WCAG 2.1).

- **Paleta de Cores:**
  - **Primária (Safety Blue):** `#1E40AF` - Representa segurança e seriedade.
  - **Sucesso (Velo Green):** `#059669` - Para etapas concluídas no checklist e aulas validadas.
  - **Alerta (Warning Gold):** `#D97706` - Para pendências burocráticas e status de pagamento 'Locked'.
  - **Fundo:** `#F9FAFB` (Light Gray) para evitar cansaço visual.
- **Tipografia:** Inter ou Roboto para legibilidade técnica.

## 2. Estrutura de Layout (Next.js)
- **Shared Layouts:** Utilizar layouts aninhados do App Router para diferenciar as áreas de 'Student' e 'Instructor'.
- **Navigation:**
  - **Mobile-First:** Menu inferior (Bottom Nav) para o Aluno (Home, Academy, Agenda, Perfil).
  - **Desktop-First:** Sidebar lateral para o Painel Administrativo e Dashboard do Instrutor.

## 3. Componentes Base (ShadCN UI)
- **Cards:** Para listagem de instrutores e progresso teórico.
- **Progress Bars:** Essenciais para o "Navegador" (Progresso burocrático e carga horária).
- **Dialogs/Modals:** Para confirmação de biometria e agendamento de aulas.
- **Badges:** Para exibir status de documentos (Validado, Pendente, Vencido).

## 4. Estratégias de Responsividade
O sistema deve ser perfeitamente responsivo, visto que o Instrutor utilizará majoritariamente o Dashboard via desktop/tablet, enquanto o Aluno utilizará o celular para validação de aulas e estudo teórico.
