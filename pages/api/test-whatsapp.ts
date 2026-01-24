// pages/api/test-whatsapp.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
	const myWhatsAppNumber = process.env.MY_WHATSAPP_NUMBER;

	if (!accountSid || !authToken || !myWhatsAppNumber) {
		return res.status(400).json({ error: 'Configuração Twilio incompleta' });
	}

	try {
		const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				From: twilioWhatsAppNumber,
				To: myWhatsAppNumber,
				Body: '🧪 Teste de configuração WhatsApp - Funcionando! ✅',
			}),
		});

		const result = await response.json();

		if (!response.ok) {
			return res.status(400).json({ error: 'Erro Twilio', details: result });
		}

		return res.status(200).json({
			success: true,
			message: 'Teste enviado com sucesso!',
			messageSid: result.sid,
		});
	} catch (error) {
		return res.status(500).json({ error: 'Erro interno', details: error });
	}
}
