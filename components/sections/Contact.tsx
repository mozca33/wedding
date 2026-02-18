// components/sections/Contact.tsx
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

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
		<section id="contact" className="section-padding relative">
			<div className="absolute inset-0 z-0">
				<Image src="/images/hero/tenis.jpeg" alt="Background" fill className="object-cover" />
				<div className="absolute inset-0" />
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-16">
					<p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-4">Fale Conosco</p>
					<h2 className="font-script text-4xl md:text-5xl text-white mb-4">Entre em Contato</h2>
					<div className="w-24 h-px bg-white mx-auto mb-6" />
					<p className="text-white/90 max-w-2xl mx-auto">
						Tem alguma dúvida sobre o casamento? Entre em contato conosco! Ficaremos felizes em ajudar.
					</p>
				</div>

				<div className="max-w-2xl mx-auto space-y-8">
					{/* Contact Info */}
					<div className="bg-transparent border border-neutral-200 p-8">
						<h3 className="text-xl font-medium mb-8 text-white text-center tracking-wide">Informações de Contato</h3>

						<div className="space-y-6">
							{contactInfo.map((info, index) => {
								const Icon = info.icon;
								return (
									<div key={info.label} className="flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
										<div className="w-12 h-12 border border-white flex items-center justify-center flex-shrink-0">
											<Icon className="w-5 h-5 text-white" />
										</div>
										<div>
											<p className="font-medium text-white text-sm tracking-wider">{info.label}</p>
											<a href={info.href} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
												{info.value}
											</a>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Wedding Info Card */}
					<div className="bg-transparent border border-neutral-200 p-8">
						<h3 className="text-lg font-medium mb-4 text-white text-center tracking-wide">Lembrete Importante</h3>
						<p className="text-white leading-relaxed text-center">
							Para confirmar sua presença, não esqueça de preencher o formulário. Isso nos ajuda muito no planejamento do dia!
						</p>
						<div className="text-center">
							<Button onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })} variant="primary" className="mt-10">
								Confirmar Presença
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
