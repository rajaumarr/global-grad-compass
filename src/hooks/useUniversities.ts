
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface University {
  id: string
  name: string
  city: string
  state: string
  website?: string
  tuition_in_state?: number
  tuition_out_of_state?: number
  tuition_international: number
  has_in_state_tuition_waiver: boolean
  ranking?: number
  image_url?: string
  programs?: Program[]
  scholarships?: Scholarship[]
}

export interface Program {
  id: string
  university_id: string
  name: string
  department: string
  degree: string
  description?: string
  requirements_gpa?: number
  requirements_gre_verbal?: number
  requirements_gre_quantitative?: number
  requirements_gre_writing?: number
  requirements_gmat?: number
  requirements_toefl?: number
  requirements_ielts?: number
  prerequisites?: string[]
  application_deadline?: string
}

export interface Scholarship {
  id: string
  university_id: string
  name: string
  amount_type: string
  amount_value?: number
  eligibility?: string[]
  deadline?: string
  renewable: boolean
}

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch universities with their programs and scholarships - optimized query
      const { data: universitiesData, error: universitiesError } = await supabase
        .from('universities')
        .select(`
          id,
          name,
          city,
          state,
          website,
          tuition_in_state,
          tuition_out_of_state,
          tuition_international,
          has_in_state_tuition_waiver,
          ranking,
          image_url,
          programs (
            id,
            university_id,
            name,
            department,
            degree,
            description,
            requirements_gpa,
            requirements_gre_verbal,
            requirements_gre_quantitative,
            requirements_gre_writing,
            requirements_gmat,
            requirements_toefl,
            requirements_ielts,
            prerequisites,
            application_deadline
          ),
          scholarships (
            id,
            university_id,
            name,
            amount_type,
            amount_value,
            eligibility,
            deadline,
            renewable
          )
        `)
        .order('ranking', { ascending: true, nullsFirst: false })
        .limit(1000) // Increased limit to fetch all universities

      if (universitiesError) {
        throw universitiesError
      }

      // Add a minimal delay for smooth UX transition
      await new Promise(resolve => setTimeout(resolve, 300))

      setUniversities(universitiesData || [])
    } catch (err) {
      console.error('Error fetching universities:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return {
    universities,
    loading,
    error,
    refetch: fetchUniversities
  }
}
