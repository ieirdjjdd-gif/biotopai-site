// ============================================================
// إعدادات الاتصال بـ Supabase
// هتلاقي القيمتين دول في: Supabase Dashboard > Project Settings > API
// ============================================================
const SUPABASE_URL = "https://ufmhvryhrerwilaigtgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbWh2cnlocmVyd2lsYWlndGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTEyMDUsImV4cCI6MjA5OTM2NzIwNX0.u1SnUktfojX-2Fa2QEoel6_BPrjBAbxep6d32fHjcE8";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// دوال مساعدة تتكرر في كل الصفحات
// ============================================================

// يرجع المستخدم الحالي لو مسجل دخول، أو null
// ملاحظة: بنستخدم getSession() مش getUser() لأنها بتقرا الجلسة من الجهاز
// نفسه (localStorage) من غير ما تحتاج تكلم سيرفر Supabase، فهي أسرع وأضمن.
// getUser() كانت بتعمل طلب شبكة، ولو الطلب اتأخر أو فشل (نت بطيء/حجب)
// كانت بتقع بصمت ويفضل زرار "تسجيل الدخول" ظاهر حتى لو المستخدم داخل فعلاً.
async function getCurrentUser() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session ? session.user : null;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}

// يحمي صفحة معينة: لو مفيش مستخدم مسجل، يرجّعه لصفحة الدخول
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "dr-rady-auth-page.html";
    return null;
  }
  return user;
}

// تسجيل خروج
async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = "dr-rady-auth-page.html";
}
