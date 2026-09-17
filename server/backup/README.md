# Independent lead backup

Primary leads and immutable submissions are committed to PostgreSQL before email dispatch. Email and SHEET_BACKUP are separate outbox events: a failure in one does not delete a lead or mark the other delivered.

Google Sheets activation (not yet activated):
1. Create a private Sheet in the owner's account. Use google-sheets.gs in Apps Script.
2. Set Script Properties SHEET_ID and a randomly generated SHEET_WEBHOOK_SECRET.
3. Deploy as web app executing as the owner, reachable by the server. Keep the Sheet private. The endpoint authenticates its JSON body with the secret.
4. Configure SHEET_WEBHOOK_URL and the matching SHEET_WEBHOOK_SECRET as server-only Vercel production environment variables, then redeploy.
5. Submit a labeled test, verify its submission_id in the Sheet and a done SHEET_BACKUP event. Replay the same submission: it must create no duplicate row.

HTTP 200 without an exact JSON receipt is a failure and is retried. Existing leads need a separately verified backfill after activation. Failed events remain stored for operator recovery. The current Vercel cron runs daily; timely retry scheduling needs an external scheduler or a suitable Vercel plan. This is not an absolute guarantee against simultaneous failures of every storage provider.
