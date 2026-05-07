# Velo Frontend - Detalhamento de Telas e Componentes (v2)

Instruções específicas para a criação das telas principais com foco nas estratégias "Navegador" e "Escudo".

## 1. Área do Aluno (O Navegador)

### 1.1 Dashboard de Progresso (Checklist)
- **Funcionalidade:** Visualização das etapas do DETRAN (RENACH, Médico, Psicotécnico, Taxas, LADV).
- **UI:** Uma trilha vertical ou horizontal onde cada nó representa uma etapa legal. Cores mudam conforme o status no banco de dados.

### 1.2 Velo Academy (Teoria Digital)
- **Video Player:** Player minimalista para aulas teóricas.
- **Quizzes:** Interface de múltipla escolha para simulados. Exibir contador de acertos (necessário > 70% para aprovação).

### 1.3 Marketplace de Instrutores
- **Filtros:** Busca por geolocalização (Google Maps API), preço e tipo de veículo.
- **Instructor Card:** Exibir foto, rating (US12), preço da aula e número de credencial do DETRAN.

## 2. Área do Instrutor (O Escudo)

### 2.1 Dashboard de Ganhos e Status
- **Métricas:** Valor total a receber (Escrow status: Pending vs Released).
- **Alertas de Documentos:** Banner de aviso no topo se a credencial estiver a < 30 dias de vencer.

### 2.2 Validação de Aula (Interface de Campo)
- **Biometry Screen:** Overlay de câmera para captura de selfie em 3 pontos (início, meio, fim).
- **Telemetry HUD:** Exibição discreta do status do sinal GPS e tempo decorrido (meta: 2 horas mínimas).

## 3. Componentes de Mediação e Finanças

### 3.1 Tela de Pagamento (Escrow UI)
- **Status Stepper:** Mostra o fluxo do dinheiro (Pago pelo Aluno -> Retido no Velo -> Aula Validada -> Liberado para Instrutor).
- **Fees:** Descritivo claro da taxa de intermediação conforme US19.

### 3.2 Painel de Disputas
- **Timeline:** Exibição cronológica dos logs de GPS e fotos biométricas para análise visual em caso de conflito.
