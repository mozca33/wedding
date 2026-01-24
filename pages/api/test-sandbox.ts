// pages/api/simple-test.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const myWhatsAppNumber = process.env.MY_WHATSAPP_NUMBER;

	console.log('🧪 Teste Simples:');
	console.log('- Account SID:', accountSid?.substring(0, 10) + '...');
	console.log('- Auth Token:', authToken ? 'Configurado' : 'Não configurado');
	console.log('- Meu WhatsApp:', myWhatsAppNumber);

	if (!accountSid || !authToken || !myWhatsAppNumber) {
		return res.status(400).json({
			error: 'Configuração incompleta',
			check: {
				accountSid: !!accountSid,
				authToken: !!authToken,
				myWhatsAppNumber: !!myWhatsAppNumber,
			},
		});
	}

	try {
		// ✅ Tentar enviar mensagem diretamente
		const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

		console.log('📤 Enviando mensagem de teste...');

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				From: 'whatsapp:+14155238886', // Sandbox padrão
				To: myWhatsAppNumber,
				Body:
					'🧪 **TESTE DIRETO**\n\nSe você recebeu esta mensagem, suas credenciais Twilio estão funcionando!\n\n✅ Sandbox ativo\n⏰ ' +
					new Date().toLocaleString('pt-BR'),
			}),
		});

		const result = await response.json();

		console.log('📋 Resposta Twilio:', result);

		if (!response.ok) {
			return res.status(400).json({
				error: 'Erro do Twilio',
				code: result.code,
				message: result.message,
				details: result,
				solutions: {
					'20008': 'Conta Trial - funcionalidade limitada, mas mensagens devem funcionar',
					'63007': 'Sandbox não ativado - envie "join down-friend" para +14155238886',
					'21211': 'Número inválido - verifique formato whatsapp:+5562994776888',
					'20003': 'Credenciais inválidas',
				},
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Mensagem enviada com sucesso!',
			messageSid: result.sid,
			account_type: 'Trial (limitado mas funcional)',
			from: 'whatsapp:+14155238886',
			to: myWhatsAppNumber,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('❌ Erro:', error);
		return res.status(500).json({
			error: 'Erro de conexão',
			details: String(error),
		});
	}
}
