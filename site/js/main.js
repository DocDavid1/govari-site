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
  document.querySelectorAll('#year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ===== מתג יום/לילה =====
  (function themeToggle() {
    var root = document.documentElement;
    var KEY = 'gav-theme';
    function isEffectivelyLight(mode) {
      if (mode === 'light') return true;
      if (mode === 'dark') return false;
      try { return matchMedia('(prefers-color-scheme: light)').matches; } catch (e) { return false; }
    }
    function apply(mode) {
      if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
      else root.removeAttribute('data-theme'); // עוקב אחרי prefers-color-scheme
      var light = isEffectivelyLight(mode);
      document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.setAttribute('aria-pressed', light ? 'true' : 'false');
        btn.setAttribute('aria-label', light ? 'מעבר למצב לילה' : 'מעבר למצב יום');
      });
    }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    // בלי בחירה שמורה — לא קובעים תכונה כלל, וה-CSS מכריע (ברירת מחדל כהה, או prefers-color-scheme:light)
    apply(saved);

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = isEffectivelyLight(root.getAttribute('data-theme')) ? 'dark' : 'light';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        if (window.govariTrack) window.govariTrack('theme_toggle', { mode: next });
      });
    });
  })();

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

  // Autoplay short loops only when in view (saves battery/data) + optional pause button
  var vids = document.querySelectorAll('video[data-inview]');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        var saveData = navigator.connection && navigator.connection.saveData;
        if (e.isIntersecting && !reduced && !saveData && v.dataset.userPaused !== 'true') v.play().catch(function () {});
        else v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vo.observe(v); });
  }
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var v = document.getElementById(btn.getAttribute('data-video-toggle'));
    if (!v) return;
    btn.addEventListener('click', function () {
      if (v.paused) { v.dataset.userPaused = 'false'; v.play().catch(function () {}); btn.textContent = btn.dataset.pauseLabel || 'השהיית הסרטון'; }
      else { v.dataset.userPaused = 'true'; v.pause(); btn.textContent = btn.dataset.playLabel || 'הפעלת הסרטון'; }
    });
    if (!btn.dataset.pauseLabel) btn.dataset.pauseLabel = btn.textContent;
    if (!btn.dataset.playLabel) btn.dataset.playLabel = 'הפעלת הסרטון';
  });

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

  // ===== רצועת CTA דביקה במובייל =====
  (function stickyCta() {
    var bar = document.getElementById('stickyCta');
    if (!bar) return;
    document.body.classList.add('has-sticky-cta');
    var leadEl = document.getElementById('lead');
    var hero = document.querySelector('.hero');

    function update() {
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
    bar.querySelectorAll('a[href$="#lead"]').forEach(function (a) {
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

  // ============================================================
  //  מודל גנרי — קליפה משותפת לחלון ההמרה, "מה מקבלים" ומידע התרומה.
  //  כל קורא ל-openModal() מקבל את אותה חוויה (רקע מטושטש, ESC, פוקוס).
  // ============================================================
  function buildModalShell() {
    var modal = document.createElement('div');
    modal.className = 'cta-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="cta-modal-overlay" data-close></div>' +
      '<div class="cta-modal-card">' +
        '<button class="cta-modal-close" data-close aria-label="סגירה">×</button>' +
        '<div class="cta-modal-body"></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) close(); });
    function onKey(e) { if (e.key === 'Escape') close(); }
    function open() { modal.classList.add('open'); document.addEventListener('keydown', onKey); }
    function close() { modal.classList.remove('open'); document.removeEventListener('keydown', onKey); }
    return { modal: modal, open: open, close: close, body: modal.querySelector('.cta-modal-body'), card: modal.querySelector('.cta-modal-card') };
  }

  // ============================================================
  //  חלון בקשת ההזמנה — לא מיד עם טעינת הדף. נפתח כשמתחילים לגלול,
  //  ולכל היותר פעמיים סה"כ לביקור (לא בפעם השלישית, גם אם ממשיכים לגלול).
  // ============================================================
  (function ctaModal() {
    var leadEl = document.getElementById('lead');
    if (!leadEl) return;
    var MAX_SHOWS = 2;
    var COUNT_KEY = 'gav-cta-count';
    function shown() { try { return parseInt(sessionStorage.getItem(COUNT_KEY) || '0', 10); } catch (e) { return 0; } }
    function markShown() { try { sessionStorage.setItem(COUNT_KEY, String(shown() + 1)); } catch (e) {} }

    var m = buildModalShell();
    m.card.classList.add('is-plain');
    m.body.innerHTML =
      '<span class="cta-modal-flag">אין תשלום באתר</span>' +
      '<h3>בקשת הזמנה — ללא תשלום</h3>' +
      '<p class="cta-modal-sub">4 ערוצים, כיסוי 360° וחיבור 4G. משאירים שם וטלפון — ונציג של גוב ארי יחזור אליכם להשלמת ההזמנה.</p>' +
      '<div class="cta-modal-actions">' +
        '<a class="btn btn-primary btn-block btn-lg" href="#lead" data-close>בקשת הזמנה ללא תשלום</a>' +
        '<a class="btn btn-ghost btn-block" href="https://wa.me/972536813013" target="_blank" rel="noopener">שאלה מהירה בוואטסאפ</a>' +
      '</div>' +
      '<p class="cta-modal-trust">אין תשלום באתר · שם וטלפון בלבד</p>';

    var isOpen = false;
    var origOpen = m.open, origClose = m.close;
    m.open = function () { isOpen = true; origOpen(); };
    m.close = function () { isOpen = false; origClose(); };
    m.modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { isOpen = false; });
    });

    function trigger() {
      if (isOpen || shown() >= MAX_SHOWS) return;
      markShown();
      m.open();
    }

    // פעם ראשונה — כבר בתחילת הגלילה (יוצאים מהאזור הראשון של הדף)
    var firstShown = false;
    window.addEventListener('scroll', function () {
      if (!firstShown && window.scrollY > window.innerHeight * 0.25) {
        firstShown = true;
        trigger();
      }
    }, { passive: true });

    // פעם שנייה (אם עוד לא נסגר/הושלם) — גלילה עמוקה יותר, exit-intent, או טיימר
    window.addEventListener('scroll', function () {
      var p = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (p > 0.65) trigger();
    }, { passive: true });
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) trigger(); });
    setTimeout(trigger, 40000);
  })();

  // ===== כפתורי "מה מקבלים" / מידע נוסף → פותחים מודל עם תוכן + CTA =====
  document.querySelectorAll('[data-info-modal]').forEach(function (btn) {
    var m = buildModalShell();
    m.card.classList.add('is-plain');
    m.body.innerHTML = document.getElementById(btn.getAttribute('data-info-modal'))?.innerHTML || '';
    btn.addEventListener('click', function (e) { e.preventDefault(); m.open(); });
  });

  // ===== הודעת תרומה צדדית — "קונים מצלמה, תומכים במי ששומר עלינו" =====
  function startDonate() {
    var dismissed = false;
    try { dismissed = localStorage.getItem('gav-donate') === '1'; } catch (e) {}
    if (dismissed || !document.querySelector('.donation-band')) return;
    var t = document.createElement('div');
    t.className = 'donate-toast';
    t.setAttribute('role', 'status');
    t.innerHTML =
      '<svg class="heart" viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-8.5C.5 9 2 5.5 5.2 5.5c1.9 0 3 1 3.8 2 .8-1 1.9-2 3.8-2C16 5.5 17.5 9 15.5 12.5 13 16.65 12 21 12 21z"/></svg>' +
      '<span><b>10% מהרווח</b> על כל רכישה נתרמים לפצועי מלחמת חרבות ברזל. <a href="#donation">לפרטים</a></span>' +
      '<button class="dt-close" aria-label="סגירה">×</button>';
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 3500);
    t.querySelector('.dt-close').addEventListener('click', function () {
      t.classList.remove('show');
      try { localStorage.setItem('gav-donate', '1'); } catch (e) {}
      setTimeout(function () { t.remove(); }, 500);
    });
  }

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
      startDonate();
    });
  } else {
    startDonate();
  }
})();
