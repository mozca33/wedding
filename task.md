# CLAUDE.md — Wedding Website (Compacto + Agentes)

## 1) Objetivo

Desenvolver e manter um website de casamento em Next.js com um pipeline de 8 agentes:

- Requisitos
- Design
- Backend
- Frontend
- Review (Code Review)
- Testes
- Performance
- Deploy (Publicação)

## 2) Stack Base

- Next.js (App Router) + TypeScript
- next/font (Geist)
- ESLint + Prettier
- Testes: Jest/React Testing Library (unit) e Playwright (E2E) — quando solicitado
- Deploy: Vercel

## 3) Agentes e Referências

- Requisitos
  - O que faz: coleta, refina e prioriza requisitos; define escopo e critérios de aceite.
  - Quando usar: Início do projeto ou ao definir novas features
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-requirements.md`

- Design
  - O que faz: cria a linguagem visual e wireframes; define tokens e componentes-base.
  - Quando usar: Após requisitos definidos, para criar interface visual
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-design.md`

- Backend
  - O que faz: APIs, banco de dados, validação, segurança e lógica de servidor.
  - Quando usar: Para implementar APIs, banco de dados e lógica de servidor
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-backend.md`

- Frontend
  - O que faz: páginas e componentes acessíveis; integrações com APIs; estado e UX.
  - Quando usar: Para implementar a interface do usuário
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-frontend.md`

- Performance
  - O que faz: otimiza Core Web Vitals, imagens, caching e bundle; mede e prioriza.
  - Quando usar: Após implementação básica, para otimizar velocidade
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-performance.md`

- Review (Code Review)
  - O que faz: valida qualidade, segurança, padrões e consistência antes de testes.
  - Quando usar: Antes de testes, para validação de qualidade
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-review.md`

- Testes
  - O que faz: cobre unit/integration/E2E; garante regressão zero e critérios de aceite.
  - Quando usar: Após code review aprovado, antes do deploy
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-testing.md`

- Deploy (Publicação)
  - O que faz: orquestra build, envs, variáveis secretas e publicação (ex.: Vercel).
  - Quando usar: Após testes aprovados, para publicação
  - Referência: `/mnt/skills/user/wedding-dev-pipeline/references/agent-deployment.md`

## 4) Fluxo de Trabalho (curto)

1. Requisitos: mapear escopo, critérios e priorização.
2. Design: criar base visual e tokens/componentes principais.
3. Backend e Frontend: implementar de forma incremental (em paralelo, quando fizer sentido).
4. Review (Code Review): revisar diffs e apontar mudanças mínimas necessárias.
5. Testes: cobrir cenários críticos e validar critérios de aceite.
6. Performance: medir, priorizar e aplicar otimizações rápidas.
7. Deploy: preparar build e publicar (ex.: Vercel).
8. Repetir incrementalmente por feature.

## 5) Formato de Resposta (sempre)

Entregue SEMPRE nesta ordem:

1. Plano curto (bullets, até 10 linhas).
2. Alterações como patch unified diff (quando alterar arquivos existentes).
3. Arquivos novos completos (com caminho no cabeçalho).
4. Comandos de uso/execução (npm/yarn/pnpm/bun).
5. Checklist de aceite (marcado).

Exemplo mínimo de diff:
--- a/app/page.tsx
+++ b/app/page.tsx
@@

- export default function Page() { return <div>Old</div>; }

* export default function Page() { return <main>New</main>; }

## 6) Critérios de Aceite

- Compila e roda: npm run dev | npm run build | npm run start
- Lint/format ok: npm run lint | npm run format
- Acessibilidade básica (a11y): headings, labels, contraste, foco.
- Performance: imagens otimizadas, import dinâmico quando útil, sem grandes regressões de bundle.
- Segurança: validação de entrada, sem segredos em código, cabeçalhos/HTTP seguros nas rotas (quando aplicável).
- Documentação mínima: README seção “Como rodar” + anotações de decisões no PR.

## 7) Comandos Úteis

- Instalação: npm install
- Dev: npm run dev (http://localhost:3000)
- Build: npm run build
- Lint/Format: npm run lint | npm run format
- Testes (se configurado): npm test | npx playwright test

## 8) Convenções

- TypeScript estrito em novas peças.
- Componentes: server quando possível; client só se necessário ("use client").
- CSS/UI: preferir recursos nativos do Next; se usar lib de UI, justificar.
- Imagens: Next/Image, tamanhos corretos, lazy e prioridade apenas quando necessário.
- Commits: curtos e claros; PRs pequenos com o “porquê” das decisões.

## 9) Estrutura Mínima

.
├─ app/
│ ├─ page.tsx
│ └─ api/
├─ components/
├─ lib/
├─ public/
└─ README.md

## 10) Solicitação Típica (modelo)

“Claude, implemente a página inicial e a rota de RSVP:

- Requisitos: delimitar escopo e critérios (o que a tela/rota deve cumprir).
- Design: wireframe leve e tokens (cores, tipografia).
- Backend: route.ts para POST /api/rsvp com validação.
- Frontend: página /rsvp com formulário acessível.
- Review: revisar diffs e apontar ajustes críticos.
- Testes: unit/integration básicos para a rota e o formulário.
- Performance: otimizar imagens e evitar bundle desnecessário.
- Deploy: preparar build para Vercel.
  Responder no Formato de Resposta (Seção 5).”
