// components/sections/GiftList.tsx
import { useState, useEffect } from 'react'
import { Home, Utensils, Plane, Heart, Copy, Check, Gift, ShoppingBag, AlertTriangle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useNotification } from '@/hooks/useNotification'
import { useGifts } from '@/hooks/useGifts'
import { GiftGrid } from '@/components/ui/GiftGrid'
import { GiftPurchaseModal } from '@/components/ui/GiftPurchaseModal'
import { Gift as GiftType, GiftCategory } from '@/lib/types'

export const GiftList = () => {
  const [isPixModalOpen, setIsPixModalOpen] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | null>(null)
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null)
  const [showGifts, setShowGifts] = useState(false)
  
  const { showNotification } = useNotification()
  const { 
    loading, 
    categories, 
    gifts, 
    fetchGiftsByCategory, 
    purchaseGift,
    getGiftStats 
  } = useGifts()

  const stats = getGiftStats()

  const handleCategoryClick = async (category: GiftCategory) => {
    if (category.name === 'Lua de Mel') {
      setIsPixModalOpen(true)
      return
    }

    setSelectedCategory(category)
    setShowGifts(true)
    await fetchGiftsByCategory(category.id)
  }

  const handleBackToCategories = () => {
    setShowGifts(false)
    setSelectedCategory(null)
  }

  const handleGiftSelect = (gift: GiftType) => {
    if (gift.is_purchased) {
      showNotification('Este presente já foi comprado! 🎁', 'info')
      return
    }
    setSelectedGift(gift)
  }

  const handlePurchaseConfirm = async (giftId: string, buyerName: string) => {
    const success = await purchaseGift({ gift_id: giftId, buyer_name: buyerName })
    if (success) {
      setSelectedGift(null)
    }
    return success
  }

  const copyPixKey = async () => {
    const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || 'rafaelfelipe501@gmail.com'
    
    try {
      await navigator.clipboard.writeText(pixKey)
      setPixCopied(true)
      showNotification('Chave PIX copiada!', 'success')
      
      setTimeout(() => {
        setPixCopied(false)
      }, 3000)
    } catch (err) {
      showNotification('Erro ao copiar chave PIX', 'error')
    }
  }

  if (showGifts && selectedCategory) {
    return (
      <section id="gifts" className="section-padding gradient-bg">
        <div className="container-custom">
          {/* Header da categoria */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleBackToCategories}
              variant="outline"
              className="mb-6"
            >
              ← Voltar às Categorias
            </Button>
            
            <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
              {selectedCategory.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {selectedCategory.description}
            </p>

            {/* Estatísticas da categoria */}
            {gifts.length > 0 && (
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 mb-8">
                <span>🎁 {gifts.length} itens</span>
                <span>✅ {gifts.filter(g => g.is_purchased).length} comprados</span>
                <span>🛒 {gifts.filter(g => !g.is_purchased).length} disponíveis</span>
              </div>
            )}
          </div>

          {/* Aviso importante */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  ⚠️ Importante: Marque antes de comprar!
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Para evitar presentes duplicados, <strong>sempre marque o item como "comprado" antes de efetuar a compra</strong>. 
                  Isso garante que outras pessoas saibam que você já escolheu este presente.
                </p>
              </div>
            </div>
          </div>

          {/* Grid de presentes */}
          <GiftGrid 
            gifts={gifts}
            loading={loading}
            onGiftSelect={handleGiftSelect}
          />

          {/* Modal de compra */}
          <GiftPurchaseModal
            gift={selectedGift}
            isOpen={!!selectedGift}
            onClose={() => setSelectedGift(null)}
            onConfirm={handlePurchaseConfirm}
          />
        </div>
      </section>
    )
  }

  return (
    <section id="gifts" className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
            Lista de Presentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Sua presença é o maior presente que poderíamos receber! Mas se quiser nos presentear, 
            aqui estão algumas sugestões que nos ajudarão a começar nossa vida juntos.
          </p>

          {/* Estatísticas gerais */}
          {stats.total > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-primary-500 mr-2" />
                <h3 className="text-xl font-semibold">Progresso da Lista</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Presentes comprados:</span>
                  <span className="font-semibold">{stats.purchased}/{stats.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {stats.percentage}% da lista já foi escolhida
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mensagem especial */}
        <div className="card text-center max-w-3xl mx-auto animate-fade-in-up animation-delay-600 p-8 mb-12">
          <Heart className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">
            💝 Mensagem para você
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Não se sinta no dever de nos presentear. O mais importante é compartilhar esse momento 
            com a gente. Cada gesto de carinho será apreciado e guardado ❤️.
          </p>
        </div>

        {/* Categorias */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => {
            const iconMap: Record<string, any> = {
              'Home': Home,
              'Utensils': Utensils,
              'Plane': Plane
            }
            const Icon = iconMap[category.icon] || Gift

            return (
              <div
                key={category.id}
                className="card text-center group hover:scale-105 transition-transform duration-300 animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                <Button className="w-full">
                  {category.name === 'Lua de Mel' ? 'Contribuir via PIX' : 'Ver Presentes'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal PIX */}
      <Modal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        title="PIX para Lua de Mel"
        className="max-w-md"
      >
        <div className="text-center">
          <Plane className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            Contribua para nossa viagem de lua de mel! Qualquer valor será muito bem-vindo.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
            <p className="font-mono text-lg font-semibold text-gray-900 break-all">
              {process.env.NEXT_PUBLIC_PIX_KEY || 'rafaelfelipe501@gmail.com'}
            </p>
          </div>

          <Button
            onClick={copyPixKey}
            variant={pixCopied ? 'secondary' : 'primary'}
            className="w-full"
          >
            {pixCopied ? (
              <>
                <Check size={16} className="mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copiar Chave PIX
              </>
            )}
          </Button>
        </div>
      </Modal>
    </section>
  )
}