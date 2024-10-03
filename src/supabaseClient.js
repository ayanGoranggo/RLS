import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xsllesqxcnognegmvtfx.supabase.co";
const supabaseKey =
  "dont steal";
export const supabase = createClient(supabaseUrl, supabaseKey);
