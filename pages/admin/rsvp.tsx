import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Users, Mail, Phone, MessageSquare, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';

interface RSVP {
	id: string;
	name: string;
	email: string;
	phone?: string;
	message?: string;
	confirmed: boolean;
	created_at: string;
}

const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export default function AdminRSVPPage() {
	const router = useRouter();
	const [rsvps, setRsvps] = useState<RSVP[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

	useEffect(() => {
		const auth = localStorage.getItem('admin-authenticated');
		if (auth !== 'true') {
			router.push('/admin');
			return;
		}
		fetchRSVPs();
	}, []);

	const fetchRSVPs = async () => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase
				.from('rsvp')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching RSVPs:', error);
				alert('Erro ao carregar confirmações');
			} else {
				setRsvps(data || []);
			}
		} catch (error) {
			console.error('Error fetching RSVPs:', error);
			alert('Erro ao carregar confirmações');
		} finally {
			setIsLoading(false);
		}
	};

	const filteredRSVPs = rsvps.filter((rsvp) => {
		if (filter === 'all') return true;
		if (filter === 'confirmed') return rsvp.confirmed;
		return !rsvp.confirmed;
	});

	const stats = {
		total: rsvps.length,
		confirmed: rsvps.filter((r) => r.confirmed).length,
		pending: rsvps.filter((r) => !r.confirmed).length,
	};

	return (
		<AdminLayout title="Confirmações de Presença">
			<Head>
				<title>RSVPs - Admin Panel</title>
			</Head>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 border border-neutral-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-blue-100 text-blue-600">
							<Users size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Total</p>
							<p className="text-3xl font-medium text-primary-500">{stats.total}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-green-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-green-100 text-green-600">
							<Users size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Confirmados</p>
							<p className="text-3xl font-medium text-green-600">{stats.confirmed}</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 border border-yellow-200">
					<div className="flex items-center justify-between mb-4">
						<div className="p-3 bg-yellow-100 text-yellow-600">
							<Users size={24} />
						</div>
						<div className="text-right">
							<p className="text-sm text-neutral-600">Pendentes</p>
							<p className="text-3xl font-medium text-yellow-600">{stats.pending}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-2 mb-6">
				<button
					onClick={() => setFilter('all')}
					className={`px-4 py-2 text-sm ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-primary-500 hover:border-primary-500'}`}
				>
					Todos ({stats.total})
				</button>
				<button
					onClick={() => setFilter('confirmed')}
					className={`px-4 py-2 text-sm ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-white border border-neutral-200 text-green-600 hover:border-green-500'}`}
				>
					Confirmados ({stats.confirmed})
				</button>
				<button
					onClick={() => setFilter('pending')}
					className={`px-4 py-2 text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white border border-neutral-200 text-yellow-600 hover:border-yellow-500'}`}
				>
					Pendentes ({stats.pending})
				</button>
			</div>

			{/* RSVPs List */}
			{isLoading ? (
				<div className="text-center py-12">
					<div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
				</div>
			) : filteredRSVPs.length === 0 ? (
				<div className="bg-white p-12 text-center border border-neutral-200">
					<Users className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
					<p className="text-neutral-600 text-lg mb-2">Nenhuma confirmação encontrada</p>
					<p className="text-neutral-500 text-sm">Aguarde as confirmações dos convidados</p>
				</div>
			) : (
				<div className="bg-white border border-neutral-200">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-cream-50 border-b border-neutral-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Contato</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Mensagem</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Data</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200">
								{filteredRSVPs.map((rsvp) => (
									<tr key={rsvp.id} className="hover:bg-cream-50">
										<td className="px-6 py-4">
											<div className="flex items-center">
												<div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm">
													{rsvp.name.charAt(0).toUpperCase()}
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-neutral-700">{rsvp.name}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-neutral-600 space-y-1">
												<p className="flex items-center gap-1">
													<Mail size={14} />
													{rsvp.email}
												</p>
												{rsvp.phone && (
													<p className="flex items-center gap-1">
														<Phone size={14} />
														{rsvp.phone}
													</p>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											{rsvp.message ? (
												<div className="text-sm text-neutral-600 max-w-xs">
													<MessageSquare size={14} className="inline mr-1" />
													{rsvp.message.length > 50 ? rsvp.message.substring(0, 50) + '...' : rsvp.message}
												</div>
											) : (
												<span className="text-sm text-neutral-400">Sem mensagem</span>
											)}
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-neutral-600 flex items-center gap-1">
												<Calendar size={14} />
												{formatDate(rsvp.created_at)}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium ${
													rsvp.confirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
												}`}
											>
												{rsvp.confirmed ? 'Confirmado' : 'Pendente'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
