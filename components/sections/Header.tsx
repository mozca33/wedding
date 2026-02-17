import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navigation = [
		{ name: 'Início', href: '#home' },
		{ name: 'Informações', href: '#info' },
		{ name: 'Nossa História', href: '#story' },
		{ name: 'Presentes', href: '#gifts' },
		{ name: 'Galeria', href: '#gallery' },
		{ name: 'Confirmar Presença', href: '#rsvp' },
		{ name: 'Contato', href: '#contact' },
	];

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setIsMenuOpen(false);
	};

	return (
		<header
			className={cn(
				'fixed top-0 w-full z-40 transition-all duration-500',
				isScrolled ? 'bg-cream-100/95 backdrop-blur-md border-b border-neutral-200' : 'bg-transparent'
			)}
		>
			<div className="container-custom">
				<div className="flex items-center justify-between h-16 md:h-20">
					<Link
						href="/"
						className={cn(
							'font-script text-2xl md:text-3xl font-semibold transition-colors duration-300 tracking-wide',
							isScrolled ? 'text-primary-500' : 'text-white drop-shadow-md'
						)}
					>
						J & R
					</Link>

					<nav className="hidden md:flex space-x-8">
						{navigation.map((item) => (
							<button
								key={item.name}
								onClick={() => scrollToSection(item.href)}
								className={cn(
									'transition-colors duration-300 text-sm tracking-wider uppercase',
									isScrolled ? 'text-neutral-600 hover:text-primary-500' : 'text-white/90 hover:text-white drop-shadow-sm'
								)}
							>
								{item.name}
							</button>
						))}
					</nav>

					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className={cn(
							'md:hidden p-2 transition-colors',
							isScrolled ? 'text-primary-500 hover:text-primary-600' : 'text-white hover:text-white/80'
						)}
						aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{isMenuOpen && (
					<div className="md:hidden bg-cream-100 border-t border-neutral-200">
						<nav className="py-4 space-y-1">
							{navigation.map((item) => (
								<button
									key={item.name}
									onClick={() => scrollToSection(item.href)}
									className="block w-full text-left px-4 py-3 text-neutral-600 hover:text-primary-500 hover:bg-cream-200 transition-colors duration-300 text-sm tracking-wider uppercase"
								>
									{item.name}
								</button>
							))}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};
