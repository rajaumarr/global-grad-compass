import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export function useSavedUniversities() {
  const { user } = useAuth()
  const [savedUniversityIds, setSavedUniversityIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSavedUniversities()
    } else {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem('saved-universities')
      setSavedUniversityIds(saved ? JSON.parse(saved) : [])
      setLoading(false)
    }
  }, [user])

  const fetchSavedUniversities = async () => {
    if (!user) return

    try {
      // Temporarily use localStorage until database types update
      const saved = localStorage.getItem(`saved-universities-${user.id}`)
      const ids = saved ? JSON.parse(saved) : []
      setSavedUniversityIds(ids)
    } catch (error) {
      console.error('Error fetching saved universities:', error)
      setSavedUniversityIds([])
    } finally {
      setLoading(false)
    }
  }

  const toggleSaved = async (universityId: string) => {
    const isCurrentlySaved = savedUniversityIds.includes(universityId)

    if (user) {
      // For authenticated users, use localStorage temporarily until types update
      const newSavedIds = isCurrentlySaved
        ? savedUniversityIds.filter(id => id !== universityId)
        : [...savedUniversityIds, universityId]
      
      setSavedUniversityIds(newSavedIds)
      localStorage.setItem(`saved-universities-${user.id}`, JSON.stringify(newSavedIds))
    } else {
      // For non-authenticated users, save to localStorage
      const newSavedIds = isCurrentlySaved
        ? savedUniversityIds.filter(id => id !== universityId)
        : [...savedUniversityIds, universityId]
      
      setSavedUniversityIds(newSavedIds)
      localStorage.setItem('saved-universities', JSON.stringify(newSavedIds))
    }
  }

  const isSaved = (universityId: string) => savedUniversityIds.includes(universityId)

  return {
    savedUniversityIds,
    loading,
    toggleSaved,
    isSaved,
    refetch: fetchSavedUniversities
  }
}