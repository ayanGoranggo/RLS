import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xsllesqxcnognegmvtfx.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_TOKEN;
export const supabase = createClient(supabaseUrl, supabaseKey);
