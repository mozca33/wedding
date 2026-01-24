import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Heart, Camera } from 'lucide-react'

interface TimelineItem {
  date: string
  title: string
  description: string
  image?: string
  imageAlt?: string
}

export const OurStory = () => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

  const timeline: TimelineItem[] = [
    {
      date: 'Maio 2022',
      title: 'Como nos conhecemos',
      description: '',
      image: '/images/story/conhecemos.jpeg',
      imageAlt: 'Primeira foto juntos no shopping'
    },
    {
      date: 'Junho 2022',
      title: 'Primeiro Encontro',
      description: '',
      image: '/images/story/primeiro-encontro.jpeg',
      imageAlt: 'Primeira foto do nosso encontro'
    },
    {
      date: 'Dezembro 2023',
      title: 'O Pedido',
      description: '',
      image: '/public/images/story/pedido.jpeg',
      imageAlt: 'Momento do pedido de casamento na cabine'
    }
  ]

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const PlaceholderImage = ({ title, index }: { title: string; index: number }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-primary-100 to-secondary-100">
      <Camera className="w-12 h-12 mb-2 text-primary-400" />
      <p className="text-sm font-medium text-center px-4">{title}</p>
      <p className="text-xs text-gray-400 mt-1"></p>
    </div>
  )

  return (
    <section id="story" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
            Nossa História
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada casal tem uma história única. Esta é a nossa jornada até o altar.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-300 hidden md:block" />

          {timeline.map((item, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-col md:space-x-8`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg z-10 hidden md:block" />

              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} text-center md:text-left`}>
                <div className="card animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <Calendar className="w-4 h-4 text-primary-600 mr-2" />
                    <p className="text-primary-600 font-semibold">{item.date}</p>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center justify-center md:justify-start">
                    <Heart className="w-5 h-5 text-red-500 mr-2" />
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 mb-6 md:mb-0">
                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg animate-fade-in-up hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 200 + 100}ms` }}>
                  {item.image && !imageErrors[index] ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(index)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <PlaceholderImage title={item.title} index={index} />
                  )}
                  
                  {/* Overlay com informações */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-medium">{item.date}</p>
                      <p className="text-xs opacity-90">{item.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card max-w-2xl mx-auto">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              E agora, nossa nova aventura começa!
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Queremos compartilhar este momento especial com vocês, nossas pessoas mais queridas. 
              Sua presença tornará nosso dia ainda mais especial!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}