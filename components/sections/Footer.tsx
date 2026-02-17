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

					{/* Contact and Social */}
					<div className="text-center md:text-right">
						<h3 className="text-sm font-medium mb-6 tracking-widest uppercase">Nos Acompanhe</h3>
						<div className="flex justify-center md:justify-end space-x-4 mb-6">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										rel="noopener noreferrer"
										className="w-10 h-10 border border-cream-400 flex items-center justify-center text-cream-300 hover:text-cream-100 hover:border-cream-100 transition-all duration-300"
										title={social.label}
									>
										<Icon className="w-5 h-5" />
									</a>
								);
							})}
						</div>
						<div className="text-cream-300 text-sm space-y-1">
							<p>{process.env.NEXT_PUBLIC_EMAIL || 'email@example.com'}</p>
							<p>
								<a
									href={`https://wa.me/${whatsappNumber}`}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-cream-100 transition-colors"
								>
									+{whatsappNumber}
								</a>
							</p>
						</div>
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
