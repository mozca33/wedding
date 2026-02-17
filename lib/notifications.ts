// lib/notifications.ts
// Notification helpers for Telegram and Email

interface OrderNotification {
	orderNumber: string;
	buyerName: string;
	buyerEmail: string;
	buyerPhone?: string;
	items: Array<{
		name: string;
		quantity: number;
		price: number;
	}>;
	total: number;
}

// Send Telegram notification
export async function sendTelegramNotification(order: OrderNotification): Promise<boolean> {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!botToken || !chatId) {
		console.log('Telegram not configured, skipping notification');
		return false;
	}

	const message = formatTelegramMessage(order);

	try {
		const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: 'HTML',
			}),
		});

		const data = await response.json();

		if (data.ok) {
			console.log('✅ Telegram notification sent');
			return true;
		} else {
			console.error('❌ Telegram error:', data);
			return false;
		}
	} catch (error) {
		console.error('Error sending Telegram notification:', error);
		return false;
	}
}

function formatTelegramMessage(order: OrderNotification): string {
	const itemsList = order.items
		.map((item) => `  • ${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}`)
		.join('\n');

	return `
🎁 <b>NOVO PEDIDO RECEBIDO!</b>

📋 Pedido: <code>${order.orderNumber}</code>

👤 <b>Comprador:</b>
Nome: ${order.buyerName}
Email: ${order.buyerEmail}
${order.buyerPhone ? `Telefone: ${order.buyerPhone}` : ''}

🎁 <b>Itens:</b>
${itemsList}

💰 <b>Total: R$ ${order.total.toFixed(2)}</b>

⏰ ${new Date().toLocaleString('pt-BR')}

🔗 Acesse o admin para aprovar:
${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders
`.trim();
}

// Send Email notification
export async function sendEmailNotification(order: OrderNotification): Promise<boolean> {
	const resendApiKey = process.env.RESEND_API_KEY;

	if (!resendApiKey) {
		console.log('Resend not configured, skipping email notification');
		return false;
	}

	try {
		const { Resend } = await import('resend');
		const resend = new Resend(resendApiKey);

		const itemsList = order.items
			.map(
				(item) => `
				<tr>
					<td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}x ${item.name}</td>
					<td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
				</tr>
			`
			)
			.join('');

		const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
	<div style="background: #171717; color: #FAF8F5; padding: 20px; text-align: center;">
		<h1 style="margin: 0;">🎁 Novo Pedido Recebido</h1>
	</div>

	<div style="background: #fff; padding: 20px; border: 1px solid #eee;">
		<h2 style="color: #171717; margin-top: 0;">Pedido #${order.orderNumber}</h2>

		<div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #171717;">
			<h3 style="margin: 0 0 10px 0; color: #171717;">Comprador</h3>
			<p style="margin: 5px 0;"><strong>Nome:</strong> ${order.buyerName}</p>
			<p style="margin: 5px 0;"><strong>Email:</strong> ${order.buyerEmail}</p>
			${order.buyerPhone ? `<p style="margin: 5px 0;"><strong>Telefone:</strong> ${order.buyerPhone}</p>` : ''}
		</div>

		<h3 style="color: #171717;">Itens do Pedido</h3>
		<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
			${itemsList}
			<tr style="background: #171717; color: #FAF8F5;">
				<td style="padding: 12px; font-weight: bold;">TOTAL</td>
				<td style="padding: 12px; text-align: right; font-weight: bold;">R$ ${order.total.toFixed(2)}</td>
			</tr>
		</table>

		<div style="margin-top: 30px; padding: 20px; background: #f9f9f9; text-align: center;">
			<p style="margin: 0 0 15px 0;">Acesse o painel para aprovar ou rejeitar este pedido:</p>
			<a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders"
			   style="display: inline-block; padding: 12px 30px; background: #171717; color: #FAF8F5; text-decoration: none; font-weight: bold;">
				Ver Pedidos Pendentes
			</a>
		</div>

		<p style="margin-top: 20px; color: #999; font-size: 12px; text-align: center;">
			${new Date().toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
		</p>
	</div>
</body>
</html>
		`;

		const { data, error } = await resend.emails.send({
			from: 'Casamento Julia & Rafael <noreply@' + (process.env.RESEND_DOMAIN || 'resend.dev') + '>',
			to: [process.env.ADMIN_EMAIL || 'rafaelfelipe501@gmail.com'],
			subject: `🎁 Novo pedido #${order.orderNumber} - R$ ${order.total.toFixed(2)}`,
			html,
		});

		if (error) {
			console.error('❌ Email error:', error);
			return false;
		}

		console.log('✅ Email notification sent:', data);
		return true;
	} catch (error) {
		console.error('Error sending email notification:', error);
		return false;
	}
}

// Send both notifications
export async function sendOrderNotifications(order: OrderNotification): Promise<void> {
	console.log('=== SENDING ORDER NOTIFICATIONS ===');

	// Send in parallel
	const [telegramSent, emailSent] = await Promise.all([
		sendTelegramNotification(order),
		sendEmailNotification(order),
	]);

	console.log('Notification results:', {
		telegram: telegramSent ? '✅ Sent' : '❌ Failed',
		email: emailSent ? '✅ Sent' : '❌ Failed',
	});

	if (!telegramSent && !emailSent) {
		console.warn('⚠️ No notifications were sent! Check configuration.');
	}
}
