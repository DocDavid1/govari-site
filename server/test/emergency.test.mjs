import test from 'node:test';
import assert from 'node:assert/strict';

// This isolated test worker cannot contact Resend or a real database.
Object.assign(process.env, { NODE_ENV: 'production', DATABASE_URL: '', RESEND_API_KEY: 're_test_not_a_real_key', VERCEL: '', META_PIXEL_ID: '', META_CAPI_TOKEN: '', SHEET_WEBHOOK_URL: '' });
const realFetch = globalThis.fetch;
const mailRequests = [];
globalThis.fetch = async (url, options) => {
  if (String(url).startsWith('https://api.resend.com/')) {
    mailRequests.push({ body: options.body, key: new Headers(options.headers).get('idempotency-key') });
    return new Response(JSON.stringify({ id: 'provider-accepted-test-message' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (!String(url).startsWith('http://127.0.0.1:')) throw new Error('Unexpected external request blocked in test');
  return realFetch(url, options);
};
const { default: app } = await import('../app.js');

test('accepted emergency email never acknowledges durable lead success', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const endpoint = `http://127.0.0.1:${server.address().port}/api/leads`;
    const payload = { full_name: 'בדיקת חירום', phone: '0501234567', idempotency_key: 'emergency-test-same-attempt' };
    for (let i = 0; i < 2; i++) {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      assert.equal(response.status, 503);
      assert.equal(data.ok, false);
      assert.equal(data.fallback, true);
      assert.equal(data.leadId, undefined);
      assert.equal(data.submissionId, undefined);
    }
    assert.equal(mailRequests.length, 2);
    assert.equal(mailRequests[0].key, 'emergency-lead/emergency-test-same-attempt');
    assert.deepEqual(mailRequests[0], mailRequests[1]);
  } finally {
    await new Promise(resolve => server.close(resolve));
    globalThis.fetch = realFetch;
  }
});
