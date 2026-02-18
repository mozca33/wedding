import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface StorySection {
	id: string;
	title: string;
	images: string[];
}

const storySections: StorySection[] = [
	{
		id: 'primeiro-encontro',
		title: 'Nosso primeiro encontro',
		images: ['/images/story/primeiro-encontro.jpeg'],
	},
	{
		id: 'primeira-viagem',
		title: 'Nossa primeira viagem juntos',
		images: ['/images/story/primeira-viagem.jpeg'],
	},
	{
		id: 'pedido',
		title: 'O pedido de casamento!',
		images: ['/images/story/pedido.jpeg'],
	},
	{
		id: 'aliancas',
		title: 'Fizemos nossas próprias alianças',
		images: [
			'/images/story/alianças-1.jpeg',
			'/images/story/alianças-2.jpeg',
			'/images/story/alianças-3.jpeg',
			'/images/story/alianças-4.jpeg',
			'/images/story/alianças-5.jpeg',
			'/images/story/alianças-6.jpeg',
		],
	},
	{
		id: 'adotamos',
		title: 'Adotamos um gatinho',
		images: ['/images/story/adotamos.jpeg'],
	},
	{
		id: 'shows',
		title: 'Gostamos de ir em shows e fazer shows',
		images: [
			'/images/story/show-1.jpeg',
			'/images/story/show-2.jpeg',
			'/images/story/show-3.jpeg',
			'/images/story/show-4.jpeg',
			'/images/story/show-5.jpeg',
			'/images/story/show-6.jpeg',
			'/images/story/show-7.jpeg',
			'/images/story/show-8.jpeg',
		],
	},
	{
		id: 'cafe',
		title: 'Gostamos de ir em cafeterias',
		images: [
			'/images/story/café.jpeg',
			'/images/story/café-2.jpeg',
			'/images/story/café-3.jpeg',
			'/images/story/café-4.jpeg',
			'/images/story/café-5.jpeg',
		],
	},
	{
		id: 'animais',
		title: 'AMAMOS nossos animaizinhos',
		images: ['/images/story/animais-1.jpeg', '/images/story/animais-5.jpeg', '/images/story/animais-3.jpeg', '/images/story/animais-4.jpeg'],
	},
	{
		id: 'anime-filmes',
		title: 'Gostamos de assistir anime e filmes',
		images: [
			'/images/story/anime-1.jpeg',
			'/images/story/anime-2.jpeg',
			'/images/story/indo-cinema-1.jpeg',
			'/images/story/indo-cinema-2.jpeg',
			'/images/story/indo-cinema-3.jpeg',
			'/images/story/indo-cinema-4.jpeg',
		],
	},
	{
		id: 'eventos-culturais',
		title: 'Gostamos de ir em eventos culturais',
		images: [
			'/images/story/evento-cultural-1.jpeg',
			'/images/story/evento-cultural-2.jpeg',
			'/images/story/evento-cultural-3.jpeg',
			'/images/story/evento-cultural-4.jpeg',
			'/images/story/evento-cultural-5.jpeg',
			'/images/story/museu-1.jpeg',
			'/images/story/museu-2.jpeg',
		],
	},
	{
		id: 'comidinha',
		title: 'Gostamos de cozinhar (Ju cozinha e Rafa dá apoio emocional)',
		images: ['/images/story/comidinha-1.jpeg', '/images/story/comidinha-2.jpeg'],
	},
	{
		id: 'ensaio-hero',
		title: 'Nosso Ensaio',
		images: [
			'/images/hero/divos.jpeg',
			'/images/hero/alianças.jpeg',
			'/images/hero/bebendo.jpeg',
			'/images/hero/cafezinho.jpeg',
			'/images/hero/emo.jpeg',
			'/images/hero/hobby.jpeg',
			'/images/hero/juntinhos.jpeg',
			'/images/hero/maos.jpeg',
			'/images/hero/nos.jpeg',
			'/images/hero/sentados.jpeg',
		],
	},
];

interface GalleryModalProps {
	section: StorySection;
	initialIndex: number;
	onClose: () => void;
}

const GalleryModal = ({ section, initialIndex, onClose }: GalleryModalProps) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const hasMultipleImages = section.images.length > 1;

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? section.images.length - 1 : prev - 1));
	}, [section.images.length]);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev === section.images.length - 1 ? 0 : prev + 1));
	}, [section.images.length]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowLeft') goToPrevious();
			if (e.key === 'ArrowRight') goToNext();
		};

		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose, goToPrevious, goToNext]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
			{/* Close Button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
				aria-label="Fechar galeria"
			>
				<X className="w-6 h-6 text-white" />
			</button>

			{/* Title */}
			<div className="absolute top-4 left-4 right-16 z-50">
				<h3 className="text-white text-lg md:text-xl font-semibold truncate">{section.title}</h3>
				{hasMultipleImages && (
					<p className="text-white/70 text-sm">
						{currentIndex + 1} de {section.images.length}
					</p>
				)}
			</div>

			{/* Navigation Arrows */}
			{hasMultipleImages && (
				<>
					<button
						onClick={(e) => {
							e.stopPropagation();
							goToPrevious();
						}}
						className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
						aria-label="Foto anterior"
					>
						<ChevronLeft className="w-8 h-8 text-white" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							goToNext();
						}}
						className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
						aria-label="Próxima foto"
					>
						<ChevronRight className="w-8 h-8 text-white" />
					</button>
				</>
			)}

			{/* Image Container */}
			<div className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-20" onClick={(e) => e.stopPropagation()}>
				<div className="relative max-w-full max-h-full">
					<Image
						src={section.images[currentIndex]}
						alt={`${section.title} - Foto ${currentIndex + 1}`}
						width={1200}
						height={800}
						className="max-w-full max-h-[calc(100vh-10rem)] w-auto h-auto object-contain rounded-lg"
						priority
					/>
				</div>
			</div>

			{/* Thumbnail Strip */}
			{hasMultipleImages && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-2 bg-black/50 rounded-full max-w-[90vw] overflow-x-auto">
					{section.images.map((image, idx) => (
						<button
							key={idx}
							onClick={(e) => {
								e.stopPropagation();
								setCurrentIndex(idx);
							}}
							className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
								idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'
							}`}
							aria-label={`Ir para foto ${idx + 1}`}
						>
							<Image src={image} alt={`Miniatura ${idx + 1}`} fill className="object-cover" sizes="56px" />
						</button>
					))}
				</div>
			)}
		</div>
	);
};

interface StoryCardProps {
	section: StorySection;
	index: number;
	onOpenGallery: (section: StorySection, imageIndex: number) => void;
}

const StoryCard = ({ section, index, onOpenGallery }: StoryCardProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [imageError, setImageError] = useState(false);
	const hasMultipleImages = section.images.length > 1;

	const goToPrevious = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === 0 ? section.images.length - 1 : prev - 1));
	};

	const goToNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === section.images.length - 1 ? 0 : prev + 1));
	};

	const handleCardClick = () => {
		onOpenGallery(section, currentImageIndex);
	};

	return (
		<div
			className="group relative bg-white border border-neutral-200 overflow-hidden animate-fade-in-up hover:border-primary-500 transition-all duration-300 cursor-pointer"
			style={{ animationDelay: `${index * 100}ms` }}
			onClick={handleCardClick}
		>
			{/* Image Container */}
			<div className="relative aspect-[4/3] overflow-hidden">
				{!imageError ? (
					<Image
						src={section.images[currentImageIndex]}
						alt={section.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
						onError={() => setImageError(true)}
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-cream-100">
						<Heart className="w-12 h-12 text-neutral-300" />
					</div>
				)}

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

				{/* Click hint */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<span className="bg-cream-100 text-primary-500 px-4 py-2 text-sm tracking-wider">Ver mais</span>
				</div>

				{/* Navigation Arrows */}
				{hasMultipleImages && (
					<>
						<button
							onClick={goToPrevious}
							className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
							aria-label="Foto anterior"
						>
							<ChevronLeft className="w-5 h-5 text-primary-500" />
						</button>
						<button
							onClick={goToNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-100/90 hover:bg-cream-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
							aria-label="Próxima foto"
						>
							<ChevronRight className="w-5 h-5 text-primary-500" />
						</button>
					</>
				)}

				{/* Image Counter */}
				{hasMultipleImages && (
					<div className="absolute top-3 right-3 bg-primary-500/80 text-cream-100 text-xs px-2 py-1">
						{currentImageIndex + 1} / {section.images.length}
					</div>
				)}

				{/* Dots Indicator */}
				{hasMultipleImages && (
					<div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
						{section.images.map((_, idx) => (
							<button
								key={idx}
								onClick={(e) => {
									e.stopPropagation();
									setCurrentImageIndex(idx);
								}}
								className={`w-2 h-2 transition-all duration-300 ${
									idx === currentImageIndex ? 'bg-cream-100 w-4' : 'bg-cream-100/50 hover:bg-cream-100/75'
								}`}
								aria-label={`Ir para foto ${idx + 1}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* Title */}
			<div className="absolute bottom-0 left-0 right-0 p-4">
				<h3 className="text-cream-100 font-medium text-base leading-tight drop-shadow-lg tracking-wide">{section.title}</h3>
			</div>
		</div>
	);
};

export const OurStory = () => {
	const [galleryState, setGalleryState] = useState<{
		isOpen: boolean;
		section: StorySection | null;
		imageIndex: number;
	}>({
		isOpen: false,
		section: null,
		imageIndex: 0,
	});

	const openGallery = (section: StorySection, imageIndex: number) => {
		setGalleryState({
			isOpen: true,
			section,
			imageIndex,
		});
	};

	const closeGallery = () => {
		setGalleryState({
			isOpen: false,
			section: null,
			imageIndex: 0,
		});
	};

	return (
		<>
			<section id="story" className="section-padding bg-white">
				<div className="container-custom">
					<div className="text-center mb-16">
						<p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">Sobre nós</p>
						<h2 className="font-script text-4xl md:text-5xl text-primary-500 mb-4">Nossa História</h2>
						<div className="w-24 h-px bg-primary-500 mx-auto mb-6" />
						<p className="text-neutral-600 max-w-2xl mx-auto">Cada casal tem uma história única. Esta é a nossa jornada até o altar.</p>
					</div>

					{/* Grid de Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{storySections.map((section, index) => (
							<StoryCard key={section.id} section={section} index={index} onOpenGallery={openGallery} />
						))}
					</div>

					{/* Call to Action */}
					<div className="text-center mt-20">
						<div className="bg-cream-100 border border-neutral-200 p-10 max-w-2xl mx-auto">
							<div className="w-12 h-12 border border-primary-500 flex items-center justify-center mx-auto mb-6">
								<Heart className="w-6 h-6 text-primary-500" />
							</div>
							<h3 className="text-2xl font-script text-primary-500 mb-4">E agora, nossa nova aventura começa!</h3>
							<p className="text-neutral-600 leading-relaxed">
								Queremos compartilhar este momento especial com vocês, nossas pessoas mais queridas. Sua presença tornará nosso dia ainda mais
								especial!
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Gallery Modal */}
			{galleryState.isOpen && galleryState.section && (
				<GalleryModal section={galleryState.section} initialIndex={galleryState.imageIndex} onClose={closeGallery} />
			)}
		</>
	);
};
