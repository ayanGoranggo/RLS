import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xsllesqxcnognegmvtfx.supabase.co";
const supabaseKey = "erofh";
export const supabase = createClient(supabaseUrl, supabaseKey);
