import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST' && req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const authHeader = req.headers['authorization'];
	const cronSecret = process.env.CRON_SECRET;
	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const resendKey = process.env.RESEND_API_KEY;
	const backupEmail = process.env.BACKUP_EMAIL;
	if (!resendKey || !backupEmail) {
		return res.status(500).json({ error: 'RESEND_API_KEY ou BACKUP_EMAIL não configurados' });
	}

	try {
		const [{ data: rsvps, error: rsvpError }, { data: orders, error: ordersError }, { data: gifts, error: giftsError }] = await Promise.all([
			supabase.from('rsvp').select('*').order('created_at', { ascending: false }),
			supabase.from('gift_orders').select('*').order('created_at', { ascending: false }),
			supabase.from('gifts').select('*').order('name'),
		]);

		if (rsvpError) throw rsvpError;
		if (ordersError) throw ordersError;
		if (giftsError) throw giftsError;

		const payload = {
			generatedAt: new Date().toISOString(),
			counts: {
				rsvp: rsvps?.length ?? 0,
				orders: orders?.length ?? 0,
				gifts: gifts?.length ?? 0,
			},
			rsvp: rsvps ?? [],
			orders: orders ?? [],
			gifts: gifts ?? [],
		};

		const json = JSON.stringify(payload, null, 2);
		const base64 = Buffer.from(json, 'utf8').toString('base64');
		const dateStr = new Date().toISOString().slice(0, 10);

		const resend = new Resend(resendKey);
		const { error: emailError } = await resend.emails.send({
			from: process.env.BACKUP_FROM || 'Wedding Backup <onboarding@resend.dev>',
			to: backupEmail,
			subject: `Backup do site do casamento — ${dateStr}`,
			text: `Backup automático.\n\nRSVPs: ${payload.counts.rsvp}\nPedidos: ${payload.counts.orders}\nPresentes: ${payload.counts.gifts}\n\nJSON em anexo.`,
			attachments: [
				{
					filename: `wedding-backup-${dateStr}.json`,
					content: base64,
				},
			],
		});

		if (emailError) {
			console.error('Resend error:', emailError);
			return res.status(500).json({ error: 'Falha ao enviar e-mail', details: emailError });
		}

		return res.status(200).json({ success: true, counts: payload.counts });
	} catch (error) {
		console.error('Backup error:', error);
		return res.status(500).json({ error: 'Erro ao gerar backup' });
	}
}
