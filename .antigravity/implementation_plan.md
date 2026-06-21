# Plano de Implantação — Conclusão Total do LifeOS e Publicação no GitHub

Este plano detalha as etapas finais para garantir que 100% das páginas, botões e fluxos do aplicativo **LifeOS** estejam completos e integrados, seguidos pelo versionamento e publicação automática do projeto em um novo repositório no GitHub via MCP.

---

## Proposed Changes

### Componente: Conclusão das Páginas e Funcionalidades

#### [NEW] [page.tsx (Relatórios)](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/app/relatorios/page.tsx)
* Criar a página de Relatórios detalhada contendo gráficos de consistência de hábitos, volume de atividades concluídas e distribuição de categorias financeiras (receitas vs despesas), consumindo os dados reais do contexto global.

#### [MODIFY] [page.tsx (Configurações)](file:///c:/Users/joao.tamanqueira/Documents/Projeto%20App%20de%20Produtividade/app/configuracoes/page.tsx)
* Conectar os campos de edição de perfil (Nome, E-mail) diretamente ao estado global `onboardingAnswers` e `completeOnboarding` do contexto para que qualquer alteração de nome reflita imediatamente no cabeçalho do Dashboard e na conversa com o Mentor.

---

### Componente: Publicação no GitHub via MCP

#### [NEW] [GitHub Repository]
* Utilizar as ferramentas do **github-mcp-server** para:
  1. Criar um novo repositório remoto público ou privado (ex: `lifeos-productivity-portal`).
  2. Subir todos os arquivos estruturais e de código do projeto (`app/`, `components/`, `context/`, `package.json`, `tailwind.config.ts`, etc.) para a branch principal (`main`).

---

## Verification Plan

### Automated Tests
* Executar o build local do Next.js para garantir que não existam erros de compilação ou de tipos no TypeScript:
  `npm run build`

### Manual Verification
1. O usuário abrirá `http://localhost:3000/relatorios` para verificar os gráficos alimentados dinamicamente com base nos hábitos e tarefas realizados.
2. O usuário alterará seu nome na aba de Configurações e validará se o cabeçalho do Dashboard atualizou em tempo real.
3. O usuário verificará o link do repositório no GitHub gerado pelo MCP.
