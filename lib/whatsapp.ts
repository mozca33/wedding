// lib/whatsapp.ts
interface ContactMessage {
	name: string;
	email: string;
	message: string;
}

export const sendContactMessage = (data: ContactMessage) => {
	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
	const message = `Nova mensagem do site de casamento:\n\nNome: ${data.name}\nE-mail: ${data.email}\nMensagem: ${data.message}`;
	const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

	window.open(whatsappUrl, '_blank');
};
