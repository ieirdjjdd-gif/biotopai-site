// ============================================================
// BioTopia — تأثيرات مشتركة لكل صفحات الموقع
// (شاشة تحميل + تأثير موجة عند الضغط على الأزرار)
// ============================================================

(function(){
  // ===== شاشة التحميل: تختفي أول ما الصفحة تخلص تحميل، بحد أدنى وقت عشان الحركة تبان =====
  function hideLoader(){
    const loader = document.getElementById('page-loader');
    if(!loader) return;
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 500);
  }

  const minDelay = new Promise(resolve => setTimeout(resolve, 350));
  const pageLoad = new Promise(resolve => {
    if(document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  Promise.all([minDelay, pageLoad]).then(hideLoader);

  // حماية إضافية: لو في مشكلة نت أو تحميل بطيء، منسيبش الشاشة معلّقة أكتر من كده
  setTimeout(hideLoader, 4000);
})();

// ===== تأثير موجة (ripple) لما تضغط على أي زرار/شريحة في الموقع =====
document.addEventListener('click', function(e){
  const el = e.target.closest('.btn, .btn-outline, .btn-ghost, .chip, .tab-btn, .social-icon');
  if(!el) return;

  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement('span');
  span.className = 'ripple-fx';
  span.style.width = span.style.height = size + 'px';
  span.style.left = (e.clientX - rect.left - size / 2) + 'px';
  span.style.top = (e.clientY - rect.top - size / 2) + 'px';

  el.appendChild(span);
  span.addEventListener('animationend', () => span.remove());
});

// ===== إشعار عائم (Toast) — بيظهر فوق يمين الشاشة ويختفي لوحده =====
// type: 'ok' (افتراضي/نجاح) | 'warn' (تحذير) | 'err' (خطأ)
const TOAST_ICONS = {
  ok:  '<path d="m5 12.5 4.5 4.5L19 7"/>',
  warn:'<path d="M12 8.5v4.5M12 16.5h.01"/><path d="M10.3 4.2 2.9 17c-.6 1 .1 2.3 1.3 2.3h15.6c1.2 0 1.9-1.3 1.3-2.3L13.7 4.2c-.6-1-2-1-2.6 0Z"/>',
  err: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>'
};
function showToast(title, subtitle, type){
  type = TOAST_ICONS[type] ? type : 'ok';
  let host = document.getElementById('toast-host');
  if(!host){
    host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'site-toast ' + (type === 'ok' ? '' : type);
  el.innerHTML = `
    <div class="site-toast-ic"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICONS[type]}</svg></div>
    <div class="site-toast-txt"><b>${title}</b>${subtitle ? `<span>${subtitle}</span>` : ''}</div>
  `;
  host.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 3800);
}
