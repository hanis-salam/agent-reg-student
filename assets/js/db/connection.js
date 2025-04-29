const SUPABASE_URL = "https://bmroymhdqqbzlubpfjvs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcm95bWhkcXFiemx1YnBmanZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTc4MjMsImV4cCI6MjA2MTAzMzgyM30.k-Vcbza0LeYr9mtQXwD2gHkIys-kmU0uky6VJ0LMX3g";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase initialized:", window.supabase);
