-- Create saved_universities table for bookmarking universities
CREATE TABLE public.saved_universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, university_id)
);

-- Enable RLS
ALTER TABLE public.saved_universities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved universities" 
ON public.saved_universities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save universities" 
ON public.saved_universities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved universities" 
ON public.saved_universities 
FOR DELETE 
USING (auth.uid() = user_id);