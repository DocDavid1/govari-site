/* Resilient lead forms: retain a short-lived session draft and retry the same payload. */
(function () {
  'use strict';
  var G = window.GOVARI || {};
  var TTL = 24 * 60 * 60 * 1000;
  function track() { try { if (window.govariTrack) window.govariTrack.apply(window, arguments); } catch (_) {} }
  function uuid() { return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'lead-' + Date.now() + '-' + Math.random().toString(16).slice(2); }
  function waHref(text) {
    try { if (typeof G.waHref === 'function') { var href = G.waHref(text); if (/^https:\/\/wa.me\//.test(href)) return href; } } catch (_) {}
    return 'https://wa.me/972536813013?text=' + encodeURIComponent(text);
  }
  function init(form, index) {
    if (form.__leadInit) return;
    form.__leadInit = true;
    var nameEl = form.querySelector('[name="full_name"], [name="name"]');
    var phoneEl = form.querySelector('[name="phone"]');
    var cityEl = form.querySelector('[name="city"]');
    var button = form.querySelector('[type="submit"], button:not([type])');
    var fields = [nameEl, phoneEl, cityEl].filter(Boolean);
    var status = form.querySelector('[data-lead-status]');
    if (!status) { status = document.createElement('div'); status.setAttribute('data-lead-status', ''); form.appendChild(status); }
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    if (nameEl) nameEl.setAttribute('autocomplete', 'name');
    if (cityEl) cityEl.setAttribute('autocomplete', 'address-level2');
    if (phoneEl) { phoneEl.type = 'tel'; phoneEl.setAttribute('inputmode', 'tel'); phoneEl.setAttribute('autocomplete', 'tel'); phoneEl.setAttribute('dir', 'ltr'); }
    var key = 'govari:lead-draft:v1:' + location.pathname + ':' + (form.id || form.dataset.leadForm || 'lead') + ':' + index;
    var pending = null;
    var submitting = false;
    var waitingOnline = false;
    var complete = false;
    var started = false;
    var blockedUntil = 0;
    var originalLabel = button ? button.textContent : '';
    function values() { return { full_name: nameEl ? nameEl.value.trim() : '', phone: phoneEl ? phoneEl.value.trim() : '', city: cityEl ? cityEl.value.trim() : '' }; }
    function persist() { try { sessionStorage.setItem(key, JSON.stringify({ expires: Date.now() + TTL, values: values(), pending: pending, blockedUntil: blockedUntil })); } catch (_) {} }
    try {
      var saved = JSON.parse(sessionStorage.getItem(key));
      if (saved && saved.expires > Date.now() && saved.values) {
        [[nameEl, 'full_name'], [phoneEl, 'phone'], [cityEl, 'city']].forEach(function (pair) { if (pair[0] && !pair[0].value && typeof saved.values[pair[1]] === 'string') pair[0].value = saved.values[pair[1]]; });
        if (saved.pending && typeof saved.pending.idempotency_key === 'string') pending = saved.pending;
        blockedUntil = Number(saved.blockedUntil) || 0;
      } else sessionStorage.removeItem(key);
    } catch (_) {}
    function message(text, error) { status.textContent = text; status.style.display = 'block'; status.dataset.tone = error ? 'error' : 'info'; }
    function lock(on) {
      submitting = on;
      form.setAttribute('aria-busy', String(on));
      fields.forEach(function (el) { el.readOnly = on; });
      if (button) { button.disabled = on; button.textContent = on ? 'שולח…' : originalLabel; }
    }
    function link(parent, text, href, external) {
      var el = document.createElement('a'); el.className = 'btn btn-ghost btn-sm'; el.textContent = text; el.href = href;
      if (external) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
      parent.appendChild(el);
    }
    function fallback() {
      persist();
      message('לא הצלחנו לאשר שהפרטים נשמרו. אפשר לנסות שוב או לפנות אלינו ישירות. הפרטים נשארו בטופס.', true);
      var links = document.createElement('div'); links.className = 'lead-fallback-links';
      var v = values();
      link(links, 'שליחה בוואטסאפ', waHref('היי, ניסיתי להשאיר פרטים באתר. שם: ' + v.full_name + ' · טלפון: ' + v.phone), true);
      link(links, 'התקשרו אלינו', typeof G.telHref === 'string' && /^tel:\+?[\d-]+$/.test(G.telHref) ? G.telHref : 'tel:+972536813013');
      status.appendChild(links);
      track('lead_submit_error', { form: form.dataset.leadForm || 'lead', mode: 'fallback' });
    }
    function success(data) {
      complete = true; pending = null; waitingOnline = false;
      try { sessionStorage.removeItem(key); } catch (_) {}
      track('lead_submit_success', { form: form.dataset.leadForm || 'lead' }, { eventId: data.submissionId });
      var box = document.createElement('div'); box.className = 'lead-success'; box.setAttribute('role', 'status'); box.setAttribute('tabindex', '-1');
      var heading = document.createElement('h3'); heading.textContent = 'הבקשה התקבלה'; box.appendChild(heading);
      var text = document.createElement('p'); text.textContent = 'נחזור אליכם להשלמת הפרטים. אין תשלום באתר ולא בוצע חיוב.'; box.appendChild(text);
      link(box, 'שמירת המספר שלנו בוואטסאפ', waHref('היי, השארתי פרטים באתר גוב ארי ואשמח שתחזרו אליי.'), true);
      form.replaceWith(box); box.focus();
    }
    function valid(v) {
      var digits = v.phone.replace(/[^\d]/g, '');
      var el = v.full_name.length < 2 ? nameEl : digits.length < 7 || digits.length > 15 ? phoneEl : null;
      if (el) { message(el === nameEl ? 'נא למלא שם מלא' : 'נא למלא מספר טלפון תקין', true); el.focus(); return false; }
      return !!nameEl && !!phoneEl;
    }
    function sameValues(a, b) { return a.full_name === b.full_name && a.phone === b.phone && (a.city || '') === (b.city || ''); }
    function receipt(data) { return data && data.ok === true && !data.spam && typeof data.leadId === 'string' && typeof data.submissionId === 'string' && /^[0-9a-f-]{36}$/i.test(data.leadId) && /^[0-9a-f-]{36}$/i.test(data.submissionId); }
    function retryDelay(response, attempt) {
      var header = response && response.headers.get('Retry-After');
      var delay = header ? (/^\d+$/.test(header) ? Number(header) * 1000 : Date.parse(header) - Date.now()) : attempt * 1500;
      return Math.max(1500, isFinite(delay) ? delay : 1500);
    }
    async function send(payload, attempt) {
      var controller = window.AbortController ? new AbortController() : null;
      var timeout = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
      var response;
      try {
        response = await fetch(form.getAttribute('action') || G.leadEndpoint || '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch' }, body: JSON.stringify(payload), signal: controller ? controller.signal : undefined, keepalive: true });
        var data = await response.json().catch(function () { return {}; });
        if (response.ok && receipt(data)) { clearTimeout(timeout); lock(false); success(data); return; }
        if (response.status === 400 || response.status === 422) {
          clearTimeout(timeout); lock(false);
          message(Array.isArray(data.errors) ? data.errors.map(String).join(' · ') : 'בדקו את הפרטים ונסו שוב.', true); persist(); return;
        }
        if (response.status === 429) {
          clearTimeout(timeout); blockedUntil = Date.now() + Math.max(60000, retryDelay(response, attempt)); persist(); lock(false);
          message('יותר מדי ניסיונות. הפרטים נשמרו בטופס; נסו שוב בעוד כמה דקות.', true); return;
        }
        if (response.status < 500) { clearTimeout(timeout); lock(false); fallback(); return; }
      } catch (_) { /* A timeout does not mean rejection: retry exactly the same submission. */ }
      finally { if (timeout) clearTimeout(timeout); }
      if (navigator.onLine === false) { waitingOnline = true; message('אין חיבור כרגע. הפרטים נשארו כאן וננסה לשלוח כשהחיבור יחזור.'); persist(); return; }
      var delay = retryDelay(response, attempt);
      if (attempt < 3 && delay <= 30000) {
        message('בעיית חיבור זמנית. מנסים שוב…');
        setTimeout(function () { if (!complete) send(payload, attempt + 1); }, delay); return;
      }
      if (delay > 30000) blockedUntil = Date.now() + delay;
      lock(false); fallback();
    }
    form.addEventListener('input', function () {
      if (!started) { started = true; track('lead_form_started', { form: form.dataset.leadForm || 'lead' }); }
      status.style.display = 'none'; persist();
    });
    window.addEventListener('online', function () {
      if (waitingOnline && pending && !complete) { waitingOnline = false; lock(true); message('החיבור חזר. שולחים…'); send(pending, 1); }
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submitting || complete) return;
      if (Date.now() < blockedUntil) { message('נא להמתין מעט לפני ניסיון נוסף. הפרטים נשארו בטופס.', true); return; }
      var v = values();
      if (!valid(v)) return;
      var honey = form.querySelector('[name="company"], [name="website"], [name="fax"]');
      if (honey && honey.value) { message('לא הצלחנו לאמת את הטופס. אפשר לפנות אלינו ישירות.', true); fallback(); return; }
      if (!pending || !sameValues(pending, v)) {
        var attribution = {}; try { if (window.govariAttribution) attribution = window.govariAttribution(); } catch (_) {}
        pending = Object.assign({}, v, { idempotency_key: uuid(), attribution: attribution });
      }
      persist(); lock(true); track('lead_submit_attempt', { form: form.dataset.leadForm || 'lead' }); send(pending, 1);
    });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) { if (entries.some(function (entry) { return entry.isIntersecting; })) { track('lead_form_view', { form: form.dataset.leadForm || 'lead' }); observer.disconnect(); } }, { threshold: 0.4 }); observer.observe(form);
    }
  }
  function boot() { document.querySelectorAll('form[data-lead-form]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
