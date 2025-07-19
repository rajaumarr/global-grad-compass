import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  gpa?: number;
  gre_verbal?: number;
  gre_quantitative?: number;
  gre_writing?: number;
  toefl?: number;
  ielts?: number;
  preferred_degree_types?: string[];
  preferred_states?: string[];
  max_tuition_budget?: number;
  target_programs?: string[];
  academic_background?: string;
}

interface University {
  id: string;
  name: string;
  state: string;
  type: string;
  setting: string;
  tuition_international: number;
  acceptance_rate: number;
  ranking: number;
  programs: any[];
  scholarships: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, user_id, filters } = await req.json();
    console.log(`Processing ${action} for user ${user_id}`);

    switch (action) {
      case 'get_recommendations':
        return await getRecommendations(supabaseClient, user_id, filters);
      case 'get_scholarship_matches':
        return await getScholarshipMatches(supabaseClient, user_id);
      case 'analyze_fit_score':
        return await analyzeFitScore(supabaseClient, user_id, filters?.university_id);
      case 'get_similar_programs':
        return await getSimilarPrograms(supabaseClient, filters?.program_id);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in recommendation-engine:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getRecommendations(supabaseClient: any, userId: string, filters: any = {}) {
  // Get user profile
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get user preferences
  const { data: preferences } = await supabaseClient
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get all universities with programs and scholarships
  const { data: universities, error } = await supabaseClient
    .from('universities')
    .select(`
      *,
      programs (*),
      scholarships (*)
    `)
    .order('ranking', { ascending: true, nullsFirst: false });

  if (error) throw error;

  // Calculate fit scores for each university
  const recommendations = universities.map((university: University) => {
    const fitScore = calculateFitScore(university, profile, preferences, filters);
    const matchReasons = getMatchReasons(university, profile, preferences);
    const gapAnalysis = calculateGapAnalysis(university, profile);
    
    return {
      university,
      fit_score: fitScore,
      match_reasons: matchReasons,
      gap_analysis: gapAnalysis,
      recommended_programs: getRecommendedPrograms(university.programs, profile, preferences)
    };
  });

  // Sort by fit score and filter
  const sortedRecommendations = recommendations
    .filter(rec => rec.fit_score > 30) // Only show reasonable matches
    .sort((a, b) => b.fit_score - a.fit_score)
    .slice(0, filters.limit || 20);

  return new Response(
    JSON.stringify({
      success: true,
      recommendations: sortedRecommendations,
      total_analyzed: universities.length,
      user_profile_completeness: calculateProfileCompleteness(profile)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getScholarshipMatches(supabaseClient: any, userId: string) {
  // Get user profile
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get all scholarships with university info
  const { data: scholarships, error } = await supabaseClient
    .from('scholarships')
    .select(`
      *,
      universities (name, state, type)
    `)
    .order('amount_value', { ascending: false, nullsFirst: false });

  if (error) throw error;

  // Calculate scholarship match scores
  const matches = scholarships.map((scholarship: any) => {
    const matchScore = calculateScholarshipMatch(scholarship, profile);
    const eligibilityStatus = checkScholarshipEligibility(scholarship, profile);
    
    return {
      scholarship,
      match_score: matchScore,
      eligibility_status: eligibilityStatus,
      estimated_value: estimateScholarshipValue(scholarship),
      application_difficulty: assessApplicationDifficulty(scholarship)
    };
  });

  const sortedMatches = matches
    .filter(match => match.match_score > 40)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 30);

  return new Response(
    JSON.stringify({
      success: true,
      scholarship_matches: sortedMatches,
      total_scholarships: scholarships.length,
      high_probability_matches: sortedMatches.filter(m => m.match_score > 80).length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeFitScore(supabaseClient: any, userId: string, universityId: string) {
  // Get user profile and preferences
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: preferences } = await supabaseClient
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get specific university
  const { data: university, error } = await supabaseClient
    .from('universities')
    .select(`
      *,
      programs (*),
      scholarships (*)
    `)
    .eq('id', universityId)
    .single();

  if (error) throw error;

  const detailedAnalysis = {
    overall_fit_score: calculateFitScore(university, profile, preferences),
    category_scores: {
      academic_fit: calculateAcademicFit(university, profile),
      financial_fit: calculateFinancialFit(university, profile, preferences),
      location_preference: calculateLocationFit(university, preferences),
      program_alignment: calculateProgramAlignment(university, profile, preferences),
      research_opportunities: calculateResearchFit(university, profile),
      career_outcomes: calculateCareerFit(university, profile)
    },
    strengths: getApplicationStrengths(university, profile),
    improvement_areas: getImprovementAreas(university, profile),
    recommended_actions: getRecommendedActions(university, profile),
    admission_probability: calculateAdmissionProbability(university, profile),
    scholarship_opportunities: university.scholarships.filter((s: any) => 
      calculateScholarshipMatch(s, profile) > 60
    )
  };

  return new Response(
    JSON.stringify({
      success: true,
      university_name: university.name,
      analysis: detailedAnalysis
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getSimilarPrograms(supabaseClient: any, programId: string) {
  // Get the reference program
  const { data: referenceProgram, error } = await supabaseClient
    .from('programs')
    .select(`
      *,
      universities (name, state, ranking, type)
    `)
    .eq('id', programId)
    .single();

  if (error) throw error;

  // Get all programs in the same field
  const { data: allPrograms } = await supabaseClient
    .from('programs')
    .select(`
      *,
      universities (name, state, ranking, type, tuition_international)
    `)
    .eq('degree', referenceProgram.degree)
    .neq('id', programId);

  // Calculate similarity scores
  const similarPrograms = allPrograms.map((program: any) => {
    const similarityScore = calculateProgramSimilarity(referenceProgram, program);
    
    return {
      program,
      similarity_score: similarityScore,
      comparison_highlights: getProgramComparisonHighlights(referenceProgram, program)
    };
  });

  const sortedSimilar = similarPrograms
    .filter(p => p.similarity_score > 60)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 15);

  return new Response(
    JSON.stringify({
      success: true,
      reference_program: referenceProgram,
      similar_programs: sortedSimilar
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Scoring and analysis functions
function calculateFitScore(university: University, profile: UserProfile, preferences: any, filters: any = {}): number {
  let score = 0;
  let maxScore = 0;

  // Academic fit (30%)
  const academicFit = calculateAcademicFit(university, profile);
  score += academicFit * 0.3;
  maxScore += 100 * 0.3;

  // Financial fit (25%)
  const financialFit = calculateFinancialFit(university, profile, preferences);
  score += financialFit * 0.25;
  maxScore += 100 * 0.25;

  // Program alignment (25%)
  const programFit = calculateProgramAlignment(university, profile, preferences);
  score += programFit * 0.25;
  maxScore += 100 * 0.25;

  // Location preference (10%)
  const locationFit = calculateLocationFit(university, preferences);
  score += locationFit * 0.1;
  maxScore += 100 * 0.1;

  // University type preference (10%)
  const typeFit = calculateTypeFit(university, preferences);
  score += typeFit * 0.1;
  maxScore += 100 * 0.1;

  return Math.round((score / maxScore) * 100);
}

function calculateAcademicFit(university: University, profile: UserProfile): number {
  if (!university.programs || university.programs.length === 0) return 0;

  let bestProgramFit = 0;

  university.programs.forEach(program => {
    let programFit = 0;
    let checks = 0;

    // GPA check
    if (profile.gpa && program.requirements_gpa) {
      checks++;
      if (profile.gpa >= program.requirements_gpa) {
        programFit += 100;
      } else if (profile.gpa >= program.requirements_gpa - 0.3) {
        programFit += 70;
      } else {
        programFit += 30;
      }
    }

    // GRE checks
    if (profile.gre_verbal && program.requirements_gre_verbal) {
      checks++;
      programFit += profile.gre_verbal >= program.requirements_gre_verbal ? 100 : 
                    profile.gre_verbal >= program.requirements_gre_verbal - 10 ? 70 : 30;
    }

    if (profile.gre_quantitative && program.requirements_gre_quantitative) {
      checks++;
      programFit += profile.gre_quantitative >= program.requirements_gre_quantitative ? 100 :
                    profile.gre_quantitative >= program.requirements_gre_quantitative - 10 ? 70 : 30;
    }

    // Language requirements
    if (profile.toefl && program.requirements_toefl) {
      checks++;
      programFit += profile.toefl >= program.requirements_toefl ? 100 :
                    profile.toefl >= program.requirements_toefl - 10 ? 70 : 30;
    }

    if (checks > 0) {
      const avgProgramFit = programFit / checks;
      bestProgramFit = Math.max(bestProgramFit, avgProgramFit);
    }
  });

  return bestProgramFit;
}

function calculateFinancialFit(university: University, profile: UserProfile, preferences: any): number {
  const maxBudget = preferences?.max_tuition_budget || profile?.max_tuition_budget || 100000;
  const tuition = university.tuition_international;

  if (tuition <= maxBudget * 0.7) return 100;
  if (tuition <= maxBudget) return 80;
  if (tuition <= maxBudget * 1.2) return 60;
  if (tuition <= maxBudget * 1.5) return 40;
  return 20;
}

function calculateLocationFit(university: University, preferences: any): number {
  if (!preferences?.preferred_locations || preferences.preferred_locations.length === 0) {
    return 70; // Neutral if no preference
  }

  return preferences.preferred_locations.includes(university.state) ? 100 : 30;
}

function calculateProgramAlignment(university: University, profile: UserProfile, preferences: any): number {
  if (!profile?.target_programs || profile.target_programs.length === 0) {
    return 70; // Neutral if no specific programs targeted
  }

  const hasMatchingProgram = university.programs?.some(program =>
    profile.target_programs.some(target =>
      program.name.toLowerCase().includes(target.toLowerCase()) ||
      program.department.toLowerCase().includes(target.toLowerCase())
    )
  );

  return hasMatchingProgram ? 100 : 20;
}

function calculateTypeFit(university: University, preferences: any): number {
  if (!preferences?.preferred_university_types || preferences.preferred_university_types.length === 0) {
    return 70;
  }

  return preferences.preferred_university_types.includes(university.type) ? 100 : 30;
}

function calculateScholarshipMatch(scholarship: any, profile: UserProfile): number {
  let score = 50; // Base score

  // GPA requirement check
  if (scholarship.gpa_requirement && profile.gpa) {
    if (profile.gpa >= scholarship.gpa_requirement) {
      score += 30;
    } else if (profile.gpa >= scholarship.gpa_requirement - 0.2) {
      score += 15;
    }
  }

  // Field of study alignment
  if (scholarship.field_of_study_restrictions && profile.target_programs) {
    const hasFieldMatch = scholarship.field_of_study_restrictions.some((field: string) =>
      profile.target_programs?.some(program =>
        program.toLowerCase().includes(field.toLowerCase())
      )
    );
    if (hasFieldMatch) score += 20;
  }

  return Math.min(score, 100);
}

function calculateProfileCompleteness(profile: UserProfile): number {
  const fields = ['gpa', 'gre_verbal', 'gre_quantitative', 'toefl', 'preferred_degree_types', 'target_programs'];
  const completedFields = fields.filter(field => profile && profile[field as keyof UserProfile]);
  return Math.round((completedFields.length / fields.length) * 100);
}

function getMatchReasons(university: University, profile: UserProfile, preferences: any): string[] {
  const reasons = [];

  if (university.ranking && university.ranking <= 50) {
    reasons.push("Top-ranked university");
  }

  if (preferences?.preferred_locations?.includes(university.state)) {
    reasons.push("Matches location preference");
  }

  if (university.has_in_state_tuition_waiver) {
    reasons.push("Offers in-state tuition for international students");
  }

  if (university.scholarships && university.scholarships.length > 0) {
    reasons.push(`${university.scholarships.length} scholarships available`);
  }

  return reasons;
}

function calculateGapAnalysis(university: University, profile: UserProfile): any {
  const gaps = [];

  if (university.programs && university.programs.length > 0) {
    const program = university.programs[0]; // Analyze first program for simplicity

    if (program.requirements_gpa && profile.gpa && profile.gpa < program.requirements_gpa) {
      gaps.push({
        type: "GPA",
        required: program.requirements_gpa,
        current: profile.gpa,
        gap: program.requirements_gpa - profile.gpa
      });
    }

    if (program.requirements_gre_verbal && profile.gre_verbal && profile.gre_verbal < program.requirements_gre_verbal) {
      gaps.push({
        type: "GRE Verbal",
        required: program.requirements_gre_verbal,
        current: profile.gre_verbal,
        gap: program.requirements_gre_verbal - profile.gre_verbal
      });
    }
  }

  return {
    gaps,
    meets_requirements: gaps.length === 0,
    total_gaps: gaps.length
  };
}

function getRecommendedPrograms(programs: any[], profile: UserProfile, preferences: any): any[] {
  if (!programs) return [];

  return programs
    .map(program => ({
      ...program,
      fit_score: calculateProgramFit(program, profile, preferences)
    }))
    .sort((a, b) => b.fit_score - a.fit_score)
    .slice(0, 3);
}

function calculateProgramFit(program: any, profile: UserProfile, preferences: any): number {
  let score = 50;

  // Check academic requirements
  if (profile.gpa && program.requirements_gpa) {
    if (profile.gpa >= program.requirements_gpa) score += 25;
    else if (profile.gpa >= program.requirements_gpa - 0.3) score += 15;
  }

  // Check program alignment
  if (profile.target_programs) {
    const hasAlignment = profile.target_programs.some(target =>
      program.name.toLowerCase().includes(target.toLowerCase())
    );
    if (hasAlignment) score += 25;
  }

  return Math.min(score, 100);
}

// Additional helper functions for detailed analysis
function calculateResearchFit(university: University, profile: UserProfile): number {
  // Implementation for research opportunities scoring
  return 70; // Placeholder
}

function calculateCareerFit(university: University, profile: UserProfile): number {
  // Implementation for career outcomes scoring
  return 70; // Placeholder
}

function getApplicationStrengths(university: University, profile: UserProfile): string[] {
  return ["Strong academic background", "Relevant experience"]; // Placeholder
}

function getImprovementAreas(university: University, profile: UserProfile): string[] {
  return ["Consider improving GRE scores"]; // Placeholder
}

function getRecommendedActions(university: University, profile: UserProfile): string[] {
  return ["Start application early", "Prepare strong personal statement"]; // Placeholder
}

function calculateAdmissionProbability(university: University, profile: UserProfile): number {
  return 65; // Placeholder percentage
}

function checkScholarshipEligibility(scholarship: any, profile: UserProfile): string {
  return "Eligible"; // Placeholder
}

function estimateScholarshipValue(scholarship: any): number {
  return scholarship.amount_value || 25000; // Placeholder
}

function assessApplicationDifficulty(scholarship: any): string {
  return "Medium"; // Placeholder
}

function calculateProgramSimilarity(program1: any, program2: any): number {
  return 75; // Placeholder
}

function getProgramComparisonHighlights(program1: any, program2: any): string[] {
  return ["Similar duration", "Comparable requirements"]; // Placeholder
}