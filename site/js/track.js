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
  var META_CONSENT_KEY = 'govari_meta_consent_v1';
  var consentChoice = null;
  try { consentChoice = localStorage.getItem(CONSENT_KEY); } catch (e) {}
  function hasConsent() { return consentChoice === 'granted'; }
  function measurementEnabled() { return consentChoice !== 'denied'; }
  function hasMetaConsent() {
    try { return measurementEnabled() && localStorage.getItem(META_CONSENT_KEY) === 'granted'; } catch (e) { return false; }
  }
  function googleConsent() {
    return { analytics_storage: hasConsent() ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  }
  function setConsent(value) {
    consentChoice = value === 'granted' || value === 'denied' ? value : null;
    try {
      if (consentChoice) localStorage.setItem(CONSENT_KEY, consentChoice);
      else localStorage.removeItem(CONSENT_KEY);
    } catch (e) {}
  }

  // Analytics never receives raw query strings, fragments, referrers or form values.
  function measurementPage() {
    return location.origin + (/^\/[a-z0-9_-]+\.html$/i.test(location.pathname) ? location.pathname : '/');
  }
  function measurementReferrer() {
    try { var ref = new URL(document.referrer); return /^https?:$/.test(ref.protocol) ? ref.origin + '/' : ''; } catch (e) { return ''; }
  }
  function safeParams(params) {
    var result = {};
    ['form', 'reason', 'field', 'button_name', 'location', 'phase_name'].forEach(function (key) {
      if (typeof params[key] === 'string' && /^[a-z_][a-z0-9_-]{0,79}$/i.test(params[key])) result[key] = params[key];
    });
    ['count', 'phase'].forEach(function (key) {
      if (typeof params[key] === 'number' && Number.isFinite(params[key])) result[key] = params[key];
    });
    return result;
  }

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
    if (pixelReady || !G.metaPixelId || !hasMetaConsent()) return;
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
    if (gaReady || !G.ga4Id || !measurementEnabled()) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      // Consent defaults must precede tag loading, config and events.
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      if (hasConsent()) window.gtag('consent', 'update', googleConsent());
      window.gtag('set', 'ads_data_redaction', true);
      window.gtag('set', 'url_passthrough', false);
      window['ga-disable-' + G.ga4Id] = false;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(G.ga4Id);
      document.head.appendChild(s);
      window.gtag('js', new Date());
      var config = {
        page_location: measurementPage(), page_referrer: measurementReferrer(), page_title: G.brand || 'Govari',
        allow_google_signals: false, allow_ad_personalization_signals: false
      };
      if (window.__govariDebug) config.debug_mode = true;
      window.gtag('config', G.ga4Id, config);
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

  /* ---------- אירוע משפך אחיד ---------- */
  window.govariTrack = function (name, params, opts) {
    if (!measurementEnabled() || !/^[a-z_][a-z0-9_]{0,39}$/i.test(name)) return;
    params = safeParams(params || {});
    opts = opts || {};
    var eventId = typeof opts.eventId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opts.eventId) ? opts.eventId : '';
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: 'govari_' + name }, params));
    } catch (e) {}
    try {
      if (hasMetaConsent() && window.fbq) {
        if (name === 'lead_submit_success') {
          window.fbq('track', 'Lead', { currency: 'ILS', value: 0 }, eventId ? { eventID: eventId } : undefined);
        } else if (name === 'hero_view' || name === 'lead_form_view') {
          window.fbq('track', 'ViewContent', { content_name: name });
        } else {
          window.fbq('trackCustom', 'govari_' + name, params);
        }
      }
    } catch (e) {}
    try {
      if (gaReady && window.gtag && name !== 'page_view') {
        var gaParams = { page_location: measurementPage(), page_referrer: measurementReferrer(), page_path: new URL(measurementPage()).pathname };
        Object.assign(gaParams, STEP_META[name], params);
        (GA_EVENT_MAP[name] || [name]).forEach(function (gaName) {
          var eventParams = gaParams;
          if (gaName === 'lead' || gaName === 'generate_lead') {
            eventParams = Object.assign({ currency: 'ILS', value: 0 }, gaParams);
            if (eventId) eventParams.transaction_id = eventId;
          }
          window.gtag('event', gaName, eventParams);
        });
      }
    } catch (e) {}
    if (window.__govariDebug) console.log('[track]', name, params);
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
  loadGA();
  loadPixel();

  function clearMeasurementCookies() {
    var domains = location.hostname.split('.');
    var scopes = [''];
    for (var i = 0; i < domains.length - 1; i++) scopes.push('; domain=' + domains.slice(i).join('.'));
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^(_ga($|_)|_gid$|_gat($|_)|_gcl_|_fbp$|_fbc$)/.test(name)) return;
      scopes.forEach(function (scope) { document.cookie = name + '=; Max-Age=0; path=/' + scope + '; SameSite=Lax'; });
    });
  }
  function renderPreferences() {
    var status = document.querySelector('[data-consent-status]');
    function refresh() {
      if (status) status.textContent = hasConsent() ? 'הבחירה הנוכחית: עוגיות מדידה מאושרות.' : measurementEnabled() ? 'הבחירה הנוכחית: מדידה בסיסית ללא עוגיות.' : 'הבחירה הנוכחית: המדידה כבויה.';
      document.querySelectorAll('[data-consent-value]').forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-consent-value') === (consentChoice || 'auto')));
      });
    }
    document.querySelectorAll('[data-consent-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        setConsent(button.getAttribute('data-consent-value'));
        window['ga-disable-' + G.ga4Id] = !measurementEnabled();
        if (gaReady) window.gtag('consent', 'update', googleConsent());
        else loadGA();
        if (!hasConsent()) { try { clearMeasurementCookies(); } catch (e) {} }
        if (!measurementEnabled() && window.fbq) window.fbq('consent', 'revoke');
        refresh();
      });
    });
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPreferences); else renderPreferences();
  window.govariTrack('page_view', { path: location.pathname });
})();
