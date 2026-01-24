// hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/lib/types';

const CART_STORAGE_KEY = 'wedding-gift-cart';

export const useCart = () => {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Carregar carrinho do localStorage
	useEffect(() => {
		const savedCart = localStorage.getItem(CART_STORAGE_KEY);
		if (savedCart) {
			try {
				setItems(JSON.parse(savedCart));
			} catch {
				console.error('Erro ao carregar carrinho');
			}
		}
		setIsLoaded(true);
	}, []);

	// Salvar carrinho no localStorage
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
		}
	}, [items, isLoaded]);

	const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
		setItems((prev) => {
			const existingItem = prev.find((i) => i.giftId === item.giftId);
			if (existingItem) {
				return prev.map((i) =>
					i.giftId === item.giftId ? { ...i, quantity: i.quantity + 1 } : i
				);
			}
			return [...prev, { ...item, quantity: 1 }];
		});
	}, []);

	const removeItem = useCallback((giftId: string) => {
		setItems((prev) => prev.filter((i) => i.giftId !== giftId));
	}, []);

	const updateQuantity = useCallback((giftId: string, quantity: number) => {
		if (quantity <= 0) {
			setItems((prev) => prev.filter((i) => i.giftId !== giftId));
		} else {
			setItems((prev) =>
				prev.map((i) => (i.giftId === giftId ? { ...i, quantity } : i))
			);
		}
	}, []);

	const decrementItem = useCallback((giftId: string) => {
		setItems((prev) => {
			const item = prev.find((i) => i.giftId === giftId);
			if (item && item.quantity > 1) {
				return prev.map((i) =>
					i.giftId === giftId ? { ...i, quantity: i.quantity - 1 } : i
				);
			}
			return prev.filter((i) => i.giftId !== giftId);
		});
	}, []);

	const clearCart = useCallback(() => {
		setItems([]);
	}, []);

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	return {
		items,
		isLoaded,
		addItem,
		removeItem,
		updateQuantity,
		decrementItem,
		clearCart,
		totalItems,
		totalPrice,
	};
};
