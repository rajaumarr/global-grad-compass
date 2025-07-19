import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { University } from './useUniversities'

export interface RecommendationScore {
  university: University
  score: number
  reasons: string[]
}

export function usePersonalizedRecommendations(universities: University[]): RecommendationScore[] {
  const { profile } = useAuth()

  return useMemo(() => {
    if (!profile || universities.length === 0) {
      return []
    }

    const recommendations: RecommendationScore[] = universities.map(university => {
      let score = 0
      const reasons: string[] = []

      // State preference matching (20 points)
      if (profile.preferred_states?.includes(university.state)) {
        score += 20
        reasons.push(`Located in preferred state: ${university.state}`)
      }

      // Budget matching (25 points)
      if (profile.max_tuition_budget && university.tuition_international <= profile.max_tuition_budget) {
        score += 25
        reasons.push('Within your budget')
      }

      // In-state tuition waiver preference (15 points)
      if (university.has_in_state_tuition_waiver) {
        score += 15
        reasons.push('Offers in-state tuition for international students')
      }

      // Program matching (30 points)
      if (profile.preferred_degree_types && university.programs) {
        const matchingPrograms = university.programs.filter(program => 
          profile.preferred_degree_types?.includes(program.degree)
        )
        if (matchingPrograms.length > 0) {
          score += 30
          reasons.push(`Offers ${profile.preferred_degree_types.join(', ')} programs`)
        }
      }

      // Target program field matching (25 points)
      if (profile.target_programs && university.programs) {
        const fieldMatches = university.programs.filter(program =>
          profile.target_programs?.some(targetProgram =>
            program.name.toLowerCase().includes(targetProgram.toLowerCase()) ||
            program.department.toLowerCase().includes(targetProgram.toLowerCase())
          )
        )
        if (fieldMatches.length > 0) {
          score += 25
          reasons.push('Offers programs in your target fields')
        }
      }

      // Academic qualification matching
      if (profile.gpa && university.programs) {
        const qualifiedPrograms = university.programs.filter(program =>
          !program.requirements_gpa || (profile.gpa && profile.gpa >= program.requirements_gpa)
        )
        if (qualifiedPrograms.length === university.programs.length) {
          score += 20
          reasons.push('You meet GPA requirements for all programs')
        } else if (qualifiedPrograms.length > 0) {
          score += 10
          reasons.push('You meet GPA requirements for some programs')
        }
      }

      // GRE score matching
      if (profile.gre_verbal && profile.gre_quantitative && university.programs) {
        const greQualifiedPrograms = university.programs.filter(program => {
          const meetsVerbal = !program.requirements_gre_verbal || 
            (profile.gre_verbal && profile.gre_verbal >= program.requirements_gre_verbal)
          const meetsQuant = !program.requirements_gre_quantitative || 
            (profile.gre_quantitative && profile.gre_quantitative >= program.requirements_gre_quantitative)
          return meetsVerbal && meetsQuant
        })
        
        if (greQualifiedPrograms.length === university.programs.length) {
          score += 15
          reasons.push('You meet GRE requirements for all programs')
        } else if (greQualifiedPrograms.length > 0) {
          score += 8
          reasons.push('You meet GRE requirements for some programs')
        }
      }

      // TOEFL/IELTS matching
      if ((profile.toefl || profile.ielts) && university.programs) {
        const languageQualifiedPrograms = university.programs.filter(program => {
          const meetsToefl = !program.requirements_toefl || 
            (profile.toefl && profile.toefl >= program.requirements_toefl)
          const meetsIelts = !program.requirements_ielts || 
            (profile.ielts && profile.ielts >= program.requirements_ielts)
          return meetsToefl || meetsIelts
        })
        
        if (languageQualifiedPrograms.length > 0) {
          score += 10
          reasons.push('You meet language requirements')
        }
      }

      // Scholarship availability bonus (10 points)
      if (university.scholarships && university.scholarships.length > 0) {
        score += 10
        reasons.push('Offers scholarships')
      }

      // Ranking bonus (up to 10 points, higher ranking = more points)
      if (university.ranking) {
        const rankingScore = Math.max(0, 10 - Math.floor(university.ranking / 10))
        score += rankingScore
        if (rankingScore > 0) {
          reasons.push(`Highly ranked university (#${university.ranking})`)
        }
      }

      return {
        university,
        score,
        reasons
      }
    })

    // Sort by score (highest first) and return top recommendations
    return recommendations
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Return top 20 recommendations
  }, [universities, profile])
}