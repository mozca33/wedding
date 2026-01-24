# CLAUDE.md — Wedding Website (Compacto)

## 1) Objetivo

Desenvolver e manter um website de casamento em Next.js com um pipeline de 5 agentes:

- Arquitetura
- Backend
- Frontend
- Code Review
- Performance

## 2) Stack Base

- Next.js (App Router) + TypeScript
- next/font (Geist)
- Testes: Jest/React Testing Library (unit) e Playwright (E2E) — quando solicitado
- Deploy: Vercel

## 3) Papéis (Agentes)

- Arquitetura: definir estrutura de pastas, padrões, contratos de API, dados e integrações.
- Backend: rotas (route.ts), handlers, validação, segurança, tipagem, mocks.
- Frontend: páginas e componentes acessíveis, estados, integrações com APIs, responsividade.
- Code Review: padronização, segurança, DX, consistência, sugestões objetivas.
- Performance: Core Web Vitals, imagens, caching, bundle, métricas e ações de melhoria.

## 4) Fluxo de Trabalho (curto)

1. Arquitetura: entregar plano curto (objetivos, módulos, APIs, pastas).
2. Backend e Frontend: implementar incrementalmente conforme plano.
3. Code Review: revisar diffs, apontar mudanças mínimas necessárias.
4. Performance: medir, priorizar e aplicar otimizações rápidas.
5. Repetir até atender critérios de aceite.

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
- Acessibilidade básica (a11y): headings, labels, contraste, foco.
- Performance: imagens otimizadas, import dinâmico quando útil, sem grandes regressões de bundle.
- Segurança: validação de entrada, sem segredos em código, cabeçalhos/HTTP seguros nas rotas (quando aplicável).
- Documentação mínima: README seção “Como rodar” + anotações de decisões no PR.

## 7) Comandos Úteis

- Instalação: npm install
- Dev: npm run dev (http://localhost:3000)
- Build: npm run build
- Testes (se configurado): npm test | npx playwright test

## 8) Convenções

- TypeScript estrito em novas peças.
- Componentes: server quando possível; client só se necessário (use client).
- CSS: preferir estilos do Next/Image e otimizações padrão; se usar lib de UI, justificar.
- Mensagens de commit: curtas e claras; PRs pequenos com descrição do “porquê”.

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

- Arquitetura: contratos de API e estrutura de pastas.
- Backend: route.ts para POST /api/rsvp com validação.
- Frontend: página /rsvp com formulário acessível.
- Code Review: revisar diffs e apontar ajustes críticos.
- Performance: otimizar imagens e evitar bundle desnecessário.
  Responder no Formato de Resposta (Seção 5).”
