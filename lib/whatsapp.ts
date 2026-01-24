// lib/whatsapp.ts
interface RSVPNotification {
  name: string
  email: string
  phone?: string
  guestsCount: number
  guestNames?: string[]
  dietaryRestrictions?: string
  message?: string
}

export const sendRSVPNotification = (data: RSVPNotification) => {
  const guestsList = data.guestNames?.length 
    ? `\nConvidados: ${data.guestNames.join(', ')}`
    : ''
  
  const dietary = data.dietaryRestrictions 
    ? `\nRestrições alimentares: ${data.dietaryRestrictions}`
    : ''
  
  const userMessage = data.message 
    ? `\nMensagem: ${data.message}`
    : ''

  const whatsappMessage = `🎉 NOVA CONFIRMAÇÃO DE PRESENÇA! 🎉

👤 Nome: ${data.name}
📧 E-mail: ${data.email}
📱 Telefone: ${data.phone || 'Não informado'}
👥 Número de convidados: ${data.guestsCount + 1}${guestsList}${dietary}${userMessage}

Data/Hora: ${new Date().toLocaleString('pt-BR')}

#CasamentoConfirmado`

  const phoneNumber = '5562994776888' // Seu WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
  
  // Abrir WhatsApp em nova aba
  window.open(whatsappUrl, '_blank')
}