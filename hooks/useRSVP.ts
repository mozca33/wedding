// hooks/useRSVP.ts
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RSVPData, RSVPRow } from '@/lib/types'
import { useNotification } from './useNotification'
import { sendRSVPNotification } from '@/lib/whatsapp'

export const useRSVP = () => {
  const [loading, setLoading] = useState(false)
  const [rsvpList, setRsvpList] = useState<RSVPData[]>([])
  const { showNotification } = useNotification()

  const fetchRSVPList = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('confirmed', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData: RSVPData[] = (data as RSVPRow[]).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone || undefined,
        guestsCount: item.guests_count,
        guestNames: item.guest_names || undefined,
        dietaryRestrictions: item.dietary_restrictions || undefined,
        message: item.message || undefined,
        confirmed: item.confirmed
      }))

      setRsvpList(formattedData)
    } catch (error) {
      console.error('Error fetching RSVP list:', error)
      showNotification('Erro ao carregar lista de confirmados.', 'error')
    }
  }, [showNotification])

  const submitRSVP = useCallback(async (data: RSVPData) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('rsvp')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          guests_count: data.guestsCount,
          guest_names: data.guestNames,
          dietary_restrictions: data.dietaryRestrictions,
          message: data.message,
          confirmed: true
        })

      if (error) throw error

      // Enviar notificação via WhatsApp
      sendRSVPNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        guestsCount: data.guestsCount,
        guestNames: data.guestNames,
        dietaryRestrictions: data.dietaryRestrictions,
        message: data.message
      })

      showNotification('Presença confirmada com sucesso! 🎉', 'success')
      await fetchRSVPList()
      
      return { success: true }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      showNotification('Erro ao confirmar presença. Tente novamente.', 'error')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }, [fetchRSVPList, showNotification])

  const getTotalGuests = useCallback(() => {
    return rsvpList.reduce((total, rsvp) => total + rsvp.guestsCount + 1, 0)
  }, [rsvpList])

  return {
    loading,
    rsvpList,
    submitRSVP,
    fetchRSVPList,
    getTotalGuests
  }
}