// Run with: node --test content/qa/lead-draft-recovery.test.cjs
// Execute the actual client script with in-memory DOM/storage and mocked fetch only.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../../site/js/lead-form.js'), 'utf8');
const NOW = 1800000000000;
const originalId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const newId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const values = { full_name: 'Synthetic QA', phone: '0500000000', city: 'Test city', vehicle: 'Test vehicle' };
const payload = { ...values, idempotency_key: originalId };
const key = (pathname, form = 'home') => 'govari:lead-draft:v1:' + pathname + ':' + form + ':0';
function storage() {
  const data = new Map();
  return { data, getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k) };
}
function put(store, name, record) { store.setItem(name, JSON.stringify(record)); }
function element() { return { value: '', textContent: '', style: {}, dataset: {}, setAttribute() {}, appendChild() {}, focus() {} }; }
function boot(pathname, sessionStorage, localStorage, formName = 'home') {
  const listeners = {};
  const inputs = Object.fromEntries(Object.keys(values).map(name => [name, element()]));
  const status = element(), button = element(), calls = [];
  let confirmed = false, replaced = false;
  const form = {
    id: '', dataset: { leadForm: formName },
    querySelector(selector) {
      if (selector.includes('data-lead-status')) return status;
      if (selector.includes('submit')) return button;
      return inputs[selector.match(/name="([^"]+)"/)?.[1]];
    },
    setAttribute() {}, appendChild() {}, replaceWith() { replaced = true; },
    getAttribute() { return '/api/leads'; },
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  const context = {
    window: { GOVARI: {}, crypto: { randomUUID: () => newId }, addEventListener() {} },
    location: { pathname }, sessionStorage, localStorage, navigator: { onLine: true },
    document: { readyState: 'complete', querySelectorAll: () => [form], createElement: element },
    Date: class extends Date { static now() { return NOW; } },
    setTimeout() { throw new Error('Unexpected retry: all fetch responses are mocked'); }, clearTimeout() {},
    async fetch(url, options) {
      assert.equal(url, '/api/leads');
      calls.push(JSON.parse(options.body));
      return { ok: true, status: 200, headers: { get: () => null }, json: async () => confirmed ? { ok: true, leadId: originalId, submissionId: newId } : { ok: true } };
    }
  };
  vm.runInNewContext(source, context);
  return {
    inputs, status, calls, get replaced() { return replaced; },
    input() { listeners.input(); },
    async submit(success = false) { confirmed = success; listeners.submit({ preventDefault() {} }); await new Promise(resolve => setImmediate(resolve)); }
  };
}

test('new homepage drafts survive navigation in both URL directions', () => {
  for (const [from, to] of [['/', '/index.html'], ['/index.html', '/']]) {
    const ss = storage(), ls = storage(), first = boot(from, ss, ls);
    for (const name of Object.keys(values)) first.inputs[name].value = values[name];
    first.input();
    const second = boot(to, ss, ls);
    for (const name of Object.keys(values)) assert.equal(second.inputs[name].value, values[name]);
    assert.equal(second.calls.length, 0);
  }
});

test('legacy pending migrates without changing expiry or idempotency, then success cleans both aliases', async () => {
  const ss = storage(), ls = storage();
  const stored = { expires: NOW + 12345, payload };
  put(ls, key('/index.html') + ':pending', stored);
  const page = boot('/', ss, ls);
  assert.equal(page.inputs.phone.value, values.phone);
  assert.match(page.status.textContent, /בקשה קודמת/);
  assert.equal(page.calls.length, 0);
  assert.deepEqual(JSON.parse(ls.getItem(key('/') + ':pending')), stored);
  assert.equal(ls.getItem(key('/index.html') + ':pending'), null);
  // A legacy tab can write an alias again while this tab is open.
  put(ls, key('/index.html') + ':pending', stored);
  put(ss, key('/index.html'), { expires: NOW + 12345, values, pending: payload });
  await page.submit(true);
  assert.equal(page.calls[0].idempotency_key, originalId);
  assert.equal(page.replaced, true);
  assert.equal(ls.data.size, 0);
  assert.equal(ss.data.size, 0);
});

test('newer valid session draft wins across aliases, preserving its original expiry and cooldown', () => {
  const ss = storage(), ls = storage();
  put(ss, key('/'), { expires: NOW + 100, values: { ...values, city: 'Older' } });
  const newer = { expires: NOW + 200, values: { ...values, city: 'Newer' }, blockedUntil: NOW + 50 };
  put(ss, key('/index.html'), newer);
  const page = boot('/index.html', ss, ls);
  assert.equal(page.inputs.city.value, 'Newer');
  assert.deepEqual(JSON.parse(ss.getItem(key('/'))), newer);
  assert.equal(ss.getItem(key('/index.html')), null);
});

test('expired records on either homepage alias are removed and never restored', () => {
  const ss = storage(), ls = storage();
  for (const pathname of ['/', '/index.html']) {
    put(ss, key(pathname), { expires: NOW - 1, values, pending: payload });
    put(ls, key(pathname) + ':pending', { expires: NOW - 1, payload });
  }
  const page = boot('/index.html', ss, ls);
  assert.equal(page.inputs.phone.value, '');
  assert.equal(page.calls.length, 0);
  assert.equal(ss.data.size, 0);
  assert.equal(ls.data.size, 0);
});

test('migration does not read or remove another page or form draft', () => {
  const ss = storage(), ls = storage();
  for (const name of [key('/features.html'), key('/index.html', 'other'), key('/nested/index.html')]) {
    put(ss, name, { expires: NOW + 100, values });
    put(ls, name + ':pending', { expires: NOW + 100, payload });
  }
  const page = boot('/', ss, ls);
  assert.equal(page.inputs.phone.value, '');
  assert.equal(ss.data.size, 3);
  assert.equal(ls.data.size, 3);
});

test('intentional optional-field clears survive reload and only explicit submission creates a new identity', async () => {
  const ss = storage(), ls = storage();
  put(ls, key('/') + ':pending', { expires: NOW + 100, payload });
  const first = boot('/', ss, ls);
  first.inputs.city.value = '';
  first.inputs.vehicle.value = '';
  first.input();
  const reloaded = boot('/index.html', ss, ls);
  assert.equal(reloaded.inputs.city.value, '');
  assert.equal(reloaded.inputs.vehicle.value, '');
  assert.equal(reloaded.inputs.phone.value, values.phone);
  assert.equal(reloaded.calls.length, 0);
  assert.equal(JSON.parse(ls.getItem(key('/') + ':pending')).payload.idempotency_key, originalId);
  await reloaded.submit();
  assert.equal(reloaded.calls.length, 1);
  assert.equal(reloaded.calls[0].idempotency_key, newId);
  assert.equal(reloaded.calls[0].city, '');
  assert.equal(reloaded.calls[0].vehicle, '');
});
