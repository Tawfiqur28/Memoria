import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !key) {
  const missing = [];
  if (!url) missing.push("EXPO_PUBLIC_SUPABASE_URL");
  if (!key) missing.push("EXPO_PUBLIC_SUPABASE_ANON_KEY");
  throw new Error(`Missing Supabase environment variables: ${missing.join(", ")}`);
}

export const supabase = createClient(url, key);