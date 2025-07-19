import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Scholarship {
  id: string
  name: string
  amount_type: string
  amount_value?: number
  eligibility?: string[]
  deadline?: string
  renewable: boolean
  description?: string
  external_link?: string
  university?: {
    name: string
    state: string
    city: string
  }
  funding_source?: string
  gpa_requirement?: number
  citizenship_requirements?: string[]
  field_of_study_restrictions?: string[]
  selection_criteria?: string[]
  contact_email?: string
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchScholarships = useCallback(async (page = 1, limit = 25, filters?: {
    search?: string
    state?: string
    amountRange?: string
    gpaRange?: string
    citizenship?: string
    fieldOfStudy?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const offset = (page - 1) * limit

      // Build the query with university data
      let query = supabase
        .from('scholarships')
        .select(`
          id,
          name,
          amount_type,
          amount_value,
          eligibility,
          deadline,
          renewable,
          description,
          external_link,
          funding_source,
          gpa_requirement,
          citizenship_requirements,
          field_of_study_restrictions,
          selection_criteria,
          contact_email,
          university_id,
          universities (
            name,
            city,
            state
          )
        `, { count: 'exact' })

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Remove state filter temporarily to avoid JOIN issues
      // if (filters?.state && filters.state !== 'all-states') {
      //   query = query.eq('universities.state', filters.state)
      // }

      if (filters?.amountRange && filters.amountRange !== 'any-amount') {
        switch (filters.amountRange) {
          case 'under-10k':
            query = query.lt('amount_value', 10000)
            break
          case '10k-20k':
            query = query.gte('amount_value', 10000).lte('amount_value', 20000)
            break
          case '20k-plus':
            query = query.gt('amount_value', 20000)
            break
        }
      }

      if (filters?.gpaRange && filters.gpaRange !== 'any-gpa') {
        switch (filters.gpaRange) {
          case 'below-3.0':
            query = query.or('gpa_requirement.is.null,gpa_requirement.lt.3.0')
            break
          case '3.0-3.5':
            query = query.or('gpa_requirement.is.null,gpa_requirement.lte.3.5')
            break
          case '3.5-plus':
            query = query.or('gpa_requirement.is.null,gpa_requirement.lte.4.0')
            break
        }
      }

      if (filters?.citizenship && filters.citizenship !== 'any-citizenship') {
        if (filters.citizenship === 'us-citizens') {
          query = query.or('citizenship_requirements.is.null,citizenship_requirements.cs.{"US Citizens"}')
        } else if (filters.citizenship === 'international') {
          query = query.or('citizenship_requirements.is.null,citizenship_requirements.cs.{"International Students"}')
        }
      }

      if (filters?.fieldOfStudy && filters.fieldOfStudy !== 'any-field') {
        query = query.or('field_of_study_restrictions.is.null,field_of_study_restrictions.cs.{' + `"${filters.fieldOfStudy}"` + '}')
      }

      const { data, error: scholarshipsError, count } = await query
        .order('amount_value', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1)

      if (scholarshipsError) {
        throw scholarshipsError
      }

      // Transform the data with university information
      const transformedData = data?.map(scholarship => ({
        ...scholarship,
        university: scholarship.universities ? {
          name: scholarship.universities.name,
          city: scholarship.universities.city,
          state: scholarship.universities.state
        } : undefined
      })) || []

      setScholarships(transformedData)
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching scholarships:', err)
      setError('Unable to connect to database. Please check your internet connection and try again.')
      
      // Add mock data as fallback for demonstration
      if (scholarships.length === 0) {
        const mockData = [
          {
            id: "1",
            name: "International Excellence Scholarship",
            amount_type: "Fixed Amount",
            amount_value: 15000,
            eligibility: ["International students", "GPA 3.5+", "TOEFL 100+"],
            deadline: "2024-03-15",
            renewable: true,
            description: "Full merit-based scholarship for outstanding international students pursuing undergraduate or graduate degrees.",
            external_link: "https://example.com/apply",
            funding_source: "University",
            gpa_requirement: 3.5,
            citizenship_requirements: ["International Students"],
            field_of_study_restrictions: [],
            selection_criteria: ["Academic Excellence", "Leadership"],
            contact_email: "scholarships@university.edu",
            university_id: "1"
          },
          {
            id: "2",
            name: "STEM Leadership Award", 
            amount_type: "Fixed Amount",
            amount_value: 25000,
            eligibility: ["STEM majors", "Leadership experience", "US citizens/residents"],
            deadline: "2024-02-28",
            renewable: true,
            description: "Supports students pursuing STEM fields who demonstrate exceptional leadership potential.",
            external_link: "https://example.com/stem-apply",
            funding_source: "Foundation",
            gpa_requirement: 3.2,
            citizenship_requirements: ["US Citizens"],
            field_of_study_restrictions: ["Engineering", "Computer Science"],
            selection_criteria: ["Leadership", "Academic Performance"],
            contact_email: "stem@foundation.org",
            university_id: "2"
          }
        ]
        setScholarships(mockData)
        setTotalCount(mockData.length)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScholarships()
  }, [])

  return {
    scholarships,
    loading,
    error,
    totalCount,
    fetchScholarships
  }
}