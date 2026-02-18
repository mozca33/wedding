import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

// Importar o countdown dinamicamente sem SSR
const CountdownTimer = dynamic(() => import('../CountDownTimer').then((mod) => ({ default: mod.CountdownTimer })), {
	ssr: false,
	loading: () => (
		<div className="flex justify-center space-x-4 md:space-x-8 mb-8">
			{[
				{ label: 'Dias', value: '--' },
				{ label: 'Horas', value: '--' },
				{ label: 'Minutos', value: '--' },
				{ label: 'Segundos', value: '--' },
			].map((item) => (
				<div key={item.label} className="text-center border border-white/30 p-4 min-w-[80px]">
					<div className="text-2xl md:text-4xl font-light">{item.value}</div>
					<div className="text-xs md:text-sm tracking-widest uppercase">{item.label}</div>
				</div>
			))}
		</div>
	),
});

// Caminho da foto do casal - coloque sua foto em public/images/hero/couple.jpg
const HERO_IMAGE = '/images/hero/capa.jpeg';

export const Hero = () => {
	const [imageError, setImageError] = useState(false);

	return (
		<section id="home" className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Seção principal do casamento">
			{/* Background: Foto do casal ou fallback elegante */}
			<div className="absolute inset-0 z-0">
				{!imageError ? (
					<Image
						src={HERO_IMAGE}
						alt="Julia e Rafael - Foto do casal"
						fill
						priority
						quality={85}
						className="object-cover object-center"
						onError={() => setImageError(true)}
						sizes="100vw"
					/>
				) : (
					<div className="w-full h-full bg-primary-500" />
				)}
				{/* Overlay elegante preto */}
				<div className="absolute inset-0 bg-black/50" />
			</div>

			{/* Conteúdo */}
			<div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
				<div className="animate-fade-in-up">
					<p className="text-sm md:text-base mb-4 tracking-[0.3em] uppercase font-light">Nosso Casamento</p>
					<h1 className="font-script text-5xl sm:text-6xl md:text-8xl font-normal mb-6">
						{process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Julia & Rafael'}
					</h1>
					<div className="flex items-center justify-center gap-6 mb-4">
						<span className="w-16 h-px bg-white/40" aria-hidden="true" />
						<p className="text-lg md:text-xl tracking-wider font-light">25 de Julho de 2026</p>
						<span className="w-16 h-px bg-white/40" aria-hidden="true" />
					</div>
					<p className="text-base md:text-lg mb-10 tracking-wider font-light">{process.env.NEXT_PUBLIC_WEDDING_LOCATION || 'Goiânia, GO'}</p>
				</div>

				<div className="animate-fade-in-up animation-delay-400">
					<CountdownTimer />
				</div>

				<div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
						className="bg-white text-primary-500 font-medium py-4 px-10 border border-white hover:bg-transparent hover:text-white transition-all duration-300 tracking-wider uppercase text-sm"
						aria-label="Ir para seção de confirmação de presença"
					>
						Confirmar Presença
					</button>
					<button
						onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
						className="bg-transparent text-white font-medium py-4 px-10 border border-white/60 hover:border-white hover:bg-white/10 transition-all duration-300 tracking-wider uppercase text-sm"
						aria-label="Conhecer nossa história"
					>
						Nossa História
					</button>
				</div>
			</div>
		</section>
	);
};
