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
