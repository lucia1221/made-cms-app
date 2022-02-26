import { createClient, SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient;

export const databaseService = function () {
  if (instance) {
    return instance;
  }

  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

  instance = createClient(supabaseUrl, supabaseKey);

  return instance;
};
