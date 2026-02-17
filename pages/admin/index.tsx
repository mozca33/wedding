import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Package, Clock, CheckCircle, DollarSign, Users, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/Button';

interface DashboardStats {
	totalOrders: number;
	pendingOrders: number;
	confirmedOrders: number;
	totalRevenue: number;
	totalRSVPs: number;
	recentOrders: Array<{
		id: string;
		order_number: string;
		buyer_name: string;
		total: number;
		status: string;
		created_at: string;
	}>;
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
		hour: '2-digit',
		minute: '2-digit',
	});
};

function AdminLoginForm({ onLogin }: { onLogin: (password: string) => void }) {
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		onLogin(password);
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
			<div className="bg-white p-8 border border-neutral-200 w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="font-script text-3xl text-primary-500 mb-2">Julia & Rafael</h1>
					<h2 className="text-xl font-medium text-primary-500">Admin Panel</h2>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-2 tracking-wide">Senha de Administrador</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input-field"
							required
							placeholder="Digite a senha"
							autoFocus
							disabled={isLoading}
						/>
					</div>

					<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
						{isLoading ? 'Verificando...' : 'Entrar'}
					</Button>
				</form>

				<div className="mt-6 text-center text-sm text-neutral-500">
					<p>Área restrita para gerenciamento do site</p>
				</div>
			</div>
		</div>
	);
}

function AdminDashboard({ stats }: { stats: DashboardStats }) {
	return (
		<AdminLayout title="Dashboard">
			<Head>
				<title>Admin Dashboard - Julia & Rafael</title>
			</Head>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-100 text-blue-600">
							<Package size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Total de Pedidos</p>
							<p className="text-3xl font-medium text-primary-500">{stats.totalOrders}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-yellow-100 text-yellow-600">
							<Clock size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Pedidos Pendentes</p>
							<p className="text-3xl font-medium text-yellow-600">{stats.pendingOrders}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-100 text-green-600">
							<CheckCircle size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Confirmados</p>
							<p className="text-3xl font-medium text-green-600">{stats.confirmedOrders}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-primary-100 text-primary-600">
							<DollarSign size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Total Arrecadado</p>
							<p className="text-2xl font-medium text-primary-500">{formatPrice(stats.totalRevenue)}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-purple-100 text-purple-600">
							<Users size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Confirmações RSVP</p>
							<p className="text-3xl font-medium text-purple-600">{stats.totalRSVPs}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-orange-100 text-orange-600">
							<TrendingUp size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Taxa de Aprovação</p>
							<p className="text-3xl font-medium text-orange-600">
								{stats.totalOrders > 0 ? Math.round((stats.confirmedOrders / stats.totalOrders) * 100) : 0}%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Orders */}
			<div className="bg-white border border-neutral-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-medium text-primary-500">Pedidos Recentes</h2>
					<Button variant="outline" size="sm" onClick={() => (window.location.href = '/admin/orders')}>
						Ver Todos
					</Button>
				</div>

				{stats.recentOrders.length === 0 ? (
					<p className="text-center text-neutral-500 py-8">Nenhum pedido ainda</p>
				) : (
					<div className="space-y-3">
						{stats.recentOrders.map((order) => (
							<div key={order.id} className="flex items-center justify-between p-4 border border-neutral-200 hover:border-primary-500 transition-colors">
								<div className="flex-1">
									<p className="font-medium text-primary-500">#{order.order_number}</p>
									<p className="text-sm text-neutral-600">{order.buyer_name}</p>
									<p className="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
								</div>
								<div className="text-right">
									<p className="font-medium text-primary-500">{formatPrice(order.total)}</p>
									<span
										className={`inline-block px-2 py-1 text-xs ${
											order.status === 'pending'
												? 'bg-yellow-100 text-yellow-700'
												: order.status === 'confirmed'
													? 'bg-green-100 text-green-700'
													: 'bg-red-100 text-red-700'
										}`}
									>
										{order.status === 'pending' ? 'Pendente' : order.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
				<div className="bg-white border border-neutral-200 p-6">
					<h3 className="text-lg font-medium text-primary-500 mb-4">Ações Rápidas</h3>
					<div className="space-y-3">
						<Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/admin/orders')}>
							<Package className="mr-2" size={18} />
							Gerenciar Pedidos
						</Button>
						<Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/admin/rsvp')}>
							<Users className="mr-2" size={18} />
							Ver Confirmações
						</Button>
						<Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/presentes')}>
							<Package className="mr-2" size={18} />
							Ver Lista de Presentes
						</Button>
					</div>
				</div>

				<div className="bg-white border border-neutral-200 p-6">
					<h3 className="text-lg font-medium text-primary-500 mb-4">Informações</h3>
					<div className="space-y-2 text-sm text-neutral-600">
						<p>
							<strong>Pedidos Pendentes:</strong> Aguardam sua aprovação
						</p>
						<p>
							<strong>Aprovar:</strong> Confirma pagamento e marca presentes como vendidos
						</p>
						<p>
							<strong>Rejeitar:</strong> Cancela pedido e libera presentes novamente
						</p>
						<p className="pt-2 text-xs text-neutral-500">
							Sempre verifique o pagamento no Nubank antes de aprovar. O número do pedido aparece na descrição do PIX.
						</p>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}

export default function AdminPage() {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({
		totalOrders: 0,
		pendingOrders: 0,
		confirmedOrders: 0,
		totalRevenue: 0,
		totalRSVPs: 0,
		recentOrders: [],
	});

	useEffect(() => {
		const auth = localStorage.getItem('admin-authenticated');
		if (auth === 'true') {
			setIsAuthenticated(true);
			fetchStats();
		} else {
			setIsLoading(false);
		}
	}, []);

	const fetchStats = async () => {
		try {
			const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

			// Fetch orders
			const ordersRes = await fetch(`/api/orders/list?adminPassword=${adminPassword}`);
			const ordersData = await ordersRes.json();

			if (ordersData.orders) {
				const orders = ordersData.orders;
				const pending = orders.filter((o: any) => o.status === 'pending').length;
				const confirmed = orders.filter((o: any) => o.status === 'confirmed');
				const revenue = confirmed.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);
				const recent = orders.slice(0, 5);

				setStats((prev) => ({
					...prev,
					totalOrders: orders.length,
					pendingOrders: pending,
					confirmedOrders: confirmed.length,
					totalRevenue: revenue,
					recentOrders: recent,
				}));
			}

			// Fetch RSVPs (if endpoint exists)
			// You can add this later when you have the RSVP API

			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching stats:', error);
			setIsLoading(false);
		}
	};

	const handleLogin = (password: string) => {
		if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
			localStorage.setItem('admin-authenticated', 'true');
			setIsAuthenticated(true);
			fetchStats();
		} else {
			alert('Senha incorreta!');
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-cream-100 flex items-center justify-center">
				<div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <AdminLoginForm onLogin={handleLogin} />;
	}

	return <AdminDashboard stats={stats} />;
}
