import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xsllesqxcnognegmvtfx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGxlc3F4Y25vZ25lZ212dGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3ODgzNTEsImV4cCI6MjA0MzM2NDM1MX0.RN6coy76bwRFJTYTrcgtRtKdd3ZoDuy0ZpjLVzWyIRQ";
export const supabase = createClient(supabaseUrl, supabaseKey);
