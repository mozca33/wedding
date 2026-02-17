import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Check, X, Clock, Package, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/Button';

interface Order {
	id: string;
	order_number: string;
	buyer_name: string;
	buyer_email: string;
	buyer_phone: string | null;
	items: Array<{
		giftId: string;
		name: string;
		price: number;
		quantity: number;
	}>;
	total: number;
	status: 'pending' | 'confirmed' | 'cancelled';
	pix_code: string;
	created_at: string;
	confirmed_at: string | null;
	notes: string | null;
}

const formatPrice = (value: number): string => {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
};

const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

function OrderCard({ order, onApprove, onReject }: { order: Order; onApprove: (id: string) => void; onReject: (id: string) => void }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showPixCode, setShowPixCode] = useState(false);

	return (
		<div className="bg-white border border-neutral-200">
			{/* Header */}
			<div className="p-6 border-b border-neutral-200">
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<h3 className="text-lg font-medium text-primary-500">#{order.order_number}</h3>
							<span
								className={`px-3 py-1 text-xs font-medium ${
									order.status === 'pending'
										? 'bg-yellow-100 text-yellow-700'
										: order.status === 'confirmed'
											? 'bg-green-100 text-green-700'
											: 'bg-red-100 text-red-700'
								}`}
							>
								{order.status === 'pending' ? (
									<>
										<Clock className="inline w-3 h-3 mr-1" />
										Pendente
									</>
								) : order.status === 'confirmed' ? (
									<>
										<Check className="inline w-3 h-3 mr-1" />
										Confirmado
									</>
								) : (
									<>
										<X className="inline w-3 h-3 mr-1" />
										Cancelado
									</>
								)}
							</span>
						</div>
						<p className="text-sm text-neutral-600">{formatDate(order.created_at)}</p>
					</div>
					<div className="text-right">
						<p className="text-2xl font-medium text-primary-500">{formatPrice(order.total)}</p>
					</div>
				</div>

				{/* Buyer Info */}
				<div className="grid md:grid-cols-2 gap-4">
					<div>
						<p className="text-xs font-medium text-neutral-500 uppercase mb-1">Comprador</p>
						<p className="text-sm font-medium text-neutral-700">{order.buyer_name}</p>
						<p className="text-sm text-neutral-600">{order.buyer_email}</p>
						{order.buyer_phone && <p className="text-sm text-neutral-600">{order.buyer_phone}</p>}
					</div>
					<div>
						<p className="text-xs font-medium text-neutral-500 uppercase mb-1">Itens ({order.items.length})</p>
						<div className="space-y-1">
							{order.items.map((item, idx) => (
								<p key={idx} className="text-sm text-neutral-700">
									{item.quantity}x {item.name}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="p-4 bg-cream-50 flex flex-wrap items-center justify-between gap-3">
				<div className="flex gap-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
					>
						{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						{isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
					</button>
					{order.pix_code && (
						<button
							onClick={() => setShowPixCode(!showPixCode)}
							className="text-sm text-primary-500 hover:text-primary-600"
						>
							{showPixCode ? 'Ocultar' : 'Ver'} código PIX
						</button>
					)}
				</div>

				{order.status === 'pending' && (
					<div className="flex gap-2">
						<Button onClick={() => onReject(order.id)} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
							<X className="w-4 h-4 mr-1" />
							Rejeitar
						</Button>
						<Button onClick={() => onApprove(order.id)} size="sm">
							<Check className="w-4 h-4 mr-1" />
							Aprovar Pagamento
						</Button>
					</div>
				)}

				{order.status === 'confirmed' && order.confirmed_at && (
					<p className="text-sm text-green-600">Aprovado em: {formatDate(order.confirmed_at)}</p>
				)}

				{order.status === 'cancelled' && order.notes && (
					<p className="text-sm text-red-600 flex items-center gap-1">
						<AlertCircle size={14} />
						{order.notes}
					</p>
				)}
			</div>

			{/* Expanded Details */}
			{isExpanded && (
				<div className="p-6 border-t border-neutral-200 bg-white">
					<div className="space-y-4">
						<div>
							<p className="text-xs font-medium text-neutral-500 uppercase mb-2">Detalhamento dos Itens</p>
							<div className="space-y-2">
								{order.items.map((item, idx) => (
									<div key={idx} className="flex justify-between items-center p-3 bg-cream-50 border border-neutral-200">
										<div>
											<p className="font-medium text-neutral-700">{item.name}</p>
											<p className="text-sm text-neutral-600">Quantidade: {item.quantity}</p>
										</div>
										<div className="text-right">
											<p className="font-medium text-primary-500">{formatPrice(item.price)}</p>
											<p className="text-xs text-neutral-600">Subtotal: {formatPrice(item.price * item.quantity)}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* PIX Code */}
			{showPixCode && order.pix_code && (
				<div className="p-6 border-t border-neutral-200 bg-cream-50">
					<p className="text-xs font-medium text-neutral-500 uppercase mb-2">Código PIX</p>
					<div className="bg-white p-3 border border-neutral-200 font-mono text-xs break-all">{order.pix_code}</div>
					<p className="text-xs text-neutral-500 mt-2">Este código foi gerado para o pagamento deste pedido.</p>
				</div>
			)}
		</div>
	);
}

export default function AdminOrdersPage() {
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

	useEffect(() => {
		const auth = localStorage.getItem('admin-authenticated');
		if (auth !== 'true') {
			router.push('/admin');
			return;
		}
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setIsLoading(true);
		try {
			const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
			const response = await fetch(`/api/orders/list?adminPassword=${adminPassword}`);
			const data = await response.json();

			if (data.orders) {
				setOrders(data.orders);
			}
		} catch (error) {
			console.error('Error fetching orders:', error);
			alert('Erro ao carregar pedidos');
		} finally {
			setIsLoading(false);
		}
	};

	const handleApprove = async (orderId: string) => {
		const order = orders.find((o) => o.id === orderId);
		if (!order) return;

		if (!confirm(`Confirmar pagamento de ${formatPrice(order.total)} do pedido #${order.order_number}?\n\nVerifique se o pagamento foi recebido no Nubank antes de aprovar.`)) {
			return;
		}

		try {
			const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
			const response = await fetch('/api/orders/confirm', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ orderId, adminPassword }),
			});

			const data = await response.json();

			if (data.success) {
				alert('✅ Pedido aprovado com sucesso! Os presentes foram marcados como vendidos.');
				fetchOrders();
			} else {
				alert('Erro ao aprovar pedido: ' + data.error);
			}
		} catch (error) {
			console.error('Error approving order:', error);
			alert('Erro ao aprovar pedido');
		}
	};

	const handleReject = async (orderId: string) => {
		const order = orders.find((o) => o.id === orderId);
		if (!order) return;

		const reason = prompt(`Rejeitar pedido #${order.order_number}?\n\nMotivo (opcional):`);
		if (reason === null) return; // User cancelled

		try {
			const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
			const response = await fetch('/api/orders/reject', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ orderId, adminPassword, reason: reason || 'Rejeitado pelo administrador' }),
			});

			const data = await response.json();

			if (data.success) {
				alert('❌ Pedido rejeitado. Os presentes foram liberados novamente.');
				fetchOrders();
			} else {
				alert('Erro ao rejeitar pedido: ' + data.error);
			}
		} catch (error) {
			console.error('Error rejecting order:', error);
			alert('Erro ao rejeitar pedido');
		}
	};

	const filteredOrders = orders.filter((order) => {
		if (filter === 'all') return true;
		return order.status === filter;
	});

	const stats = {
		total: orders.length,
		pending: orders.filter((o) => o.status === 'pending').length,
		confirmed: orders.filter((o) => o.status === 'confirmed').length,
		cancelled: orders.filter((o) => o.status === 'cancelled').length,
		revenue: orders.filter((o) => o.status === 'confirmed').reduce((sum, o) => sum + o.total, 0),
	};

	return (
		<AdminLayout title="Gerenciar Pedidos">
			<Head>
				<title>Pedidos - Admin Panel</title>
			</Head>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
				<div className="bg-white p-4 border border-neutral-200">
					<div className="text-sm text-neutral-600 mb-1">Total</div>
					<div className="text-2xl font-medium text-primary-500">{stats.total}</div>
				</div>
				<div className="bg-white p-4 border border-yellow-200">
					<div className="text-sm text-neutral-600 mb-1">Pendentes</div>
					<div className="text-2xl font-medium text-yellow-600">{stats.pending}</div>
				</div>
				<div className="bg-white p-4 border border-green-200">
					<div className="text-sm text-neutral-600 mb-1">Confirmados</div>
					<div className="text-2xl font-medium text-green-600">{stats.confirmed}</div>
				</div>
				<div className="bg-white p-4 border border-red-200">
					<div className="text-sm text-neutral-600 mb-1">Cancelados</div>
					<div className="text-2xl font-medium text-red-600">{stats.cancelled}</div>
				</div>
				<div className="bg-white p-4 border border-primary-200">
					<div className="text-sm text-neutral-600 mb-1">Arrecadado</div>
					<div className="text-lg font-medium text-primary-500">{formatPrice(stats.revenue)}</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-2 mb-6">
				<button
					onClick={() => setFilter('all')}
					className={`px-4 py-2 text-sm transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-primary-500 hover:border-primary-500'}`}
				>
					Todos ({stats.total})
				</button>
				<button
					onClick={() => setFilter('pending')}
					className={`px-4 py-2 text-sm transition-colors ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white border border-neutral-200 text-yellow-600 hover:border-yellow-500'}`}
				>
					Pendentes ({stats.pending})
				</button>
				<button
					onClick={() => setFilter('confirmed')}
					className={`px-4 py-2 text-sm transition-colors ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-white border border-neutral-200 text-green-600 hover:border-green-500'}`}
				>
					Confirmados ({stats.confirmed})
				</button>
				<button
					onClick={() => setFilter('cancelled')}
					className={`px-4 py-2 text-sm transition-colors ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white border border-neutral-200 text-red-600 hover:border-red-500'}`}
				>
					Cancelados ({stats.cancelled})
				</button>
				<Button onClick={fetchOrders} variant="outline" size="sm" className="ml-auto">
					Atualizar
				</Button>
			</div>

			{/* Orders List */}
			{isLoading ? (
				<div className="text-center py-12">
					<div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="bg-white p-12 text-center border border-neutral-200">
					<Package className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
					<p className="text-neutral-600 text-lg mb-2">Nenhum pedido encontrado</p>
					<p className="text-neutral-500 text-sm">
						{filter === 'pending' ? 'Não há pedidos aguardando aprovação' : 'Altere o filtro ou aguarde novos pedidos'}
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => (
						<OrderCard key={order.id} order={order} onApprove={handleApprove} onReject={handleReject} />
					))}
				</div>
			)}
		</AdminLayout>
	);
}
