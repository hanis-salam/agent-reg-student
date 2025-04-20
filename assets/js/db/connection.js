const SUPABASE_URL = "https://tptqwocpihegmwvfkgct.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdHF3b2NwaWhlZ213dmZrZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODk1NjIsImV4cCI6MjA2MDM2NTU2Mn0.9Sw71EgC2F0TxR0YSAkp4vGmwzW40mrop6I2BKtoZAI";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase initialized:", window.supabase);
