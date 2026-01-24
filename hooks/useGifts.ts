// hooks/useGifts.ts
import { useState, useEffect, useCallback } from 'react';
import { Gift, GiftCategoryType } from '@/lib/types';
import { initialGifts, giftCategories } from '@/lib/gifts-data';

const GIFTS_STORAGE_KEY = 'wedding-gifts-state';

export const useGifts = () => {
	const [gifts, setGifts] = useState<Gift[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	// Carregar estado dos presentes do localStorage (ou usar inicial)
	useEffect(() => {
		setLoading(true);
		const savedGifts = localStorage.getItem(GIFTS_STORAGE_KEY);
		if (savedGifts) {
			try {
				setGifts(JSON.parse(savedGifts));
			} catch {
				setGifts(initialGifts);
			}
		} else {
			setGifts(initialGifts);
		}
		setIsLoaded(true);
		setLoading(false);
	}, []);

	// Salvar estado no localStorage
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(gifts));
		}
	}, [gifts, isLoaded]);

	// Reservar um presente (adicionar ao carrinho)
	const reserveGift = useCallback((giftId: string, quantity: number = 1) => {
		setGifts((prev) =>
			prev.map((gift) => {
				if (gift.id === giftId) {
					const available = gift.quantity - gift.reserved - gift.sold;
					if (available >= quantity) {
						return { ...gift, reserved: gift.reserved + quantity };
					}
				}
				return gift;
			})
		);
	}, []);

	// Liberar reserva (remover do carrinho)
	const releaseReservation = useCallback((giftId: string, quantity: number = 1) => {
		setGifts((prev) =>
			prev.map((gift) => {
				if (gift.id === giftId && gift.reserved >= quantity) {
					return { ...gift, reserved: gift.reserved - quantity };
				}
				return gift;
			})
		);
	}, []);

	// Confirmar venda (após pagamento confirmado)
	const confirmSale = useCallback((giftId: string, quantity: number = 1) => {
		setGifts((prev) =>
			prev.map((gift) => {
				if (gift.id === giftId) {
					return {
						...gift,
						reserved: Math.max(0, gift.reserved - quantity),
						sold: gift.sold + quantity,
					};
				}
				return gift;
			})
		);
	}, []);

	// Verificar disponibilidade
	const getAvailableQuantity = useCallback(
		(giftId: string): number => {
			const gift = gifts.find((g) => g.id === giftId);
			if (!gift) return 0;
			return gift.quantity - gift.reserved - gift.sold;
		},
		[gifts]
	);

	// Obter presentes por categoria
	const getGiftsByCategory = useCallback(
		(category: GiftCategoryType): Gift[] => {
			return gifts.filter((g) => g.category === category);
		},
		[gifts]
	);

	// Obter presente por ID
	const getGiftById = useCallback(
		(giftId: string): Gift | undefined => {
			return gifts.find((g) => g.id === giftId);
		},
		[gifts]
	);

	// Estatísticas
	const getGiftStats = useCallback(() => {
		const total = gifts.reduce((sum, g) => sum + g.quantity, 0);
		const sold = gifts.reduce((sum, g) => sum + g.sold, 0);
		const reserved = gifts.reduce((sum, g) => sum + g.reserved, 0);
		const available = total - sold - reserved;

		return {
			total,
			sold,
			reserved,
			available,
			percentage: total > 0 ? Math.round((sold / total) * 100) : 0,
		};
	}, [gifts]);

	// Resetar para estado inicial (útil para desenvolvimento)
	const resetGifts = useCallback(() => {
		setGifts(initialGifts);
		localStorage.removeItem(GIFTS_STORAGE_KEY);
	}, []);

	return {
		gifts,
		categories: giftCategories,
		isLoaded,
		loading,
		reserveGift,
		releaseReservation,
		confirmSale,
		getAvailableQuantity,
		getGiftsByCategory,
		getGiftById,
		getGiftStats,
		resetGifts,
	};
};
