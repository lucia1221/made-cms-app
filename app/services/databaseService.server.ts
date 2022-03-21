import { createClient, SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient;

export const databaseService = function () {
  if (instance) {
    return instance;
  }

  instance = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  return instance;
};
