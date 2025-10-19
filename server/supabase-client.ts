import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for reliable deployment
const supabaseUrl = 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1NTA5MSwiZXhwIjoyMDc1NDMxMDkxfQ.AmYPTMNFzWbRqg2CpT1F84vwYdASvG3boqk7P1_r0q0';

export const supabase = createClient(supabaseUrl, supabaseKey);