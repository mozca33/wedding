// lib/gifts-data.ts
// Dados dos presentes - será substituído pelos dados da planilha
import { Gift, GiftCategory, GiftCategoryType } from './types';

export const giftCategories: GiftCategory[] = [
	{ id: 'cozinha', name: 'Cozinha', icon: '🍳' },
	{ id: 'banheiro', name: 'Banheiro', icon: '🚿' },
	{ id: 'limpeza', name: 'Limpeza', icon: '🧹' },
	{ id: 'cama-banho', name: 'Cama e Banho', icon: '🛏️' },
];

// Produtos de exemplo - substituir pelos dados reais da planilha
export const initialGifts: Gift[] = [
	// Cozinha
	{
		id: 'coz-001',
		category: 'cozinha',
		name: 'Jogo de Panelas Antiaderente',
		price: 299.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'coz-002',
		category: 'cozinha',
		name: 'Liquidificador',
		price: 189.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'coz-003',
		category: 'cozinha',
		name: 'Air Fryer',
		price: 449.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'coz-004',
		category: 'cozinha',
		name: 'Jogo de Talheres 24 peças',
		price: 129.90,
		quantity: 2,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	// Banheiro
	{
		id: 'ban-001',
		category: 'banheiro',
		name: 'Jogo de Toalhas',
		price: 89.90,
		quantity: 3,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'ban-002',
		category: 'banheiro',
		name: 'Organizador de Banheiro',
		price: 59.90,
		quantity: 2,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	// Limpeza
	{
		id: 'lim-001',
		category: 'limpeza',
		name: 'Aspirador de Pó',
		price: 349.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'lim-002',
		category: 'limpeza',
		name: 'Vassoura Elétrica',
		price: 199.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	// Cama e Banho
	{
		id: 'cab-001',
		category: 'cama-banho',
		name: 'Jogo de Cama Queen',
		price: 199.90,
		quantity: 2,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'cab-002',
		category: 'cama-banho',
		name: 'Edredom',
		price: 249.90,
		quantity: 1,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
	{
		id: 'cab-003',
		category: 'cama-banho',
		name: 'Travesseiro de Plumas',
		price: 129.90,
		quantity: 4,
		image: '/images/gifts/placeholder.jpg',
		reserved: 0,
		sold: 0,
	},
];

export const getCategoryName = (categoryId: GiftCategoryType): string => {
	const category = giftCategories.find((c) => c.id === categoryId);
	return category?.name || categoryId;
};

export const getCategoryIcon = (categoryId: GiftCategoryType): string => {
	const category = giftCategories.find((c) => c.id === categoryId);
	return category?.icon || '🎁';
};
