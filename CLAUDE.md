# CLAUDE.md — Wedding Website

## Stack

- **Next.js** (Pages Router) + TypeScript
- **Supabase** — banco de dados e realtime
- **Tailwind CSS**
- **Vercel** — deploy e cron jobs
- **PIX** — pagamento manual via chave telefone

---

## Estrutura de pastas

```
pages/
├── index.tsx              # Página principal
├── presentes.tsx          # Lista de presentes + carrinho + checkout
├── admin/
│   ├── index.tsx          # Dashboard admin
│   ├── orders.tsx         # Gestão de pedidos
│   └── rsvp.tsx           # Lista de RSVPs
└── api/
    ├── orders/
    │   ├── create.ts      # Cria pedido + reserva presentes
    │   ├── confirm.ts     # Aprova pedido (reserved → sold)
    │   ├── reject.ts      # Rejeita pedido (libera reservas)
    │   ├── list.ts        # Lista pedidos (admin)
    │   └── cleanup.ts     # Cron: cancela pedidos > 7 dias
    ├── notify-whatsapp.ts
    └── test-whatsapp.ts

components/
├── AdminLayout.tsx
├── CountDownTimer.tsx
├── Layout.tsx
├── sections/
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Gallery.tsx
│   ├── GiftList.tsx       # Seção de presentes na página principal
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── OurStory.tsx
│   ├── RSVP.tsx
│   └── WeddingInfo.tsx
└── ui/
    ├── AdminLogin.tsx
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── MultiSelectActions.tsx
    └── Notification.tsx

lib/
├── gifts-data.ts          # Funções de acesso ao Supabase (gifts)
├── notifications.ts
├── supabase.ts            # Cliente Supabase (anon key)
├── supabaseAdmin.ts       # Cliente Supabase (service role)
├── types.ts               # Interfaces TypeScript
├── utils.ts
└── whatsapp.ts

hooks/
├── useAuth.ts
├── useCart.ts             # Carrinho local (localStorage)
├── useGallery.ts
├── useGifts.ts            # Fetch de presentes do Supabase
├── useNotification.ts
└── useRSVP.ts

public/
├── images/
│   ├── gifts/             # Imagens antigas dos presentes
│   │   └── new/           # Imagens novas (abril/2026)
│   ├── hero/
│   └── story/
└── sheet/                 # Scripts SQL de migração
    ├── seed-gifts.sql
    ├── update-gifts-v2.sql  # Atualiza imagens + adiciona website
    └── ...
```

---

## Modelo de dados

### `gifts`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Chave primária |
| `name` | TEXT | Nome do presente |
| `category` | TEXT | `cozinha`, `limpeza`, `cama-e-banho`, `para-a-vida-de-casados` |
| `price` | DECIMAL | Preço em R$ |
| `quantity` | INT | Quantidade total disponível |
| `image` | TEXT | Caminho da imagem em `/public` |
| `website` | TEXT | URL para comprar o presente (opcional) |
| `reserved` | INT | Reservado em pedidos `pending` |
| `sold` | INT | Vendido em pedidos `confirmed` |

### `gift_orders`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Chave primária |
| `order_number` | TEXT | Ex: `WED-1234...` |
| `buyer_name` | TEXT | Nome do convidado |
| `buyer_email` | TEXT | E-mail do convidado |
| `buyer_phone` | TEXT | Telefone (opcional) |
| `items` | JSONB | Array de `{ giftId, name, price, quantity, image }` |
| `total` | DECIMAL | Valor total |
| `status` | TEXT | `pending`, `confirmed`, `cancelled` |
| `pix_code` | TEXT | Código PIX gerado |
| `notes` | TEXT | Observações (usado pelo cron de cancelamento) |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `confirmed_at` | TIMESTAMPTZ | Data de confirmação |

---

## Fluxo de presentes

1. Convidado adiciona ao carrinho (localStorage, sem banco)
2. Clica "Finalizar Presente"
3. Escolhe método: **PIX** ou **Comprar no site**
4. Preenche nome + e-mail
5. API cria pedido + reserva presentes
6. **PIX:** exibe QR Code + chave
7. **Site:** exibe links por produto
8. Admin confirma ou rejeita no painel

---

## Inventário

- Carrinho é 100% local — não toca o banco
- Reserva acontece apenas na criação do pedido
- Disponibilidade = `quantity - reserved - sold`
- Ao adicionar ao carrinho, desconta o que já está no carrinho local
- Pedidos `pending` > 7 dias são cancelados automaticamente pelo cron

---

## Variáveis de ambiente obrigatórias

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_PIX_KEY
NEXT_PUBLIC_PIX_NAME
ADMIN_PASSWORD            # senha do painel admin (servidor; sem prefixo NEXT_PUBLIC)
ADMIN_SESSION_SECRET      # (opcional) segredo HMAC para assinar o cookie de sessão admin
CRON_SECRET
```

---

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # http://localhost:3000
npm run build        # Build de produção
npx vercel --prod    # Deploy para produção
```

---

## Deploy e cron

O arquivo `vercel.json` configura o cron job de limpeza:

```json
{
  "crons": [{ "path": "/api/orders/cleanup", "schedule": "0 8 * * *" }]
}
```

Executa diariamente às 08:00 UTC. Protegido por `CRON_SECRET`.

---

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `README.md` | Visão geral e como rodar |
| `ADMIN-PANEL.md` | Guia do painel administrativo |
| `PIX-SETUP.md` | Fluxo de checkout e pagamento |
| `INVENTORY-FIX.md` | Sistema de inventário e reservas |
| `NOTIFICATIONS-SETUP.md` | Configuração de notificações |
