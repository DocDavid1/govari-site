// נקודת כניסה ל-Vercel (Serverless Function) — עוטפת את אפליקציית Express.
// מאתחל מסד + סכימת לידים פעם אחת לכל cold start, ואז מעביר את הבקשה ל-app.
import app from '../server/app.js';
import { initDb } from '../server/src/orders.js';
import { initLeads } from '../server/src/leads.js';
import { warnInsecureConfig } from '../server/src/config.js';

let ready = null;

export default async function handler(req, res) {
  if (!ready) {
    warnInsecureConfig();
    ready = Promise.all([initDb(), initLeads()]).catch((error) => {
      ready = null; // transient cold-start failures must be retried
      throw error;
    });
  }
  try { await ready; } catch {
    return res.status(503).json({ ok: false, errors: ['לא הצלחנו לשמור את הפרטים כרגע.'], fallback: true });
  }
  return app(req, res);
}
