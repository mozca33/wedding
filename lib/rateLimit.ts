import type { NextApiRequest } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export function getClientIp(req: NextApiRequest): string {
	const xff = req.headers['x-forwarded-for'];
	if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
	if (Array.isArray(xff) && xff.length > 0) return xff[0];
	return req.socket?.remoteAddress || 'unknown';
}

export interface RateLimitOptions {
	key: string;
	max: number;
	windowSeconds: number;
}

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	retryAfterSeconds: number;
}

export async function checkRateLimit({ key, max, windowSeconds }: RateLimitOptions): Promise<RateLimitResult> {
	const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

	const { count, error } = await supabase
		.from('rate_limits')
		.select('*', { count: 'exact', head: true })
		.eq('key', key)
		.gte('created_at', since);

	if (error) {
		console.error('Rate limit query error (fail-open):', error);
		return { allowed: true, remaining: max, retryAfterSeconds: 0 };
	}

	const used = count ?? 0;
	if (used >= max) {
		return { allowed: false, remaining: 0, retryAfterSeconds: windowSeconds };
	}

	await supabase.from('rate_limits').insert({ key }).then(({ error: insertError }) => {
		if (insertError) console.error('Rate limit insert error:', insertError);
	});

	return { allowed: true, remaining: max - used - 1, retryAfterSeconds: 0 };
}
