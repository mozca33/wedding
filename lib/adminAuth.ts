import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 60 * 60 * 24; // 24h

const getSecret = () =>
	process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';

const sign = (value: string) => {
	const hmac = crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
	return `${value}.${hmac}`;
};

const verify = (token: string): string | null => {
	const idx = token.lastIndexOf('.');
	if (idx === -1) return null;
	const value = token.slice(0, idx);
	const sig = token.slice(idx + 1);
	const expected = crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
	try {
		if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
	} catch {
		return null;
	}
	return value;
};

export function setAdminCookie(res: NextApiResponse) {
	const token = sign(String(Date.now()));
	const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
	res.setHeader(
		'Set-Cookie',
		`${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax;${secure}`
	);
}

export function clearAdminCookie(res: NextApiResponse) {
	const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
	res.setHeader(
		'Set-Cookie',
		`${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;${secure}`
	);
}

export function isAdmin(req: NextApiRequest): boolean {
	if (!getSecret()) return false;
	const cookies = req.headers.cookie || '';
	const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
	if (!match) return false;
	const value = verify(match[1]);
	if (!value) return false;
	const ts = parseInt(value, 10);
	if (isNaN(ts)) return false;
	return Date.now() - ts < MAX_AGE * 1000;
}

export function requireAdmin(req: NextApiRequest, res: NextApiResponse): boolean {
	if (!isAdmin(req)) {
		res.status(401).json({ error: 'Unauthorized' });
		return false;
	}
	return true;
}
