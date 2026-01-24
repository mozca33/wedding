import { MapPin, Calendar, Clock, Shirt } from 'lucide-react'

export const WeddingInfo = () => {
  const infoCards = [
    {
      icon: Calendar,
      title: 'Data e Horário',
      content: (
        <div>
          <p className="font-semibold text-lg mb-2">25 de Julho de 2026</p>
          <p>Cerimônia: 16h00</p>
          <p>Recepção: 18h00</p>
        </div>
      )
    },
    {
      icon: MapPin,
      title: 'Localização',
      content: (
        <div id='maps-location'>
          <p className="font-semibold mb-2">Recanto dos Buritis</p>
          <p className="text-gray-600 mb-3">Av. Portugal, QD B - chácara 7 - Buriti Sereno, Aparecida de Goiânia - GO, 74942-210<br />Goiânia, GO</p>
          <a
            href="https://maps.app.goo.gl/YTouAzkUkWDXMSBh6"
            
            rel="noopener noreferrer"
            className="btn-outline text-sm"
          >
            <MapPin size={16} className="mr-2" />
            Ver no Mapa
          </a>
        </div>
      )
    },
    {
      icon: Shirt,
      title: 'Dress Code',
      content: (
        <div>
          <p className="font-semibold mb-2">Traje Esporte Fino</p>
          <div className="space-y-2 text-sm">
            <p><strong>Cores sugeridas:</strong> Azul, Rosa, Bege</p>
            <p><strong>Evitar:</strong> Branco, Preto, Vermelho</p>
            <p><strong>Homens:</strong> Terno ou blazer</p>
            <p><strong>Mulheres:</strong> Vestido ou conjunto elegante</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="info" className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
            Informações do Casamento
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todas as informações importantes para você não perder nenhum detalhe do dia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {infoCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className={`card text-center animate-fade-in-up`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {card.title}
                </h3>
                <div className="text-gray-700">
                  {card.content}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}