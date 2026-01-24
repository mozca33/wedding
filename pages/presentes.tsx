// pages/presentes.tsx
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ShoppingCart, Gift as GiftIcon, Plus, Minus, X, Check, Copy } from 'lucide-react';
import { useGifts } from '@/hooks/useGifts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Gift, CartItem } from '@/lib/types';
import { getCategoryName, getCategoryIcon } from '@/lib/gifts-data';

// Formatar preço em BRL
const formatPrice = (value: number): string => {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
};

// Componente do Card de Presente
const GiftCard = ({
	gift,
	onAddToCart,
	availableQty,
}: {
	gift: Gift;
	onAddToCart: (gift: Gift) => void;
	availableQty: number;
}) => {
	const isAvailable = availableQty > 0;
	const [imageError, setImageError] = useState(false);
	const hasValidImage = gift.image && !gift.image.includes('placeholder') && !imageError;

	return (
		<div
			className={`flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
				isAvailable ? 'hover:shadow-lg' : 'opacity-60'
			}`}
		>
			{/* Imagem */}
			<div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 bg-gradient-to-br from-primary-100 to-secondary-100">
				{hasValidImage ? (
					<Image
						src={gift.image}
						alt={gift.name}
						fill
						className="object-cover"
						sizes="160px"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<GiftIcon className="w-12 h-12 text-primary-300" />
					</div>
				)}
				{!isAvailable && (
					<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
						<span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
							Indisponível
						</span>
					</div>
				)}
			</div>

			{/* Informações */}
			<div className="flex-1 p-4 flex flex-col justify-between">
				<div>
					<h3 className="font-semibold text-gray-900 text-lg mb-1">{gift.name}</h3>
					<p className="text-2xl font-bold text-primary-600 mb-2">
						{formatPrice(gift.price)}
					</p>
					<p className="text-sm text-gray-500">
						{isAvailable ? (
							<>
								<span className="text-green-600 font-medium">{availableQty}</span>{' '}
								disponível(is)
							</>
						) : (
							<span className="text-red-500">Esgotado</span>
						)}
					</p>
				</div>

				<Button
					onClick={() => onAddToCart(gift)}
					disabled={!isAvailable}
					className="mt-3 w-full sm:w-auto"
					size="sm"
				>
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
}: {
	isOpen: boolean;
	onClose: () => void;
	items: CartItem[];
	totalPrice: number;
	onRemoveItem: (giftId: string) => void;
	onUpdateQuantity: (giftId: string, qty: number) => void;
	onCheckout: () => void;
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<ShoppingCart size={24} />
						Seu Carrinho
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Items */}
				<div className="flex-1 overflow-y-auto p-4">
					{items.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
							<p>Seu carrinho está vazio</p>
						</div>
					) : (
						<div className="space-y-4">
							{items.map((item) => (
								<div
									key={item.giftId}
									className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
								>
									<div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
										<Image
											src={item.image}
											alt={item.name}
											fill
											className="object-cover"
											sizes="64px"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-medium text-gray-900 truncate">
											{item.name}
										</h4>
										<p className="text-primary-600 font-semibold">
											{formatPrice(item.price)}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												onUpdateQuantity(item.giftId, item.quantity - 1)
											}
											className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
										>
											<Minus size={16} />
										</button>
										<span className="w-8 text-center font-medium">
											{item.quantity}
										</span>
										<button
											onClick={() =>
												onUpdateQuantity(item.giftId, item.quantity + 1)
											}
											className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
										>
											<Plus size={16} />
										</button>
									</div>
									<button
										onClick={() => onRemoveItem(item.giftId)}
										className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
									>
										<X size={20} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div className="p-4 border-t bg-gray-50">
						<div className="flex justify-between items-center mb-4">
							<span className="text-lg font-medium text-gray-700">Subtotal:</span>
							<span className="text-2xl font-bold text-primary-600">
								{formatPrice(totalPrice)}
							</span>
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
	onConfirm,
}: {
	isOpen: boolean;
	onClose: () => void;
	totalPrice: number;
	onConfirm: (buyerInfo: { name: string; email: string; phone?: string }) => void;
}) => {
	const [step, setStep] = useState<'info' | 'pix'>('info');
	const [buyerName, setBuyerName] = useState('');
	const [buyerEmail, setBuyerEmail] = useState('');
	const [buyerPhone, setBuyerPhone] = useState('');
	const [copied, setCopied] = useState(false);

	const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || 'pix@exemplo.com';

	const handleCopyPix = () => {
		navigator.clipboard.writeText(pixKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleSubmitInfo = (e: React.FormEvent) => {
		e.preventDefault();
		if (buyerName && buyerEmail) {
			setStep('pix');
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
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-bold text-gray-900">
						{step === 'info' ? 'Seus Dados' : 'Pagamento PIX'}
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{step === 'info' ? (
						<form onSubmit={handleSubmitInfo} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Seu Nome *
								</label>
								<input
									type="text"
									value={buyerName}
									onChange={(e) => setBuyerName(e.target.value)}
									className="input-field"
									required
									placeholder="Digite seu nome"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Seu E-mail *
								</label>
								<input
									type="email"
									value={buyerEmail}
									onChange={(e) => setBuyerEmail(e.target.value)}
									className="input-field"
									required
									placeholder="seu@email.com"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Seu Telefone (opcional)
								</label>
								<input
									type="tel"
									value={buyerPhone}
									onChange={(e) => setBuyerPhone(e.target.value)}
									className="input-field"
									placeholder="(00) 00000-0000"
								/>
							</div>
							<Button type="submit" className="w-full" size="lg">
								Continuar
							</Button>
						</form>
					) : (
						<div className="text-center">
							<div className="mb-6">
								<p className="text-gray-600 mb-2">Valor total:</p>
								<p className="text-3xl font-bold text-primary-600">
									{formatPrice(totalPrice)}
								</p>
							</div>

							{/* QR Code placeholder */}
							<div className="bg-gray-100 rounded-xl p-4 mb-4 inline-block">
								<div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
									<p className="text-gray-400 text-sm text-center px-4">
										QR Code PIX
										<br />
										<span className="text-xs">(gerar com API de pagamento)</span>
									</p>
								</div>
							</div>

							{/* Chave PIX */}
							<div className="mb-6">
								<p className="text-sm text-gray-600 mb-2">Ou copie a chave PIX:</p>
								<div className="flex items-center justify-center gap-2">
									<code className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
										{pixKey}
									</code>
									<button
										onClick={handleCopyPix}
										className={`p-2 rounded-lg transition-colors ${
											copied
												? 'bg-green-100 text-green-600'
												: 'bg-gray-100 hover:bg-gray-200'
										}`}
									>
										{copied ? <Check size={20} /> : <Copy size={20} />}
									</button>
								</div>
							</div>

							<Button onClick={handleConfirmPayment} className="w-full" size="lg">
								<Check size={20} className="mr-2" />
								Já fiz o pagamento
							</Button>

							<p className="text-xs text-gray-500 mt-4">
								Após confirmar, aguarde a validação do pagamento pelos noivos.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Página Principal de Presentes
export default function PresentesPage() {
	const {
		gifts,
		categories,
		isLoaded,
		reserveGift,
		releaseReservation,
		getAvailableQuantity,
		getGiftsByCategory,
	} = useGifts();

	const {
		items: cartItems,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		totalItems,
		totalPrice,
	} = useCart();

	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isPixOpen, setIsPixOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const handleAddToCart = (gift: Gift) => {
		const available = getAvailableQuantity(gift.id);
		if (available > 0) {
			reserveGift(gift.id, 1);
			addItem({
				giftId: gift.id,
				name: gift.name,
				price: gift.price,
				image: gift.image,
			});
		}
	};

	const handleRemoveFromCart = (giftId: string) => {
		const item = cartItems.find((i) => i.giftId === giftId);
		if (item) {
			releaseReservation(giftId, item.quantity);
			removeItem(giftId);
		}
	};

	const handleUpdateCartQuantity = (giftId: string, newQty: number) => {
		const item = cartItems.find((i) => i.giftId === giftId);
		if (!item) return;

		const diff = newQty - item.quantity;
		if (diff > 0) {
			// Aumentando quantidade
			const available = getAvailableQuantity(giftId);
			if (available >= diff) {
				reserveGift(giftId, diff);
				updateQuantity(giftId, newQty);
			}
		} else if (diff < 0) {
			// Diminuindo quantidade
			releaseReservation(giftId, Math.abs(diff));
			updateQuantity(giftId, newQty);
		}
	};

	const handleCheckout = () => {
		setIsCartOpen(false);
		setIsPixOpen(true);
	};

	const handleConfirmPayment = (buyerInfo: { name: string; email: string; phone?: string }) => {
		// Aqui você salvaria o pedido no banco/localStorage para admin confirmar
		const order = {
			id: Date.now().toString(),
			items: cartItems,
			total: totalPrice,
			...buyerInfo,
			status: 'pending',
			createdAt: new Date().toISOString(),
		};

		// Salvar pedido pendente no localStorage
		const pendingOrders = JSON.parse(localStorage.getItem('wedding-pending-orders') || '[]');
		pendingOrders.push(order);
		localStorage.setItem('wedding-pending-orders', JSON.stringify(pendingOrders));

		// Limpar carrinho
		clearCart();
		setIsPixOpen(false);

		alert('Pedido registrado! Aguarde a confirmação do pagamento pelos noivos.');
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	const displayedGifts = selectedCategory
		? getGiftsByCategory(selectedCategory as any)
		: gifts;

	return (
		<>
			<Head>
				<title>Lista de Presentes | Julia & Rafael</title>
				<meta name="description" content="Lista de presentes do casamento de Julia e Rafael" />
			</Head>

			<div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
				{/* Header */}
				<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
					<div className="container-custom py-4 flex items-center justify-between">
						<div>
							<h1 className="font-script text-2xl md:text-3xl text-gradient font-bold">
								Lista de Presentes
							</h1>
							<p className="text-sm text-gray-600">Julia & Rafael</p>
						</div>

						{/* Carrinho */}
						<button
							onClick={() => setIsCartOpen(true)}
							className="relative p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
						>
							<ShoppingCart size={24} />
							{totalItems > 0 && (
								<span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
									{totalItems}
								</span>
							)}
						</button>
					</div>
				</header>

				{/* Filtros por Categoria */}
				<div className="container-custom py-6">
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedCategory(null)}
							className={`px-4 py-2 rounded-full font-medium transition-colors ${
								selectedCategory === null
									? 'bg-primary-500 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-100'
							}`}
						>
							Todos
						</button>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-4 py-2 rounded-full font-medium transition-colors ${
									selectedCategory === category.id
										? 'bg-primary-500 text-white'
										: 'bg-white text-gray-700 hover:bg-gray-100'
								}`}
							>
								{category.icon} {category.name}
							</button>
						))}
					</div>
				</div>

				{/* Lista de Presentes */}
				<main className="container-custom pb-12">
					{selectedCategory === null ? (
						// Mostrar por categoria
						categories.map((category) => {
							const categoryGifts = getGiftsByCategory(category.id);
							if (categoryGifts.length === 0) return null;

							return (
								<section key={category.id} className="mb-12">
									<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
										<span className="text-3xl">{category.icon}</span>
										{category.name}
									</h2>
									<div className="grid gap-4 md:grid-cols-2">
										{categoryGifts.map((gift) => (
											<GiftCard
												key={gift.id}
												gift={gift}
												onAddToCart={handleAddToCart}
												availableQty={getAvailableQuantity(gift.id)}
											/>
										))}
									</div>
								</section>
							);
						})
					) : (
						// Mostrar categoria selecionada
						<div className="grid gap-4 md:grid-cols-2">
							{displayedGifts.map((gift) => (
								<GiftCard
									key={gift.id}
									gift={gift}
									onAddToCart={handleAddToCart}
									availableQty={getAvailableQuantity(gift.id)}
								/>
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
				/>

				<PixModal
					isOpen={isPixOpen}
					onClose={() => setIsPixOpen(false)}
					totalPrice={totalPrice}
					onConfirm={handleConfirmPayment}
				/>
			</div>
		</>
	);
}
