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
		const { orderId, adminPassword, reason } = req.body;

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

		if (order.status === 'cancelled') {
			return res.status(400).json({ error: 'Order already cancelled' });
		}

		if (order.status === 'confirmed') {
			return res.status(400).json({ error: 'Cannot cancel a confirmed order' });
		}

		// Update order status to cancelled
		const { error: updateError } = await supabase
			.from('gift_orders')
			.update({
				status: 'cancelled',
				notes: reason || 'Cancelled by admin',
			})
			.eq('id', orderId);

		if (updateError) {
			return res.status(500).json({ error: 'Failed to cancel order' });
		}

		// Release reserved items back to inventory
		const items = order.items as any;

		console.log('=== REJECT ORDER DEBUG ===');
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

			console.log(`Updating gift ${giftId}:`, {
				itemName: item.name || giftId,
				quantityToRelease: quantity,
				currentReserved: gift.reserved,
				newReserved: newReserved,
				willChange: gift.reserved !== newReserved
			});

			const { data: updateData, error: updateError } = await supabase
				.from('gifts')
				.update({
					reserved: newReserved,
				})
				.eq('id', giftId)
				.select();

			if (updateError) {
				console.error(`❌ Error updating gift ${giftId}:`, updateError);
			} else {
				console.log(`✅ Update query executed for gift ${giftId}. Reserved: ${gift.reserved} → ${newReserved}`);

				// Verify the update actually happened
				const { data: verifyGift } = await supabase
					.from('gifts')
					.select('id, reserved, sold, quantity')
					.eq('id', giftId)
					.single();

				if (verifyGift) {
					console.log(`🔍 Verified actual database state:`, {
						giftId: verifyGift.id,
						reserved: verifyGift.reserved,
						sold: verifyGift.sold,
						quantity: verifyGift.quantity,
						expectedReserved: newReserved,
						actuallyUpdated: verifyGift.reserved === newReserved
					});

					if (verifyGift.reserved !== newReserved) {
						console.error(`⚠️ WARNING: Database not updated! Expected ${newReserved}, got ${verifyGift.reserved}`);
					}
				}
			}
		}

		console.log('=== END REJECT DEBUG ===');

		return res.status(200).json({
			success: true,
			message: 'Order cancelled and items released back to inventory'
		});
	} catch (error) {
		console.error('Error rejecting order:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
