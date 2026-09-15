import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dir = await mkdtemp(path.join(tmpdir(), 'govari-lead-test-'));
Object.assign(process.env, { LEAD_DATA_DIR: dir, DATABASE_URL: '', RESEND_API_KEY: '', META_PIXEL_ID: '', META_CAPI_TOKEN: '', SHEET_WEBHOOK_URL: '', NODE_ENV: 'test', VERCEL: '', OUTBOX_TICK_SECRET: '', CRON_SECRET: '' });
const { initLeads, cleanLeadInput, createLead, claimDueEvents, completeEvent, countLeads } = await import('../src/leads.js');
const { config } = await import('../src/config.js');
const { default: app } = await import('../app.js');
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
after(async () => { await new Promise(resolve => server.close(resolve)); await rm(dir, { recursive: true, force: true }); });

await initLeads();
test('concurrent retries preserve exactly one submission and outbox event', async () => {
  const { clean, ok } = cleanLeadInput({ full_name: 'בדיקת מערכת', phone: '0501234567', idempotency_key: 'same-attempt' });
  assert.equal(ok, true);
  const results = await Promise.all(Array.from({ length: 12 }, () => createLead(clean)));
  assert.equal(new Set(results.map(r => r.submissionId)).size, 1);
  assert.equal(results.filter(r => !r.deduped).length, 1);
  assert.equal((await countLeads()).total, 1);
  const events = JSON.parse(await readFile(path.join(dir, 'lead_events.json')));
  assert.equal(events.length, 1);
});
test('a notification abandoned by a stopped worker becomes claimable', async () => {
  const first = await claimDueEvents();
  assert.equal(first.length, 1);
  assert.equal((await claimDueEvents()).length, 0);
  const events = JSON.parse(await readFile(path.join(dir, 'lead_events.json')));
  events[0].next_attempt_at = new Date(Date.now() - 1000).toISOString();
  await writeFile(path.join(dir, 'lead_events.json'), JSON.stringify(events));
  const retry = await claimDueEvents();
  assert.equal(retry[0].id, first[0].id);
  await completeEvent(retry[0].id);
  assert.equal((await claimDueEvents()).length, 0);
});
test('invalid input and honeypot never return false success', async () => {
  assert.equal(cleanLeadInput({ full_name: {}, phone: '0501234567' }).ok, false);
  assert.equal(cleanLeadInput({ full_name: 'בדיקה', phone: '0501234567', email: 'invalid' }).ok, false);
  const response = await fetch(url + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company: 'autofill', full_name: 'בדיקה', phone: '0501234567' }) });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
});
test('forged cron header cannot bypass secret authentication', async () => {
  const response = await fetch(url + '/api/outbox/tick', { headers: { 'x-vercel-cron': '1' } });
  assert.equal(response.status, 403);
});
test('production refuses ephemeral JSON and health signals not ready', async () => {
  config.env = 'production';
  try {
    await assert.rejects(initLeads(), /DATABASE_URL/);
    const { clean } = cleanLeadInput({ full_name: 'בדיקה', phone: '0501234567' });
    await assert.rejects(createLead(clean), /DATABASE_URL/);
    assert.equal((await fetch(url + '/api/health')).status, 503);
  } finally { config.env = 'test'; }
});

test('Vercel cron token works alongside a distinct external scheduler token', async () => {
  const oldTick = config.outboxTickSecret;
  const oldCron = config.cronSecret;
  config.outboxTickSecret = 'external-scheduler-test';
  config.cronSecret = 'vercel-cron-test';
  try {
    const response = await fetch(url + '/api/outbox/tick', { headers: { authorization: 'Bearer vercel-cron-test' } });
    assert.equal(response.status, 200);
  } finally { config.outboxTickSecret = oldTick; config.cronSecret = oldCron; }
});

test('admin accepts colon in password and prevents private page caching', async () => {
  const { basicAuth } = await import('../src/admin.js');
  const old = { ...config.admin };
  Object.assign(config.admin, { user: 'owner', password: 'long:password:test' });
  try {
    const headers = {};
    let accepted = false;
    basicAuth({ headers: { authorization: 'Basic ' + Buffer.from('owner:long:password:test').toString('base64') } }, { set(k, v) { headers[k] = v; } }, () => { accepted = true; });
    assert.equal(accepted, true);
    assert.equal(headers['Cache-Control'], 'private, no-store');
  } finally { Object.assign(config.admin, old); }
});

test('queued notifications retain the submitted name after a repeat lead updates it', async () => {
  const { HANDLERS } = await import('../src/notify.js');
  const { processOutbox } = await import('../src/outbox.js');
  const original = HANDLERS.ADMIN_EMAIL;
  const names = [];
  HANDLERS.ADMIN_EMAIL = async lead => { names.push(lead.full_name); };
  try {
    for (const name of ['שם ראשון', 'שם שני']) {
      const { clean } = cleanLeadInput({ full_name: name, phone: '0521234567' });
      await createLead(clean);
    }
    const result = await processOutbox();
    assert.equal(result.failed, 0);
    assert.deepEqual(names, ['שם ראשון', 'שם שני']);
  } finally { HANDLERS.ADMIN_EMAIL = original; }
});

test('lead HTTP response registers notification work with the Vercel lifecycle', async () => {
  const key = Symbol.for('@vercel/request-context');
  const previous = globalThis[key];
  const jobs = [];
  const { HANDLERS } = await import('../src/notify.js');
  const original = HANDLERS.ADMIN_EMAIL;
  HANDLERS.ADMIN_EMAIL = async () => {};
  globalThis[key] = { get: () => ({ waitUntil: promise => jobs.push(promise) }) };
  try {
    const response = await fetch(url + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: 'בדיקת מחזור חיים', phone: '0541234567' }) });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(jobs.length, 1);
    await Promise.all(jobs);
  } finally { globalThis[key] = previous; HANDLERS.ADMIN_EMAIL = original; }
});
