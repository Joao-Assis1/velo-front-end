# Velo - Especificação Técnica e Arquitetura

## 1. Stack Tecnológica
- **Frontend Web:** Next.js + ShadCN (Painel Admin e Gestão Burocrática).
- **Mobile:** Flutter (App único com perfis dinâmicos para Aluno e Instrutor).
- **Backend:** NestJS (Node.js) com arquitetura modular.
- **ORM:** Prisma.
- **Banco de Dados:** Neon.tech (PostgreSQL Serverless).

## 2. Arquitetura de Dados (Extensão Prisma)
Para suportar as novas funcionalidades de "Escudo" e "Navegador", o `schema.prisma` deve incluir:

- **Model `UserChecklist`**: Rastreia as etapas do aluno (Médico, Psicotécnico, Taxas, LADV).
- **Model `LessonTelemetry`**: Armazena coordenadas GPS e timestamps de início/fim.
- **Model `Dispute`**: Registra contestações de aulas, permitindo que a mediação humana ou automática ocorra.
- **Model `PaymentEscrow`**: Status do pagamento (Pending, Locked, Released, Disputed).

## 3. Funcionalidades Críticas de Segurança (O Escudo)
1. **Telemetria via Flutter:** Coleta de dados de GPS e velocidade simulada enviada em pacotes para o NestJS.
2. **Biometria Facial:** Comparação da foto de check-in com a foto do cadastro (DataValid ou AWS Rekognition).
3. **Logs Imutáveis:** Cada registro de aula gera um hash para garantir que o instrutor não altere os dados de um possível acidente.

## 4. Plano de Integrações
- **Pagamentos:** Stripe Connect ou Pagar.me (Suporte nativo a Split e Escrow).
- **Notificações:** Firebase Cloud Messaging (Alertas de vencimento de prazos burocráticos).
- **Mapas:** Google Maps SDK para Flutter (Cálculo de rota e Geofencing).

## 5. Viabilidade e Performance (Neon.tech)
- Utilização de **Indexes** nas tabelas de telemetria para garantir que as consultas de disputa sejam rápidas.
- Estratégia de **Soft Delete** para registros de alunos que concluíram a CNH, movendo dados antigos para Cold Storage para economizar no Neon.