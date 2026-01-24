import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Users, Calendar, MessageCircle } from 'lucide-react';
import { useRSVP } from '@/hooks/useRSVP';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RSVPData } from '@/lib/types';

// Definir interface específica para o formulário
interface RSVPFormData {
	name: string;
	email: string;
	phone?: string;
	message?: string;
}

export const RSVP = () => {
	const { loading, rsvpList, submitRSVP, fetchRSVPList } = useRSVP();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RSVPFormData>();

	useEffect(() => {
		fetchRSVPList();
	}, [fetchRSVPList]);

	const onSubmit = async (data: RSVPFormData) => {
		// Converter para o formato esperado pela API
		const rsvpData: RSVPData = data;

		const result = await submitRSVP(rsvpData);

		if (result?.success) {
			reset();
		}
	};

	return (
		<section id="rsvp" className="section-padding gradient-bg">
			<div className="container-custom">
				<div className="text-center mb-16">
					<h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">Confirmar Presença</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Por favor, confirme sua presença até 1º de maio para que possamos nos organizar melhor.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12">
					{/* RSVP Form */}
					<div className="card">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="text-center mb-6">
								<Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
								<h3 className="text-2xl font-semibold text-gray-900">Confirme sua Presença</h3>
							</div>

							<Input label="Nome Completo *" {...register('name', { required: 'Nome é obrigatório' })} error={errors.name?.message} />

							<Input
								label="E-mail *"
								type="email"
								{...register('email', {
									required: 'E-mail é obrigatório',
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: 'E-mail inválido',
									},
								})}
								error={errors.email?.message}
							/>

							<Input label="Telefone" type="tel" {...register('phone')} />

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Mensagem para os Noivos (Opcional)</label>
								<textarea {...register('message')} className="textarea-field" placeholder="Deixa uma mensagem carinhosa pra gente 🥺" />
							</div>

							<Button type="submit" loading={loading} className="w-full" size="lg">
								Confirmar Presença
							</Button>
						</form>
					</div>

					{/* Confirmed List */}
					<div className="card">
						<div className="text-center mb-6">
							<Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Lista de Confirmados</h3>
							<p className="text-gray-600">
								Total de confirmações: <span className="font-semibold">{rsvpList.length}</span>
							</p>
						</div>

						<div className="space-y-4 max-h-96 overflow-y-auto">
							{rsvpList.length === 0 ? (
								<div className="text-center py-8">
									<MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-500">Ainda não há confirmações.</p>
								</div>
							) : (
								rsvpList.map((rsvp) => (
									<div key={rsvp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
										<div>
											<p className="font-semibold text-gray-900">{rsvp.name}</p>
										</div>
										<div className="text-right">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Confirmado
											</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
