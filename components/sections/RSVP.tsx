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
		<section id="rsvp" className="section-padding bg-white">
			<div className="container-custom">
				<div className="text-center mb-16">
					<p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">RSVP</p>
					<h2 className="font-script text-4xl md:text-5xl text-primary-500 mb-4">Confirmar Presença</h2>
					<div className="w-24 h-px bg-primary-500 mx-auto mb-6" />
					<p className="text-neutral-600 max-w-2xl mx-auto">
						Por favor, confirme sua presença até 1º de maio para que possamos nos organizar melhor.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-12">
					{/* RSVP Form */}
					<div className="bg-cream-100 border border-neutral-200 p-8">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="text-center mb-8">
								<div className="w-14 h-14 border border-primary-500 flex items-center justify-center mx-auto mb-4">
									<Calendar className="w-7 h-7 text-primary-500" />
								</div>
								<h3 className="text-xl font-medium text-primary-500 tracking-wide">Confirme sua Presença</h3>
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
								<label className="block text-sm font-medium text-neutral-700 mb-2">Mensagem para os Noivos (Opcional)</label>
								<textarea {...register('message')} className="textarea-field" placeholder="Deixe uma mensagem carinhosa para nós" />
							</div>

							<Button type="submit" loading={loading} className="w-full" size="lg">
								Confirmar Presença
							</Button>
						</form>
					</div>

					{/* Confirmed List */}
					<div className="bg-cream-100 border border-neutral-200 p-8">
						<div className="text-center mb-8">
							<div className="w-14 h-14 border border-primary-500 flex items-center justify-center mx-auto mb-4">
								<Users className="w-7 h-7 text-primary-500" />
							</div>
							<h3 className="text-xl font-medium text-primary-500 tracking-wide mb-2">Lista de Confirmados</h3>
							<p className="text-neutral-600 text-sm">
								Total de confirmações: <span className="font-medium text-primary-500">{rsvpList.length}</span>
							</p>
						</div>

						<div className="space-y-3 max-h-96 overflow-y-auto">
							{rsvpList.length === 0 ? (
								<div className="text-center py-8">
									<MessageCircle className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
									<p className="text-neutral-500 text-sm">Ainda não há confirmações.</p>
								</div>
							) : (
								rsvpList.map((rsvp) => (
									<div key={rsvp.id} className="flex justify-between items-center p-4 bg-white border border-neutral-200">
										<div>
											<p className="font-medium text-primary-500">{rsvp.name}</p>
										</div>
										<div className="text-right">
											<span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary-500 text-cream-100 tracking-wider">
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
