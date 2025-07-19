
-- Remove fake universities and keep only real, verified institutions
-- First, let's identify and delete fake universities by their generic naming patterns

DELETE FROM public.universities 
WHERE name SIMILAR TO '%(College of [A-Z]{2} [0-9]+|State University of [A-Z]{2} [0-9]+|[A-Z]{2} [A-Za-z\s]+ University)%'
   OR name IN (
    'TN Arts & Sciences University',
    'AR Science University', 
    'CT Technology University',
    'College of ND 9',
    'College of AZ 65',
    'College of KS 38'
   )
   OR city = 'Metro City'
   OR city = 'University Town'
   OR city = 'College City';

-- Also remove any universities that don't have proper website URLs or have placeholder data
DELETE FROM public.universities 
WHERE website IS NULL 
   OR website LIKE '%example.%'
   OR website LIKE '%placeholder%'
   OR description IS NULL;

-- Keep only well-known, verified universities
-- The remaining universities should be real institutions like:
-- MIT, Stanford, Harvard, University of Florida, Purdue, etc.
