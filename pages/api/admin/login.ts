import type { NextApiRequest, NextApiResponse } from 'next';
import { setAdminCookie, clearAdminCookie, isAdmin } from '@/lib/adminAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		return res.status(200).json({ isAdmin: isAdmin(req) });
	}

	if (req.method === 'POST') {
		const password = (req.body && req.body.password) || '';
		const expected = process.env.ADMIN_PASSWORD;
		if (!expected) {
			return res.status(500).json({ error: 'ADMIN_PASSWORD não configurada no servidor' });
		}
		if (typeof password !== 'string' || password.length === 0 || password !== expected) {
			return res.status(401).json({ error: 'Senha inválida' });
		}
		setAdminCookie(res);
		return res.status(200).json({ success: true });
	}

	if (req.method === 'DELETE') {
		clearAdminCookie(res);
		return res.status(200).json({ success: true });
	}

	return res.status(405).json({ error: 'Method not allowed' });
}
