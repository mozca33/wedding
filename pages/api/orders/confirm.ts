import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { orderId, adminPassword } = req.body;

		// Simple admin auth check
		if (adminPassword !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		if (!orderId) {
			return res.status(400).json({ error: 'Order ID is required' });
		}

		// Get order details
		const { data: order, error: orderError } = await supabase
			.from('gift_orders')
			.select('*')
			.eq('id', orderId)
			.single();

		if (orderError || !order) {
			return res.status(404).json({ error: 'Order not found' });
		}

		if (order.status === 'confirmed') {
			return res.status(400).json({ error: 'Order already confirmed' });
		}

		// Update order status
		const { error: updateError } = await supabase
			.from('gift_orders')
			.update({
				status: 'confirmed',
				confirmed_at: new Date().toISOString(),
			})
			.eq('id', orderId);

		if (updateError) {
			return res.status(500).json({ error: 'Failed to confirm order' });
		}

		// Move reserved items to sold
		const items = order.items as any;

		console.log('=== CONFIRM ORDER DEBUG ===');
		console.log('Order number:', order.order_number);
		console.log('Order items (raw):', JSON.stringify(items, null, 2));

		// Handle both array and object formats
		const itemsArray = Array.isArray(items) ? items : [items];

		for (const item of itemsArray) {
			// Try both giftId and id field names
			const giftId = item.giftId || item.id;
			const quantity = parseInt(item.quantity) || 1;

			if (!giftId) {
				console.error('Item missing giftId:', item);
				continue;
			}

			console.log(`Processing gift ${giftId}, quantity: ${quantity}`);

			const { data: gift, error: giftError } = await supabase
				.from('gifts')
				.select('id, reserved, sold, quantity')
				.eq('id', giftId)
				.single();

			if (giftError) {
				console.error(`Error fetching gift ${giftId}:`, giftError);
				continue;
			}

			if (!gift) {
				console.error(`Gift ${giftId} not found in database`);
				continue;
			}

			const newReserved = Math.max(0, gift.reserved - quantity);
			const newSold = gift.sold + quantity;

			console.log(`Updating gift ${giftId}:`, {
				itemName: item.name || giftId,
				quantityToConfirm: quantity,
				currentReserved: gift.reserved,
				currentSold: gift.sold,
				newReserved: newReserved,
				newSold: newSold
			});

			const { error: updateError } = await supabase
				.from('gifts')
				.update({
					reserved: newReserved,
					sold: newSold,
				})
				.eq('id', giftId);

			if (updateError) {
				console.error(`Error updating gift ${giftId}:`, updateError);
			} else {
				console.log(`✅ Successfully confirmed ${quantity} of gift ${giftId}. Reserved: ${gift.reserved} → ${newReserved}, Sold: ${gift.sold} → ${newSold}`);
			}
		}

		console.log('=== END CONFIRM DEBUG ===');

		return res.status(200).json({ success: true, message: 'Order confirmed successfully' });
	} catch (error) {
		console.error('Error confirming order:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
