import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Basic client creation. It will fail gracefully if keys are missing but warns developer.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Supabase functionality will not work properly until env variables are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
