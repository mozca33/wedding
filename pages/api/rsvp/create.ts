import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

	const ip = getClientIp(req);
	const limit = await checkRateLimit({ key: `rsvp:${ip}`, max: 5, windowSeconds: 60 });
	if (!limit.allowed) {
		res.setHeader('Retry-After', String(limit.retryAfterSeconds));
		return res.status(429).json({ error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' });
	}

	const { name, phone, message } = req.body ?? {};

	if (typeof name !== 'string' || name.trim().length < 2) {
		return res.status(400).json({ error: 'Nome inválido' });
	}
	if (phone && typeof phone !== 'string') {
		return res.status(400).json({ error: 'Telefone inválido' });
	}
	if (message && typeof message !== 'string') {
		return res.status(400).json({ error: 'Mensagem inválida' });
	}

	const trimmedName = name.trim().slice(0, 120);
	const trimmedPhone = phone ? String(phone).trim().slice(0, 32) : null;
	const trimmedMessage = message ? String(message).trim().slice(0, 2000) : null;

	const { error } = await supabase.from('rsvp').insert({
		name: trimmedName,
		phone: trimmedPhone,
		message: trimmedMessage,
		confirmed: true,
	});

	if (error) {
		console.error('RSVP insert error:', error);
		return res.status(500).json({ error: 'Erro ao salvar confirmação' });
	}

	try {
		const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
		await fetch(`${base}/api/notify-whatsapp`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: trimmedName, phone: trimmedPhone, message: trimmedMessage }),
		});
	} catch (notifyError) {
		console.error('Notify error (non-fatal):', notifyError);
	}

	return res.status(200).json({ success: true });
}
