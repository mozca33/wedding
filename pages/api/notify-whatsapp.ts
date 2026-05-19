import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

interface RSVPNotification {
	name: string;
	phone?: string;
	message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const data: RSVPNotification = req.body;

	if (!data.name) {
		return res.status(400).json({ error: 'Nome é obrigatório' });
	}

	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const twilioWhatsAppNumber = 'whatsapp:+14155238886'; // Sandbox
	const myWhatsAppNumber = process.env.MY_WHATSAPP_NUMBER;

	if (!accountSid || !authToken || !myWhatsAppNumber) {
		console.warn('⚠️ Twilio não configurado completamente');
		return res.status(200).json({
			success: true,
			warning: 'WhatsApp não configurado',
			rsvp_saved: true,
		});
	}

	// Garantir que o número de destino tenha o prefixo correto
	const formattedMyNumber = myWhatsAppNumber.startsWith('whatsapp:') ? myWhatsAppNumber : `whatsapp:${myWhatsAppNumber}`;

	// Validar que From e To são diferentes
	if (twilioWhatsAppNumber === formattedMyNumber) {
		console.error('❌ Erro de configuração: MY_WHATSAPP_NUMBER não pode ser igual ao número do Twilio Sandbox');
		return res.status(200).json({
			success: true,
			rsvp_saved: true,
			whatsapp_error: 'Configuração inválida: números From e To são iguais',
			troubleshooting: 'Configure MY_WHATSAPP_NUMBER com seu número pessoal (ex: whatsapp:+5511999999999)',
			warning: 'RSVP salvo, mas notificação WhatsApp falhou',
		});
	}

	let totalConfirmations = 1;
	try {
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseKey) {
			console.warn('⚠️ Supabase não configurado para contagem');
		} else {
			const supabase = createClient(supabaseUrl, supabaseKey);

			const { count, error } = await supabase
				.from('rsvp')
				.select('*', { count: 'exact', head: true });

			if (error) {
				console.error('❌ Erro na query de contagem:', error);
			} else {
				totalConfirmations = count ?? 1;
				console.log('📊 Total de confirmações no banco:', totalConfirmations);
			}
		}
	} catch (error) {
		console.warn('⚠️ Erro ao contar confirmações:', error);
	}

	const whatsappMessage = `🎉 *NOVA CONFIRMAÇÃO RSVP!*

👤 **${data.name}**
📱 ${data.phone || 'Não informado'}
${data.message ? `💬 **Mensagem:**\n   "${data.message}"\n` : ''}
⏰ **Confirmado em:** ${new Date().toLocaleString('pt-BR')}

📊 *Total de confirmações: ${totalConfirmations}*

---
*Sistema de RSVP automático*`;

	try {
		const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

		console.log('📤 Enviando WhatsApp...');
		console.log('- From:', twilioWhatsAppNumber);
		console.log('- To:', formattedMyNumber);
		console.log('- Para:', data.name);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				From: twilioWhatsAppNumber,
				To: formattedMyNumber,
				Body: whatsappMessage,
			}),
		});

		const result = await response.json();

		if (!response.ok) {
			console.error('❌ Erro Twilio:', result);

			let troubleshooting = 'Erro de configuração Twilio';
			if (result.code === 63007) {
				troubleshooting = 'Verifique se enviou "join down-friend" para +14155238886';
			} else if (result.code === 63031) {
				troubleshooting = 'Os números From e To são iguais. Configure MY_WHATSAPP_NUMBER com seu número pessoal (ex: whatsapp:+5511999999999)';
			}

			return res.status(200).json({
				success: true,
				rsvp_saved: true,
				whatsapp_error: `${result.code}: ${result.message}`,
				troubleshooting,
				warning: 'RSVP salvo, mas notificação WhatsApp falhou',
			});
		}

		console.log('✅ WhatsApp enviado! SID:', result.sid);

		return res.status(200).json({
			success: true,
			rsvp_saved: true,
			whatsapp_sent: true,
			messageSid: result.sid,
		});
	} catch (error) {
		console.error('❌ Erro de conexão:', error);

		return res.status(200).json({
			success: true,
			rsvp_saved: true,
			whatsapp_error: 'Erro de conexão',
			warning: 'RSVP salvo, mas notificação WhatsApp falhou',
		});
	}
}
