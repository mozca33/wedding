import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Heart, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface StorySection {
  id: string
  title: string
  images: string[]
}

const storySections: StorySection[] = [
  {
    id: 'primeiro-encontro',
    title: 'Nosso primeiro encontro',
    images: ['/images/story/primeiro-encontro.jpeg']
  },
  {
    id: 'primeira-viagem',
    title: 'Nossa primeira viagem juntos',
    images: ['/images/story/primeira-viagem.jpeg']
  },
  {
    id: 'pedido',
    title: 'O pedido de casamento!',
    images: ['/images/story/pedido.jpeg']
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
      '/images/story/alianças-6.jpeg'
    ]
  },
  {
    id: 'adotamos',
    title: 'Adotamos um gatinho',
    images: ['/images/story/adotamos.jpeg']
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
      '/images/story/show-8.jpeg'
    ]
  },
  {
    id: 'cafe',
    title: 'Gostamos de ir em cafeterias',
    images: [
      '/images/story/café.jpeg',
      '/images/story/café-2.jpeg',
      '/images/story/café-3.jpeg',
      '/images/story/café-4.jpeg',
      '/images/story/café-5.jpeg'
    ]
  },
  {
    id: 'animais',
    title: 'AMAMOS nossos animaizinhos',
    images: [
      '/images/story/animais-1.jpeg',
      '/images/story/animais-2.jpeg'
    ]
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
      '/images/story/indo-cinema-4.jpeg'
    ]
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
      '/images/story/museu-2.jpeg'
    ]
  },
  {
    id: 'comidinha',
    title: 'Gostamos de cozinhar (Ju cozinha e Rafa dá apoio emocional)',
    images: [
      '/images/story/comidinha-1.jpeg',
      '/images/story/comidinha-2.jpeg'
    ]
  }
]

interface GalleryModalProps {
  section: StorySection
  initialIndex: number
  onClose: () => void
}

const GalleryModal = ({ section, initialIndex, onClose }: GalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const hasMultipleImages = section.images.length > 1

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? section.images.length - 1 : prev - 1
    )
  }, [section.images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === section.images.length - 1 ? 0 : prev + 1
    )
  }, [section.images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, goToPrevious, goToNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
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
        <h3 className="text-white text-lg md:text-xl font-semibold truncate">
          {section.title}
        </h3>
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
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-20"
        onClick={(e) => e.stopPropagation()}
      >
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
                e.stopPropagation()
                setCurrentIndex(idx)
              }}
              className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                idx === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-50 hover:opacity-100'
              }`}
              aria-label={`Ir para foto ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface StoryCardProps {
  section: StorySection
  index: number
  onOpenGallery: (section: StorySection, imageIndex: number) => void
}

const StoryCard = ({ section, index, onOpenGallery }: StoryCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const hasMultipleImages = section.images.length > 1

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? section.images.length - 1 : prev - 1
    )
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === section.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleCardClick = () => {
    onOpenGallery(section, currentImageIndex)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up hover:shadow-xl transition-all duration-300 cursor-pointer"
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <Heart className="w-12 h-12 text-primary-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Click hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            Clique para abrir
          </span>
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-10"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md z-10"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
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
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para foto ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg">
          {section.title}
        </h3>
      </div>
    </div>
  )
}

export const OurStory = () => {
  const [galleryState, setGalleryState] = useState<{
    isOpen: boolean
    section: StorySection | null
    imageIndex: number
  }>({
    isOpen: false,
    section: null,
    imageIndex: 0
  })

  const openGallery = (section: StorySection, imageIndex: number) => {
    setGalleryState({
      isOpen: true,
      section,
      imageIndex
    })
  }

  const closeGallery = () => {
    setGalleryState({
      isOpen: false,
      section: null,
      imageIndex: 0
    })
  }

  return (
    <>
      <section id="story" className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada casal tem uma história única. Esta é a nossa jornada até o altar.
            </p>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storySections.map((section, index) => (
              <StoryCard
                key={section.id}
                section={section}
                index={index}
                onOpenGallery={openGallery}
              />
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

      {/* Gallery Modal */}
      {galleryState.isOpen && galleryState.section && (
        <GalleryModal
          section={galleryState.section}
          initialIndex={galleryState.imageIndex}
          onClose={closeGallery}
        />
      )}
    </>
  )
}
