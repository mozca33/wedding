// hooks/useGifts.ts
import { useState, useEffect, useCallback } from 'react';
import { Gift, GiftCategoryType } from '@/lib/types';
import { fetchGifts, giftCategories } from '@/lib/gifts-data';
import { supabase } from '@/lib/supabase';

export const useGifts = () => {
	const [gifts, setGifts] = useState<Gift[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Carregar presentes do Supabase
	const loadGifts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchGifts();
			setGifts(data);
			setIsLoaded(true);
		} catch (err) {
			console.error('Erro ao carregar presentes:', err);
			setError('Erro ao carregar presentes');
		} finally {
			setLoading(false);
		}
	}, []);

	// Carregar ao montar o componente
	useEffect(() => {
		loadGifts();
	}, [loadGifts]);

	// Escutar mudanças em tempo real no Supabase
	useEffect(() => {
		const channel = supabase
			.channel('gifts-changes')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'gifts' },
				(payload) => {
					if (payload.eventType === 'UPDATE') {
						const updated = payload.new as any;
						setGifts((prev) =>
							prev.map((gift) =>
								gift.id === updated.id
									? {
											...gift,
											reserved: updated.reserved,
											sold: updated.sold,
											quantity: updated.quantity,
									  }
									: gift
							)
						);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	// Reservar um presente (adicionar ao carrinho)
	const reserveGift = useCallback(async (giftId: string, quantity: number = 1) => {
		// Atualização otimista local
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

		// Atualizar no Supabase
		const gift = gifts.find((g) => g.id === giftId);
		if (gift) {
			const { error } = await supabase
				.from('gifts')
				.update({ reserved: gift.reserved + quantity })
				.eq('id', giftId);

			if (error) {
				console.error('Erro ao reservar presente:', error);
				// Reverter em caso de erro
				loadGifts();
			}
		}
	}, [gifts, loadGifts]);

	// Liberar reserva (remover do carrinho)
	const releaseReservation = useCallback(async (giftId: string, quantity: number = 1) => {
		// Atualização otimista local
		setGifts((prev) =>
			prev.map((gift) => {
				if (gift.id === giftId && gift.reserved >= quantity) {
					return { ...gift, reserved: gift.reserved - quantity };
				}
				return gift;
			})
		);

		// Atualizar no Supabase
		const gift = gifts.find((g) => g.id === giftId);
		if (gift && gift.reserved >= quantity) {
			const { error } = await supabase
				.from('gifts')
				.update({ reserved: Math.max(0, gift.reserved - quantity) })
				.eq('id', giftId);

			if (error) {
				console.error('Erro ao liberar reserva:', error);
				loadGifts();
			}
		}
	}, [gifts, loadGifts]);

	// Confirmar venda (após pagamento confirmado)
	const confirmSale = useCallback(async (giftId: string, quantity: number = 1) => {
		// Atualização otimista local
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

		// Atualizar no Supabase
		const gift = gifts.find((g) => g.id === giftId);
		if (gift) {
			const { error } = await supabase
				.from('gifts')
				.update({
					reserved: Math.max(0, gift.reserved - quantity),
					sold: gift.sold + quantity,
				})
				.eq('id', giftId);

			if (error) {
				console.error('Erro ao confirmar venda:', error);
				loadGifts();
			}
		}
	}, [gifts, loadGifts]);

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

	// Recarregar presentes do Supabase
	const refreshGifts = useCallback(() => {
		loadGifts();
	}, [loadGifts]);

	return {
		gifts,
		categories: giftCategories,
		isLoaded,
		loading,
		error,
		reserveGift,
		releaseReservation,
		confirmSale,
		getAvailableQuantity,
		getGiftsByCategory,
		getGiftById,
		getGiftStats,
		refreshGifts,
	};
};
