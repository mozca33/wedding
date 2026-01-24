// components/ui/GiftPurchaseModal.tsx
import { useState } from 'react'
import { Gift, User, AlertTriangle, ExternalLink, Check } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Gift as GiftType } from '@/lib/types'
import Image from 'next/image'

interface GiftPurchaseModalProps {
  gift: GiftType | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (giftId: string, buyerName: string) => Promise<boolean>
}

export const GiftPurchaseModal = ({ 
  gift, 
  isOpen, 
  onClose, 
  onConfirm 
}: GiftPurchaseModalProps) => {
  const [buyerName, setBuyerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'info' | 'confirm'>('info')

  if (!gift) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const validateName = (name: string) => {
    const trimmed = name.trim()
    return trimmed.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)
  }

  const handleConfirm = async () => {
    if (!validateName(buyerName)) {
      return
    }

    setLoading(true)
    const success = await onConfirm(gift.id, buyerName.trim())
    
    if (success) {
      setBuyerName('')
      setStep('info')
      onClose()
    }
    
    setLoading(false)
  }

  const handleClose = () => {
    setBuyerName('')
    setStep('info')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Confirmar Presente"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Informações do presente */}
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {gift.image_url ? (
              <Image
                src={gift.image_url}
                alt={gift.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {gift.name}
            </h3>
            {gift.description && (
              <p className="text-gray-600 text-sm mb-2">
                {gift.description}
              </p>
            )}
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(gift.price)}
            </p>
          </div>
        </div>

        {/* Link da loja */}
        {gift.store_link && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  🛒 Onde comprar
                </h4>
                <p className="text-blue-700 text-sm">
                  Clique no link para ver o produto na loja
                </p>
              </div>
              <a
                href={gift.store_link}
                
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver na Loja
              </a>
            </div>
          </div>
        )}

        {step === 'info' && (
          <>
            {/* Aviso importante */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    ⚠️ Importante: Marque ANTES de comprar!
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Para evitar presentes duplicados, marque este item como comprado 
                    <strong> antes de efetuar a compra na loja</strong>. Isso garante que 
                    outras pessoas saibam que você já escolheu este presente.
                  </p>
                </div>
              </div>
            </div>

            {/* Campo nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Seu nome completo:
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Digite seu nome completo"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  buyerName && !validateName(buyerName)
                    ? 'border-red-300 bg-red-50'
                    : buyerName && validateName(buyerName)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
                maxLength={100}
              />
              {buyerName && !validateName(buyerName) && (
                <p className="text-red-500 text-sm mt-1">
                  Nome deve ter pelo menos 2 caracteres e conter apenas letras
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                disabled={!validateName(buyerName)}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <>
            {/* Confirmação final */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Confirmar Presente
              </h3>
              <p className="text-green-700 mb-4">
                Olá <strong>{buyerName}</strong>! 👋
              </p>
              <p className="text-green-700 text-sm">
                Você está prestes a marcar "<strong>{gift.name}</strong>" como comprado. 
                Esta ação <strong>não pode ser desfeita</strong> e o presente ficará 
                indisponível para outras pessoas.
              </p>
            </div>

            {/* Botões finais */}
            <div className="flex space-x-3">
              <Button
                onClick={() => setStep('info')}
                variant="outline"
                className="flex-1"
              >
                ← Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Confirmando...' : 'Confirmar Compra'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}