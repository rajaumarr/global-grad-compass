import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface DatabaseStats {
  universities: number
  programs: number
  scholarships: number
}

export const useDatabaseStats = (isAdmin: boolean) => {
  const [dbStats, setDbStats] = useState<DatabaseStats>({ universities: 0, programs: 0, scholarships: 0 })

  const fetchDatabaseStats = async () => {
    try {
      const [universitiesRes, programsRes, scholarshipsRes] = await Promise.all([
        supabase.from('universities').select('*', { count: 'exact', head: true }),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('scholarships').select('*', { count: 'exact', head: true })
      ])

      setDbStats({
        universities: universitiesRes.count || 0,
        programs: programsRes.count || 0,
        scholarships: scholarshipsRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching database stats:', error)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchDatabaseStats()
    }
  }, [isAdmin])

  return { dbStats, refetchStats: fetchDatabaseStats }
}