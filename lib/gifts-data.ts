// lib/gifts-data.ts
// Dados dos presentes - buscados do Supabase
import { supabase } from './supabase';
import { Gift, GiftCategory, GiftCategoryType } from './types';

export const giftCategories: GiftCategory[] = [
	{ id: 'cozinha', name: 'Cozinha', icon: '🍳' },
	{ id: 'limpeza', name: 'Limpeza', icon: '🧹' },
	{ id: 'cama-e-banho', name: 'Cama e Banho', icon: '🛏️' },
	{ id: 'para-a-vida-de-casados', name: 'Para a vida de casados', icon: '💑' },
];

// Buscar todos os presentes do Supabase
export const fetchGifts = async (): Promise<Gift[]> => {
	const { data, error } = await supabase
		.from('gifts')
		.select('*')
		.order('category')
		.order('name');

	if (error) {
		console.error('Erro ao buscar presentes:', error);
		return [];
	}

	return data.map((gift) => ({
		id: gift.id,
		category: gift.category as GiftCategoryType,
		name: gift.name,
		price: parseFloat(gift.price),
		quantity: gift.quantity,
		image: gift.image,
		reserved: gift.reserved,
		sold: gift.sold,
	}));
};

// Buscar presentes por categoria
export const fetchGiftsByCategory = async (category: GiftCategoryType): Promise<Gift[]> => {
	const { data, error } = await supabase
		.from('gifts')
		.select('*')
		.eq('category', category)
		.order('name');

	if (error) {
		console.error('Erro ao buscar presentes por categoria:', error);
		return [];
	}

	return data.map((gift) => ({
		id: gift.id,
		category: gift.category as GiftCategoryType,
		name: gift.name,
		price: parseFloat(gift.price),
		quantity: gift.quantity,
		image: gift.image,
		reserved: gift.reserved,
		sold: gift.sold,
	}));
};

// Buscar um presente específico por ID
export const fetchGiftById = async (id: string): Promise<Gift | null> => {
	const { data, error } = await supabase
		.from('gifts')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Erro ao buscar presente:', error);
		return null;
	}

	return {
		id: data.id,
		category: data.category as GiftCategoryType,
		name: data.name,
		price: parseFloat(data.price),
		quantity: data.quantity,
		image: data.image,
		reserved: data.reserved,
		sold: data.sold,
	};
};

// Atualizar quantidade reservada de um presente
export const updateGiftReserved = async (id: string, reserved: number): Promise<boolean> => {
	const { error } = await supabase
		.from('gifts')
		.update({ reserved })
		.eq('id', id);

	if (error) {
		console.error('Erro ao atualizar reserva:', error);
		return false;
	}

	return true;
};

// Atualizar quantidade vendida de um presente
export const updateGiftSold = async (id: string, sold: number): Promise<boolean> => {
	const { error } = await supabase
		.from('gifts')
		.update({ sold })
		.eq('id', id);

	if (error) {
		console.error('Erro ao atualizar vendas:', error);
		return false;
	}

	return true;
};

// Verificar disponibilidade de um presente
export const checkGiftAvailability = async (id: string, requestedQty: number): Promise<boolean> => {
	const gift = await fetchGiftById(id);
	if (!gift) return false;

	const available = gift.quantity - gift.reserved - gift.sold;
	return available >= requestedQty;
};

// Helpers para categorias
export const getCategoryName = (categoryId: GiftCategoryType): string => {
	const category = giftCategories.find((c) => c.id === categoryId);
	return category?.name || categoryId;
};

export const getCategoryIcon = (categoryId: GiftCategoryType): string => {
	const category = giftCategories.find((c) => c.id === categoryId);
	return category?.icon || '🎁';
};
