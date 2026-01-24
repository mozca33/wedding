// pages/admin.tsx
import { useEffect } from 'react';
import { useRSVP } from '@/hooks/useRSVP';

export default function Admin() {
	const { rsvpList, fetchRSVPList } = useRSVP();

	useEffect(() => {
		fetchRSVPList();
	}, [fetchRSVPList]);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

				<div className="grid md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow">
						<h3 className="text-lg font-semibold mb-2">Total de Confirmações</h3>
						<p className="text-3xl font-bold text-secondary-600">{rsvpList.length}</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow">
						<h3 className="text-lg font-semibold mb-2">Contagem Total</h3>
						<p className="text-3xl font-bold text-green-600">
							{rsvpList.length} pessoa{rsvpList.length !== 1 ? 's' : ''}
						</p>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="px-6 py-4 border-b">
						<h2 className="text-xl font-semibold">Lista de Confirmações</h2>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{rsvpList.map((rsvp) => (
									<tr key={rsvp.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rsvp.name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.email}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rsvp.phone || '-'}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
