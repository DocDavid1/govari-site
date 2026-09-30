import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../site/js/track.js', import.meta.url), 'utf8');
const consentKey = 'govari_analytics_consent_v1';
function setup({ choice, storageBlocked = false, metaConsent, metaId = '123' } = {}) {
  const values = new Map(choice ? [[consentKey, choice]] : []);
  if (metaConsent) values.set('govari_meta_consent_v1', metaConsent);
  const storage = {
    getItem(key) { if (storageBlocked) throw Error('blocked'); return values.get(key) ?? null; },
    setItem(key, value) { if (storageBlocked) throw Error('blocked'); values.set(key, value); },
    removeItem(key) { if (storageBlocked) throw Error('blocked'); values.delete(key); }
  };
  const buttons = ['auto', 'granted', 'denied'].map(value => ({
    value, attributes: {}, listeners: {},
    getAttribute(name) { return name === 'data-consent-value' ? value : this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    click() { this.listeners.click(); }
  }));
  const scripts = [];
  const cookieWrites = [];
  const status = {};
  const location = new URL('https://www.govarisystems.co.il/index.html?email=private%40example.com&phone=0551234567#private');
  let cookie = '_ga=old; _ga_ABC=old; _fbp=old';
  const document = {
    referrer: 'https://example.com/search?email=private@example.com',
    readyState: 'complete',
    head: { appendChild(script) { scripts.push({ src: script.src, consentAtAppend: Array.from(window.dataLayer[0]) }); } },
    createElement(tag) { assert.equal(tag, 'script', 'No banner or other DOM injection'); return {}; },
    getElementsByTagName() { return [{ parentNode: { insertBefore(script) { scripts.push({ src: script.src }); } } }]; },
    querySelector(selector) { return selector === '[data-consent-status]' ? status : null; },
    querySelectorAll(selector) { return selector === '[data-consent-value]' ? buttons : []; },
    addEventListener() {},
    get cookie() { return cookie; },
    set cookie(value) { cookieWrites.push(value); }
  };
  const window = { GOVARI: { ga4Id: 'G-TEST', metaPixelId: metaId, brand: 'Govari' } };
  const context = { window, document, localStorage: storage, sessionStorage: storage, location, URL, URLSearchParams, console };
  vm.runInNewContext(source, context);
  const commands = () => (window.dataLayer || []).filter(item => item[0]).map(item => Array.from(item));
  const click = choice => buttons.find(button => button.value === choice).click();
  return { window, document, values, scripts, status, commands, click, cookieWrites };
}

test('new visit silently sends cookieless Google measurement with denied defaults before script/config', () => {
  const env = setup();
  assert.equal(env.scripts.length, 1);
  assert.match(env.scripts[0].src, /googletagmanager/);
  assert.deepEqual(env.scripts[0].consentAtAppend.slice(0, 2), ['consent', 'default']);
  const commands = env.commands();
  for (const value of Object.values(commands[0][2])) assert.equal(value, 'denied');
  assert.equal(commands.filter(command => command[0] === 'config').length, 1);
  assert.equal(commands.some(command => command[1] === 'page_view'), false);
  const config = commands.find(command => command[0] === 'config')[2];
  assert.equal(config.page_location, 'https://www.govarisystems.co.il/index.html');
  assert.equal(config.page_referrer, 'https://example.com/');
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(env.values.has(consentKey), false);
  assert.equal(env.window.fbq, undefined);
});

test('previous explicit denial blocks Google and Meta, including later custom events', () => {
  const env = setup({ choice: 'denied', metaConsent: 'granted' });
  env.window.govariTrack('lead_submit_success', {});
  assert.equal(env.scripts.length, 0);
  assert.equal(env.window.gtag, undefined);
  assert.equal(env.window.fbq, undefined);
  assert.equal(env.window.dataLayer, undefined);
});

test('stored analytics grant enables analytics storage only, never Meta', () => {
  const env = setup({ choice: 'granted' });
  const update = env.commands().find(command => command[1] === 'update')[2];
  assert.equal(update.analytics_storage, 'granted');
  for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(update[key], 'denied');
  assert.equal(env.scripts.length, 1);
  assert.equal(env.window.fbq, undefined);
});

test('funnel events run without cookie consent and discard contact fields and raw URLs', () => {
  const env = setup();
  env.window.govariTrack('lead_submit_success', {
    form: 'lead', full_name: 'Private Person', phone: '0551234567', email: 'private@example.com',
    href: 'https://example.com/?phone=0551234567', reason: 'private@example.com'
  }, { eventId: 'f1308a97-ea7a-4444-bbf2-6fd9478333a1' });
  const event = env.commands().find(command => command[1] === 'generate_lead');
  assert.equal(event[2].form, 'lead');
  assert.equal(event[2].funnel_step, 4);
  assert.equal(event[2].transaction_id, 'f1308a97-ea7a-4444-bbf2-6fd9478333a1');
  const sent = JSON.stringify(env.window.dataLayer);
  for (const privateValue of ['Private Person', '0551234567', 'private@example.com']) assert.equal(sent.includes(privateValue), false);
});

test('privacy controls update consent in place and opt-out blocks later measurement', () => {
  const env = setup();
  env.click('granted');
  assert.equal(env.values.get(consentKey), 'granted');
  assert.equal(env.commands().at(-1)[2].analytics_storage, 'granted');
  env.click('denied');
  assert.equal(env.values.get(consentKey), 'denied');
  assert.equal(env.window['ga-disable-G-TEST'], true);
  assert.equal(env.commands().at(-1)[2].analytics_storage, 'denied');
  assert.ok(env.cookieWrites.some(value => value.startsWith('_ga=; Max-Age=0')));
  const count = env.window.dataLayer.length;
  env.window.govariTrack('cta_click', { button_name: 'call' });
  assert.equal(env.window.dataLayer.length, count);
  env.click('auto');
  assert.equal(env.values.has(consentKey), false);
  assert.equal(env.window['ga-disable-G-TEST'], false);
  assert.equal(env.commands().at(-1)[2].analytics_storage, 'denied');
  assert.equal(env.scripts.length, 1);
});

test('a previously opted-out visitor can enable cookie-free measurement on the same page', () => {
  const env = setup({ choice: 'denied' });
  env.click('auto');
  assert.equal(env.scripts.length, 1);
  assert.equal(env.commands()[0][1], 'default');
  assert.equal(env.commands()[0][2].analytics_storage, 'denied');
});

test('blocked browser storage cannot break tracking or the current-page opt-out', () => {
  const env = setup({ storageBlocked: true });
  assert.equal(env.scripts.length, 1);
  env.click('denied');
  const count = env.window.dataLayer.length;
  env.window.govariTrack('lead_submit_success', {});
  assert.equal(env.window.dataLayer.length, count);
  assert.match(env.status.textContent, /כבויה/);
});

test('Meta stays gated behind separate explicit advertising consent', () => {
  const env = setup({ metaConsent: 'granted' });
  assert.equal(env.scripts.length, 2);
  assert.match(env.scripts[1].src, /connect.facebook.net/);
  env.click('denied');
  assert.deepEqual(Array.from(env.window.fbq.queue.at(-1)), ['consent', 'revoke']);
});
