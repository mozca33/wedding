// components/sections/Contact.tsx
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Contact = () => {
	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

	const contactInfo = [
		{
			icon: Mail,
			label: 'E-mail',
			value: process.env.NEXT_PUBLIC_EMAIL || 'email@example.com',
			href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'email@example.com'}`,
		},
		{
			icon: Phone,
			label: 'Telefone',
			value: whatsappNumber ? `+${whatsappNumber}` : '(00) 00000-0000',
			href: `https://wa.me/${whatsappNumber}`,
		},
		{
			icon: MapPin,
			label: 'Local da Cerimônia',
			value: 'Recanto dos buritis, Goiânia - GO',
			href: 'https://maps.app.goo.gl/DYJuZdPYVZN15X978',
		},
		{
			icon: Instagram,
			label: 'Instagram',
			value: `@${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'username'}`,
			href: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || ''}`,
		},
	];

	return (
		<section id="contact" className="section-padding gradient-bg">
			<div className="container-custom">
				<div className="text-center mb-16">
					<h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">Entre em Contato</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Tem alguma dúvida sobre o casamento? Entre em contato conosco! Ficaremos felizes em ajudar.
					</p>
				</div>

				<div className="max-w-2xl mx-auto space-y-8">
					{/* Contact Info */}
					<div className="card">
						<h3 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Informações de Contato</h3>

						<div className="space-y-6">
							{contactInfo.map((info, index) => {
								const Icon = info.icon;
								return (
									<div key={info.label} className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
										<div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
											<Icon className="w-6 h-6 text-white" />
										</div>
										<div>
											<p className="font-medium text-gray-900">{info.label}</p>
											<a
												href={info.href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary-600 hover:text-primary-700 transition-colors"
											>
												{info.value}
											</a>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Wedding Info Card */}
					<div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
						<h3 className="text-xl font-semibold mb-4 text-gray-900 text-center">Lembrete Importante</h3>
						<p className="text-gray-700 leading-relaxed text-center">
							Para confirmar sua presença, não esqueça de preencher o formulário. Isso nos ajuda muito no planejamento do dia!
						</p>
						<div className="text-center">
							<Button onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="mt-4">
								Confirmar Presença
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
