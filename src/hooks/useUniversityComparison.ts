import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export interface ComparedUniversity {
  id: string
  name: string
  city: string
  state: string
  tuition_international: number
  ranking?: number
  programs?: any[]
  scholarships?: any[]
}

export function useUniversityComparison() {
  const { user } = useAuth()
  const [comparedUniversities, setComparedUniversities] = useState<ComparedUniversity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadComparison()
    } else {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem('compared-universities')
      setComparedUniversities(saved ? JSON.parse(saved) : [])
    }
  }, [user])

  const loadComparison = async () => {
    if (!user) return
    
    try {
      const saved = localStorage.getItem(`compared-universities-${user.id}`)
      setComparedUniversities(saved ? JSON.parse(saved) : [])
    } catch (error) {
      console.error('Error loading comparison:', error)
    }
  }

  const addToComparison = async (university: ComparedUniversity) => {
    const isAlreadyCompared = comparedUniversities.some(u => u.id === university.id)
    if (isAlreadyCompared || comparedUniversities.length >= 4) return false

    const newList = [...comparedUniversities, university]
    setComparedUniversities(newList)
    
    const storageKey = user ? `compared-universities-${user.id}` : 'compared-universities'
    localStorage.setItem(storageKey, JSON.stringify(newList))
    return true
  }

  const removeFromComparison = async (universityId: string) => {
    const newList = comparedUniversities.filter(u => u.id !== universityId)
    setComparedUniversities(newList)
    
    const storageKey = user ? `compared-universities-${user.id}` : 'compared-universities'
    localStorage.setItem(storageKey, JSON.stringify(newList))
  }

  const clearComparison = async () => {
    setComparedUniversities([])
    const storageKey = user ? `compared-universities-${user.id}` : 'compared-universities'
    localStorage.removeItem(storageKey)
  }

  const isInComparison = (universityId: string) => {
    return comparedUniversities.some(u => u.id === universityId)
  }

  return {
    comparedUniversities,
    loading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore: comparedUniversities.length < 4
  }
}