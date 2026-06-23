# LifeOS Improvement Plan

Este documento consolida a analise tecnica e de produto do LifeOS e transforma os feedbacks em um plano de execucao para o Antigravity ou outro agente de desenvolvimento.

Objetivo geral: sair de um prototipo visual funcional para uma base web mais estavel, utilizavel em mobile, com persistencia minima e melhor organizacao para evoluir produto, design e engenharia.

## Contexto Atual

O projeto web e uma aplicacao Next.js 14 com App Router, React 18, Tailwind CSS e estado global via React Context.

Pontos fortes atuais:

- Boa direcao visual para um painel pessoal de produtividade.
- Escopo de produto claro: dashboard, tarefas, habitos, financas, metas, protocolos, mentor e revisao diaria.
- Componentes de interface ja demonstram uma experiencia rica para MVP.

Principais limitacoes atuais:

- Build web pode quebrar porque o `tsconfig.json` raiz inclui arquivos da pasta `mobile`.
- Dados vivem apenas em memoria e sao reinicializados com mocks no reload.
- Sidebar desaparece no mobile sem navegacao alternativa.
- IA e Open Finance sao simulacoes, mas a UI pode sugerir integracoes reais.
- Logica de XP pode gerar recompensas duplicadas ou inconsistentes.
- README e DX ainda estao fracos para continuidade de desenvolvimento.

## Principios de Implementacao

- Fazer mudancas pequenas, verificaveis e em ordem.
- Priorizar build, persistencia e navegacao antes de novas features.
- Evitar grandes refactors antes de estabilizar comportamento.
- Manter a identidade visual existente, mas reduzir repeticao e inconsistencias.
- Separar explicitamente simulacao, mock e integracao real.

## Fase 1 - Destravar Build Web

Prioridade: alta.

Problema: o `tsconfig.json` raiz inclui `**/*.ts` e `**/*.tsx`, o que faz o Next.js validar tambem `mobile/**/*.tsx`. Como as dependencias mobile nao estao instaladas na raiz web, o build pode falhar ao resolver `react-native` ou dependencias Expo.

Arquivos provaveis:

- `tsconfig.json`
- `mobile/App.tsx`
- `package.json`

Acao recomendada para curto prazo:

1. Editar `tsconfig.json`.
2. Alterar o `exclude` para ignorar a pasta mobile no build web.

Exemplo esperado:

```json
{
  "exclude": ["node_modules", "mobile", "mobile/**/*"]
}
```

Se houver outros artefatos locais, tambem excluir:

```json
{
  "exclude": ["node_modules", ".next", "mobile", "mobile/**/*"]
}
```

Criterios de aceite:

- `npm run build` nao tenta compilar `mobile/App.tsx`.
- O build web passa ou revela apenas erros realmente pertencentes ao web app.
- Nenhuma mudanca funcional na UI nesta fase.

Comandos de verificacao:

```bash
npm install
npm run build
```

## Fase 2 - Melhorar Scripts e DX

Prioridade: alta.

Problema: o projeto precisa de uma base de comandos previsivel para desenvolvimento.

Arquivos provaveis:

- `package.json`
- `README.md`
- `.eslintrc.json` ou `eslint.config.*`

Acoes:

1. Verificar se `next lint` funciona com as dependencias atuais.
2. Se necessario, adicionar `eslint` e `eslint-config-next`.
3. Adicionar scripts claros:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

4. Atualizar README com:

- Requisitos.
- Como instalar.
- Como rodar local.
- Como buildar.
- Status conhecido de web/mobile.

Criterios de aceite:

- `npm run build` roda.
- `npm run typecheck` roda.
- README permite que outro dev suba o projeto sem adivinhar comandos.

## Fase 3 - Persistencia MVP com localStorage

Prioridade: alta.

Problema: tarefas, habitos, financas, onboarding, XP, level e protocolo ativo sao perdidos no reload.

Arquivo principal:

- `context/lifeos-context.tsx`

Objetivo:

Implementar persistencia local simples para o MVP sem adicionar backend ainda.

Acoes:

1. Criar uma constante de chave, por exemplo:

```ts
const STORAGE_KEY = "lifeos:v1";
```

2. Criar um tipo para o estado persistido:

```ts
type PersistedLifeOSState = {
  tasks: Task[];
  habits: Habit[];
  expenses: Expense[];
  xp: number;
  level: number;
  activeProtocol: string | null;
  onboardingAnswers: OnboardingAnswers | null;
};
```

3. No primeiro mount client-side:

- Tentar ler `localStorage`.
- Se existir estado valido, hidratar a aplicacao com ele.
- Se nao existir, carregar os mocks iniciais.

4. Persistir no `localStorage` sempre que os dados principais mudarem.

5. Evitar sobrescrever dados carregados com mocks apos reload.

Cuidado importante:

- Como Next.js renderiza no servidor, acessar `localStorage` apenas dentro de `useEffect`.
- Usar flag de hidratacao, por exemplo `hasHydrated`, para nao salvar estado vazio antes de carregar.

Criterios de aceite:

- Criar tarefa, recarregar pagina, tarefa continua la.
- Completar habito, recarregar pagina, estado continua.
- Onboarding feito uma vez continua visivel apos reload.
- XP e level persistem.

## Fase 4 - Navegacao Mobile Web

Prioridade: alta.

Problema: `Sidebar` usa `hidden md:flex`, mas nao ha menu mobile alternativo.

Arquivos provaveis:

- `components/layout/sidebar.tsx`
- `app/layout.tsx`
- novo componente: `components/layout/mobile-nav.tsx`

Opcao recomendada:

Criar uma bottom navigation fixa para mobile com os destinos principais.

Itens sugeridos para bottom nav:

- Dashboard: `/`
- Atividades: `/atividades`
- Mentor: `/mentor`
- Financas: `/financas`
- Mais: abre drawer ou link para `/protocolos`

Implementacao minima:

1. Extrair `menuItems` para um arquivo compartilhado ou duplicar inicialmente com cuidado.
2. Criar `MobileNav` visivel apenas em `md:hidden`.
3. Adicionar padding inferior ao conteudo mobile para nao ficar oculto atras da nav.
4. Usar `usePathname` para estado ativo.
5. Usar icones `lucide-react`, mantendo padrao existente.

Criterios de aceite:

- Em viewport mobile, o usuario consegue navegar entre telas principais.
- Sidebar desktop continua funcionando.
- Conteudo nao fica escondido pela bottom nav.
- Nenhum botao de navegacao tem texto cortado.

## Fase 5 - Sinalizar Simulacoes de IA e Open Finance

Prioridade: alta/media.

Problema: Aether e Open Finance parecem reais, mas hoje sao simulacoes locais.

Arquivos provaveis:

- `app/mentor/page.tsx`
- `app/financas/page.tsx`
- `app/page.tsx`
- `app/protocolos/page.tsx`

Acoes:

1. Adicionar badge discreto `Demo` ou `Simulacao` nas areas:

- Mentor Aether.
- Conectar Open Finance.
- Replanejar com IA.
- Insight do Mentor no dashboard.

2. Ajustar textos para nao prometer integracao real.

Exemplos de copy:

- "Modo demo: respostas geradas localmente para validar a experiencia."
- "Simulacao Open Finance: nenhum banco real sera conectado neste MVP."

3. Evitar bloquear a experiencia; apenas deixar transparente.

Criterios de aceite:

- Usuario entende que nao ha conexao bancaria real.
- Usuario entende que o mentor ainda nao usa um modelo de IA real.
- A experiencia visual continua limpa.

## Fase 6 - Corrigir e Documentar Regras de XP

Prioridade: media.

Problema: `gainXp` depende de `level` capturado por closure e algumas acoes compostas concedem XP multiplas vezes.

Arquivo principal:

- `context/lifeos-context.tsx`

Acoes de curto prazo:

1. Ajustar `gainXp` para calcular level e xp de forma deterministica.
2. Permitir subir multiplos niveis se uma acao gerar XP suficiente.
3. Criar constantes para recompensas.

Exemplo conceitual:

```ts
const XP_REWARDS = {
  addTask: 20,
  completeTask: 50,
  addHabit: 15,
  completeHabit: 30,
  addExpense: 10,
  activateProtocol: 50,
  dailyReview: 80,
  onboarding: 100,
};
```

4. Revisar `activateProtocol`:

- Decidir se ele deve dar XP apenas pela ativacao.
- Ou se as tarefas/habitos gerados tambem devem pontuar.
- Documentar essa decisao no codigo.

Criterios de aceite:

- XP nao depende de estado antigo de `level`.
- Ativar protocolo nao gera XP acidentalmente alem da regra definida.
- Regras ficam legiveis para manutencao.

## Fase 7 - Componentizacao Inicial

Prioridade: media.

Problema: algumas paginas concentram UI, estado local, formularios e calculos no mesmo arquivo.

Arquivos mais criticos:

- `app/page.tsx`
- `app/atividades/page.tsx`
- `app/financas/page.tsx`
- `app/metas/page.tsx`

Componentes candidatos:

- `components/ui/button.tsx`
- `components/ui/modal.tsx`
- `components/ui/page-header.tsx`
- `components/ui/empty-state.tsx`
- `components/dashboard/quick-actions.tsx`
- `components/dashboard/today-panel.tsx`
- `components/dashboard/metrics-card.tsx`
- `components/forms/task-form.tsx`
- `components/forms/habit-form.tsx`
- `components/forms/expense-form.tsx`

Acoes:

1. Comecar pelos componentes repetidos e de baixo risco:

- Page header.
- Modal shell.
- Empty state.
- Botao padronizado.

2. Depois extrair partes do dashboard.
3. Evitar mudar comportamento durante a componentizacao.

Criterios de aceite:

- Arquivos de pagina ficam menores e mais legiveis.
- Build continua passando apos cada extracao.
- UI permanece visualmente equivalente.

## Fase 8 - Design e Experiencia

Prioridade: media.

Objetivo: manter o visual premium, mas melhorar clareza, mobile e consistencia.

Acoes recomendadas:

1. Reduzir excesso de hex codes inline.
2. Usar tokens do Tailwind sempre que possivel.
3. Padronizar estados:

- Empty state.
- Loading.
- Success.
- Error.
- Demo/simulacao.

4. Melhorar fluxos principais:

- Primeiro acesso deve sugerir onboarding.
- Dashboard deve indicar claramente proxima melhor acao.
- Revisao diaria deve ser facil de encontrar e concluir.
- Tarefas, habitos e financas devem ter criacao rapida e feedback claro.

5. Substituir `alert()` por modal/toast visual consistente.

Criterios de aceite:

- Mobile navegavel e sem sobreposicoes.
- Acoes principais sempre visiveis.
- Feedback de sucesso/erro aparece dentro da UI.
- Textos nao prometem funcionalidade inexistente.

## Fase 9 - Separacao Web/Mobile

Prioridade: media/alta, dependendo da estrategia do produto.

Decisao necessaria:

Escolher uma das tres opcoes:

1. Web responsivo apenas por enquanto.
2. Mobile em repositorio separado.
3. Monorepo com workspaces.

Recomendacao para agora:

- Curto prazo: excluir `mobile/**` do build web.
- Medio prazo: se mobile continuar no mesmo repositorio, migrar para monorepo.

Exemplo de estrutura futura:

```text
apps/
  web/
  mobile/
packages/
  core/
  ui/
```

Criterios de aceite futuro:

- Build web nao depende de dependencias mobile.
- Build mobile nao depende de Next.js.
- Tipos compartilhados vivem em pacote comum.

## Fase 10 - Backend Futuro

Prioridade: futura, apos MVP localStorage.

Possiveis opcoes:

- Supabase: boa opcao para auth, Postgres, RLS e evolucao rapida.
- Firebase: simples para realtime e prototipagem.
- Prisma/Postgres: bom controle de schema, mas exige mais infraestrutura.

Modelo inicial sugerido:

- `users`
- `tasks`
- `habits`
- `habit_logs`
- `expenses`
- `goals`
- `protocols`
- `xp_events`
- `daily_reviews`

Regra importante:

Antes de backend real, estabilizar entidades e fluxos no localStorage.

## Ordem Recomendada de PRs

### PR 1 - Build e DX

- Corrigir `tsconfig.json` para excluir mobile.
- Adicionar `typecheck`.
- Corrigir lint se necessario.
- Atualizar README basico.

Verificacao:

```bash
npm run build
npm run typecheck
npm run lint
```

### PR 2 - Persistencia local

- Persistir estado principal em `localStorage`.
- Garantir fallback para mocks iniciais.
- Testar reload manual.

Verificacao manual:

- Criar tarefa e recarregar.
- Fazer onboarding e recarregar.
- Adicionar gasto e recarregar.

### PR 3 - Mobile nav

- Criar bottom nav ou drawer mobile.
- Ajustar layout para padding inferior.
- Testar viewport mobile.

Verificacao manual:

- Abrir em 375px de largura.
- Navegar entre dashboard, atividades, mentor e financas.

### PR 4 - Transparencia de simulacoes

- Adicionar badges/copy de demo.
- Remover promessas de conexao real onde nao existem.

Verificacao manual:

- Mentor e Open Finance indicam modo demo.

### PR 5 - XP rules

- Criar constantes de XP.
- Corrigir `gainXp`.
- Evitar recompensa composta acidental.

Verificacao manual:

- Completar tarefa pontua uma vez.
- Ativar protocolo segue regra definida.
- Level up funciona.

### PR 6 - Componentizacao leve

- Extrair componentes repetidos.
- Manter UI equivalente.

Verificacao:

```bash
npm run build
```

## Checklist Para o Antigravity

Antes de comecar:

- Confirmar que o repositorio local tem `package.json` na raiz.
- Rodar `npm install`.
- Rodar `npm run build` e salvar erro inicial.

Durante a implementacao:

- Fazer uma fase por vez.
- Rodar build apos cada fase.
- Evitar refactor grande junto com mudanca funcional.
- Nao remover a pasta mobile sem decisao explicita.

Ao finalizar:

- Confirmar comandos executados.
- Listar arquivos alterados.
- Descrever comportamento testado manualmente.
- Informar qualquer pendencia ou decisao de produto necessaria.

## Resultado Esperado

Ao concluir as fases prioritarias, o LifeOS deve ter:

- Build web destravado.
- Estado persistente localmente.
- Navegacao funcional em mobile web.
- Simulacoes claramente sinalizadas.
- Regras de XP mais previsiveis.
- README e scripts melhores para continuidade.

Isso transforma o LifeOS de um prototipo visual promissor em uma base de produto mais confiavel para evoluir com backend, IA real e design system mais maduro.
