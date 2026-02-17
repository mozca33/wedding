# Notifications Setup - Telegram + Email 📧📱

Both services are **100% FREE** for your use case!

---

## 🤖 Telegram Bot Setup (2 minutes)

### Step 1: Create Bot

1. **Open Telegram** (on phone or desktop)
2. Search for **@BotFather**
3. Send: `/newbot`
4. Choose a name: `Julia & Rafael Wedding Bot`
5. Choose username: `juliarafa_wedding_bot` (must end with `_bot`)
6. **Copy the API token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

1. Search for **@userinfobot** in Telegram
2. Send any message to it
3. It will reply with your **Chat ID** (a number like: `123456789`)
4. **Copy this Chat ID**

### Step 3: Start Your Bot

1. Search for your bot: `@juliarafa_wedding_bot`
2. Click **START** button
3. Send a test message (e.g., "Hello")

---

## 📧 Resend Email Setup (3 minutes)

### Step 1: Create Account

1. Go to: https://resend.com/signup
2. Sign up with your email
3. Verify your email

### Step 2: Get API Key

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name: `Wedding Notifications`
4. Permission: **Sending access**
5. Click **Create**
6. **Copy the API key** (starts with `re_...`)
7. ⚠️ Save it now! You won't see it again

### Step 3: Verify Domain (Optional but Recommended)

**Option A: Use Resend's test domain (Quick)**
- No setup needed
- Emails from: `noreply@resend.dev`
- Works immediately
- Good for testing

**Option B: Use your own domain (Better for production)**
1. Go to: https://resend.com/domains
2. Add your domain (e.g., `casamento-juliarafa.com`)
3. Add DNS records (TXT, MX, CNAME)
4. Wait for verification
5. Emails from: `noreply@casamento-juliarafa.com`

For now, **use Option A** (test domain) to get started quickly!

---

## ⚙️ Add to .env.local

Open `.env.local` and add these variables:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_DOMAIN=resend.dev
ADMIN_EMAIL=rafaelfelipe501@gmail.com

# Site URL (for links in notifications)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace:**
- `TELEGRAM_BOT_TOKEN` with your bot token from BotFather
- `TELEGRAM_CHAT_ID` with your chat ID from userinfobot
- `RESEND_API_KEY` with your API key from Resend
- `RESEND_DOMAIN` with `resend.dev` (or your custom domain)
- `ADMIN_EMAIL` with the email where you want notifications
- `NEXT_PUBLIC_SITE_URL` with your site URL (update when deploying)

---

## 🧪 Test Notifications

### 1. Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Create Test Order

1. Go to: http://localhost:3000/presentes
2. Add a gift to cart
3. Create order
4. Fill in buyer info
5. Click "Continuar"

### 3. Check Notifications

**Telegram:**
- Open Telegram
- Check your bot's chat
- You should see: "🎁 NOVO PEDIDO RECEBIDO!"

**Email:**
- Check your inbox (rafaelfelipe501@gmail.com)
- Subject: "🎁 Novo pedido #WED-... - R$ XX,XX"
- Should have nice HTML formatting

### 4. Check Console Logs

In your terminal, look for:
```
=== SENDING ORDER NOTIFICATIONS ===
✅ Telegram notification sent
✅ Email notification sent
Notification results: { telegram: '✅ Sent', email: '✅ Sent' }
```

---

## 📋 What You'll Receive

### Telegram Message Example:
```
🎁 NOVO PEDIDO RECEBIDO!

📋 Pedido: WED-1771352123456-ABC1

👤 Comprador:
Nome: João Silva
Email: joao@example.com
Telefone: (62) 99999-9999

🎁 Itens:
  • 1x Faca Profissional - R$ 200.00
  • 2x Jogo de xícaras - R$ 170.00

💰 Total: R$ 540.00

⏰ 17/02/2026, 15:30

🔗 Acesse o admin para aprovar:
http://localhost:3000/admin/orders
```

### Email Example:
```
Subject: 🎁 Novo pedido #WED-1771352123456-ABC1 - R$ 540,00

[Beautiful HTML email with:]
- Order details
- Buyer information
- Items table
- Total amount
- Link to admin panel
```

---

## 💰 Free Tier Limits

### Telegram
✅ **Completely FREE**
✅ **Unlimited messages**
✅ **No rate limits**
✅ **Instant delivery**

### Resend
✅ **3,000 emails/month** (FREE)
✅ **100 emails/day** (FREE)
✅ **More than enough** for wedding orders

**Estimate:**
- If you get 50 orders/month → 50 emails
- You have 3,000 emails available
- **60x more than you need!**

---

## 🔧 Troubleshooting

### Telegram not working?

**1. Bot token invalid?**
- Check you copied the full token from BotFather
- Format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

**2. Messages not arriving?**
- Did you click START on your bot?
- Is the chat ID correct?
- Check console for errors

**3. Test manually:**
```bash
curl -X POST \
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -H 'Content-Type: application/json' \
  -d '{
    "chat_id": "<YOUR_CHAT_ID>",
    "text": "Test message"
  }'
```

### Email not working?

**1. API key invalid?**
- Check you copied the full key (starts with `re_`)
- Create a new key if needed

**2. Emails not arriving?**
- Check spam folder
- Verify ADMIN_EMAIL is correct
- Using test domain? Emails might be delayed

**3. Test manually in Resend Dashboard:**
- Go to: https://resend.com/emails
- Click "Send test email"
- Check if it arrives

---

## 🚀 Deploy to Production

When deploying to Vercel:

1. Add all env variables in **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` to your production URL
3. Redeploy

**That's it!** Notifications will work in production automatically.

---

## 📊 Monitor Usage

### Telegram
- No usage dashboard needed (unlimited)
- Just check your bot messages

### Resend
1. Go to: https://resend.com/overview
2. See emails sent this month
3. Track delivery rate

---

## 🎯 Next Steps (Optional)

**After wedding:**
1. **Send thank you emails** to buyers
2. **Export order data** for records
3. **Archive the bot** (keep it for memories!)

---

All done! 🎉 You'll now receive instant notifications on both Telegram and Email whenever someone places an order!
