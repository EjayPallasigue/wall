"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are not available (for build time)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client for build time
    return createClient('https://dummy.supabase.co', 'dummy-key', {
      auth: { persistSession: false },
    });
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We're not using auth for this public wall
    },
  });
};

export const supabase = createSupabaseClient();
