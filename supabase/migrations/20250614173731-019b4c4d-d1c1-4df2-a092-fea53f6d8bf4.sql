-- Create enhanced tables for comprehensive university data

-- Add more fields to universities table
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS student_population INTEGER,
ADD COLUMN IF NOT EXISTS acceptance_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS graduation_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS faculty_student_ratio TEXT,
ADD COLUMN IF NOT EXISTS campus_size TEXT,
ADD COLUMN IF NOT EXISTS setting TEXT, -- urban, suburban, rural
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'public', -- public, private
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7),
ADD COLUMN IF NOT EXISTS accreditation TEXT[],
ADD COLUMN IF NOT EXISTS notable_alumni TEXT[],
ADD COLUMN IF NOT EXISTS research_areas TEXT[],
ADD COLUMN IF NOT EXISTS international_programs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS housing_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS application_fee INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS common_app_accepted BOOLEAN DEFAULT false;

-- Add more fields to programs table
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS duration_months INTEGER,
ADD COLUMN IF NOT EXISTS credit_hours INTEGER,
ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'on-campus', -- on-campus, online, hybrid
ADD COLUMN IF NOT EXISTS specializations TEXT[],
ADD COLUMN IF NOT EXISTS internship_opportunities BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS thesis_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS capstone_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS language_requirements TEXT[],
ADD COLUMN IF NOT EXISTS work_experience_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS min_work_experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS portfolio_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS interview_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS letters_of_recommendation_required INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS statement_of_purpose_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cv_resume_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS average_class_size INTEGER,
ADD COLUMN IF NOT EXISTS faculty_count INTEGER,
ADD COLUMN IF NOT EXISTS research_opportunities BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS industry_partnerships TEXT[],
ADD COLUMN IF NOT EXISTS career_outcomes JSONB,
ADD COLUMN IF NOT EXISTS average_starting_salary INTEGER,
ADD COLUMN IF NOT EXISTS employment_rate NUMERIC(5,2);

-- Add more fields to scholarships table
ALTER TABLE public.scholarships
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS application_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS gpa_requirement NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS citizenship_requirements TEXT[],
ADD COLUMN IF NOT EXISTS field_of_study_restrictions TEXT[],
ADD COLUMN IF NOT EXISTS number_available INTEGER,
ADD COLUMN IF NOT EXISTS selection_criteria TEXT[],
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS requires_interview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_essay BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_portfolio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS funding_source TEXT, -- university, government, private
ADD COLUMN IF NOT EXISTS coverage_details TEXT; -- what the scholarship covers

-- Create application tracking table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'planning', -- planning, in_progress, submitted, under_review, accepted, rejected, waitlisted
  application_deadline DATE,
  application_submitted_date DATE,
  decision_date DATE,
  decision_type TEXT, -- accepted, rejected, waitlisted
  documents_submitted JSONB DEFAULT '[]'::jsonb,
  requirements_completed JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  priority INTEGER DEFAULT 3, -- 1-5 scale
  application_fee_paid BOOLEAN DEFAULT false,
  transcript_sent BOOLEAN DEFAULT false,
  test_scores_sent BOOLEAN DEFAULT false,
  letters_of_rec_sent BOOLEAN DEFAULT false,
  personal_statement_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table for enhanced personalization
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferred_locations TEXT[],
  max_tuition_budget INTEGER,
  preferred_university_types TEXT[], -- public, private
  preferred_university_settings TEXT[], -- urban, suburban, rural
  preferred_program_formats TEXT[], -- on-campus, online, hybrid
  min_acceptance_rate NUMERIC(5,2),
  max_acceptance_rate NUMERIC(5,2),
  preferred_class_sizes TEXT[], -- small, medium, large
  research_opportunities_important BOOLEAN DEFAULT false,
  internship_opportunities_important BOOLEAN DEFAULT false,
  housing_required BOOLEAN DEFAULT false,
  international_programs_important BOOLEAN DEFAULT false,
  scholarship_priority INTEGER DEFAULT 3, -- 1-5 scale
  application_timeline JSONB, -- preferred timeline for applications
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create university rankings table for multiple ranking systems
CREATE TABLE IF NOT EXISTS public.university_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  ranking_system TEXT NOT NULL, -- us_news, qs_world, times_higher_ed, etc.
  overall_rank INTEGER,
  category_ranks JSONB, -- specific category rankings
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(university_id, ranking_system, year)
);

-- Create program reviews and ratings table
CREATE TABLE IF NOT EXISTS public.program_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id UUID,
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  graduation_year INTEGER,
  verified BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data sources tracking table
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- website, api, manual, scrape
  source_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_quality_score INTEGER CHECK (data_quality_score >= 1 AND data_quality_score <= 100),
  update_frequency TEXT, -- daily, weekly, monthly, yearly
  automated BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- RLS policies for applications table
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for user preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Public read policies for reference data
CREATE POLICY "University rankings are viewable by everyone" 
ON public.university_rankings 
FOR SELECT 
USING (true);

CREATE POLICY "Program reviews are viewable by everyone" 
ON public.program_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Data sources are viewable by everyone" 
ON public.data_sources 
FOR SELECT 
USING (true);

-- Authenticated users can add reviews
CREATE POLICY "Authenticated users can add reviews" 
ON public.program_reviews 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_reviews_updated_at
BEFORE UPDATE ON public.program_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_university_id ON public.applications(university_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_university_rankings_university_id ON public.university_rankings(university_id);
CREATE INDEX IF NOT EXISTS idx_university_rankings_system_year ON public.university_rankings(ranking_system, year);
CREATE INDEX IF NOT EXISTS idx_program_reviews_program_id ON public.program_reviews(program_id);
CREATE INDEX IF NOT EXISTS idx_data_sources_university_id ON public.data_sources(university_id);
CREATE INDEX IF NOT EXISTS idx_universities_type ON public.universities(type);
CREATE INDEX IF NOT EXISTS idx_universities_state ON public.universities(state);
CREATE INDEX IF NOT EXISTS idx_programs_degree ON public.programs(degree);
CREATE INDEX IF NOT EXISTS idx_programs_format ON public.programs(format);