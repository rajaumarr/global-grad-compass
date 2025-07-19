import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UniversityData {
  name: string;
  city: string;
  state: string;
  website?: string;
  description?: string;
  founded_year?: number;
  student_population?: number;
  acceptance_rate?: number;
  graduation_rate?: number;
  faculty_student_ratio?: string;
  campus_size?: string;
  setting?: string;
  type?: string;
  tuition_in_state?: number;
  tuition_out_of_state?: number;
  tuition_international: number;
  has_in_state_tuition_waiver?: boolean;
  ranking?: number;
  contact_email?: string;
  contact_phone?: string;
  address_line1?: string;
  address_line2?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  accreditation?: string[];
  notable_alumni?: string[];
  research_areas?: string[];
  international_programs?: boolean;
  housing_available?: boolean;
  application_fee?: number;
  common_app_accepted?: boolean;
  programs?: any[];
  scholarships?: any[];
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

    const { action, data } = await req.json();
    console.log(`Processing ${action} for university data`);

    switch (action) {
      case 'import_university':
        return await importUniversity(supabaseClient, data);
      case 'bulk_import':
        return await bulkImportUniversities(supabaseClient, data);
      case 'update_rankings':
        return await updateRankings(supabaseClient, data);
      case 'validate_data':
        return await validateUniversityData(supabaseClient, data);
      case 'generate_sample_data':
        return await generateSampleData(supabaseClient);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in university-data-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function importUniversity(supabaseClient: any, universityData: UniversityData) {
  // Extract programs and scholarships for separate insertion
  const { programs, scholarships, ...university } = universityData;

  // Insert university
  const { data: universityResult, error: universityError } = await supabaseClient
    .from('universities')
    .insert(university)
    .select()
    .single();

  if (universityError) throw universityError;

  const universityId = universityResult.id;

  // Insert programs if provided
  if (programs && programs.length > 0) {
    const programsWithUniversityId = programs.map(program => ({
      ...program,
      university_id: universityId
    }));

    const { error: programsError } = await supabaseClient
      .from('programs')
      .insert(programsWithUniversityId);

    if (programsError) throw programsError;
  }

  // Insert scholarships if provided
  if (scholarships && scholarships.length > 0) {
    const scholarshipsWithUniversityId = scholarships.map(scholarship => ({
      ...scholarship,
      university_id: universityId
    }));

    const { error: scholarshipsError } = await supabaseClient
      .from('scholarships')
      .insert(scholarshipsWithUniversityId);

    if (scholarshipsError) throw scholarshipsError;
  }

  // Log data source
  await supabaseClient
    .from('data_sources')
    .insert({
      university_id: universityId,
      source_type: 'api',
      data_quality_score: 85,
      automated: true,
      notes: 'Imported via data processor function'
    });

  return new Response(
    JSON.stringify({ 
      success: true, 
      university_id: universityId,
      message: 'University data imported successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function bulkImportUniversities(supabaseClient: any, universities: UniversityData[]) {
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const universityData of universities) {
    try {
      const result = await importUniversity(supabaseClient, universityData);
      const resultData = await result.json();
      results.push({ university: universityData.name, success: true, data: resultData });
      successCount++;
    } catch (error) {
      results.push({ 
        university: universityData.name, 
        success: false, 
        error: error.message 
      });
      errorCount++;
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true,
      summary: {
        total: universities.length,
        successful: successCount,
        errors: errorCount
      },
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateRankings(supabaseClient: any, rankingsData: any) {
  const { rankings, ranking_system, year } = rankingsData;

  const rankingInserts = rankings.map((ranking: any) => ({
    university_id: ranking.university_id,
    ranking_system,
    overall_rank: ranking.rank,
    category_ranks: ranking.category_ranks || {},
    year
  }));

  const { error } = await supabaseClient
    .from('university_rankings')
    .upsert(rankingInserts, { 
      onConflict: 'university_id,ranking_system,year',
      ignoreDuplicates: false
    });

  if (error) throw error;

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Updated ${rankings.length} rankings for ${ranking_system} ${year}`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function validateUniversityData(supabaseClient: any, data: any) {
  const { university_id } = data;

  // Fetch university data
  const { data: university, error } = await supabaseClient
    .from('universities')
    .select(`
      *,
      programs (*),
      scholarships (*),
      data_sources (*)
    `)
    .eq('id', university_id)
    .single();

  if (error) throw error;

  // Perform validation checks
  const validationResults = {
    university_id,
    checks: {
      basic_info: validateBasicInfo(university),
      programs: validatePrograms(university.programs),
      scholarships: validateScholarships(university.scholarships),
      data_freshness: validateDataFreshness(university.data_sources)
    },
    overall_score: 0
  };

  // Calculate overall score
  const checks = Object.values(validationResults.checks);
  validationResults.overall_score = Math.round(
    checks.reduce((sum: number, check: any) => sum + check.score, 0) / checks.length
  );

  return new Response(
    JSON.stringify(validationResults),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateSampleData(supabaseClient: any) {
  const sampleUniversities = [
    {
      name: "California Institute of Technology",
      city: "Pasadena",
      state: "CA",
      website: "https://www.caltech.edu",
      description: "A world-renowned science and engineering institute with a strong focus on research and innovation.",
      founded_year: 1891,
      student_population: 2240,
      acceptance_rate: 6.4,
      graduation_rate: 94.0,
      faculty_student_ratio: "3:1",
      campus_size: "124 acres",
      setting: "suburban",
      type: "private",
      tuition_international: 58680,
      has_in_state_tuition_waiver: false,
      ranking: 7,
      application_fee: 75,
      common_app_accepted: true,
      research_areas: ["Aerospace", "Biology", "Chemistry", "Computer Science", "Physics"],
      international_programs: true,
      housing_available: true,
      programs: [
        {
          name: "Computer Science",
          department: "Computing and Mathematical Sciences",
          degree: "MS",
          duration_months: 24,
          format: "on-campus",
          requirements_gpa: 3.7,
          requirements_gre_verbal: 160,
          requirements_gre_quantitative: 170,
          requirements_gre_writing: 4.5,
          requirements_toefl: 100,
          requirements_ielts: 7.0,
          application_deadline: "December 15, 2024",
          research_opportunities: true,
          thesis_required: true,
          average_starting_salary: 145000
        }
      ],
      scholarships: [
        {
          name: "Caltech Graduate Fellowship",
          amount_type: "full_tuition",
          renewable: true,
          deadline: "December 15, 2024",
          eligibility: ["Exceptional academic record", "Research potential"],
          funding_source: "university"
        }
      ]
    },
    {
      name: "University of Washington",
      city: "Seattle",
      state: "WA",
      website: "https://www.washington.edu",
      description: "A leading public research university known for innovation in technology and medicine.",
      founded_year: 1861,
      student_population: 47400,
      acceptance_rate: 52.9,
      graduation_rate: 84.0,
      faculty_student_ratio: "19:1",
      campus_size: "703 acres",
      setting: "urban",
      type: "public",
      tuition_in_state: 12076,
      tuition_out_of_state: 39114,
      tuition_international: 39114,
      has_in_state_tuition_waiver: true,
      ranking: 59,
      application_fee: 90,
      common_app_accepted: false,
      research_areas: ["Medicine", "Technology", "Engineering", "Business", "Environmental Science"],
      international_programs: true,
      housing_available: true,
      programs: [
        {
          name: "Data Science",
          department: "Information School",
          degree: "MS",
          duration_months: 18,
          format: "on-campus",
          requirements_gpa: 3.0,
          requirements_gre_verbal: 155,
          requirements_gre_quantitative: 160,
          requirements_gre_writing: 4.0,
          requirements_toefl: 92,
          requirements_ielts: 7.0,
          application_deadline: "December 15, 2024",
          internship_opportunities: true,
          capstone_required: true,
          average_starting_salary: 115000
        }
      ],
      scholarships: [
        {
          name: "Graduate School Fellowship",
          amount_type: "fixed",
          amount_value: 28000,
          renewable: true,
          deadline: "January 15, 2025",
          eligibility: ["Academic merit", "Research focus"],
          funding_source: "university"
        }
      ]
    }
  ];

  let successCount = 0;
  for (const university of sampleUniversities) {
    try {
      await importUniversity(supabaseClient, university);
      successCount++;
    } catch (error) {
      console.error(`Failed to import ${university.name}:`, error);
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Generated ${successCount} sample universities`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function validateBasicInfo(university: any) {
  let score = 0;
  const checks = [];

  if (university.name) { score += 20; checks.push("Name present"); }
  if (university.description) { score += 15; checks.push("Description present"); }
  if (university.website) { score += 10; checks.push("Website present"); }
  if (university.founded_year) { score += 10; checks.push("Founded year present"); }
  if (university.student_population) { score += 15; checks.push("Student population present"); }
  if (university.acceptance_rate) { score += 15; checks.push("Acceptance rate present"); }
  if (university.tuition_international) { score += 15; checks.push("Tuition present"); }

  return { score, checks, passed: score >= 70 };
}

function validatePrograms(programs: any[]) {
  if (!programs || programs.length === 0) {
    return { score: 0, checks: ["No programs found"], passed: false };
  }

  let totalScore = 0;
  const checks = [];

  programs.forEach((program, index) => {
    let programScore = 0;
    if (program.name) programScore += 25;
    if (program.degree) programScore += 25;
    if (program.department) programScore += 25;
    if (program.requirements_gpa) programScore += 25;
    
    totalScore += programScore;
    checks.push(`Program ${index + 1}: ${programScore}/100`);
  });

  const averageScore = Math.round(totalScore / programs.length);
  return { score: averageScore, checks, passed: averageScore >= 70 };
}

function validateScholarships(scholarships: any[]) {
  if (!scholarships || scholarships.length === 0) {
    return { score: 50, checks: ["No scholarships data"], passed: true };
  }

  let validScholarships = 0;
  scholarships.forEach(scholarship => {
    if (scholarship.name && scholarship.amount_type) {
      validScholarships++;
    }
  });

  const score = Math.round((validScholarships / scholarships.length) * 100);
  return { 
    score, 
    checks: [`${validScholarships}/${scholarships.length} scholarships valid`], 
    passed: score >= 70 
  };
}

function validateDataFreshness(dataSources: any[]) {
  if (!dataSources || dataSources.length === 0) {
    return { score: 30, checks: ["No data source tracking"], passed: false };
  }

  const latestSource = dataSources.sort((a, b) => 
    new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  )[0];

  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(latestSource.last_updated).getTime()) / (1000 * 60 * 60 * 24)
  );

  let score = 100;
  if (daysSinceUpdate > 30) score = 60;
  if (daysSinceUpdate > 90) score = 30;
  if (daysSinceUpdate > 365) score = 10;

  return {
    score,
    checks: [`Last updated ${daysSinceUpdate} days ago`],
    passed: score >= 70
  };
}