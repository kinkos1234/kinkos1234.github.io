// Shared i18n helper for Comad guide pages.
// Each page provides its own window.I18N_DICT = { en: {...}, ko: {...} } inline.
// Buttons use onclick="toggleLang()". State persists in localStorage('comad-lang').

(function () {
  let currentLang = localStorage.getItem('comad-lang')
    || (navigator.language && navigator.language.startsWith('ko') ? 'ko' : 'en');

  function applyLang(lang) {
    // Read fresh each call: i18n.js is loaded BEFORE the inline
    // window.I18N_DICT script runs, so we can't capture it at module init.
    const dict = window.I18N_DICT || { en: {}, ko: {} };
    const d = dict[lang];
    if (!d) return;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (d[k] !== undefined) el.textContent = d[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.getAttribute('data-i18n-html');
      if (d[k] !== undefined) el.innerHTML = d[k];
    });
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
      const k = el.getAttribute('data-i18n-meta');
      if (d[k] !== undefined) el.setAttribute('content', d[k]);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      // format: "attr:key" e.g. alt:img.alt or title:tip.text
      const spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      const idx = spec.indexOf(':');
      if (idx < 0) return;
      const attr = spec.slice(0, idx);
      const key = spec.slice(idx + 1);
      if (d[key] !== undefined) el.setAttribute(attr, d[key]);
    });

    if (d['meta.title']) document.title = d['meta.title'];

    const en = document.getElementById('langEn');
    const ko = document.getElementById('langKo');
    if (en && ko) {
      en.classList.toggle('active', lang === 'en');
      ko.classList.toggle('active', lang === 'ko');
    }
  }

  window.toggleLang = function () {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    localStorage.setItem('comad-lang', currentLang);
    applyLang(currentLang);
  };

  // Auto-apply on load.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyLang(currentLang));
  } else {
    applyLang(currentLang);
  }
})();
