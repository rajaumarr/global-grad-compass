-- Create universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  website TEXT,
  tuition_in_state INTEGER,
  tuition_out_of_state INTEGER,
  tuition_international INTEGER NOT NULL,
  has_in_state_tuition_waiver BOOLEAN NOT NULL DEFAULT false,
  ranking INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  degree TEXT NOT NULL CHECK (degree IN ('MS', 'PhD', 'MBA', 'MFA')),
  description TEXT,
  requirements_gpa DECIMAL(3,2),
  requirements_gre_verbal INTEGER,
  requirements_gre_quantitative INTEGER,
  requirements_gre_writing DECIMAL(3,1),
  requirements_gmat INTEGER,
  requirements_toefl INTEGER,
  requirements_ielts DECIMAL(3,1),
  prerequisites TEXT[],
  application_deadline TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount_type TEXT NOT NULL CHECK (amount_type IN ('fixed', 'full_tuition')),
  amount_value INTEGER,
  eligibility TEXT[],
  deadline TEXT,
  renewable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_programs_university_id ON public.programs(university_id);
CREATE INDEX idx_scholarships_university_id ON public.scholarships(university_id);
CREATE INDEX idx_universities_ranking ON public.universities(ranking) WHERE ranking IS NOT NULL;
CREATE INDEX idx_universities_state ON public.universities(state);

-- Insert sample data
INSERT INTO public.universities (id, name, city, state, website, tuition_in_state, tuition_out_of_state, tuition_international, has_in_state_tuition_waiver, ranking) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stanford University', 'Stanford', 'CA', 'https://www.stanford.edu', 58416, 58416, 58416, false, 3),
('550e8400-e29b-41d4-a716-446655440002', 'Massachusetts Institute of Technology', 'Cambridge', 'MA', 'https://www.mit.edu', 57986, 57986, 57986, false, 1),
('550e8400-e29b-41d4-a716-446655440003', 'University of Georgia', 'Athens', 'GA', 'https://www.uga.edu', 12080, 29844, 29844, true, 48),
('550e8400-e29b-41d4-a716-446655440004', 'University of Texas at Austin', 'Austin', 'TX', 'https://www.utexas.edu', 11698, 39322, 39322, true, 38),
('550e8400-e29b-41d4-a716-446655440005', 'Arizona State University', 'Tempe', 'AZ', 'https://www.asu.edu', 12691, 29428, 29428, true, 103),
('550e8400-e29b-41d4-a716-446655440006', 'Purdue University', 'West Lafayette', 'IN', 'https://www.purdue.edu', 10002, 28794, 28794, true, 51);

-- Insert sample programs
INSERT INTO public.programs (university_id, name, department, degree, requirements_gpa, requirements_gre_verbal, requirements_gre_quantitative, requirements_gre_writing, requirements_toefl, requirements_ielts, prerequisites, application_deadline) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'Computer Science', 'MS', 3.5, 160, 165, 4.0, 100, 7.0, ARRAY['Bachelor''s in CS or related field', 'Programming experience'], 'December 15, 2024'),
('550e8400-e29b-41d4-a716-446655440002', 'Electrical Engineering and Computer Science', 'EECS', 'MS', 3.7, 155, 170, 4.5, 100, 7.0, ARRAY['Bachelor''s in Engineering or CS'], 'December 15, 2024'),
('550e8400-e29b-41d4-a716-446655440003', 'Business Administration', 'Terry College of Business', 'MBA', 3.0, NULL, NULL, NULL, 80, 6.5, ARRAY['Work experience preferred'], 'March 1, 2025'),
('550e8400-e29b-41d4-a716-446655440004', 'Mechanical Engineering', 'Cockrell School of Engineering', 'MS', 3.0, 150, 160, 3.5, 79, 6.5, ARRAY['Bachelor''s in Engineering'], 'December 1, 2024'),
('550e8400-e29b-41d4-a716-446655440005', 'Data Science', 'School of Computing and Augmented Intelligence', 'MS', 3.0, 146, 155, 3.0, 80, 6.5, ARRAY['Programming background', 'Statistics knowledge'], 'January 15, 2025'),
('550e8400-e29b-41d4-a716-446655440006', 'Aeronautical and Astronautical Engineering', 'School of Aeronautics and Astronautics', 'MS', 3.25, 153, 155, 3.5, 88, 6.5, ARRAY['Bachelor''s in Aerospace Engineering or related'], 'December 15, 2024');

-- Insert sample scholarships
INSERT INTO public.scholarships (university_id, name, amount_type, amount_value, eligibility, deadline, renewable) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stanford Graduate Fellowship', 'full_tuition', NULL, ARRAY['PhD students', 'Exceptional academic record'], 'December 1, 2024', true),
('550e8400-e29b-41d4-a716-446655440002', 'MIT Presidential Fellowship', 'fixed', 43000, ARRAY['Outstanding academic achievement', 'Research potential'], 'January 1, 2025', true),
('550e8400-e29b-41d4-a716-446655440003', 'Graduate Merit Scholarship', 'fixed', 15000, ARRAY['High GPA', 'International students eligible'], 'February 1, 2025', true),
('550e8400-e29b-41d4-a716-446655440004', 'Longhorn Graduate Scholarship', 'fixed', 20000, ARRAY['Merit-based', 'Research assistantship'], 'January 15, 2025', true),
('550e8400-e29b-41d4-a716-446655440005', 'Graduate College Fellowship', 'fixed', 25000, ARRAY['High academic achievement', 'Research focus'], 'January 1, 2025', true),
('550e8400-e29b-41d4-a716-446655440006', 'Teaching Assistantship', 'fixed', 22000, ARRAY['Graduate students', 'Teaching capability'], 'February 1, 2025', true);