import { Instagram, MessageSquare } from 'lucide-react';

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

	const socialLinks = [
		{
			icon: Instagram,
			href: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'username'}`,
			label: 'Instagram',
		},
		{
			icon: MessageSquare,
			href: `https://wa.me/${whatsappNumber}`,
			label: 'WhatsApp',
		},
	];

	const quickLinks = [
		{ name: 'Início', href: '#home' },
		{ name: 'Informações', href: '#info' },
		{ name: 'Nossa História', href: '#story' },
		{ name: 'Confirmar Presença', href: '#rsvp' },
		{ name: 'Presentes', href: '#gifts' },
		{ name: 'Galeria', href: '#gallery' },
		{ name: 'Contato', href: '#contact' },
	];

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<footer className="bg-primary-500 text-cream-100">
			<div className="container-custom py-16">
				<div className="grid md:grid-cols-3 gap-12 mb-12">
					{/* Logo and Description */}
					<div className="text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start mb-6">
							<span className="font-script text-3xl">Julia & Rafael</span>
						</div>
						<p className="text-cream-300 leading-relaxed text-sm">
							Celebrando nosso amor e compartilhando nossa alegria com vocês. Obrigado por fazer parte da nossa história.
						</p>
					</div>

					{/* Quick Links */}
					<div className="text-center">
						<h3 className="text-sm font-medium mb-6 tracking-widest uppercase">Links Rápidos</h3>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<button
										onClick={() => scrollToSection(link.href)}
										className="text-cream-300 hover:text-cream-100 transition-colors duration-300 text-sm tracking-wider"
									>
										{link.name}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className="w-full h-px bg-cream-800 mb-8" />

				{/* Bottom Bar */}
				<div className="text-center">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-cream-400 text-xs tracking-wider">&copy; {currentYear} Julia & Rafael</p>
						<p className="text-cream-400 text-xs tracking-wider">25 de Julho de 2026</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
