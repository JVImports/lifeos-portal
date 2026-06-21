# Plano de Implantação — Evolução Premium LifeOS (Competitor Benchmark Trilha.IA)

Melhoraremos o portal **LifeOS** com novos recursos inspirados no concorrente **Trilha.IA**, elevando o nível estético e funcional da aplicação para um patamar de altíssimo padrão.

## Mudanças Propostas

### 1. Novo Fluxo: Revisão Diária (`/revisao-diaria`) [NEW]
* Criar uma página que permite ao usuário "encerrar o dia".
* Passos interativos:
  1. **Auditoria de Pendências:** Ver tarefas não concluídas e selecionar motivos (Procrastinação, Urgência Externa, Falta de Tempo).
  2. **Feedback do Mentor Aether:** O mentor analisa os motivos e dá um feedback personalizado com tom de cobrança configurado.
  3. **Planejamento de Amanhã:** Definir as 3 metas do dia seguinte antecipadamente.

### 2. Novo Fluxo: Mapa da Trilha de Evolução (`/trilha`) [NEW]
* Criar um mapa visual interativo (Skill Tree / Roadmap) que ilustra a jornada de evolução do usuário.
* Nós desbloqueados com base no nível do usuário (ex: "Explorador da Manhã", "Orçamentista Disciplinado", "Mestre do Foco Profundo").

### 3. Integração: Conexão Open Finance Simulada (`/financas`) [MODIFY]
* Adicionar na tela de Finanças um fluxo para conectar bancos via Open Finance de forma visualmente rica (com logos de bancos reais e etapas de carregamento futuristas).
* Ao conectar, injeta automaticamente transações mockadas complexas no banco do usuário.

### 4. Ajustes no Sidebar (`components/layout/sidebar.tsx`) [MODIFY]
* Adicionar links de navegação para a **Revisão Diária** e o **Mapa da Trilha**.

---

## Proposed Files

#### [NEW] [revisao-diaria page.tsx](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/app/revisao-diaria/page.tsx)
#### [NEW] [trilha page.tsx](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/app/trilha/page.tsx)
#### [MODIFY] [financas page.tsx](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/app/financas/page.tsx)
#### [MODIFY] [sidebar.tsx](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/components/layout/sidebar.tsx)
#### [MODIFY] [lifeos-context.tsx](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/context/lifeos-context.tsx)

---

## Plano de Verificação

### Testes Manuais
1. Acessar `/revisao-diaria` e completar o fluxo de fechamento do dia.
2. Acessar `/trilha` e verificar se o mapa visual renderiza os nós desbloqueados/bloqueados dinamicamente.
3. Testar a conexão Open Finance na aba de `/financas` e checar se novas transações foram injetadas.
