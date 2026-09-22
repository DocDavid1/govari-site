/* ============================================================
   גוב ארי — מדידה: Meta Pixel + לכידת ייחוס + אירועי משפך.
   עיקרון: כשל בסקריפט מדידה לעולם לא מפיל טופס. אירוע Lead רק אחרי
   אישור מהשרת. dataLayer נתמך אם קיים GTM.
   ============================================================ */
(function () {
  'use strict';
  var G = window.GOVARI || {};
  var LS_KEY = 'govari_attribution';
  var DEBUG_KEY = 'govari_debug';
  var CONSENT_KEY = 'govari_analytics_consent_v1';
  function hasConsent() { try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch (e) { return false; } }
  function setConsent(value) { try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {} }

  /* ---------- מצב דיבאג מדידה: ?ga_debug=1 (נשמר לכל הביקור) ----------
     מדפיס כל אירוע לקונסול ומפעיל GA4 DebugView, כדי לוודא בפועל שאירועים נשלחים. */
  try {
    if (new URLSearchParams(location.search).get('ga_debug') === '1') sessionStorage.setItem(DEBUG_KEY, '1');
    if (sessionStorage.getItem(DEBUG_KEY) === '1') window.__govariDebug = true;
  } catch (e) {}

  /* ---------- לכידת ייחוס (UTM / fbclid / gclid / referrer) ---------- */
  function captureAttribution() {
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem(LS_KEY) || '{}'); } catch (e) {}
    var q = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var fresh = {};
    keys.forEach(function (k) { if (q.get(k)) fresh[k] = q.get(k).slice(0, 200); });
    if (q.get('fbclid')) fresh.fbclid = q.get('fbclid').slice(0, 400);
    if (q.get('gclid')) fresh.gclid = q.get('gclid').slice(0, 400);

    // הגשה ראשונה בביקור קובעת; לא דורסים ייחוס קיים אלא אם הגיע חדש
    var merged = Object.keys(fresh).length ? fresh : stored;
    if (!merged.landing_page) merged.landing_page = stored.landing_page || location.pathname;
    if (!merged.referrer) merged.referrer = stored.referrer || document.referrer || '';
    merged.page_url = location.href;

    try { sessionStorage.setItem(LS_KEY, JSON.stringify(merged)); } catch (e) {}
    return merged;
  }

  function readCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : '';
  }

  window.govariAttribution = function () {
    var a = captureAttribution();
    var out = {};
    Object.keys(a).forEach(function (k) { out[k] = a[k]; });
    var fbp = readCookie('_fbp'); if (fbp) out.fbp = fbp;
    var fbc = readCookie('_fbc');
    if (!fbc && a.fbclid) fbc = 'fb.1.' + Date.now() + '.' + a.fbclid;
    if (fbc) out.fbc = fbc;
    return out;
  };

  /* ---------- Meta Pixel — נטען רק אם יש מזהה ---------- */
  var pixelReady = false;
  function loadPixel() {
    if (pixelReady || !G.metaPixelId || !hasConsent()) return;
    try {
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', G.metaPixelId);
      window.fbq('track', 'PageView');
      pixelReady = true;
    } catch (e) { /* מדידה לא קריטית */ }
  }

  /* ---------- Google Analytics 4 (Google tag) — נטען רק אם יש מזהה מדידה ---------- */
  var gaReady = false;
  function loadGA() {
    if (gaReady || !G.ga4Id || window.gtag || !hasConsent()) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + G.ga4Id;
      document.head.appendChild(s);
      window.gtag('js', new Date());
      if (window.__govariDebug) window.gtag('config', G.ga4Id, { debug_mode: true });
      else window.gtag('config', G.ga4Id);
      gaReady = true;
    } catch (e) { /* מדידה לא קריטית */ }
  }

  /* ---------- מיפוי אירועים פנימיים לאירועי משפך של GA4 ----------
     שם פנימי -> שם/שמות אירוע ב-GA4. אירוע ללא מיפוי נשלח תחת שמו המקורי,
     חוץ מ-page_view שכבר נשלח אוטומטית ע"י gtag('config', ...) ולא כפול. */
  var GA_EVENT_MAP = {
    lead_modal_view: ['start_process'],
    lead_form_view: ['start_process'],
    lead_form_started: ['form_start'],
    lead_submit_attempt: ['form_submit_attempt'],
    lead_validation_error: ['form_validation_error'],
    lead_submit_error: ['lead_failure'],
    lead_submit_success: ['generate_lead']
  };
  var STEP_META = {
    lead_modal_view: { step_name: 'view_offer_modal', funnel_step: 1 },
    lead_form_view: { step_name: 'view_offer_form', funnel_step: 1 },
    lead_form_started: { step_name: 'form_start', funnel_step: 2 },
    lead_submit_attempt: { step_name: 'form_submit', funnel_step: 3 },
    /* כשל ולידציה בצד לקוח: המשתמש ניסה לשלוח אך נעצר לפני השרת — עדיין בשלב 2 */
    lead_validation_error: { step_name: 'form_validation_error', funnel_step: 2 },
    lead_submit_success: { step_name: 'lead_complete', funnel_step: 4 },
    cta_click: { step_name: 'cta_click', funnel_step: 0 }
  };
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  /* ---------- אירוע משפך אחיד ---------- */
  window.govariTrack = function (name, params, opts) {
    params = params || {};
    opts = opts || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: 'govari_' + name }, params));
    } catch (e) {}
    try {
      if (hasConsent() && window.fbq) {
        if (name === 'lead_submit_success') {
          window.fbq('track', 'Lead', { currency: 'ILS', value: 0 }, opts.eventId ? { eventID: opts.eventId } : undefined);
        } else if (name === 'hero_view' || name === 'lead_form_view') {
          window.fbq('track', 'ViewContent', { content_name: name });
        } else {
          window.fbq('trackCustom', 'govari_' + name, params);
        }
      }
    } catch (e) {}
    try {
      if (hasConsent() && window.gtag && name !== 'page_view') {
        var attribution = captureAttribution();
        var gaParams = { page_path: location.pathname };
        UTM_KEYS.forEach(function (k) { if (attribution[k]) gaParams[k] = attribution[k]; });
        Object.assign(gaParams, STEP_META[name], params);
        (GA_EVENT_MAP[name] || [name]).forEach(function (gaName) {
          var eventParams = gaParams;
          if (gaName === 'lead' || gaName === 'generate_lead') {
            eventParams = Object.assign({ currency: 'ILS', value: 0 }, gaParams);
            if (opts.eventId) eventParams.transaction_id = opts.eventId;
          }
          window.gtag('event', gaName, eventParams);
        });
      }
    } catch (e) {}
    if (window.__govariDebug) console.log('[track]', name, params, opts);
  };

  /* ---------- cta_click — לחיצה על CTA אמיתי (טלפון / וואטסאפ / קישור להצעה),
     מזוהה לפי href ולא לפי class, כדי לעבוד בכל תבניות העמודים בלי לגעת ב-HTML ---------- */
  function ctaLocation(el) {
    var host = el.closest('header, footer, .lead-orbit, .impact-note, .mobile-contact, section[id], section[class], nav[aria-label]');
    if (!host) return 'body';
    return host.id || (host.className && String(host.className).split(' ')[0]) || host.tagName.toLowerCase();
  }
  document.addEventListener('click', function (e) {
    try {
      var el = e.target.closest('a[href]');
      if (!el) return;
      var href = el.getAttribute('href') || '';
      var name;
      if (/^tel:/.test(href)) name = 'call';
      else if (/^https:\/\/wa\.me\//.test(href)) name = 'whatsapp';
      else if (/#lead$/.test(href)) name = 'lead_link';
      else return;
      window.govariTrack('cta_click', { button_name: name, location: ctaLocation(el), href: href });
    } catch (err) {}
  }, true);

  captureAttribution();
  if (hasConsent()) { loadPixel(); loadGA(); }
  function renderConsent() {
    document.querySelectorAll('[data-consent-reset]').forEach(function (button) { button.addEventListener('click', function () { try { localStorage.removeItem(CONSENT_KEY); } catch (e) {} location.reload(); }); });
    var choice = null;
    try { choice = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (choice === 'granted' || choice === 'denied' || !document.body) return;
    var panel = document.createElement('div');
    panel.className = 'govari-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'בחירה לגבי מדידת השימוש באתר');
    var copy = document.createElement('p');
    copy.textContent = 'נרצה למדוד שימוש באתר כדי לשפר אותו. אפשר לסרב; הטופס ויצירת הקשר ימשיכו לפעול.';
    var privacy = document.createElement('a'); privacy.href = 'privacy.html'; privacy.textContent = 'מדיניות פרטיות'; copy.append(' ', privacy);
    var actions = document.createElement('div');
    var reject = document.createElement('button'); reject.type = 'button'; reject.textContent = 'ללא מדידה';
    var accept = document.createElement('button'); accept.type = 'button'; accept.textContent = 'אפשר מדידה';
    actions.append(reject, accept); panel.append(copy, actions); document.body.appendChild(panel);
    document.body.classList.add('consent-pending');
    function finish(value) { setConsent(value); panel.remove(); document.body.classList.remove('consent-pending'); if (value === 'granted') { loadPixel(); loadGA(); } }
    reject.addEventListener('click', function () { finish('denied'); });
    accept.addEventListener('click', function () { finish('granted'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderConsent); else renderConsent();
  window.govariTrack('page_view', { path: location.pathname });
})();
