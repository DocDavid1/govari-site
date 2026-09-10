// ===== גוב ארי מערכות — interactions =====
(function () {
  'use strict';

  // נגישות: קישור "דלג לתוכן" + סימון אזור התוכן הראשי
  if (document.body && !document.querySelector('.skip-link')) {
    document.body.insertAdjacentHTML('afterbegin', '<a href="#content" class="skip-link">דלג לתוכן</a>');
  }
  var mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) mainEl.id = 'content';

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky header state
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  var burger = document.querySelector('.burger');
  if (burger && header) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'תפריט');
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('mobile-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('mobile-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Top offer bar — dismissible, remembered
  var topbar = document.getElementById('topbar');
  var tbClose = document.getElementById('tbClose');
  if (topbar && tbClose) {
    try { if (localStorage.getItem('gav-topbar') === 'hidden') topbar.classList.add('hide'); } catch (e) {}
    tbClose.addEventListener('click', function () {
      topbar.classList.add('hide');
      try { localStorage.setItem('gav-topbar', 'hidden'); } catch (e) {}
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Autoplay short loops only when in view (saves battery/data)
  var vids = document.querySelectorAll('video[data-inview]');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  // Sticky story: highlight step + swap frame based on scroll
  var steps = document.querySelectorAll('.story-step');
  var frames = document.querySelectorAll('.story-media .frame');
  if (steps.length && frames.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.getAttribute('data-step');
        steps.forEach(function (s) { s.classList.toggle('active', +s.getAttribute('data-step') === i); });
        frames.forEach(function (f) { f.classList.toggle('active', +f.getAttribute('data-step') === i); });
      });
    }, { threshold: 0.6 });
    steps.forEach(function (s) { so.observe(s); });
  }

  // Order form -> WhatsApp/summary (no backend; opens WhatsApp with prefilled text)
  var form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var msg = 'הזמנה מראש — גוב ארי (דגם 24/7)%0A' +
        'שם: ' + (d.get('name') || '') + '%0A' +
        'טלפון: ' + (d.get('phone') || '') + '%0A' +
        'עיר: ' + (d.get('city') || '') + '%0A' +
        'הערות: ' + (d.get('notes') || '');
      window.open('https://wa.me/972536813013?text=' + msg, '_blank');
    });
  }

  // מצב כהה בלבד — הוסר מתג יום/לילה (פלטת שחור·זהב אחת)

  // ===== רצועת CTA דביקה במובייל =====
  (function stickyCta() {
    var bar = document.getElementById('stickyCta');
    if (!bar) return;
    document.body.classList.add('has-sticky-cta');
    var leadEl = document.getElementById('lead');
    var hero = document.querySelector('.hero');

    function update() {
      // מסתירים כשהטופס הראשי נראה, או לפני שגללנו מעבר להירו
      var pastHero = hero ? (hero.getBoundingClientRect().bottom < 40) : (window.scrollY > 260);
      var leadVisible = false;
      if (leadEl) {
        var r = leadEl.getBoundingClientRect();
        leadVisible = r.top < window.innerHeight * 0.85 && r.bottom > 60;
      }
      bar.classList.toggle('is-hidden', !pastHero || leadVisible);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    bar.querySelectorAll('a[href="#lead"]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.govariTrack) window.govariTrack('sticky_cta_click');
      });
    });
  })();

  // ===== מעקב קליקים על טלפון / וואטסאפ =====
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href*="wa.me"]');
    if (!a || !window.govariTrack) return;
    window.govariTrack(a.href.indexOf('tel:') === 0 ? 'phone_click' : 'whatsapp_click');
  });

  // ===== חלון המרה — exit-intent + טיימר + גלילה, פעם אחת לביקור =====
  (function ctaModal() {
    var seen = false;
    try { seen = sessionStorage.getItem('gav-cta') === '1'; } catch (e) {}
    if (seen) return;

    var modal = document.createElement('div');
    modal.className = 'cta-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="cta-modal-overlay" data-close></div>' +
      '<div class="cta-modal-card">' +
        '<button class="cta-modal-close" data-close aria-label="סגירה">×</button>' +
        '<div class="cta-modal-banner"><img src="assets/images/hero-studio-charcoal-900.webp" alt="מצלמת רכב גוב ארי"></div>' +
        '<div class="cta-modal-body">' +
          '<span class="cta-modal-flag">אין תשלום באתר</span>' +
          '<h3>בקשת הזמנה — ללא תשלום</h3>' +
          '<p class="cta-modal-sub">4 ערוצים, כיסוי 360° וחיבור 4G. משאירים שם וטלפון — ונציג של גוב ארי יחזור אליכם להשלמת ההזמנה.</p>' +
          '<div class="cta-modal-actions">' +
            '<a class="btn btn-primary btn-block btn-lg" href="#lead" data-close>בקשת הזמנה ללא תשלום</a>' +
            '<a class="btn btn-ghost btn-block" href="https://wa.me/972536813013" target="_blank" rel="noopener">שאלה מהירה בוואטסאפ</a>' +
          '</div>' +
          '<p class="cta-modal-trust">אין תשלום באתר · שם וטלפון בלבד</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    function open() {
      if (seen) return;
      seen = true;
      try { sessionStorage.setItem('gav-cta', '1'); } catch (e) {}
      modal.classList.add('open');
    }
    function close() { modal.classList.remove('open'); }

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // exit-intent (דסקטופ): העכבר יוצא מהחלק העליון של החלון
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0) open();
    });
    // גיבוי בזמן (גם למובייל): אחרי 30 שניות
    setTimeout(open, 30000);
    // טריגר גלילה: אחרי 60% מהעמוד
    var scrolled = false;
    window.addEventListener('scroll', function () {
      if (scrolled) return;
      var p = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (p > 0.6) { scrolled = true; open(); }
    }, { passive: true });
  })();

  // (הודעת התרומה הצדדית הוסרה — טענת "10% מהרווח" לא אומתה. אין להחזיר ללא אישור דוד.)

  // ===== באנר עוגיות (הסכמה) =====
  var cookieChoice = null;
  try { cookieChoice = localStorage.getItem('gav-cookie'); } catch (e) {}
  if (!cookieChoice) {
    var cb = document.createElement('div');
    cb.className = 'cookie-bar';
    cb.setAttribute('role', 'dialog');
    cb.setAttribute('aria-label', 'הודעה על שימוש בעוגיות');
    cb.innerHTML =
      '<p>אנו משתמשים בעוגיות כדי לתפעל את האתר ולשפר את חוויית הגלישה. לפרטים — <a href="privacy.html">מדיניות הפרטיות</a>.</p>' +
      '<div class="cookie-actions">' +
        '<button class="btn btn-ghost btn-sm" data-cookie="essential">חיוניות בלבד</button>' +
        '<button class="btn btn-primary btn-sm" data-cookie="all">מקובל</button>' +
      '</div>';
    document.body.appendChild(cb);
    setTimeout(function () { cb.classList.add('show'); }, 500);
    cb.addEventListener('click', function (e) {
      var c = e.target.getAttribute('data-cookie');
      if (!c) return;
      try { localStorage.setItem('gav-cookie', c); } catch (e2) {}
      cb.classList.remove('show');
      setTimeout(function () { cb.remove(); }, 400);
    });
  }
})();
