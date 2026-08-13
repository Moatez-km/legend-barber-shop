/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("YOUR_SUPABASE_PROJECT_URL")) {
  console.warn(
    "Supabase Credentials missing: Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
