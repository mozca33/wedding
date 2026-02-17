import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { adminPassword } = req.query;

		// Simple admin auth check
		if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// Fetch all orders
		const { data: orders, error } = await supabase
			.from('gift_orders')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Database error:', error);
			return res.status(500).json({ error: 'Failed to fetch orders' });
		}

		return res.status(200).json({ orders });
	} catch (error) {
		console.error('Error fetching orders:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
