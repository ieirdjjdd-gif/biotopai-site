const SUPABASE_URL = "https://ufmhvryhrerwilaigtgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbWh2cnlocmVyd2lsYWlndGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTEyMDUsImV4cCI6MjA5OTM2NzIwNX0.u1SnUktfojX-2Fa2QEoel6_BPrjBAbxep6d32fHjcE8";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "dr-rady-auth-page.html";
    return null;
  }
  return user;
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = "dr-rady-auth-page.html";
}
