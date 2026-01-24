// hooks/useRSVP.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RSVPData, RSVPRow } from '@/lib/types';
import { useNotification } from './useNotification';

export const useRSVP = () => {
	const [loading, setLoading] = useState(false);
	const [rsvpList, setRsvpList] = useState<RSVPData[]>([]);
	const { showNotification } = useNotification();

	const fetchRSVPList = useCallback(async () => {
		try {
			console.log('🔍 Buscando lista de RSVP...');

			const { data, error } = await supabase
				.from('rsvp')
				.select('*')
				.order('created_at', { ascending: false });

			console.log('📊 Resultado da query:', { data, error });

			if (error) throw error;

			if (!data || data.length === 0) {
				console.log('⚠️ Nenhum dado retornado');
				setRsvpList([]);
				return;
			}

			const formattedData: RSVPData[] = (data as RSVPRow[]).map((item) => ({
				id: item.id,
				name: item.name,
				email: item.email,
				phone: item.phone || undefined,
				message: item.message || undefined,
				confirmed: item.confirmed,
			}));

			console.log('✅ Lista formatada:', formattedData);
			setRsvpList(formattedData);
		} catch (error) {
			console.error('❌ Error fetching RSVP list:', error);
			showNotification('Erro ao carregar lista de confirmados.', 'error');
		}
	}, [showNotification]);

	const submitRSVP = useCallback(
		async (data: RSVPData) => {
			setLoading(true);
			try {
				// Verificar se já existe cadastro com mesmo email
				const { data: existingByEmail } = await supabase.from('rsvp').select('id').eq('email', data.email).limit(1);

				if (existingByEmail && existingByEmail.length > 0) {
					showNotification('Este email já foi utilizado para confirmar presença.', 'error');
					setLoading(false);
					return { success: false, error: 'Email já cadastrado' };
				}

				// Verificar se já existe cadastro com mesmo telefone (se fornecido)
				if (data.phone) {
					const { data: existingByPhone } = await supabase.from('rsvp').select('id').eq('phone', data.phone).limit(1);

					if (existingByPhone && existingByPhone.length > 0) {
						showNotification('Este telefone já foi utilizado para confirmar presença.', 'error');
						setLoading(false);
						return { success: false, error: 'Telefone já cadastrado' };
					}
				}

				const { error }: { error: unknown } = await supabase.from('rsvp').insert({
					name: data.name,
					email: data.email,
					phone: data.phone,
					message: data.message,
					confirmed: true,
				});

				if (error) throw error;

				// Enviar notificação automática via WhatsApp (API)
				try {
					await fetch('/api/notify-whatsapp', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							name: data.name,
							email: data.email,
							phone: data.phone,
							message: data.message,
						}),
					});
				} catch (notifyError: unknown) {
					// Não bloqueia o RSVP se a notificação falhar
					console.error('Erro ao enviar notificação WhatsApp:', notifyError);
				}

				showNotification('Presença confirmada com sucesso! 🎉', 'success');
				await fetchRSVPList();

				return { success: true };
			} catch (error: unknown) {
				console.error('Error submitting RSVP:', error);
				showNotification('Erro ao confirmar presença. Tente novamente.', 'error');
				return { success: false, error };
			} finally {
				setLoading(false);
			}
		},
		[fetchRSVPList, showNotification]
	);

	return {
		loading,
		rsvpList,
		submitRSVP,
		fetchRSVPList,
	};
};
