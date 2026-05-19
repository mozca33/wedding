import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST' && req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	// Protect the route: only Vercel Cron or admin can call this
	const authHeader = req.headers['authorization'];
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		// Find all pending orders older than 7 days
		const { data: expiredOrders, error: fetchError } = await supabase
			.from('gift_orders')
			.select('*')
			.eq('status', 'pending')
			.lt('created_at', sevenDaysAgo.toISOString());

		if (fetchError) {
			console.error('Error fetching expired orders:', fetchError);
			return res.status(500).json({ error: 'Failed to fetch expired orders' });
		}

		if (!expiredOrders || expiredOrders.length === 0) {
			console.log('No expired orders found.');
			return res.status(200).json({ success: true, cancelled: 0, message: 'No expired orders found' });
		}

		console.log(`Found ${expiredOrders.length} expired order(s) to cancel.`);

		let cancelledCount = 0;

		for (const order of expiredOrders) {
			const items = Array.isArray(order.items) ? order.items : [order.items];

			// Release reserved quantities for each gift
			for (const item of items) {
				const giftId = item.giftId || item.id;
				const quantity = parseInt(item.quantity) || 1;

				if (!giftId) continue;

				const { data: gift, error: giftError } = await supabase
					.from('gifts')
					.select('id, reserved')
					.eq('id', giftId)
					.single();

				if (giftError || !gift) {
					console.error(`Gift ${giftId} not found, skipping.`);
					continue;
				}

				const newReserved = Math.max(0, gift.reserved - quantity);

				const { error: updateError } = await supabase
					.from('gifts')
					.update({ reserved: newReserved })
					.eq('id', giftId);

				if (updateError) {
					console.error(`Error releasing reservation for gift ${giftId}:`, updateError);
				} else {
					console.log(`Released ${quantity} reservation(s) for gift ${giftId}. Reserved: ${gift.reserved} → ${newReserved}`);
				}
			}

			// Cancel the order
			const { error: cancelError } = await supabase
				.from('gift_orders')
				.update({
					status: 'cancelled',
					notes: 'Cancelado automaticamente por inatividade (7 dias sem pagamento)',
				})
				.eq('id', order.id);

			if (cancelError) {
				console.error(`Error cancelling order ${order.order_number}:`, cancelError);
			} else {
				console.log(`Cancelled order ${order.order_number}`);
				cancelledCount++;
			}
		}

		return res.status(200).json({
			success: true,
			cancelled: cancelledCount,
			message: `${cancelledCount} pedido(s) expirado(s) cancelado(s) e reservas liberadas.`,
		});
	} catch (error) {
		console.error('Cleanup error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
