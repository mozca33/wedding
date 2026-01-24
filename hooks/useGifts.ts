import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Gift, GiftCategory, GiftPurchaseData } from '@/lib/types'
import { useNotification } from '@/hooks/useNotification'

export const useGifts = () => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<GiftCategory[]>([])
  const [gifts, setGifts] = useState<Gift[]>([])
  const { showNotification } = useNotification()

  // Buscar categorias
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gift_categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      showNotification('Erro ao carregar categorias', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Buscar presentes por categoria
  const fetchGiftsByCategory = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true)
      let query = supabase
        .from('gifts')
        .select(`
          *,
          category:gift_categories(*)
        `)
        .order('priority')
        .order('name')

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error('Erro ao buscar presentes:', error)
      showNotification('Erro ao carregar presentes', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Marcar presente como comprado
  const purchaseGift = useCallback(async (purchaseData: GiftPurchaseData) => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('gifts')
        .update({
          is_purchased: true,
          purchased_by: purchaseData.buyer_name.trim(),
          purchased_at: new Date().toISOString()
        })
        .eq('id', purchaseData.gift_id)
        .select()

      if (error) throw error

      // Atualizar estado local
      setGifts(prev => prev.map(gift => 
        gift.id === purchaseData.gift_id 
          ? { 
              ...gift, 
              is_purchased: true, 
              purchased_by: purchaseData.buyer_name.trim(),
              purchased_at: new Date().toISOString()
            }
          : gift
      ))

      showNotification('Presente marcado como comprado! 🎁', 'success')
      return true

    } catch (error) {
      console.error('Erro ao marcar presente como comprado:', error)
      showNotification('Erro ao marcar presente. Tente novamente.', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  // Estatísticas
  const getGiftStats = useCallback(() => {
    const total = gifts.length
    const purchased = gifts.filter(g => g.is_purchased).length
    const available = total - purchased
    const totalValue = gifts.reduce((sum, gift) => sum + (gift.price || 0), 0)
    const purchasedValue = gifts
      .filter(g => g.is_purchased)
      .reduce((sum, gift) => sum + (gift.price || 0), 0)

    return {
      total,
      purchased,
      available,
      totalValue,
      purchasedValue,
      percentage: total > 0 ? Math.round((purchased / total) * 100) : 0
    }
  }, [gifts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    loading,
    categories,
    gifts,
    fetchCategories,
    fetchGiftsByCategory,
    purchaseGift,
    getGiftStats
  }
}