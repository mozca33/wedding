import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { createStaticPix } from 'pix-utils';
import QRCode from 'qrcode';
import { sendOrderNotifications } from '@/lib/notifications';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateOrderRequest {
	items: Array<{
		giftId: string;
		name: string;
		price: number;
		quantity: number;
	}>;
	buyerName: string;
	buyerEmail: string;
	buyerPhone?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { items, buyerName, buyerEmail, buyerPhone }: CreateOrderRequest = req.body;

		// Validate input
		if (!items || items.length === 0 || !buyerName || !buyerEmail) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		console.log('=== CREATE ORDER - AVAILABILITY CHECK ===');
		console.log('Requested items:', items);

		// STEP 1: Check availability of all items BEFORE creating order
		const availabilityIssues: Array<{ giftId: string; name: string; requested: number; available: number }> = [];

		for (const item of items) {
			const { data: gift, error: giftError } = await supabase
				.from('gifts')
				.select('id, name, quantity, reserved, sold')
				.eq('id', item.giftId)
				.single();

			if (giftError || !gift) {
				console.error(`Gift ${item.giftId} not found`);
				return res.status(404).json({ error: `Gift ${item.name} not found` });
			}

			const available = gift.quantity - gift.reserved - gift.sold;

			console.log(`Checking ${gift.name}:`, {
				requested: item.quantity,
				available,
				total: gift.quantity,
				reserved: gift.reserved,
				sold: gift.sold
			});

			if (available < item.quantity) {
				availabilityIssues.push({
					giftId: item.giftId,
					name: item.name,
					requested: item.quantity,
					available: available
				});
			}
		}

		// If any items are not available, return error with details
		if (availabilityIssues.length > 0) {
			console.log('❌ Availability issues found:', availabilityIssues);
			return res.status(409).json({
				error: 'Some items are no longer available',
				availabilityIssues,
				message: availabilityIssues.map(issue =>
					`${issue.name}: solicitado ${issue.requested}, disponível ${issue.available}`
				).join('; ')
			});
		}

		console.log('✅ All items available, proceeding with order creation');

		// Calculate total
		const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

		// Generate unique order number
		const orderNumber = `WED-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

		// Generate PIX code
		const pixKey = process.env.NEXT_PUBLIC_PIX_KEY!;
		const pixName = process.env.NEXT_PUBLIC_PIX_NAME || 'Rafael Felipe';

		const pixPayload = createStaticPix({
			merchantName: pixName,
			merchantCity: 'Goiania',
			pixKey: pixKey,
			infoAdicional: `Pedido ${orderNumber}`,
			transactionAmount: total,
		});

		// Check if PIX generation was successful
		if ('error' in pixPayload) {
			console.error('PIX generation error:', pixPayload.error);
			return res.status(500).json({ error: 'Failed to generate PIX code' });
		}

		const pixCode = pixPayload.toBRCode();

		// Generate QR Code as base64 image
		const qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
			errorCorrectionLevel: 'M',
			margin: 1,
			width: 300,
		});

		// Create order in database
		const { data: order, error } = await supabase
			.from('gift_orders')
			.insert({
				order_number: orderNumber,
				buyer_name: buyerName,
				buyer_email: buyerEmail,
				buyer_phone: buyerPhone,
				items: items,
				total: total,
				status: 'pending',
				pix_code: pixCode,
			})
			.select()
			.single();

		if (error) {
			console.error('Database error:', error);
			return res.status(500).json({ error: 'Failed to create order' });
		}

		// STEP 2: Reserve gifts in inventory (only after order is created)
		console.log('Reserving items in inventory...');

		for (const item of items) {
			const { data: gift, error: giftError } = await supabase
				.from('gifts')
				.select('id, name, reserved')
				.eq('id', item.giftId)
				.single();

			if (giftError || !gift) {
				console.error(`Error fetching gift ${item.giftId}:`, giftError);
				continue;
			}

			const newReserved = gift.reserved + item.quantity;

			console.log(`Reserving ${item.name}:`, {
				currentReserved: gift.reserved,
				adding: item.quantity,
				newReserved
			});

			const { error: updateError } = await supabase
				.from('gifts')
				.update({ reserved: newReserved })
				.eq('id', item.giftId);

			if (updateError) {
				console.error(`Error reserving gift ${item.giftId}:`, updateError);
			} else {
				console.log(`✅ Reserved ${item.quantity}x ${item.name}`);
			}
		}

		console.log('=== ORDER CREATED SUCCESSFULLY ===');

		// Send notifications (Telegram + Email)
		try {
			await sendOrderNotifications({
				orderNumber,
				buyerName,
				buyerEmail,
				buyerPhone,
				items: items.map(item => ({
					name: item.name,
					quantity: item.quantity,
					price: item.price
				})),
				total
			});
		} catch (notificationError) {
			// Don't fail order creation if notifications fail
			console.error('Notification error (non-fatal):', notificationError);
		}

		return res.status(200).json({
			success: true,
			order: {
				id: order.id,
				orderNumber: orderNumber,
				total: total,
				pixCode: pixCode,
				qrCodeImage: qrCodeDataUrl,
			},
		});
	} catch (error) {
		console.error('Error creating order:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
