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
// وكمان بيتأكد إن نفس الحساب مش مفتوح من جهاز أو مكان تاني في نفس الوقت
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "dr-rady-auth-page.html";
    return null;
  }

  const sessionOk = await checkSingleSession(user);
  if (!sessionOk) return null;

  // فحص دوري كل 25 ثانية طول ما الصفحة مفتوحة عند المستخدم:
  // لو حد فتح نفس الحساب من جهاز تاني وهو لسه قاعد في الصفحة،
  // هيتم تسجيل خروجه من هنا فورًا من غير ما يحتاج يعمل تحديث للصفحة.
  if (!window.__bt_session_watcher) {
    window.__bt_session_watcher = setInterval(async () => {
      const stillOk = await checkSingleSession(user);
      if (!stillOk) clearInterval(window.__bt_session_watcher);
    }, 25000);
  }

  return user;
}

// ============================================================
// منع فتح نفس الحساب من أكتر من جهاز/مكان في نفس الوقت
// ============================================================
// آلية العمل:
// 1) كل تسجيل دخول (أو إنشاء حساب) بيولّد "توكن جلسة" فريد
//    ويحفظه في مكانين: عمود active_session_id في جدول profiles،
//    وفي localStorage على الجهاز نفسه (شوف dr-rady-auth-page.html).
// 2) الدالة دي بتقارن التوكن المحفوظ محليًا بالتوكن المخزّن في قاعدة البيانات.
// 3) لو مختلفين، معناه إن حد سجّل دخول من جهاز تاني بعد كده،
//    فبيتم تسجيل خروج المستخدم من هنا فورًا وتحويله لصفحة الدخول
//    مع رسالة توضح السبب.
async function checkSingleSession(user) {
  const localToken = localStorage.getItem('bt_session_token');
  if (!localToken) return true; // مفيش توكن محفوظ (حساب قديم قبل تفعيل الميزة) - منمنعوش

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('active_session_id')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('checkSingleSession error:', error);
    return true; // لو حصل خطأ شبكة، منمنعش المستخدم من استخدام الموقع بسبب الفحص نفسه
  }

  if (data && data.active_session_id && data.active_session_id !== localToken) {
    localStorage.removeItem('bt_session_token');
    await supabaseClient.auth.signOut();
    window.location.href = "dr-rady-auth-page.html?reason=session_replaced";
    return false;
  }

  return true;
}

// تسجيل خروج
async function signOut() {
  localStorage.removeItem('bt_session_token');
  await supabaseClient.auth.signOut();
  window.location.href = "dr-rady-auth-page.html";
}
