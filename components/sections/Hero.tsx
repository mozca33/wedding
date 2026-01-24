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
				<div key={item.label} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
					<div className="text-2xl md:text-4xl font-bold">{item.value}</div>
					<div className="text-sm md:text-base font-medium">{item.label}</div>
				</div>
			))}
		</div>
	),
});

// Caminho da foto do casal - coloque sua foto em public/images/hero/couple.jpg
const HERO_IMAGE = '/images/hero/couple.jpg';

export const Hero = () => {
	const [imageError, setImageError] = useState(false);

	return (
		<section id="home" className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Seção principal do casamento">
			{/* Background: Foto do casal ou gradiente fallback */}
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
					<div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-600" />
				)}
				{/* Overlay escuro para garantir legibilidade do texto */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
			</div>

			{/* Conteúdo */}
			<div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
				<div className="animate-fade-in-up">
					<p className="text-lg md:text-xl mb-2 font-light tracking-widest uppercase">Nosso Casamento</p>
					<h1 className="font-script text-5xl sm:text-6xl md:text-8xl font-bold mb-4 drop-shadow-lg">
						{process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Julia & Rafael'}
					</h1>
					<div className="flex items-center justify-center gap-4 mb-2">
						<span className="w-12 h-px bg-white/60" aria-hidden="true" />
						<p className="text-xl md:text-2xl font-light">25 de Julho de 2026</p>
						<span className="w-12 h-px bg-white/60" aria-hidden="true" />
					</div>
					<p className="text-lg md:text-xl mb-8 font-light">{process.env.NEXT_PUBLIC_WEDDING_LOCATION || 'Goiânia, GO'}</p>
				</div>

				<div className="animate-fade-in-up animation-delay-400">
					<CountdownTimer />
				</div>

				<div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
						className="btn-primary text-lg px-8 py-4"
						aria-label="Ir para seção de confirmação de presença"
					>
						Confirmar Presença
					</button>
					<button
						onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
						className="bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
						aria-label="Conhecer nossa história"
					>
						Nossa História
					</button>
				</div>
			</div>

			{/* Indicador de scroll */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
				<button
					onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
					className="text-white/80 hover:text-white transition-colors"
					aria-label="Rolar para próxima seção"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</button>
			</div>
		</section>
	);
};
