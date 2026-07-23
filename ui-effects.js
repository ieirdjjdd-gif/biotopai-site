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
