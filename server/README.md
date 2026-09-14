# תשתית לידים — גוב ארי מערכות

האתר פועל כרגע כמשפך לידים: המשתמש משאיר שם וטלפון, הליד נשמר במסד PostgreSQL, ורק לאחר מכן נוצרות התראות בתור outbox. אין סליקה באתר, אין גביית תשלום ואין דרישה לפרטי אשראי.

## מקור האמת לליד

`POST /api/leads` הוא הנתיב הראשי. הצלחה מוחזרת רק אחרי שהליד וההגשה נשמרו במסד בצורה עמידה. כשל במייל, Meta CAPI או גיבוי Sheet לא מוחק ליד ולא חוסם את הגולש אחרי שהשמירה הצליחה.

בפרודקשן חובה להגדיר:

| משתנה | מטרה |
| --- | --- |
| `DATABASE_URL` | מסד PostgreSQL מתמשך. בלי זה פרודקשן לא אמור לקבל לידים. |
| `PGSSL` | בדרך כלל `true` בפרודקשן. |
| `IP_HASH_SALT` | מלח אקראי לגיבוב IP. לא להשתמש בברירת המחדל בפרודקשן. |
| `OWNER_EMAIL` | כתובת בעל העסק לקבלת התראות ליד. |
| `FROM_EMAIL` | כתובת שולח מאומתת ב־Resend. |
| `FROM_NAME` | שם השולח במייל. |
| `RESEND_API_KEY` | מפעיל התראות מייל. אם חסר — לידים עדיין נשמרים במסד, והמייל נשאר כבוי. |
| `ADMIN_USER` / `ADMIN_PASSWORD` | מפעילים את `/admin/leads` ו־`/admin/leads.csv`. |
| `OUTBOX_TICK_SECRET` או `CRON_SECRET` | סוד להרצת `/api/outbox/tick` מחוץ ל־Vercel Cron. |

## איפה רואים לידים

- `/admin/leads` — ממשק אדמין מוגן Basic Auth.
- `/admin/leads.csv` — ייצוא CSV.
- מסד PostgreSQL — טבלאות `leads`, `lead_submissions`, `lead_events`.

## הפעלת מיילים עם Resend

1. לאמת ב־Resend את הדומיין או כתובת השולח שמוגדרת ב־`FROM_EMAIL`.
2. ליצור API key.
3. להוסיף ב־Vercel Production את `RESEND_API_KEY`.
4. לבצע redeploy כדי שפונקציות השרת יקלטו את המשתנה.
5. לבדוק `GET /api/health` — השדה `email` צריך להפוך מ־`off` ל־`on`.
6. לשלוח ליד בדיקה אמיתי ולוודא שהוא נשמר ב־DB ומתקבל במייל.

לפני הפעלת Resend כדאי לבדוק את תור `lead_events`. אם קיימים אירועי בדיקה ישנים ב־`pending`, אפשר לסמן אותם כ־`done` כדי שלא יישלחו מיילים מיותרים לאחר ההפעלה.

## Outbox

אירועי התראה נוצרים בטבלת `lead_events` לאחר שמירת הליד. המעבד רץ בשתי דרכים:

- best effort מיד אחרי קליטת ליד.
- `/api/outbox/tick` עבור Cron/מתזמן.

כשל במייל מסמן את האירוע לניסיון חוזר. הוא לא מוחק את הליד.

## בריאות מערכת

`GET /api/health` מחזיר:

- מצב מסד (`db`).
- מצב outbox (`pending`, `processing`, `failed`, `stuck`).
- האם מייל פעיל (`email`).
- האם אדמין פעיל (`admin`).
- האם Meta CAPI / Sheet Backup פעילים אם הוגדרו.

## בדיקות מומלצות לפני פרסום

```bash
node --check site/js/config.js
node --check site/js/main.js
node --check site/js/lead-form.js
node --check server/app.js
npm test --prefix server -- --runInBand
curl https://govari-site.vercel.app/api/health
```

בדיקת ליד:

```bash
curl -X POST https://govari-site.vercel.app/api/leads \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: fetch' \
  --data '{"full_name":"בדיקת מערכת","phone":"0501234567","city":"בית שמש","company":""}'
```

## גבולות חשובים

- האתר אינו מציג מחיר מוצר מלא.
- אין סליקה באתר.
- אין מייל אישור ללקוח כרגע; ההתראה מיועדת לבעל העסק.
- אין להוסיף הבטחות מוצר, מחיר, אחריות או יכולות שלא קיימות ב־`content/content.md` או באישור מפורש של דוד.
