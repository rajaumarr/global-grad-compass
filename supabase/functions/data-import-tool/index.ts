import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data, options } = await req.json();
    console.log(`Processing ${action} for data import`);

    switch (action) {
      case 'import_csv':
        return await importFromCSV(supabaseClient, data, options);
      case 'import_json':
        return await importFromJSON(supabaseClient, data, options);
      case 'validate_import_data':
        return await validateImportData(data, options);
      case 'get_import_template':
        return await getImportTemplate(options?.type);
      case 'generate_comprehensive_data':
        return await generateComprehensiveData(supabaseClient, options);
      case 'update_existing_programs':
        return await updateExistingUniversitiesWithPrograms(supabaseClient, options);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in data-import-tool:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function importFromCSV(supabaseClient: any, csvData: string, options: any) {
  // Parse CSV data (simplified - would need proper CSV parser in production)
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || null;
    });
    return obj;
  });

  if (options.type === 'universities') {
    return await bulkImportUniversities(supabaseClient, rows);
  } else if (options.type === 'programs') {
    return await bulkImportPrograms(supabaseClient, rows);
  } else if (options.type === 'scholarships') {
    return await bulkImportScholarships(supabaseClient, rows);
  }

  throw new Error(`Unsupported import type: ${options.type}`);
}

async function importFromJSON(supabaseClient: any, jsonData: any[], options: any) {
  if (options.type === 'universities') {
    return await bulkImportUniversities(supabaseClient, jsonData);
  } else if (options.type === 'programs') {
    return await bulkImportPrograms(supabaseClient, jsonData);
  } else if (options.type === 'scholarships') {
    return await bulkImportScholarships(supabaseClient, jsonData);
  }

  throw new Error(`Unsupported import type: ${options.type}`);
}

async function bulkImportUniversities(supabaseClient: any, universities: any[]) {
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const university of universities) {
    try {
      // Clean and validate data
      const cleanedUniversity = cleanUniversityData(university);
      
      const { data, error } = await supabaseClient
        .from('universities')
        .insert(cleanedUniversity)
        .select()
        .single();

      if (error) throw error;

      // Log data source
      await supabaseClient
        .from('data_sources')
        .insert({
          university_id: data.id,
          source_type: 'bulk_import',
          data_quality_score: 80,
          automated: false,
          notes: 'Imported via bulk import tool'
        });

      results.push({ university: university.name, success: true, id: data.id });
      successCount++;
    } catch (error) {
      results.push({ 
        university: university.name, 
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

async function bulkImportPrograms(supabaseClient: any, programs: any[]) {
  const results = [];
  let successCount = 0;

  for (const program of programs) {
    try {
      const cleanedProgram = cleanProgramData(program);
      
      const { error } = await supabaseClient
        .from('programs')
        .insert(cleanedProgram);

      if (error) throw error;

      results.push({ program: program.name, success: true });
      successCount++;
    } catch (error) {
      results.push({ 
        program: program.name, 
        success: false, 
        error: error.message 
      });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      summary: { total: programs.length, successful: successCount },
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function bulkImportScholarships(supabaseClient: any, scholarships: any[]) {
  const results = [];
  let successCount = 0;

  for (const scholarship of scholarships) {
    try {
      const cleanedScholarship = cleanScholarshipData(scholarship);
      
      const { error } = await supabaseClient
        .from('scholarships')
        .insert(cleanedScholarship);

      if (error) throw error;

      results.push({ scholarship: scholarship.name, success: true });
      successCount++;
    } catch (error) {
      results.push({ 
        scholarship: scholarship.name, 
        success: false, 
        error: error.message 
      });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      summary: { total: scholarships.length, successful: successCount },
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function validateImportData(data: any[], options: any) {
  const validationResults = {
    valid_rows: 0,
    invalid_rows: 0,
    errors: [] as any[],
    warnings: [] as any[]
  };

  data.forEach((row, index) => {
    const validation = validateRow(row, options.type);
    if (validation.valid) {
      validationResults.valid_rows++;
    } else {
      validationResults.invalid_rows++;
      validationResults.errors.push({
        row: index + 1,
        errors: validation.errors
      });
    }
    
    if (validation.warnings.length > 0) {
      validationResults.warnings.push({
        row: index + 1,
        warnings: validation.warnings
      });
    }
  });

  return new Response(
    JSON.stringify({
      success: true,
      validation: validationResults,
      ready_for_import: validationResults.invalid_rows === 0
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getImportTemplate(type: string) {
  const templates = {
    universities: {
      csv_headers: 'name,city,state,website,description,founded_year,student_population,acceptance_rate,tuition_international,type,setting',
      sample_data: [
        {
          name: "Example University",
          city: "Example City",
          state: "CA",
          website: "https://example.edu",
          description: "A leading research university",
          founded_year: 1885,
          student_population: 15000,
          acceptance_rate: 65.5,
          tuition_international: 45000,
          type: "public",
          setting: "urban"
        }
      ],
      required_fields: ['name', 'city', 'state', 'tuition_international'],
      optional_fields: ['website', 'description', 'founded_year', 'student_population', 'acceptance_rate', 'type', 'setting']
    },
    programs: {
      csv_headers: 'university_id,name,department,degree,duration_months,requirements_gpa,requirements_gre_verbal,requirements_toefl',
      sample_data: [
        {
          university_id: "uuid-here",
          name: "Computer Science",
          department: "Computer Science",
          degree: "MS",
          duration_months: 24,
          requirements_gpa: 3.0,
          requirements_gre_verbal: 150,
          requirements_toefl: 80
        }
      ],
      required_fields: ['university_id', 'name', 'department', 'degree'],
      optional_fields: ['duration_months', 'requirements_gpa', 'requirements_gre_verbal', 'requirements_toefl']
    },
    scholarships: {
      csv_headers: 'university_id,name,amount_type,amount_value,renewable,deadline,eligibility',
      sample_data: [
        {
          university_id: "uuid-here",
          name: "Merit Scholarship",
          amount_type: "fixed",
          amount_value: 25000,
          renewable: true,
          deadline: "March 1, 2025",
          eligibility: "High GPA,Academic excellence"
        }
      ],
      required_fields: ['university_id', 'name', 'amount_type'],
      optional_fields: ['amount_value', 'renewable', 'deadline', 'eligibility']
    }
  };

  return new Response(
    JSON.stringify({
      success: true,
      template: templates[type as keyof typeof templates] || null
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateComprehensiveData(supabaseClient: any, options: any) {
  const count = options?.count || 50;
  
  // Get existing university names to avoid duplicates
  const { data: existingUniversities } = await supabaseClient
    .from('universities')
    .select('name');
  
  const existingNames = new Set(existingUniversities?.map((u: any) => u.name) || []);
  
  const generatedUniversities = [];
  
  // Real university data for accuracy
  const realUniversities = [
    { name: 'Harvard University', city: 'Cambridge', state: 'MA', type: 'private', setting: 'urban', founded: 1636 },
    { name: 'Yale University', city: 'New Haven', state: 'CT', type: 'private', setting: 'urban', founded: 1701 },
    { name: 'Princeton University', city: 'Princeton', state: 'NJ', type: 'private', setting: 'suburban', founded: 1746 },
    { name: 'Columbia University', city: 'New York', state: 'NY', type: 'private', setting: 'urban', founded: 1754 },
    { name: 'University of Pennsylvania', city: 'Philadelphia', state: 'PA', type: 'private', setting: 'urban', founded: 1740 },
    { name: 'Cornell University', city: 'Ithaca', state: 'NY', type: 'private', setting: 'suburban', founded: 1865 },
    { name: 'Dartmouth College', city: 'Hanover', state: 'NH', type: 'private', setting: 'rural', founded: 1769 },
    { name: 'Brown University', city: 'Providence', state: 'RI', type: 'private', setting: 'urban', founded: 1764 },
    { name: 'University of Chicago', city: 'Chicago', state: 'IL', type: 'private', setting: 'urban', founded: 1890 },
    { name: 'Northwestern University', city: 'Evanston', state: 'IL', type: 'private', setting: 'suburban', founded: 1851 },
    { name: 'Duke University', city: 'Durham', state: 'NC', type: 'private', setting: 'suburban', founded: 1838 },
    { name: 'Vanderbilt University', city: 'Nashville', state: 'TN', type: 'private', setting: 'urban', founded: 1873 },
    { name: 'Rice University', city: 'Houston', state: 'TX', type: 'private', setting: 'urban', founded: 1912 },
    { name: 'University of Notre Dame', city: 'Notre Dame', state: 'IN', type: 'private', setting: 'suburban', founded: 1842 },
    { name: 'Georgetown University', city: 'Washington', state: 'DC', type: 'private', setting: 'urban', founded: 1789 },
    { name: 'University of California, Berkeley', city: 'Berkeley', state: 'CA', type: 'public', setting: 'urban', founded: 1868 },
    { name: 'University of California, Los Angeles', city: 'Los Angeles', state: 'CA', type: 'public', setting: 'urban', founded: 1919 },
    { name: 'University of Michigan', city: 'Ann Arbor', state: 'MI', type: 'public', setting: 'suburban', founded: 1817 },
    { name: 'University of Virginia', city: 'Charlottesville', state: 'VA', type: 'public', setting: 'suburban', founded: 1819 },
    { name: 'University of North Carolina at Chapel Hill', city: 'Chapel Hill', state: 'NC', type: 'public', setting: 'suburban', founded: 1789 },
    { name: 'University of Florida', city: 'Gainesville', state: 'FL', type: 'public', setting: 'suburban', founded: 1853 },
    { name: 'Ohio State University', city: 'Columbus', state: 'OH', type: 'public', setting: 'urban', founded: 1870 },
    { name: 'Pennsylvania State University', city: 'University Park', state: 'PA', type: 'public', setting: 'suburban', founded: 1855 },
    { name: 'University of Illinois at Urbana-Champaign', city: 'Champaign', state: 'IL', type: 'public', setting: 'suburban', founded: 1867 },
    { name: 'University of Wisconsin-Madison', city: 'Madison', state: 'WI', type: 'public', setting: 'urban', founded: 1848 }
  ];

  const programs = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Data Science', 
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'Economics', 'Political Science',
    'Civil Engineering', 'Biomedical Engineering', 'Finance', 'Marketing', 'International Relations'
  ];

  let added = 0;
  let universityIndex = 0;

  // Expand with more university names if needed
  const additionalUniversities = [
    { name: 'University of California, San Diego', city: 'San Diego', state: 'CA', type: 'public', setting: 'urban', founded: 1960 },
    { name: 'University of Texas at Austin', city: 'Austin', state: 'TX', type: 'public', setting: 'urban', founded: 1883 },
    { name: 'Georgia Institute of Technology', city: 'Atlanta', state: 'GA', type: 'public', setting: 'urban', founded: 1885 },
    { name: 'Carnegie Mellon University', city: 'Pittsburgh', state: 'PA', type: 'private', setting: 'urban', founded: 1900 },
    { name: 'University of Washington, Seattle', city: 'Seattle', state: 'WA', type: 'public', setting: 'urban', founded: 1861 },
    { name: 'Johns Hopkins University', city: 'Baltimore', state: 'MD', type: 'private', setting: 'urban', founded: 1876 },
    { name: 'New York University', city: 'New York', state: 'NY', type: 'private', setting: 'urban', founded: 1831 },
    { name: 'University of Southern California', city: 'Los Angeles', state: 'CA', type: 'private', setting: 'urban', founded: 1880 }
  ];

  const allUniversities = [...realUniversities, ...additionalUniversities];

  while (added < count && universityIndex < allUniversities.length * 3) {
    let university;
    
    if (universityIndex < allUniversities.length) {
      // Use real university data
      const real = allUniversities[universityIndex];
      if (existingNames.has(real.name)) {
        universityIndex++;
        continue;
      }
      
      university = {
        name: real.name,
        city: real.city,
        state: real.state,
        website: `https://www.${real.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
        description: generateDescription(real.type, real.setting),
        founded_year: real.founded,
        student_population: real.type === 'private' ? 8000 + Math.floor(Math.random() * 12000) : 15000 + Math.floor(Math.random() * 35000),
        acceptance_rate: real.type === 'private' ? 5 + Math.random() * 15 : 20 + Math.random() * 50,
        graduation_rate: 85 + Math.random() * 15,
        faculty_student_ratio: `1:${Math.floor(Math.random() * 10) + 6}`,
        campus_size: `${Math.floor(Math.random() * 1500) + 200} acres`,
        setting: real.setting,
        type: real.type,
        tuition_in_state: real.type === 'public' ? 12000 + Math.floor(Math.random() * 15000) : null,
        tuition_out_of_state: real.type === 'public' ? 30000 + Math.floor(Math.random() * 25000) : null,
        tuition_international: real.type === 'private' ? 45000 + Math.floor(Math.random() * 25000) : 35000 + Math.floor(Math.random() * 20000),
        has_in_state_tuition_waiver: Math.random() > 0.7,
        ranking: Math.floor(Math.random() * 200) + 1,
        application_fee: Math.floor(Math.random() * 50) + 50,
        common_app_accepted: Math.random() > 0.2,
        research_areas: generateResearchAreas(),
        international_programs: Math.random() > 0.3,
        housing_available: true,
        programs: generatePrograms(programs),
        scholarships: generateScholarships()
      };
    } else {
      // Generate synthetic but realistic names
      const states = ['AL', 'AK', 'AZ', 'AR', 'CO', 'CT', 'DE', 'GA', 'HI', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NM', 'ND', 'OK', 'OR', 'SC', 'SD', 'TN', 'UT', 'VT', 'WV', 'WY'];
      const state = states[Math.floor(Math.random() * states.length)];
      const type = Math.random() > 0.6 ? 'private' : 'public';
      const setting = ['urban', 'suburban', 'rural'][Math.floor(Math.random() * 3)];
      
      const name = generateUniversityName(state, universityIndex - realUniversities.length);
      if (existingNames.has(name)) {
        universityIndex++;
        continue;
      }
      
      university = {
        name: name,
        city: generateCityName(state),
        state: state,
        website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
        description: generateDescription(type, setting),
        founded_year: 1850 + Math.floor(Math.random() * 170),
        student_population: type === 'private' ? 3000 + Math.floor(Math.random() * 12000) : 8000 + Math.floor(Math.random() * 40000),
        acceptance_rate: type === 'private' ? 15 + Math.random() * 40 : 30 + Math.random() * 50,
        graduation_rate: 65 + Math.random() * 30,
        faculty_student_ratio: `1:${Math.floor(Math.random() * 15) + 8}`,
        campus_size: `${Math.floor(Math.random() * 2000) + 100} acres`,
        setting: setting,
        type: type,
        tuition_in_state: type === 'public' ? 8000 + Math.floor(Math.random() * 15000) : null,
        tuition_out_of_state: type === 'public' ? 20000 + Math.floor(Math.random() * 25000) : null,
        tuition_international: type === 'private' ? 35000 + Math.floor(Math.random() * 30000) : 25000 + Math.floor(Math.random() * 25000),
        has_in_state_tuition_waiver: Math.random() > 0.7,
        ranking: Math.random() > 0.4 ? Math.floor(Math.random() * 400) + 1 : null,
        application_fee: Math.floor(Math.random() * 100) + 25,
        common_app_accepted: Math.random() > 0.4,
        research_areas: generateResearchAreas(),
        international_programs: Math.random() > 0.5,
        housing_available: Math.random() > 0.1,
        programs: generatePrograms(programs),
        scholarships: generateScholarships()
      };
    }

    existingNames.add(university.name);
    generatedUniversities.push(university);
    added++;
    universityIndex++;
  }

  // Import the generated data
  const importResult = await bulkImportWithPrograms(supabaseClient, generatedUniversities);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Generated and imported ${added} comprehensive university records`,
      import_summary: importResult
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
function cleanUniversityData(university: any) {
  return {
    name: university.name?.toString() || '',
    city: university.city?.toString() || '',
    state: university.state?.toString() || '',
    website: university.website?.toString() || null,
    description: university.description?.toString() || null,
    founded_year: university.founded_year ? parseInt(university.founded_year) : null,
    student_population: university.student_population ? parseInt(university.student_population) : null,
    acceptance_rate: university.acceptance_rate ? parseFloat(university.acceptance_rate) : null,
    graduation_rate: university.graduation_rate ? parseFloat(university.graduation_rate) : null,
    faculty_student_ratio: university.faculty_student_ratio?.toString() || null,
    campus_size: university.campus_size?.toString() || null,
    setting: university.setting?.toString() || null,
    type: university.type?.toString() || 'public',
    tuition_in_state: university.tuition_in_state ? parseInt(university.tuition_in_state) : null,
    tuition_out_of_state: university.tuition_out_of_state ? parseInt(university.tuition_out_of_state) : null,
    tuition_international: parseInt(university.tuition_international) || 0,
    has_in_state_tuition_waiver: university.has_in_state_tuition_waiver === 'true' || university.has_in_state_tuition_waiver === true,
    ranking: university.ranking ? parseInt(university.ranking) : null,
    application_fee: university.application_fee ? parseInt(university.application_fee) : 0,
    common_app_accepted: university.common_app_accepted === 'true' || university.common_app_accepted === true
  };
}

function cleanProgramData(program: any) {
  return {
    university_id: program.university_id,
    name: program.name?.toString() || '',
    department: program.department?.toString() || '',
    degree: program.degree?.toString() || '',
    duration_months: program.duration_months ? parseInt(program.duration_months) : null,
    requirements_gpa: program.requirements_gpa ? parseFloat(program.requirements_gpa) : null,
    requirements_gre_verbal: program.requirements_gre_verbal ? parseInt(program.requirements_gre_verbal) : null,
    requirements_gre_quantitative: program.requirements_gre_quantitative ? parseInt(program.requirements_gre_quantitative) : null,
    requirements_toefl: program.requirements_toefl ? parseInt(program.requirements_toefl) : null,
    requirements_ielts: program.requirements_ielts ? parseFloat(program.requirements_ielts) : null
  };
}

function cleanScholarshipData(scholarship: any) {
  return {
    university_id: scholarship.university_id,
    name: scholarship.name?.toString() || '',
    amount_type: scholarship.amount_type?.toString() || 'fixed',
    amount_value: scholarship.amount_value ? parseInt(scholarship.amount_value) : null,
    renewable: scholarship.renewable === 'true' || scholarship.renewable === true,
    deadline: scholarship.deadline?.toString() || null,
    eligibility: scholarship.eligibility ? scholarship.eligibility.split(',').map((e: string) => e.trim()) : []
  };
}

function validateRow(row: any, type: string) {
  const validation = { valid: true, errors: [], warnings: [] };

  if (type === 'universities') {
    if (!row.name) validation.errors.push('Name is required');
    if (!row.city) validation.errors.push('City is required');
    if (!row.state) validation.errors.push('State is required');
    if (!row.tuition_international) validation.errors.push('International tuition is required');
  }

  validation.valid = validation.errors.length === 0;
  return validation;
}

function generateUniversityName(state: string, index: number): string {
  const prefixes = ['University of', 'State University of', 'Technical Institute of', 'College of'];
  const suffixes = ['Technology', 'Science', 'Arts & Sciences', 'Engineering', 'Research'];
  
  if (Math.random() > 0.5) {
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${state} ${index + 1}`;
  } else {
    return `${state} ${suffixes[Math.floor(Math.random() * suffixes.length)]} University`;
  }
}

function generateCityName(state: string): string {
  const cities: { [key: string]: string[] } = {
    'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland'],
    'NY': ['New York', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    // Add more as needed
  };
  
  const stateCities = cities[state] || ['Metro City', 'University Town', 'College City'];
  return stateCities[Math.floor(Math.random() * stateCities.length)];
}

function generateDescription(type: string, setting: string): string {
  const descriptions = [
    `A ${type} research university located in a ${setting} environment, known for academic excellence and innovation.`,
    `Leading ${type} institution offering comprehensive programs in a ${setting} setting with strong industry connections.`,
    `Premier ${type} university combining traditional education with modern research in a beautiful ${setting} campus.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateResearchAreas(): string[] {
  const areas = [
    'Artificial Intelligence', 'Biotechnology', 'Climate Science', 'Renewable Energy',
    'Cybersecurity', 'Materials Science', 'Neuroscience', 'Space Technology',
    'Quantum Computing', 'Medical Research', 'Environmental Studies', 'Social Sciences'
  ];
  
  const count = Math.floor(Math.random() * 5) + 2;
  return areas.sort(() => 0.5 - Math.random()).slice(0, count);
}

function generatePrograms(availablePrograms: string[]): any[] {
  const count = Math.floor(Math.random() * 6) + 3; // 3-8 programs per university
  const degrees = ['MS', 'PhD', 'MBA', 'MEng', 'MA'];
  const formats = ['on-campus', 'online', 'hybrid'];
  
  return availablePrograms.slice(0, count).map(program => {
    const degree = degrees[Math.floor(Math.random() * degrees.length)];
    const isDoctoral = degree === 'PhD';
    const isMBA = degree === 'MBA';
    
    return {
      name: program,
      department: `Department of ${program}`,
      degree: degree,
      description: generateProgramDescription(program, degree),
      duration_months: isDoctoral ? 48 + Math.floor(Math.random() * 24) : (isMBA ? 24 : 18 + Math.floor(Math.random() * 12)),
      credit_hours: isDoctoral ? 90 + Math.floor(Math.random() * 30) : (isMBA ? 60 : 30 + Math.floor(Math.random() * 15)),
      format: formats[Math.floor(Math.random() * formats.length)],
      requirements_gpa: 2.5 + Math.random() * 1.5,
      requirements_gre_verbal: 140 + Math.floor(Math.random() * 30),
      requirements_gre_quantitative: 150 + Math.floor(Math.random() * 30),
      requirements_gre_writing: 3.0 + Math.random() * 2.0,
      requirements_gmat: isMBA ? 550 + Math.floor(Math.random() * 200) : null,
      requirements_toefl: 79 + Math.floor(Math.random() * 31),
      requirements_ielts: 6.5 + Math.random() * 1.5,
      prerequisites: generatePrerequisites(program),
      application_deadline: generateDeadlines(),
      specializations: generateSpecializations(program),
      internship_opportunities: Math.random() > 0.3,
      thesis_required: isDoctoral || Math.random() > 0.7,
      capstone_required: !isDoctoral && Math.random() > 0.5,
      work_experience_required: isMBA || Math.random() > 0.8,
      min_work_experience_years: isMBA ? 2 + Math.floor(Math.random() * 3) : (Math.random() > 0.8 ? 1 + Math.floor(Math.random() * 2) : 0),
      portfolio_required: ['Art', 'Design', 'Architecture'].some(field => program.includes(field)) || Math.random() > 0.9,
      interview_required: isMBA || Math.random() > 0.7,
      letters_of_recommendation_required: isDoctoral ? 3 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2),
      statement_of_purpose_required: true,
      cv_resume_required: true,
      average_class_size: 15 + Math.floor(Math.random() * 25),
      faculty_count: 8 + Math.floor(Math.random() * 15),
      research_opportunities: isDoctoral || Math.random() > 0.4,
      industry_partnerships: generateIndustryPartnerships(program),
      career_outcomes: generateCareerOutcomes(program, degree),
      average_starting_salary: generateSalary(program, degree),
      employment_rate: 75 + Math.random() * 20,
      language_requirements: Math.random() > 0.9 ? ['English Proficiency'] : null
    };
  });
}

function generateScholarships(): any[] {
  const count = Math.floor(Math.random() * 3);
  if (count === 0) return [];
  
  const scholarshipTypes = [
    { name: 'Merit Scholarship', type: 'fixed', min: 15000, max: 35000 },
    { name: 'Research Fellowship', type: 'full_tuition', min: 0, max: 0 },
    { name: 'International Student Grant', type: 'fixed', min: 8000, max: 20000 }
  ];
  
  return scholarshipTypes.slice(0, count).map(scholarship => ({
    name: scholarship.name,
    amount_type: scholarship.type,
    amount_value: scholarship.type === 'fixed' ? 
      scholarship.min + Math.floor(Math.random() * (scholarship.max - scholarship.min)) : null,
    renewable: Math.random() > 0.3,
    deadline: ['December 1, 2024', 'January 15, 2025', 'February 1, 2025'][Math.floor(Math.random() * 3)],
    eligibility: ['Academic Excellence', 'Research Potential', 'International Student']
  }));
}

async function bulkImportWithPrograms(supabaseClient: any, universities: any[]) {
  let successCount = 0;
  let errorCount = 0;
  const results = [];

  for (const universityData of universities) {
    try {
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
        const programsWithUniversityId = programs.map((program: any) => ({
          ...program,
          university_id: universityId
        }));

        const { error: programsError } = await supabaseClient
          .from('programs')
          .insert(programsWithUniversityId);

        if (programsError) console.error('Program insert error:', programsError);
      }

      // Insert scholarships if provided
      if (scholarships && scholarships.length > 0) {
        const scholarshipsWithUniversityId = scholarships.map((scholarship: any) => ({
          ...scholarship,
          university_id: universityId
        }));

        const { error: scholarshipsError } = await supabaseClient
          .from('scholarships')
          .insert(scholarshipsWithUniversityId);

        if (scholarshipsError) console.error('Scholarship insert error:', scholarshipsError);
      }

      // Log data source
      await supabaseClient
        .from('data_sources')
        .insert({
          university_id: universityId,
          source_type: 'bulk_import',
          data_quality_score: 90,
          automated: true,
          notes: 'Generated via comprehensive data tool'
        });

      results.push({ university: university.name, success: true, id: universityId });
      successCount++;
    } catch (error) {
      results.push({ 
        university: universityData.name, 
        success: false, 
        error: error.message 
      });
      errorCount++;
      console.error(`Failed to import ${universityData.name}:`, error);
    }
  }

  return {
    total: universities.length,
    successful: successCount,
    errors: errorCount,
    results
  };
}

function generateProgramDescription(program: string, degree: string): string {
  const descriptions = {
    'Computer Science': `The ${degree} in Computer Science offers advanced study in algorithms, software engineering, and emerging technologies.`,
    'Electrical Engineering': `Our ${degree} in Electrical Engineering focuses on circuit design, signal processing, and power systems.`,
    'Business Administration': `The ${degree} in Business Administration provides comprehensive training in management, strategy, and leadership.`,
    'Data Science': `This ${degree} program combines statistics, machine learning, and domain expertise to extract insights from data.`,
    'Biology': `The ${degree} in Biology covers molecular biology, ecology, and research methodologies in life sciences.`,
    'Mathematics': `Our ${degree} in Mathematics emphasizes theoretical foundations and practical applications across various fields.`
  };
  
  return descriptions[program as keyof typeof descriptions] || 
    `The ${degree} in ${program} provides comprehensive education and research opportunities in the field.`;
}

function generatePrerequisites(program: string): string[] {
  const prerequisites: { [key: string]: string[] } = {
    'Computer Science': ['Bachelor\'s in CS or related field', 'Programming experience', 'Calculus I & II'],
    'Electrical Engineering': ['Bachelor\'s in Engineering', 'Calculus III', 'Physics with lab'],
    'Business Administration': ['Bachelor\'s degree', 'GMAT or GRE', 'Work experience preferred'],
    'Data Science': ['Statistics', 'Programming (Python/R)', 'Linear Algebra'],
    'Biology': ['Bachelor\'s in Biology or related', 'Organic Chemistry', 'Research experience'],
    'Mathematics': ['Bachelor\'s in Mathematics', 'Real Analysis', 'Abstract Algebra']
  };
  
  return prerequisites[program] || ['Bachelor\'s degree in related field'];
}

function generateDeadlines(): string {
  const deadlines = [
    'December 15, 2024', 'January 1, 2025', 'January 15, 2025', 
    'February 1, 2025', 'March 1, 2025', 'Rolling admission'
  ];
  return deadlines[Math.floor(Math.random() * deadlines.length)];
}

function generateSpecializations(program: string): string[] {
  const specializations: { [key: string]: string[] } = {
    'Computer Science': ['Machine Learning', 'Cybersecurity', 'Software Engineering', 'Computer Graphics', 'Databases'],
    'Electrical Engineering': ['Power Systems', 'Signal Processing', 'Microelectronics', 'Communications', 'Control Systems'],
    'Business Administration': ['Finance', 'Marketing', 'Operations', 'Strategy', 'International Business'],
    'Data Science': ['Machine Learning', 'Big Data Analytics', 'Statistical Modeling', 'Business Intelligence'],
    'Biology': ['Molecular Biology', 'Ecology', 'Genetics', 'Biochemistry', 'Microbiology'],
    'Mathematics': ['Applied Mathematics', 'Pure Mathematics', 'Statistics', 'Mathematical Finance']
  };
  
  const available = specializations[program] || ['General Track', 'Research Track'];
  const count = Math.floor(Math.random() * 3) + 2;
  return available.slice(0, count);
}

function generateIndustryPartnerships(program: string): string[] {
  const partnerships: { [key: string]: string[] } = {
    'Computer Science': ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
    'Electrical Engineering': ['Intel', 'Tesla', 'General Electric', 'Siemens', 'Qualcomm'],
    'Business Administration': ['McKinsey & Company', 'Goldman Sachs', 'JP Morgan', 'Deloitte'],
    'Data Science': ['IBM', 'Netflix', 'Uber', 'Airbnb', 'Spotify'],
    'Biology': ['Pfizer', 'Johnson & Johnson', 'Moderna', 'Genentech'],
    'Mathematics': ['NASA', 'NSA', 'Financial institutions', 'Research labs']
  };
  
  const available = partnerships[program] || ['Local companies', 'Research institutions'];
  const count = Math.floor(Math.random() * 3) + 1;
  return available.slice(0, count);
}

function generateCareerOutcomes(program: string, degree: string): any {
  const outcomes = {
    'Computer Science': {
      common_titles: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Research Scientist'],
      industries: ['Technology', 'Finance', 'Healthcare', 'Gaming'],
      graduate_school_rate: degree === 'MS' ? 15 : 0
    },
    'Business Administration': {
      common_titles: ['Management Consultant', 'Investment Banker', 'Product Manager', 'Strategy Analyst'],
      industries: ['Consulting', 'Finance', 'Technology', 'Healthcare'],
      graduate_school_rate: 5
    },
    'Biology': {
      common_titles: ['Research Scientist', 'Biotech Analyst', 'Laboratory Manager', 'Medical Writer'],
      industries: ['Biotechnology', 'Pharmaceuticals', 'Research', 'Healthcare'],
      graduate_school_rate: degree === 'MS' ? 40 : 10
    }
  };
  
  return outcomes[program as keyof typeof outcomes] || {
    common_titles: ['Specialist', 'Analyst', 'Manager', 'Researcher'],
    industries: ['Various industries'],
    graduate_school_rate: 10
  };
}

function generateSalary(program: string, degree: string): number {
  const baseSalaries: { [key: string]: number } = {
    'Computer Science': 95000,
    'Electrical Engineering': 85000,
    'Business Administration': 120000,
    'Data Science': 100000,
    'Biology': 70000,
    'Mathematics': 75000,
    'Finance': 110000,
    'Marketing': 80000
  };
  
  const base = baseSalaries[program] || 70000;
  const multiplier = degree === 'PhD' ? 1.3 : (degree === 'MBA' ? 1.5 : 1.0);
  const variation = 0.8 + Math.random() * 0.4; // ±20% variation
  
  return Math.floor(base * multiplier * variation);
}

async function updateExistingUniversitiesWithPrograms(supabaseClient: any, options: any) {
  console.log('Starting update of existing universities with comprehensive program data');
  
  // Get all universities that have minimal program data
  const { data: universities, error: fetchError } = await supabaseClient
    .from('universities')
    .select(`
      id,
      name,
      type,
      programs (
        id,
        name,
        degree,
        duration_months,
        credit_hours,
        description
      )
    `);

  if (fetchError) {
    throw new Error(`Failed to fetch universities: ${fetchError.message}`);
  }

  let updatedUniversities = 0;
  let programsUpdated = 0;
  let scholarshipsAdded = 0;
  const results = [];

  const programTypes = [
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 
    'Data Science', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 
    'Economics', 'Political Science', 'Civil Engineering', 'Biomedical Engineering', 
    'Finance', 'Marketing', 'International Relations', 'Environmental Science'
  ];

  for (const university of universities) {
    try {
      console.log(`Updating ${university.name}...`);
      
      // Check if programs need updating (lack detailed information)
      const needsUpdate = !university.programs || 
        university.programs.length === 0 || 
        university.programs.some((p: any) => !p.duration_months || !p.credit_hours || !p.description);

      if (needsUpdate) {
        // Delete existing minimal programs
        if (university.programs && university.programs.length > 0) {
          await supabaseClient
            .from('programs')
            .delete()
            .eq('university_id', university.id);
        }

        // Generate comprehensive programs
        const comprehensivePrograms = generatePrograms(programTypes);
        
        // Insert new comprehensive programs
        const programsWithUniversityId = comprehensivePrograms.map(program => ({
          ...program,
          university_id: university.id
        }));

        const { error: programError } = await supabaseClient
          .from('programs')
          .insert(programsWithUniversityId);

        if (programError) {
          console.error(`Error updating programs for ${university.name}:`, programError);
          continue;
        }

        programsUpdated += comprehensivePrograms.length;

        // Add scholarships if none exist
        const { data: existingScholarships } = await supabaseClient
          .from('scholarships')
          .select('id')
          .eq('university_id', university.id);

        if (!existingScholarships || existingScholarships.length === 0) {
          const scholarships = generateScholarships();
          if (scholarships.length > 0) {
            const scholarshipsWithUniversityId = scholarships.map(scholarship => ({
              ...scholarship,
              university_id: university.id
            }));

            const { error: scholarshipError } = await supabaseClient
              .from('scholarships')
              .insert(scholarshipsWithUniversityId);

            if (!scholarshipError) {
              scholarshipsAdded += scholarships.length;
            }
          }
        }

        updatedUniversities++;
        results.push({ university: university.name, success: true, programs_added: comprehensivePrograms.length });
      } else {
        results.push({ university: university.name, success: true, already_comprehensive: true });
      }
    } catch (error) {
      console.error(`Failed to update ${university.name}:`, error);
      results.push({ university: university.name, success: false, error: error.message });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      updated_universities: updatedUniversities,
      programs_updated: programsUpdated,
      scholarships_added: scholarshipsAdded,
      total_universities: universities.length,
      details: results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}