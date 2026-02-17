// pages/presentes.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ShoppingCart, Gift as GiftIcon, Plus, Minus, X, Check, Copy, RefreshCw } from 'lucide-react';
import { useGifts } from '@/hooks/useGifts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Gift, CartItem } from '@/lib/types';

// Formatar preço em BRL
const formatPrice = (value: number): string => {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
};

// Componente do Card de Presente
const GiftCard = ({ gift, onAddToCart, availableQty }: { gift: Gift; onAddToCart: (gift: Gift) => void; availableQty: number }) => {
	const isAvailable = availableQty > 0;
	const [imageError, setImageError] = useState(false);
	const hasValidImage = gift.image && !gift.image.includes('placeholder') && !imageError;

	return (
		<div
			className={`flex flex-col sm:flex-row bg-white border border-neutral-200 overflow-hidden transition-all duration-300 ${
				isAvailable ? 'hover:border-primary-500' : 'opacity-60'
			}`}
		>
			{/* Imagem */}
			<div className="relative w-full sm:w-44 h-44 sm:h-auto flex-shrink-0 bg-white">
				{hasValidImage ? (
					<Image src={gift.image} alt={gift.name} fill className="object-contain p-2" sizes="176px" onError={() => setImageError(true)} />
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<GiftIcon className="w-12 h-12 text-neutral-400" />
					</div>
				)}
				{!isAvailable && (
					<div className="absolute inset-0 bg-primary-500/70 flex items-center justify-center">
						<span className="bg-cream-100 text-primary-500 px-3 py-1 text-sm font-medium tracking-wider">Indisponível</span>
					</div>
				)}
			</div>

			{/* Informações */}
			<div className="flex-1 p-5 flex flex-col justify-between">
				<div>
					<h3 className="font-medium text-primary-500 text-lg mb-1 tracking-wide">{gift.name}</h3>
					<p className="text-2xl font-medium text-primary-500 mb-2">{formatPrice(gift.price)}</p>
					<p className="text-sm text-neutral-500">
						{isAvailable ? (
							<>
								<span className="text-primary-500 font-medium">{availableQty}</span> disponível(is)
							</>
						) : (
							<span className="text-red-500">Esgotado</span>
						)}
					</p>
				</div>

				<Button onClick={() => onAddToCart(gift)} disabled={!isAvailable} className="mt-4 w-full sm:w-auto" size="sm">
					<GiftIcon size={16} className="mr-2" />
					Dar Presente
				</Button>
			</div>
		</div>
	);
};

// Modal do Carrinho
const CartModal = ({
	isOpen,
	onClose,
	items,
	totalPrice,
	onRemoveItem,
	onUpdateQuantity,
	onCheckout,
	getAvailableQuantity,
}: {
	isOpen: boolean;
	onClose: () => void;
	items: CartItem[];
	totalPrice: number;
	onRemoveItem: (giftId: string) => void;
	onUpdateQuantity: (giftId: string, qty: number) => void;
	onCheckout: () => void;
	getAvailableQuantity: (giftId: string) => number;
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-cream-100 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-neutral-200">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-neutral-200">
					<h2 className="text-lg font-medium text-primary-500 flex items-center gap-2 tracking-wide">
						<ShoppingCart size={22} />
						Seu Carrinho
					</h2>
					<button onClick={onClose} className="p-2 hover:bg-cream-200 transition-colors">
						<X size={24} className="text-primary-500" />
					</button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-5">
					{items.length === 0 ? (
						<div className="text-center py-8 text-neutral-500">
							<ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
							<p>Seu carrinho está vazio</p>
						</div>
					) : (
						<div className="space-y-4">
							{items.map((item) => {
								const available = getAvailableQuantity(item.giftId);
								const canAddMore = available > 0;

								return (
									<div key={item.giftId} className="flex items-center gap-3 p-4 bg-white border border-neutral-200">
										<div className="relative w-16 h-16 flex-shrink-0 overflow-hidden">
											<Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-primary-500 truncate">{item.name}</h4>
											<p className="text-primary-500 font-medium">{formatPrice(item.price)}</p>
											{!canAddMore && <p className="text-xs text-red-500">Máximo atingido</p>}
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => {
													if (item.quantity === 1) {
														onRemoveItem(item.giftId);
													} else {
														onUpdateQuantity(item.giftId, item.quantity - 1);
													}
												}}
												className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-primary-500 transition-colors"
												title={item.quantity === 1 ? 'Remover do carrinho' : 'Diminuir quantidade'}
											>
												<Minus size={16} />
											</button>
											<span className="w-8 text-center font-medium">{item.quantity}</span>
											<button
												onClick={() => onUpdateQuantity(item.giftId, item.quantity + 1)}
												disabled={!canAddMore}
												className="w-8 h-8 flex items-center justify-center border border-neutral-300 hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												title={canAddMore ? 'Aumentar quantidade' : 'Máximo atingido'}
											>
												<Plus size={16} />
											</button>
										</div>
										<button onClick={() => onRemoveItem(item.giftId)} className="p-2 text-red-500 hover:bg-red-50 transition-colors" title="Remover do carrinho">
											<X size={20} />
										</button>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div className="p-5 border-t border-neutral-200 bg-white">
						<div className="flex justify-between items-center mb-4">
							<span className="text-base font-medium text-neutral-600">Subtotal:</span>
							<span className="text-2xl font-medium text-primary-500">{formatPrice(totalPrice)}</span>
						</div>
						<Button onClick={onCheckout} className="w-full" size="lg">
							<GiftIcon size={20} className="mr-2" />
							Dar Presente
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

// Modal de Pagamento PIX
const PixModal = ({
	isOpen,
	onClose,
	totalPrice,
	cartItems,
	onConfirm,
	onUpdateCart,
}: {
	isOpen: boolean;
	onClose: () => void;
	totalPrice: number;
	cartItems: CartItem[];
	onConfirm: (buyerInfo: { name: string; email: string; phone?: string }) => void;
	onUpdateCart: (giftId: string, newQty: number) => void;
}) => {
	const [step, setStep] = useState<'info' | 'pix'>('info');
	const [buyerName, setBuyerName] = useState('');
	const [buyerEmail, setBuyerEmail] = useState('');
	const [buyerPhone, setBuyerPhone] = useState('');
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [pixData, setPixData] = useState<{ pixCode: string; qrCodeImage: string; orderNumber: string } | null>(null);

	const handleCopyPix = () => {
		if (pixData) {
			navigator.clipboard.writeText(pixData.pixCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSubmitInfo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (buyerName && buyerEmail) {
			setIsLoading(true);
			try {
				// Call API to create order and generate PIX
				const response = await fetch('/api/orders/create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						items: cartItems,
						buyerName,
						buyerEmail,
						buyerPhone,
					}),
				});

				const data = await response.json();

				if (data.success) {
					setPixData({
						pixCode: data.order.pixCode,
						qrCodeImage: data.order.qrCodeImage,
						orderNumber: data.order.orderNumber,
					});
					setStep('pix');
				} else if (response.status === 409 && data.availabilityIssues) {
					// Handle availability issues - some items are no longer available
					console.log('Availability issues:', data.availabilityIssues);

					// Update cart quantities based on what's available
					let message = 'Alguns itens não estão mais disponíveis:\n\n';
					let hasChanges = false;

					data.availabilityIssues.forEach((issue: any) => {
						message += `• ${issue.name}: você tentou ${issue.requested}, mas só há ${issue.available} disponível(is)\n`;

						// Update cart to available quantity
						if (issue.available > 0) {
							onUpdateCart(issue.giftId, issue.available);
							hasChanges = true;
						} else {
							// Remove item if none available
							onUpdateCart(issue.giftId, 0);
							hasChanges = true;
						}
					});

					message += '\nSeu carrinho foi atualizado. Por favor, revise e tente novamente.';

					alert(message);

					// Close modal so user can see updated cart
					onClose();
				} else {
					alert(data.message || 'Erro ao criar pedido. Tente novamente.');
				}
			} catch (error) {
				console.error('Error creating order:', error);
				alert('Erro ao processar pagamento. Tente novamente.');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleConfirmPayment = () => {
		onConfirm({
			name: buyerName,
			email: buyerEmail,
			phone: buyerPhone || undefined,
		});
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-cream-100 shadow-2xl w-full max-w-md border border-neutral-200">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-neutral-200">
					<h2 className="text-lg font-medium text-primary-500 tracking-wide">{step === 'info' ? 'Seus Dados' : 'Pagamento PIX'}</h2>
					<button onClick={onClose} className="p-2 hover:bg-cream-200 transition-colors">
						<X size={24} className="text-primary-500" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{step === 'info' ? (
						<form onSubmit={handleSubmitInfo} className="space-y-5">
							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2 tracking-wide">Seu Nome *</label>
								<input
									type="text"
									value={buyerName}
									onChange={(e) => setBuyerName(e.target.value)}
									className="input-field"
									required
									placeholder="Digite seu nome"
									disabled={isLoading}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2 tracking-wide">Seu E-mail *</label>
								<input
									type="email"
									value={buyerEmail}
									onChange={(e) => setBuyerEmail(e.target.value)}
									className="input-field"
									required
									placeholder="seu@email.com"
									disabled={isLoading}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-neutral-700 mb-2 tracking-wide">Seu Telefone (opcional)</label>
								<input
									type="tel"
									value={buyerPhone}
									onChange={(e) => setBuyerPhone(e.target.value)}
									className="input-field"
									placeholder="(00) 00000-0000"
									disabled={isLoading}
								/>
							</div>
							<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
								{isLoading ? 'Gerando PIX...' : 'Continuar'}
							</Button>
						</form>
					) : (
						<div className="text-center">
							<div className="mb-4">
								<p className="text-sm text-neutral-600 mb-1">Pedido: {pixData?.orderNumber}</p>
								<p className="text-neutral-600 mb-2">Valor total:</p>
								<p className="text-3xl font-medium text-primary-500">{formatPrice(totalPrice)}</p>
							</div>

							{/* QR Code */}
							{pixData?.qrCodeImage && (
								<div className="bg-white p-4 mb-4 inline-block border border-neutral-200">
									<Image src={pixData.qrCodeImage} alt="QR Code PIX" width={300} height={300} className="w-64 h-64" />
								</div>
							)}

							{/* Chave PIX */}
							<div className="mb-6">
								<p className="text-sm text-neutral-600 mb-2">Ou copie o código PIX:</p>
								<div className="flex flex-col gap-2">
									<div className="bg-white px-3 py-2 text-xs border border-neutral-200 font-mono break-all max-h-20 overflow-y-auto">
										{pixData?.pixCode}
									</div>
									<button
										onClick={handleCopyPix}
										className={`p-2 transition-colors flex items-center justify-center gap-2 ${
											copied ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white border border-neutral-200 hover:border-primary-500 text-primary-500'
										}`}
									>
										{copied ? (
											<>
												<Check size={20} /> Copiado!
											</>
										) : (
											<>
												<Copy size={20} /> Copiar código
											</>
										)}
									</button>
								</div>
							</div>

							<Button onClick={handleConfirmPayment} className="w-full" size="lg">
								<Check size={20} className="mr-2" />
								Já fiz o pagamento
							</Button>

							<p className="text-xs text-neutral-500 mt-4">Após confirmar, aguarde a validação do pagamento pelos noivos.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Página Principal de Presentes
export default function PresentesPage() {
	const { gifts, categories, isLoaded, reserveGift, releaseReservation, getAvailableQuantity, getGiftsByCategory, refreshGifts } = useGifts();

	const { items: cartItems, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isPixOpen, setIsPixOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isUpdatingQuantity, setIsUpdatingQuantity] = useState<string | null>(null);

	// Auto-refresh when page becomes visible (e.g., returning from admin panel)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				console.log('Page visible again, refreshing gifts...');
				refreshGifts();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [refreshGifts]);

	const handleAddToCart = async (gift: Gift) => {
		// Prevent race condition by locking
		if (isAddingToCart) return;

		setIsAddingToCart(true);

		try {
			const available = getAvailableQuantity(gift.id);
			if (available > 0) {
				// Just add to local cart (no database reservation yet)
				// Reservation happens when order is created
				addItem({
					giftId: gift.id,
					name: gift.name,
					price: gift.price,
					image: gift.image,
				});
			} else {
				alert('Este presente não está mais disponível.');
			}
		} finally {
			// Release lock after a short delay
			setTimeout(() => setIsAddingToCart(false), 300);
		}
	};

	const handleRemoveFromCart = (giftId: string) => {
		// Just remove from local cart (no database update needed)
		removeItem(giftId);
	};

	const handleUpdateCartQuantity = async (giftId: string, newQty: number) => {
		// Prevent race condition by locking this specific gift
		if (isUpdatingQuantity === giftId) {
			console.log('Update already in progress for gift', giftId);
			return;
		}

		setIsUpdatingQuantity(giftId);

		try {
			const item = cartItems.find((i) => i.giftId === giftId);
			if (!item) return;

			console.log('Updating cart quantity:', { giftId, currentQty: item.quantity, newQty });

			// Don't allow quantity less than 0
			if (newQty < 0) return;

			// If trying to decrease to 0, remove item instead
			if (newQty === 0) {
				handleRemoveFromCart(giftId);
				return;
			}

			const diff = newQty - item.quantity;
			if (diff > 0) {
				// Increasing quantity - just check if available
				const gift = gifts.find((g) => g.id === giftId);
				const available = getAvailableQuantity(giftId);

				// Account for items already in cart
				const totalNeeded = newQty;
				const actualAvailable = gift ? gift.quantity - gift.reserved - gift.sold : 0;

				console.log('Trying to increase:', {
					diff,
					currentInCart: item.quantity,
					newQty,
					totalNeeded,
					actualAvailable,
					canAdd: actualAvailable >= totalNeeded
				});

				if (actualAvailable >= totalNeeded) {
					// Just update local cart (no database reservation)
					updateQuantity(giftId, newQty);
					console.log('✅ Quantity increased in cart');
				} else {
					console.log('❌ Not enough available. Alert user.');
					alert(`Apenas ${actualAvailable} unidade(s) disponível(is).`);
				}
			} else if (diff < 0) {
				// Decreasing quantity - just update local cart
				console.log('Decreasing quantity by', Math.abs(diff));
				updateQuantity(giftId, newQty);
				console.log('✅ Quantity decreased in cart');
			}
		} finally {
			// Release lock after a short delay
			setTimeout(() => setIsUpdatingQuantity(null), 300);
		}
	};

	const handleCheckout = () => {
		setIsCartOpen(false);
		setIsPixOpen(true);
	};

	const handleConfirmPayment = (buyerInfo: { name: string; email: string; phone?: string }) => {
		// Order is already saved in database via API
		// Just clear cart and close modal
		clearCart();
		setIsPixOpen(false);

		alert('Pedido registrado! Aguarde a confirmação do pagamento pelos noivos. Você receberá um email de confirmação.');
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-cream-100">
				<div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	const displayedGifts = selectedCategory ? getGiftsByCategory(selectedCategory as any) : gifts;

	return (
		<>
			<Head>
				<title>Lista de Presentes | Julia & Rafael</title>
				<meta name="description" content="Lista de presentes do casamento de Julia e Rafael" />
			</Head>

			<div className="min-h-screen bg-cream-100">
				{/* Header */}
				<header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-neutral-200">
					<div className="container-custom py-5 flex items-center justify-between">
						<div>
							<h1 className="font-script text-2xl md:text-3xl text-primary-500">Lista de Presentes</h1>
							<p className="text-sm text-neutral-500 tracking-wider">Julia & Rafael</p>
						</div>

						<div className="flex items-center gap-2">
							{/* Refresh Button */}
							<button
								onClick={() => {
									console.log('Manual refresh triggered');
									refreshGifts();
								}}
								className="p-3 bg-white border border-neutral-200 text-primary-500 hover:border-primary-500 transition-colors"
								title="Atualizar lista"
							>
								<RefreshCw size={22} />
							</button>

							{/* Carrinho */}
							<button
								onClick={() => setIsCartOpen(true)}
								className="relative p-3 bg-primary-500 text-cream-100 hover:bg-primary-600 transition-colors"
							>
								<ShoppingCart size={22} />
								{totalItems > 0 && (
									<span className="absolute -top-1 -right-1 w-5 h-5 bg-cream-100 text-primary-500 text-xs font-medium flex items-center justify-center">
										{totalItems}
									</span>
								)}
							</button>
						</div>
					</div>
				</header>

				{/* Filtros por Categoria */}
				<div className="container-custom py-8">
					<div className="flex flex-wrap gap-2 justify-center">
						<button
							onClick={() => setSelectedCategory(null)}
							className={`px-5 py-2 text-sm font-medium tracking-wider transition-colors ${
								selectedCategory === null ? 'bg-primary-500 text-cream-100' : 'bg-white border border-neutral-200 text-primary-500 hover:border-primary-500'
							}`}
						>
							Todos
						</button>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-5 py-2 text-sm font-medium tracking-wider transition-colors ${
									selectedCategory === category.id ? 'bg-primary-500 text-cream-100' : 'bg-white border border-neutral-200 text-primary-500 hover:border-primary-500'
								}`}
							>
								{category.icon} {category.name}
							</button>
						))}
					</div>
				</div>

				{/* Lista de Presentes */}
				<main className="container-custom pb-16">
					{selectedCategory === null ? (
						// Mostrar por categoria
						categories.map((category) => {
							const categoryGifts = getGiftsByCategory(category.id);
							if (categoryGifts.length === 0) return null;

							return (
								<section key={category.id} className="mb-12">
									<h2 className="text-xl font-medium text-primary-500 mb-6 flex items-center gap-3 tracking-wide">
										<span className="text-2xl">{category.icon}</span>
										{category.name}
									</h2>
									<div className="grid gap-4 md:grid-cols-2">
										{categoryGifts.map((gift) => (
											<GiftCard key={gift.id} gift={gift} onAddToCart={handleAddToCart} availableQty={getAvailableQuantity(gift.id)} />
										))}
									</div>
								</section>
							);
						})
					) : (
						// Mostrar categoria selecionada
						<div className="grid gap-4 md:grid-cols-2">
							{displayedGifts.map((gift) => (
								<GiftCard key={gift.id} gift={gift} onAddToCart={handleAddToCart} availableQty={getAvailableQuantity(gift.id)} />
							))}
						</div>
					)}
				</main>

				{/* Modais */}
				<CartModal
					isOpen={isCartOpen}
					onClose={() => setIsCartOpen(false)}
					items={cartItems}
					totalPrice={totalPrice}
					onRemoveItem={handleRemoveFromCart}
					onUpdateQuantity={handleUpdateCartQuantity}
					onCheckout={handleCheckout}
					getAvailableQuantity={getAvailableQuantity}
				/>

				<PixModal
					isOpen={isPixOpen}
					onClose={() => setIsPixOpen(false)}
					totalPrice={totalPrice}
					cartItems={cartItems}
					onConfirm={handleConfirmPayment}
					onUpdateCart={handleUpdateCartQuantity}
				/>
			</div>
		</>
	);
}
