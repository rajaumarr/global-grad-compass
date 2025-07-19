import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { University, Program, Scholarship } from '@/hooks/useUniversities'

export interface GapAnalysis {
  university: University
  overallMatch: number
  gpaGap: {
    hasGap: boolean
    required: number | null
    current: number | null
    gap: number
  }
  greGap: {
    hasGap: boolean
    verbalRequired: number | null
    quantRequired: number | null
    writingRequired: number | null
    verbalCurrent: number | null
    quantCurrent: number | null
    writingCurrent: number | null
  }
  languageGap: {
    hasGap: boolean
    toeflRequired: number | null
    ieltsRequired: number | null
    toeflCurrent: number | null
    ieltsCurrent: number | null
  }
  matchingPrograms: Program[]
  availableScholarships: Scholarship[]
  recommendations: string[]
}

export function useGapAnalysis(universities: University[]): GapAnalysis[] {
  const { profile } = useAuth()

  return useMemo(() => {
    if (!profile || universities.length === 0) return []

    return universities.map(university => {
      const analysis: GapAnalysis = {
        university,
        overallMatch: 0,
        gpaGap: { hasGap: false, required: null, current: profile.gpa || null, gap: 0 },
        greGap: {
          hasGap: false,
          verbalRequired: null,
          quantRequired: null,
          writingRequired: null,
          verbalCurrent: profile.gre_verbal || null,
          quantCurrent: profile.gre_quantitative || null,
          writingCurrent: profile.gre_writing || null
        },
        languageGap: {
          hasGap: false,
          toeflRequired: null,
          ieltsRequired: null,
          toeflCurrent: profile.toefl || null,
          ieltsCurrent: profile.ielts || null
        },
        matchingPrograms: [],
        availableScholarships: university.scholarships || [],
        recommendations: []
      }

      // Analyze programs
      if (university.programs) {
        const matchingPrograms = university.programs.filter(program => {
          if (profile.preferred_degree_types?.length) {
            return profile.preferred_degree_types.includes(program.degree)
          }
          return true
        })

        analysis.matchingPrograms = matchingPrograms

        // Find highest requirements among matching programs
        const gpaRequirements = matchingPrograms
          .map(p => p.requirements_gpa)
          .filter(Boolean) as number[]
        
        const greVerbalReqs = matchingPrograms
          .map(p => p.requirements_gre_verbal)
          .filter(Boolean) as number[]
        
        const greQuantReqs = matchingPrograms
          .map(p => p.requirements_gre_quantitative)
          .filter(Boolean) as number[]
        
        const greWritingReqs = matchingPrograms
          .map(p => p.requirements_gre_writing)
          .filter(Boolean) as number[]
        
        const toeflReqs = matchingPrograms
          .map(p => p.requirements_toefl)
          .filter(Boolean) as number[]
        
        const ieltsReqs = matchingPrograms
          .map(p => p.requirements_ielts)
          .filter(Boolean) as number[]

        // GPA Analysis
        if (gpaRequirements.length > 0) {
          const maxGpaReq = Math.max(...gpaRequirements)
          analysis.gpaGap.required = maxGpaReq
          if (profile.gpa) {
            analysis.gpaGap.gap = Math.max(0, maxGpaReq - profile.gpa)
            analysis.gpaGap.hasGap = analysis.gpaGap.gap > 0
          } else {
            analysis.gpaGap.hasGap = true
            analysis.gpaGap.gap = maxGpaReq
          }
        }

        // GRE Analysis
        if (greVerbalReqs.length > 0) {
          analysis.greGap.verbalRequired = Math.max(...greVerbalReqs)
          if (!profile.gre_verbal || profile.gre_verbal < analysis.greGap.verbalRequired) {
            analysis.greGap.hasGap = true
          }
        }
        
        if (greQuantReqs.length > 0) {
          analysis.greGap.quantRequired = Math.max(...greQuantReqs)
          if (!profile.gre_quantitative || profile.gre_quantitative < analysis.greGap.quantRequired) {
            analysis.greGap.hasGap = true
          }
        }
        
        if (greWritingReqs.length > 0) {
          analysis.greGap.writingRequired = Math.max(...greWritingReqs)
          if (!profile.gre_writing || profile.gre_writing < analysis.greGap.writingRequired) {
            analysis.greGap.hasGap = true
          }
        }

        // Language Analysis
        if (toeflReqs.length > 0) {
          analysis.languageGap.toeflRequired = Math.max(...toeflReqs)
          if (!profile.toefl || profile.toefl < analysis.languageGap.toeflRequired) {
            analysis.languageGap.hasGap = true
          }
        }
        
        if (ieltsReqs.length > 0) {
          analysis.languageGap.ieltsRequired = Math.max(...ieltsReqs)
          if (!profile.ielts || profile.ielts < analysis.languageGap.ieltsRequired) {
            analysis.languageGap.hasGap = true
          }
        }
      }

      // Generate recommendations
      if (analysis.gpaGap.hasGap && analysis.gpaGap.gap > 0) {
        analysis.recommendations.push(`Improve GPA by ${analysis.gpaGap.gap.toFixed(2)} points`)
      }
      
      if (analysis.greGap.hasGap) {
        const greAdvice = []
        if (analysis.greGap.verbalRequired && (!profile.gre_verbal || profile.gre_verbal < analysis.greGap.verbalRequired)) {
          greAdvice.push(`GRE Verbal: aim for ${analysis.greGap.verbalRequired}+`)
        }
        if (analysis.greGap.quantRequired && (!profile.gre_quantitative || profile.gre_quantitative < analysis.greGap.quantRequired)) {
          greAdvice.push(`GRE Quant: aim for ${analysis.greGap.quantRequired}+`)
        }
        if (greAdvice.length > 0) {
          analysis.recommendations.push(`Improve GRE scores: ${greAdvice.join(', ')}`)
        }
      }
      
      if (analysis.languageGap.hasGap) {
        if (analysis.languageGap.toeflRequired && (!profile.toefl || profile.toefl < analysis.languageGap.toeflRequired)) {
          analysis.recommendations.push(`TOEFL: aim for ${analysis.languageGap.toeflRequired}+`)
        }
        if (analysis.languageGap.ieltsRequired && (!profile.ielts || profile.ielts < analysis.languageGap.ieltsRequired)) {
          analysis.recommendations.push(`IELTS: aim for ${analysis.languageGap.ieltsRequired}+`)
        }
      }

      // Calculate overall match percentage
      let totalChecks = 0
      let passedChecks = 0

      if (analysis.gpaGap.required !== null) {
        totalChecks++
        if (!analysis.gpaGap.hasGap) passedChecks++
      }
      
      if (analysis.greGap.verbalRequired !== null) {
        totalChecks++
        if (profile.gre_verbal && profile.gre_verbal >= analysis.greGap.verbalRequired) passedChecks++
      }
      
      if (analysis.greGap.quantRequired !== null) {
        totalChecks++
        if (profile.gre_quantitative && profile.gre_quantitative >= analysis.greGap.quantRequired) passedChecks++
      }
      
      if (analysis.languageGap.toeflRequired !== null || analysis.languageGap.ieltsRequired !== null) {
        totalChecks++
        const meetsToefl = analysis.languageGap.toeflRequired && profile.toefl && profile.toefl >= analysis.languageGap.toeflRequired
        const meetsIelts = analysis.languageGap.ieltsRequired && profile.ielts && profile.ielts >= analysis.languageGap.ieltsRequired
        if (meetsToefl || meetsIelts) passedChecks++
      }

      analysis.overallMatch = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100

      return analysis
    }).filter(analysis => analysis.matchingPrograms.length > 0)
  }, [universities, profile])
}