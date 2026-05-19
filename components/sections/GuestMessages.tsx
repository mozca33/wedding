'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GuestMessage {
	id: string;
	name: string;
	message: string;
}

export const GuestMessages = () => {
	const [messages, setMessages] = useState<GuestMessage[]>([]);
	const [current, setCurrent] = useState(0);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await supabase
				.from('rsvp')
				.select('id, name, message')
				.eq('confirmed', true)
				.not('message', 'is', null)
				.neq('message', '')
				.order('created_at', { ascending: false });

			if (data && data.length > 0) {
				setMessages(data as GuestMessage[]);
			}
		};

		fetch();

		// Listen for new RSVPs in real time
		const channel = supabase
			.channel('rsvp-messages')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp' }, (payload) => {
				const row = payload.new as any;
				if (row.confirmed && row.message) {
					setMessages((prev) => [{ id: row.id, name: row.name, message: row.message }, ...prev]);
				}
			})
			.subscribe();

		return () => { supabase.removeChannel(channel); };
	}, []);

	const goTo = useCallback((index: number) => {
		setVisible(false);
		setTimeout(() => {
			setCurrent(index);
			setVisible(true);
		}, 350);
	}, []);

	useEffect(() => {
		if (messages.length <= 1) return;
		const timer = setInterval(() => {
			goTo((current + 1) % messages.length);
		}, 6000);
		return () => clearInterval(timer);
	}, [current, messages.length, goTo]);

	const msg = messages[current];

	return (
		<section className="section-padding bg-white">
			<div className="container-custom">
				<div className="text-center mb-12">
					<p className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-4">Mensagens</p>
					<h2 className="font-script text-4xl md:text-5xl text-primary-500 mb-4">O que nossos convidados dizem</h2>
					<div className="w-24 h-px bg-primary-500 mx-auto" />
				</div>

				{messages.length === 0 ? (
					<div className="max-w-2xl mx-auto bg-cream-100 border border-neutral-200 p-10 text-center">
						<p className="text-neutral-600 italic">Ainda não há mensagens. Seja o primeiro a deixar uma no formulário de confirmação!</p>
					</div>
				) : (
				<div className="max-w-2xl mx-auto">
					{/* Card */}
					<div
						className="bg-cream-100 border border-neutral-200 p-8 md:p-10 text-center flex flex-col"
						style={{
							opacity: visible ? 1 : 0,
							transform: visible ? 'translateY(0)' : 'translateY(12px)',
							transition: 'opacity 350ms ease, transform 350ms ease',
						}}
					>
						{/* Quote mark */}
						<span className="block font-script text-5xl text-primary-500/20 leading-none mb-2 select-none">"</span>

						<div className="px-2">
							<p className="text-neutral-700 text-lg leading-relaxed italic whitespace-pre-line">{msg.message}</p>
						</div>

						<div className="flex items-center justify-center gap-3 mt-8">
							<div className="w-8 h-px bg-primary-500" />
							<p className="text-primary-500 font-medium tracking-wider uppercase">{msg.name}</p>
							<div className="w-8 h-px bg-primary-500" />
						</div>
					</div>

					{/* Arrows + Counter */}
					{messages.length > 1 && (
						<div className="flex items-center justify-center gap-6 mt-6">
							<button
								onClick={() => goTo((current - 1 + messages.length) % messages.length)}
								className="w-10 h-10 flex items-center justify-center border border-neutral-300 text-primary-500 hover:border-primary-500 hover:bg-primary-500 hover:text-cream-100 transition-all duration-200"
								aria-label="Mensagem anterior"
							>
								<ChevronLeft size={18} />
							</button>

							<p className="text-sm tracking-[0.2em] text-neutral-500 tabular-nums">
								{String(current + 1).padStart(2, '0')} / {String(messages.length).padStart(2, '0')}
							</p>

							<button
								onClick={() => goTo((current + 1) % messages.length)}
								className="w-10 h-10 flex items-center justify-center border border-neutral-300 text-primary-500 hover:border-primary-500 hover:bg-primary-500 hover:text-cream-100 transition-all duration-200"
								aria-label="Próxima mensagem"
							>
								<ChevronRight size={18} />
							</button>
						</div>
					)}
				</div>
				)}
			</div>
		</section>
	);
};
