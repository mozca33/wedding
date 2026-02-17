// components/sections/GiftList.tsx
import { Gift, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const GiftList = () => {
	const handleOpenGiftList = () => {
		window.open('/presentes', '_blank');
	};

	return (
		<section id="gifts" className="section-padding bg-cream-100">
			<div className="container-custom">
				<div className="text-center mb-16">
					<p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">Presentes</p>
					<h2 className="font-script text-4xl md:text-5xl text-primary-500 mb-4">Lista de Presentes</h2>
					<div className="w-24 h-px bg-primary-500 mx-auto mb-6" />
					<p className="text-neutral-600 max-w-2xl mx-auto">
						Sua presença é o maior presente que poderíamos receber! Mas se quiser nos presentear, preparamos uma lista especial para você.
					</p>
				</div>

				{/* Card central */}
				<div className="max-w-lg mx-auto">
					<div className="bg-white border border-neutral-200 text-center p-10 hover:border-primary-500 transition-colors duration-300">
						<div className="w-16 h-16 border border-primary-500 flex items-center justify-center mx-auto mb-6">
							<Gift className="w-8 h-8 text-primary-500" />
						</div>

						<h3 className="text-xl font-medium mb-4 text-primary-500 tracking-wide">Acesse Nossa Lista</h3>

						<p className="text-neutral-600 mb-8 leading-relaxed">
							Preparamos uma lista com itens que nos ajudarão a começar nossa vida juntos. Clique no botão abaixo para ver todas as opções
							disponíveis.
						</p>

						<Button onClick={handleOpenGiftList} size="lg" className="w-full">
							<Gift size={20} className="mr-2" />
							Ver Lista de Presentes
							<ExternalLink size={16} className="ml-2" />
						</Button>
					</div>
				</div>

				{/* Mensagem especial */}
				<div className="bg-white border border-neutral-200 text-center max-w-2xl mx-auto mt-8 p-8">
					<p className="text-neutral-600 leading-relaxed italic">
						"Não se sinta no dever de nos presentear. O mais importante é compartilhar esse momento especial com a gente. Cada gesto de carinho será
						apreciado e guardado com muito amor."
					</p>
					<p className="text-primary-500 font-medium mt-6 tracking-wider">— Julia & Rafael</p>
				</div>
			</div>
		</section>
	);
};
