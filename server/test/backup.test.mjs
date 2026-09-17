import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { sendSheetBackup } from '../src/notify.js';

test('backup requires a matching durable receipt; HTTP 200 alone is insufficient', async () => {
  const previous = globalThis.fetch;
  const url = config.sheetWebhookUrl, secret = config.sheetWebhookSecret;
  config.sheetWebhookUrl = 'https://example.invalid/backup';
  config.sheetWebhookSecret = 'test-secret';
  const submission = { id: '11111111-1111-4111-8111-111111111111' };
  const lead = { id: 'test', full_name: 'Test', phone_normalized: '+972501234567' };
  try {
    for (const body of [{}, {ok:true,submission_id:'wrong'}]) {
      globalThis.fetch = async () => new Response(JSON.stringify(body));
      await assert.rejects(sendSheetBackup(lead, submission), /durable storage/);
    }
    globalThis.fetch = async (_, options) => {
      const payload = JSON.parse(options.body);
      assert.equal(payload.secret, 'test-secret');
      assert.equal(payload.submission_id, submission.id);
      return new Response(JSON.stringify({ok:true,submission_id:submission.id}));
    };
    assert.deepEqual(await sendSheetBackup(lead, submission), {ok:true});
  } finally {
    globalThis.fetch = previous;
    config.sheetWebhookUrl = url;
    config.sheetWebhookSecret = secret;
  }
});
