import { MapPin, Calendar, Shirt } from 'lucide-react';

export const WeddingInfo = () => {
	const infoCards = [
		{
			icon: Calendar,
			title: 'Data e Horário',
			content: (
				<div>
					<p className="font-medium text-lg mb-3">25 de Julho de 2026</p>
					<p className="text-neutral-600">Cerimônia: 16h00</p>
					<p className="text-neutral-600">Recepção: 18h00</p>
				</div>
			),
		},
		{
			icon: MapPin,
			title: 'Localização',
			content: (
				<div id="maps-location">
					<p className="font-medium mb-3">Recanto dos Buritis</p>
					<p className="text-neutral-600 mb-4 text-sm leading-relaxed">
						Av. Portugal, QD B - chácara 7 - Buriti Sereno, Aparecida de Goiânia - GO, 74942-210
					</p>
					<a href="https://maps.app.goo.gl/YTouAzkUkWDXMSBh6" rel="noopener noreferrer" className="btn-outline text-sm inline-flex items-center">
						<MapPin size={16} className="mr-2" />
						Ver no Mapa
					</a>
				</div>
			),
		},
		{
			icon: Shirt,
			title: 'Dress Code',
			content: (
				<div>
					<p className="font-medium mb-3"></p>
					<div className="space-y-2 text-sm text-neutral-600">
						<p>
							<span className="font-medium text-primary-500">Social</span>
						</p>
						<p>
							<span className="font-medium text-primary-500">Não Usar:</span> Branco e Preto ou cores claras que pareçam com branco (ex: bege, creme,
							off-white)
						</p>
						<p>
							<span className="font-medium text-primary-500">Homens:</span> Traje social (terno ou camisa social com calça)
						</p>
						<p>
							<span className="font-medium text-primary-500">Mulheres:</span> Vestido (Mid ou long) ou conjunto elegante
						</p>
					</div>
				</div>
			),
		},
	];

	return (
		<section id="info" className="section-padding bg-cream-100">
			<div className="container-custom">
				<div className="text-center mb-16">
					<p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">Detalhes</p>
					<h2 className="font-script text-4xl md:text-5xl text-primary-500 mb-4">Informações do Casamento</h2>
					<div className="w-24 h-px bg-primary-500 mx-auto mb-6" />
					<p className="text-neutral-600 max-w-2xl mx-auto">Todas as informações importantes para você não perder nenhum detalhe do dia</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{infoCards.map((card, index) => {
						const Icon = card.icon;
						return (
							<div
								key={card.title}
								className="bg-white border border-neutral-200 p-8 text-center animate-fade-in-up hover:border-primary-500 transition-colors duration-300"
								style={{ animationDelay: `${index * 200}ms` }}
							>
								<div className="w-16 h-16 border border-primary-500 flex items-center justify-center mx-auto mb-6">
									<Icon className="w-7 h-7 text-primary-500" />
								</div>
								<h3 className="text-lg font-medium mb-4 text-primary-500 tracking-wide">{card.title}</h3>
								<div className="text-neutral-700">{card.content}</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};
