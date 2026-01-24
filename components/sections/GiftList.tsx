// components/sections/GiftList.tsx
import { Gift, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const GiftList = () => {
	const handleOpenGiftList = () => {
		window.open('/presentes', '_blank');
	};

	return (
		<section id="gifts" className="section-padding gradient-bg">
			<div className="container-custom">
				<div className="text-center mb-12">
					<h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
						Lista de Presentes
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Sua presença é o maior presente que poderíamos receber! Mas se quiser nos
						presentear, preparamos uma lista especial para você.
					</p>
				</div>

				{/* Card central */}
				<div className="max-w-lg mx-auto">
					<div className="card text-center p-8 hover:shadow-2xl transition-shadow duration-300">
						<div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
							<Gift className="w-10 h-10 text-white" />
						</div>

						<h3 className="text-2xl font-semibold mb-4 text-gray-900">
							Acesse Nossa Lista
						</h3>

						<p className="text-gray-600 mb-6 leading-relaxed">
							Preparamos uma lista com itens que nos ajudarão a começar nossa vida
							juntos. Clique no botão abaixo para ver todas as opções disponíveis.
						</p>

						<Button onClick={handleOpenGiftList} size="lg" className="w-full">
							<Gift size={20} className="mr-2" />
							Ver Lista de Presentes
							<ExternalLink size={16} className="ml-2" />
						</Button>

						<p className="text-sm text-gray-500 mt-4">
							A lista abrirá em uma nova aba
						</p>
					</div>
				</div>

				{/* Mensagem especial */}
				<div className="card text-center max-w-2xl mx-auto mt-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
					<p className="text-gray-700 leading-relaxed italic">
						"Não se sinta no dever de nos presentear. O mais importante é compartilhar
						esse momento especial com a gente. Cada gesto de carinho será apreciado e
						guardado com muito amor."
					</p>
					<p className="text-primary-600 font-semibold mt-4">— Julia & Rafael</p>
				</div>
			</div>
		</section>
	);
};
