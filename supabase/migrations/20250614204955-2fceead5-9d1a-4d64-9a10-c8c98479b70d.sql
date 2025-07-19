-- Add missing RLS policies for tables that don't have them yet

-- Programs table policies (public read access)
CREATE POLICY "Programs are viewable by everyone" 
ON public.programs 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage programs" 
ON public.programs 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Scholarships table policies (public read access)
CREATE POLICY "Scholarships are viewable by everyone" 
ON public.scholarships 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage scholarships" 
ON public.scholarships 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Universities table policies (public read access)
CREATE POLICY "Universities are viewable by everyone" 
ON public.universities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage universities" 
ON public.universities 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- University rankings table policies (admin management)
CREATE POLICY "Admins can manage university rankings" 
ON public.university_rankings 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Data sources table policies (admin management)
CREATE POLICY "Admins can manage data sources" 
ON public.data_sources 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Program reviews table policies (user management of own reviews)
CREATE POLICY "Users can update their own reviews" 
ON public.program_reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.program_reviews 
FOR DELETE 
USING (auth.uid() = user_id);