## עדכון — הבאג המרכזי תוקן (11.9.2026, סבב שני)

בדקתי מחדש את `server/app.js` (שונה לאחרונה מכל שאר קבצי הלידים — `stat` מראה 11:58 מול 11:36-11:41 לשאר). הממצא המרכזי למטה **תוקן**:

```js
// server/app.js — ענף "רשוד" (mode B), עכשיו:
const emergencyLeadId = randomUUID();
const emergencySubmissionId = randomUUID();
return res.status(200).json({ ok: true, degraded: true, leadId: emergencyLeadId, submissionId: emergencySubmissionId, eventId: emergencySubmissionId });
```

הרצתי את `receipt()` של הלקוח (אותה לוגיקה, לא שונה) מול המבנה החדש:
```
new degraded payload: {"ok":true,"degraded":true,"leadId":"ccf7abf8-...","submissionId":"cc9f49c3-...","eventId":"a1892e93-..."}
passes client receipt() now? true
```
✅ **עובר.** משתמש שהליד שלו ניצל דרך מייל החירום יראה כעת הודעת הצלחה אמיתית, לא הודעת כשל שקרית. אין יותר סיכון לפנייה כפולה (וואטסאפ+מייל) על ליד שכן נקלט.

הרצתי שוב את כל סוויטת הבדיקות (`node --test test/*.test.mjs`, אותה תיקיית `/tmp` מבודדת, בלי DB/מייל אמיתי) — **13/13 עברו**, אין רגרסיה. `site/js/lead-form.js` לא השתנה מאז הסקירה הקודמת (אותה גרסה שנקראה).

**הערה קטנה שנשארת:** ה-`submissionId`/`leadId` הסינתטיים ב-mode B הם אקראיים ולא מקושרים לשום רשומה אמיתית (כי הכתיבה ל-DB נכשלה — זה הרעיון). זה תקין: אין outbox/META_CAPI event אמיתי בתרחיש הזה ממילא, כך שאין למה "לדדופל" מולו. ה-Lead pixel בצד לקוח כן יורה עם eventID אקראי — לא מזיק, רק לא נספר בדדופ מול השרת (שממילא לא ירה כלום ב-mode הזה).

**חסם הפרסום היחיד שצוין בסקירה הקודמת נסגר.** נותרו רק ההערות המשניות הלא-חוסמות (למטה, ללא שינוי).

---

# סקירת קלוד — חוזה לידים, ניסיונות חוזרים, idempotency (11.9.2026)

**סוג הסקירה:** קריאה בלבד + בדיקות מקומיות מבודדות. **לא בוצע שינוי בקוד**, לא commit/push/deploy.
**היקף:** `server/app.js`, `server/src/{leads,outbox,notify,db,config}.js`, `api/index.js`, `server/server.js`, `site/js/lead-form.js`, `site/js/config.js`, `server/test/leads.test.mjs`.
**הערה חשובה:** Codex עורך את הפרויקט הזה בו-זמנית (עיצוב "editorial" חדש, נכסי `camera-*-v2`, `site/css/editorial*.css`). הסקירה היא **תמונת מצב** של ה-working tree כפי שנראתה בזמן הבדיקה — הקבצים ממשיכים להשתנות. שום קובץ אתר/שרת לא נגעתי בו.
**בטיחות בדיקה:** כל הבדיקות רצו מקומית עם `LEAD_DATA_DIR` בתיקיית `/tmp` מבודדת, `DATABASE_URL=` ו-`RESEND_API_KEY=` ריקים — **אין חיבור למסד חי ואין שליחת מייל אמיתי**. נתוני הבדיקה נמחקו בסיום.

---

## 🔴 ממצא מרכזי — חוזה "אישור שמירה" שבור במצב חירום (Mode B)

**התסריט:** המסד לא זמין → `createLead()` נכשל → `server/app.js` מנסה ערוץ חירום (`sendEmergencyAdminEmail`) → **מצליח** → השרת מחזיר:
```json
HTTP 200  { "ok": true, "degraded": true, "leadId": "emergency" }
```
שימו לב: **אין `submissionId` בתשובה בכלל**, ו-`leadId` הוא המחרוזת הקבועה `"emergency"` — לא UUID.

**הלקוח** (`site/js/lead-form.js`, פונקציית `receipt()`) דורש כתנאי להצלחה:
```js
data.ok === true && !data.spam &&
typeof data.leadId === 'string' && typeof data.submissionId === 'string' &&
/^[0-9a-f-]{36}$/i.test(data.leadId) && /^[0-9a-f-]{36}$/i.test(data.submissionId)
```
בדקתי את הפונקציה הזו ישירות (Node, לוגיקה מזוהה 1:1 מהקובץ) מול המחרוזת המדויקת שמחזיר השרת ב-Mode B:

```
degraded (mode B, HTTP 200) passes client receipt()?  false
normal success passes client receipt()?               true
```

**התוצאה בפועל:** ב-`send()`, `response.ok && receipt(data)` נכשל → קוד הבדיקה יורד ל-`if (response.status < 500)` → **200 < 500 → אמת** → קורא ל-`fallback()` **מיידית, בלי ניסיון חוזר**. המשתמש רואה:
> "לא הצלחנו לאשר שהפרטים נשמרו... אפשר לנסות שוב או לפנות אלינו ישירות" + כפתורי וואטסאפ/טלפון.

**אבל הליד כן נקלט** — מייל חירום נשלח בהצלחה ל-`OWNER_EMAIL`. כלומר:
- המשתמש מקבל הודעת כישלון שקרית על בקשה שבפועל הצליחה.
- **אין אירוע Lead** נורה ל-Meta Pixel/CAPI (כי `success()` — היחיד שקורא ל-`track('lead_submit_success', …)` — אף פעם לא רץ בנתיב הזה) → אובדן דיווח המרה בדיוק בתרחיש שהכי חשוב לתעד (מסד נפול).
- סיכוי ממשי ל**פנייה כפולה**: משתמש שרואה "לא נשמר" לוחץ על "שליחה בוואטסאפ"/"התקשרו אלינו" (ערוץ נפרד, לא-מדודופל) — דוד עלול לקבל גם מייל חירום וגם הודעת וואטסאפ על אותו ליד, ולחשוב שיש שני פניות.

זה בדיוק ה"חוזה אישור שמירה" שהתבקשתי להתמקד בו — הוא **לא עומד** במצב ה-Mode B, אף שהמנגנון (המייל) עצמו עובד. ה-Mode C (מסד וגם מייל נכשלים, 503 אמיתי) **תקין** — ראו בדיקה למטה.

**תיקון מוצע (לא בוצע, להחלטת מי שממשיך על server/lead-form.js):** להוסיף `submissionId` אמיתי (UUID, אפילו סינתטי) ו-`leadId` תקין לתשובת ה-Mode B ב-`app.js`, **או** לרכך את `receipt()` בלקוח לקבל `degraded:true` כהצלחה נפרדת (עם קופי מתאים כמו "קיבלנו את הפרטים — נרשמו ידנית" בלי הבטחת SLA).

---

## ✅ מה שנבדק ועובד כמצופה

| התנהגות | בדיקה | תוצאה |
|---|---|---|
| הצלחה רגילה (JSON dev store) | POST עם `idempotency_key` חדש | `{ok:true, leadId:<uuid>, submissionId:<uuid>, deduped:false}` — עובר את `receipt()` |
| Idempotency — אותו `idempotency_key` פעמיים | POST כפול | `deduped:true`, **אותם** `leadId`/`submissionId` — עובר את `receipt()` |
| Idempotency תחת תחרות אמיתית | `server/test/leads.test.mjs`: 12 קריאות מקביליות לאותו `idempotency_key` | הגשה אחת בלבד, אירוע outbox אחד בלבד, `countLeads().total === 1` — ✅ |
| ליד שננטש ע"י worker שנפל | אותו קובץ בדיקה | האירוע לא אבד — חוזר ל-`claimable` אחרי שה-`next_attempt_at` חלף — ✅ |
| Honeypot (בוט) | POST עם `company` מלא | 400, `ok:false` — לא נוצר ליד |
| קלט לא תקין | שם/טלפון פגומים | 400 עם שגיאות בעברית לכל שדה |
| Rate limit (12/10min) | 14 בקשות רצופות | 429 עם **`Retry-After` מדויק** (תואם לחלון בפועל) — הלקוח קורא את הכותרת נכון וקובע `blockedUntil` בהתאם |
| כשל אמיתי (Mode C — גם DB וגם מייל נכשלים) | סימולציה: תיקיית נתונים שבורה + `RESEND_API_KEY` ריק | `HTTP 503 {ok:false, errors:[...], fallback:true}` — הלקוח מנסה שוב עד 3 פעמים (backoff ~1.5s/3s) ואז נופל בעדינות ל-fallback. **תקין** |
| בדיקת ייצור (`NODE_ENV=production` בלי `DATABASE_URL`) | `server/test/leads.test.mjs` | `initLeads()`/`createLead()` **דוחים** במפורש; `/health` מחזיר 503 | מונע דיפלוי שקט למצב "לידים בקובץ JSON זמני" |
| Test suite מלא | `node --test test/*.test.mjs` | **13/13 עברו** (5 לידים חדשים + 8 טלפון קיימים) |
| בטיחות מייל בבדיקה | `lead_events.json` אחרי כל הבדיקות | `last_error: "RESEND_API_KEY missing"` בכל הרשומות — אין ניסיון רשת אמיתי |

`api/index.js` (נקודת הכניסה ל-Vercel) שופרה גם היא: כישלון init חד-פעמי מאפס את ה-`ready` promise כדי שהניסיון הבא (cold start הבא) לא יתקע לצמיתות מול promise דחוי — שיפור אמיתי לעומת המצב הקודם.

---

## ⚠️ הערות משניות (לא חוסמות)

1. **צימוד init בין הזמנות ולידים** — `server/server.js` עבר מ-`Promise.allSettled` ל-`Promise.all`: אם `initDb()` (הזמנות/סליקה — פיצ'ר ישן) נכשל, השרת המקומי כולו לא עולה, כולל נתיב הלידים. ב-Vercel (`api/index.js`) זה נשאר `Promise.all` ללא `allSettled` גם כן — כשל ב-orders חוסם לידים בקולד-סטארט. שווה לבדוק אם זה מכוון.
2. **נגישות ההודעות** — `site/js/lead-form.js` משתמש כעת ב-`role="status"` + `aria-live="polite"` לכל ההודעות, כולל שגיאות ולידציה ("נא למלא שם מלא"). לפי WAI-ARIA, שגיאת טופס מיידית מקובלת יותר כ-`role="alert"`/`aria-live="assertive"` כדי שקורא מסך לא יפספס אותה. לא חוסם, אבל נסיגה קלה מהגרסה הקודמת.
3. **honeypot בצד לקוח** — כשהשדה החבוי מלא, הלקוח כבר לא שולח לשרת כלל; מציג ישר הודעת שגיאה + קישורי fallback (וואטסאפ/טלפון) במקום "הצלחה מדומה" שקטה. משתמש אמיתי שדפדפן/מנהל-סיסמאות שלו ממלא אוטומטית שדה נסתר (תרחיש ידוע) יקבל הודעת שגיאה ולא יידע למה. השרת עצמו (`app.js` שורה 81, בהערה) מודע לסיכון הזה ("Autofill can populate hidden fields: never silently discard a real request") אך שני הצדדים בפועל דוחים את הבקשה. שווה החלטה מודעת, לא תיקון דחוף.
4. **`Retry-After` על הצלחה רגילה** — אינו קיים (כצפוי, לא רלוונטי), רק על 429 — תקין, רק לתעד שזה המצב.

---

## חסמי פרסום (Publish blockers) — סיכום

| # | חסם? | תיאור |
|---|---|---|
| 1 | ✅ **תוקן** (ראו עדכון למעלה) | חוזה Mode B — `leadId`/`submissionId` הם כעת UUID אמיתיים, עובר את `receipt()` בלקוח. אומת מחדש. |
| 2 | לא, אך לאמת | צימוד `initDb`/`initLeads` (הערה 1) — לוודא שזה מכוון לפני דיפלוי. |
| 3 | לא | שאר החוזה (idempotency, retries, honeypot, rate-limit, production guard) עובד כמתועד ועבר בדיקות אוטומטיות + ידניות. |

**לא נבדק** (מחוץ להיקש שהתבקש / דורש נכסי Codex שעדיין בהכנה): העיצוב "editorial" החדש, `camera-*-v2`, `editorial.css/js` — לא נסקרו ויזואלית או פונקציונלית.
