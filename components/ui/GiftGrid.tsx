// components/ui/GiftGrid.tsx
import { useState } from 'react'
import Image from 'next/image'
import { Gift, ShoppingBag, Check, ExternalLink, Star } from 'lucide-react'
import { Gift as GiftType } from '@/lib/types'

interface GiftGridProps {
  gifts: GiftType[]
  loading: boolean
  onGiftSelect: (gift: GiftType) => void
}

export const GiftGrid = ({ gifts, loading, onGiftSelect }: GiftGridProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (giftId: string) => {
    setImageErrors(prev => new Set([...Array.from(prev), giftId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return <Star className="w-4 h-4 text-yellow-500 fill-current" />
      case 2: return <Star className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Carregando presentes...</p>
      </div>
    )
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center py-16">
        <Gift className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4 text-gray-600">
          Nenhum presente encontrado
        </h3>
        <p className="text-gray-500 text-lg">
          Esta categoria ainda não possui itens cadastrados.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {gifts.map((gift, index) => (
        <div
          key={gift.id}
          className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 animate-fade-in-up ${
            gift.is_purchased 
              ? 'opacity-75 ring-2 ring-green-200' 
              : 'hover:scale-105 hover:shadow-xl cursor-pointer'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => !gift.is_purchased && onGiftSelect(gift)}
        >
          {/* Badge de status */}
          <div className="relative">
            {gift.is_purchased && (
              <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Comprado
              </div>
            )}
            
            {/* Badge de prioridade */}
            {gift.priority <= 2 && !gift.is_purchased && (
              <div className="absolute top-2 right-2 z-10">
                {getPriorityIcon(gift.priority)}
              </div>
            )}

            {/* Imagem */}
            <div className="aspect-square relative bg-gray-100">
              {gift.image_url && !imageErrors.has(gift.id) ? (
                <Image
                  src={gift.image_url}
                  alt={gift.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(gift.id)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gift className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Overlay para itens comprados */}
              {gift.is_purchased && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <Check className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
              {gift.name}
            </h3>
            
            {gift.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {gift.description}
              </p>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(gift.price)}
              </span>
              
              {gift.store_link && (
                <a
                  href={gift.store_link}
                  
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Status */}
            {gift.is_purchased ? (
              <div className="text-center">
                <p className="text-green-600 font-medium text-sm">
                  ✅ Comprado por {gift.purchased_by}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(gift.purchased_at!).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ) : (
              <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Quero Presentear
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}