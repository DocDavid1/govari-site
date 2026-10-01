
## 2026-09-21 — דוח growth-analyst: מיפוי משפך + בנצ'מרק תחרותי
- נוצר `content/growth-report.md` (לא כפול ל-`sales-playbook.md`): מיפוי קוד בפועל של מדידה/ליד/outbox/CTA, ובנצ'מרק מבני מול יבואן ישראלי ישיר ומותגים גלובליים (Nextbase/Ring/Garmin/Viofo) — ללא העתקת טקסט/מיתוג.
- ממצא מרכזי: cron ה-outbox ב-`vercel.json` רץ פעם ביום בלבד (מגבלת Vercel Hobby לפי `DEPLOY.md`), ולא ברור אם ה-workaround המתועד (`cron-job.org`) הוגדר בפועל — רשת הביטחון להתראת ליד עלולה לפעול רק אחרי עד 24 שעות במקרה כשל.
- ממצא נוסף: כפתור וואטסאפ עדיין לא קיים ברצועת ה-CTA הדביקה במובייל (`.mobile-contact`), בניגוד להמלצה המפורשת שכבר קיימת בפלייבוק.
- 5 המלצות מתועדפות עם בעלות סוכן ומה חסר מדוד לכל אחת, בתוך הדוח.

## 2026-09-14 — תיקון פופאפ ופירוק לגורמים
- הפופאפ הוקטן ועוצב מחדש ככרטיס קומפקטי יותר, עם היררכיית CTA מאוזנת ופחות חסימה של המסך.
- נוספו שכבות אלקטרוניות, מעגלים, ribbon cables ותוויות מעודנות לסקשן הפירוק לגורמים, כדי שירגיש כמו תצוגת מוצר מקצועית ולא דיאגרמה שטוחה.
- עודן פוקוס נגיש במודל ונשמר טריגר בדיקה פנימי `?modaltest=1` לצילומי QA בלבד.

## 2026-09-14 — סבב ויזואלי: הירו, נכסי מוצר וריכוך UX
- נוסף סט נכסים ויזואליים פרימיום המבוסס על תמונת המוצר הקיימת: הירו דסקטופ, הירו מובייל, התקנה ברכב, ומצלמה לצד אפליקציה.
- הסרטון בהירו נשאר פעיל; נוספה מעליו שכבת מוצר מבוקרת בלי להסיר את הווידאו.
- תוקן קרופ מוצר שבור במובייל ובדסקטופ: תמונת המוצר הישנה כבר לא נחתכת ענקית.
- ההיידר והכפתורים רוככו עם פינות מעוגלות, רקע זכוכית עדין, והיררכיית CTA נוחה יותר.
- נוסף manifest לנכסים החדשים עם הבהרה מהו צילום/המחשה כדי לא להציג הדמיות כראיה תיעודית.

## 2026-09-14 — עדכון פרטים מסחריים מאושרים
- עודכנו באתר ובמקור האמת: עוסק 207575192, שירות בעיקר בבית שמש, מרכז/ירושלים והסביבה בכפוף לתיאום.
- נוספו התקנה חינם באזור המרכז וירושלים, חלופת הדרכה טלפונית/וידאו להתקנה עצמית עם הנחה על התקנה פיזית, אחריות 12 חודשים ואפשרות SIM לשנה ב־199₪.
- עודכנו FAQ, אזור ההצעה בדף הבית, עמוד עלינו ותנאי השימוש בהתאם.

## 2026-09-14 — audit המרה, משפטי, SEO ותוכן
- שונתה שפת ה־CTA הראשית ל“בדיקת התאמה וקבלת מחיר” כדי להפחית תחושת התחייבות.
- נוספו בדף הבית סקשני הצעה/אמון/תועלות/FAQ לפני טופס הליד, ללא המצאת מחיר, אחריות או ביקורות.
- רוכך ניסוח “360°” לניסוח מדויק יותר: כיסוי רחב במספר זוויות / ארבעה ערוצי צילום.
- הוסרו פלייסהולדרים וטקסטים פנימיים מעמודי תנאים, פרטיות ונגישות.
- נוספו robots.txt, sitemap.xml ועמוד 404 בסיסי.
- עודכן מקור האמת עם פרטים שעדיין דורשים אישור בעלים לפני פרסום מסחרי.

## 2026-09-14 — סבב פרימיום, יום/לילה, מילואים ופופאפ ליד
- הופעל מתג מצב יום/לילה בהדר בדף הבית ובעמוד האפליקציה, עם שמירה מקומית והנגשה.
- נוסף תג אמון “עושה מילואים” כאלמנט מותג עדין, בלי לטעון תרומה/ביקורות/מחיר.
- נוסף חלון המרה פרימיום שנפתח בגלילה/כוונת יציאה ומוביל לטופס “בקשת הזמנה ללא תשלום”, מוגבל לשתי הופעות בביקור.
- עמוד האפליקציה הורחב לסקשנים מלאים: כל תמונת אפליקציה מסבירה תכונה אחרת — צפייה חיה, GPS, מסלול והיסטוריית מיקומים.
- נשמרו גבולות משפטיים: אין תשלום באתר, אין פרטי אשראי, אין הבטחות לא מאומתות ואין מחיר באתר.
# יומן שינויים — אתר גוב ארי מערכות

## 2026-09-30 — סידור מחדש של הירו הבית לפי בדיקה ויזואלית
- כפתור ההשהיה/הפעלה של סרטון הרקע הועבר מהצילום אל ההדר, כאייקון עגול ונגיש; כך הוא לא יושב ליד כותרת המותג ולא מתחרה בכותרת הראשית.
- תווית 4G אורגנה כיחידה RTL אחת: האייקון צמוד ל־4G ולכיתוב "חיבור סלולרי".
- הוגדלה יחידת המצלמה והוקטנה תמונת האפליקציה, עם רווח ביניהן כדי שהטלפון לא יכסה את המצלמה.
- נוספה תנועת גלילה עדינה למצלמה וקישור ברור לסקשן ההרכבה, שבו הגלילה מפעילה את סיפור הפירוק והחיבור.
- נשמרת תמיכת `prefers-reduced-motion`; לא שונתה שום טענה מסחרית או התחייבות.

## 2026-09-30 — סריקה ויזואלית ותיקון סרטון ההדגמה
- הוחלף קליפ ההדגמה הקצר (כ־4 שניות) בסרטון המקור המלא (28.4 שניות) מתיקיית החומרים. הווידאו הומר ל־MP4/H.264/AAC ידידותי לדפדפנים ובמשקל קטן משמעותית מהמקור; נשמר עותק בתיקיית החומרים ונוצר פוסטר מתוך הסרטון.
- נגן הסרטון הוגדר בפרופורציה אנכית כדי שלא ייחתך או ייראה כמו תמונה צרה בתוך מסגרת רחבה, כולל התאמה לגובה המסך במובייל.
- כפתורי ההצעה בראש עמוד המצלמה והאפליקציה קיבלו היררכיית כפתור ברורה במקום קישור טקסט קטן.
- הוסרו הפסים השחורים מסביב לתמונת המצלמה בעמוד המפרט באמצעות התאמת רקע המסגרת לגוון התמונה.
- באזורי ביניים (טאבלט/חלון צר) הירו הבית נערם ומצטמצם כדי שכותרת, מחיר, כפתורי פעולה ותמונת המוצר לא ייחתכו; למצלמה ולטלפון נוספה תנועה עדינה המכובה לפי `prefers-reduced-motion`.

## 2026-09-11 — וידאו בהירו, ליד כחלון קופץ (עד פעמיים), ניווט מתוקן, עמוד "עלינו" חדש
סבב תיקונים נוסף לפי הנחיות דוד על הסבב הקודם:

- **וידאו רקע חזר להירו** (`assets/videos/highway-editorial.mp4`) במקום תמונה סטטית. הירו נקי — בלי טופס מוטבע.
- **בקשת ההזמנה כחלון קופץ בלבד**: הוסר הטופס המוטבע מההירו. `#lead` (הטופס האמיתי היחיד) עבר לסקשן "מה סוגרים בשיחה". `main.js` → `ctaModal()` נכתב מחדש: לא נפתח עם טעינת הדף; נפתח לראשונה כשמתחילים לגלול (~25% מגובה המסך), ולכל היותר **פעמיים סה"כ** לביקור (מונה ב-`sessionStorage`, לא שער בוליאני יחיד כמו קודם).
- **תיקון ניווט**: כל העמודים (`index/about/app`) מציגים עכשיו את אותו סדר קישורים — בית · עלינו · האפליקציה · שאלות נפוצות · תרומה. קודם "תרומה" ו"שאלות נפוצות" קיימו רק בדף הבית ונעלמו בעמודים אחרים; מעכשיו מקושרים אליהם עם עוגן (`index.html#donation` וכו') מכל עמוד.
- **`features.html` → `about.html`** (git mv, לא נמחק — נשמרה היסטוריה): הוחלף מעמוד מפרט טכני לעמוד "עלינו" — מילואימניקים משוחררים ולוחמים, וההחלטה על 10% מהרווח לתרומה. המפרט הטכני המלא + גלריית התמונות האמיתיות שהיו ב-features.html **עברו לדף הבית** (`index.html#specs`) כדי לא לאבד תוכן מאומת.
- כל קישורי `features.html`/"המצלמה" בניווט ובפוטר של `app.html` עודכנו ל-`about.html`/"עלינו".

## 2026-09-11 — חזרה לשפת פחם+זהב עשירה, מצב יום/לילה, ופיצ'רים שדוד ביקש
לפי הנחיה ישירה של דוד: העיצוב ה"עריכתי" היה מינימליסטי מדי. חזרה לבסיס `styles.css` (פחם/זהב, שנבנה קודם), עם תוספות:

- **מצב יום/לילה אמיתי** — טוקנים מלאים לשני המצבים ב-`styles.css` (`:root[data-theme]` + `prefers-color-scheme`), מתג בהדר (`.theme-toggle`, קודם הוסתר לגמרי), נשמר ב-`localStorage`. כל צירופי הצבע במצב יום נבדקו ניגודיות (≥4.7:1).
- **חלונות קופצים שמובילים לפעולה**: הוחזר חלון ההמרה (exit-intent/טיימר/גלילה) ב-`main.js`, ונוסף מודל גנרי (`data-info-modal`) המשמש גם לכפתור "מה בדיוק כלול?" (מפרט מלא + CTA) וגם להסבר התרומה.
- **תג "עושה מילואים"** הוחזר פעיל בהדר בכל העמודים (כולל privacy/terms/accessibility).
- **סקשן תרומה הוחזר**, בניסוח מעודכן לפי הנחיית דוד: **"10% מהרווח על כל רכישה נתרמים לפצועי מלחמת חרבות ברזל"** (במקום הניסוח הכללי הקודם "ללוחמים ולפצועי צה״ל"). זו הנחיה מפורשת ומאושרת של דוד (לא המצאה) — מתועד גם ב-`content/content.md`. כולל טוסט תרומה צדדי (`.donate-toast`) וסקשן ייעודי (`#donation`) עם עיצוב זית/פליז נבדל מהזהב המסחרי.
- **תוכן עשיר יותר**: נוסף סקשן שאלות נפוצות (`#faq`, 5 שאלות — בלי להמציא מחיר/אחריות), וגלריית **תמונות אמיתיות** (לא הדמיות) של המוצר הפיזי ב-`features.html`.
- **`editorial.css`/`editorial-secondary.css`/`editorial.js` הוחלפו** ב-`styles.css`/`main.js` בכל העמודים (`index/features/app/privacy/terms/accessibility`) — טיפוגרפיה מודגשת/נורמלית יותר, לא הפונט הדק של הגרסה העריכתית. קבצי ה-editorial נשארו בדיסק (לא נמחקו) למקרה הצורך.
- **`app-mockup.webp`** (סצנת הפריצה המבוימת, ראו `content/claude-review-visual-2.md`) **הוחלף לגמרי** ב-`app-mockup-neutral.svg` (SVG נטרלי, ללא סצנות/טענות) בכל שימושיו.

### מפרט חדש שאומת — מצילום קופסת המוצר (`assets/images/gallery-5.webp`)
דוד צילם את קופסת המוצר המקורית עם מדבקת המפרט של היצרן. זה מקור אמין (לא הדמיית AI):
**2K Ultra HD** (ערוץ ראשי) **+ 3×1K** (ערוצים משניים), **מסך תצוגה מובנה 3 אינץ'**, **תמיכה בכרטיס עד 512GB**, **SIM מובנה**. עודכן ב-`content/content.md` ובטבלת המפרט/פילס ב-`features.html`+`index.html`. **"2K" מאשר סופית שאין להשתמש ב"4K"** (כפי שדוד תיקן קודם).

## 2026-09-11 — שפת עיצוב חדשה, וידאו חי ואפקט פירוק/חיבור
- דף הבית נבנה מחדש כשפה עריכתית פרימיום: Hero וידאו כביש, טיפוגרפיה גדולה, רקעים נקיים, פחות כרטיסיות, בלי אייקונים גנריים ובלי פלטת פחם/זהב תבניתית.
- נוספו נכסי מוצר חדשים שנוצרו על בסיס צילומי דוד: `camera-studio-v2`, `camera-main-v2`, `camera-mount-v2`, `camera-rear-v2`. קובצי הרכיבים נשמרו עם שקיפות אמיתית לאפקט גלילה.
- נוסף אפקט גלילה שבו היחידה הראשית, התושבת והמצלמה האחורית נפרדות ומתכנסות חזרה. הכיתוב מציין שזו המחשה של רכיבים חיצוניים ולא הוראת פירוק.
- הוטמע קליפ כביש חי מ-Mixkit כ-Hero video: `highway-editorial.mp4` + פוסטר `highway-editorial.jpg`.
- תמונת הסטודיו בעמוד נטענת כ-WebP דחוס, וקבצי PNG נשארים לרכיבים שדורשים אלפא.
- כל הנכסים שנוצרו הועתקו גם אל תיקיית החומרים של דוד תחת `Website-Editorial-2026-09-11`.
- בדיקת דפדפן מקומית בוצעה על `http://localhost:3020/`: תמונות נטענות, אין גלילה אופקית, והמשתנה של אפקט הגלילה מתעדכן בזמן גלילה.
- סקירת Claude במקביל מצאה חסם בפרסום: מצב חירום שבו DB נופל אבל מייל חירום מצליח החזיר מזהים לא תקינים ללקוח. תוקן ב-`server/app.js` כך שגם תגובת חירום מחזירה `leadId`, `submissionId` ו-`eventId` תקינים מסוג UUID.
- עמודי `features.html` ו-`app.html` נוקו משאריות ההדר הישן: הוסר הפס העליון, תג המילואים ואייקוני SVG מהגרסה הקודמת, והוחלף להדר הטקסטואלי הנקי של השפה החדשה.
- בעקבות QA ויזואלי של Claude, `features.html` כבר לא משתמש בתמונה `product-hero.webp` שכללה טענות מוטבעות לא מאומתות כמו 4K/ענן. במקומה מוצגת `camera-studio-v2.webp` הנקייה עם כיתוב הדמיה שקוף. עודכנו גם תאריכי `privacy.html` ו-`terms.html` ל-11.09.2026.

## 2026-09-11 — שדרוג עיצוב + זרימת ליד לפי הבריף המקומי
עבודה מקומית בלבד. אין push / פרסום / שינוי DB. בדיקות בוצעו במצב JSON מבודד (ללא DATABASE_URL) — לא נשלחו לידים ל-DB החי.

### עיצוב — פחם וזהב
- `site/css/styles.css`: פלטה חדשה — רקע `#111318`, משטחים `#1B1F26/#222732`, טקסט `#F7F4ED`/`#C4C7CE`, זהב `#E7BC68` (טקסט על זהב = פחם). ניגודיות נבדקה: כל הצירופים ≥ 5.6:1 (רובם ≥ 9:1).
- כפתור ראשי יחיד = זהב מלא. כפתורים משניים (`.btn-gold`/`.btn-ghost`) = מתאר בלבד, לא מתחרים. אדום = שגיאות בלבד; ירוק = וואטסאפ/הצלחה בלבד.
- רצועת המידע העליונה: ממשטח פחם עדין (במקום פס זהב מלא).
- תיקון חריגה אופקית: `.lead-hp` (honeypot) ו-`.skip-link` עברו לטכניקת visually-hidden במקום `left:-9999px` שיצר גלילה אופקית של ~9800px. כעת `scrollWidth == clientWidth` בכל הרוחבים.

### דף הבית — בקשת הזמנה כליד
- Hero חדש מעל תצלום מוצר נקי (`assets/images/hero-studio-charcoal.webp`, נוצר מ-`Codex-Generated-2026-09-11/01-studio-charcoal.png`, + srcset 900/1600). כותרת "הרכב שלך. תמיד בקשר עין.", טופס שם+טלפון, CTA "בקשת הזמנה ללא תשלום".
- הודעת הצלחה (רק אחרי אישור שרת): "הבקשה התקבלה. נחזור אליכם להשלמת הפרטים." — בלי הבטחת זמן.
- נגישות: `role="alert"` + `aria-live="assertive"` על אזור הסטטוס גם כשה-div מגיע מה-HTML; טלפון עם `type=tel`/`inputmode=tel`; focus גלוי (טבעת זהב); שמירת ערכים בכשל ומניעת שליחה כפולה (קוד קיים).
- סקשן "איך מזמינים" (3 צעדים) — נוסח מחדש בלי מיסגור תשלום. "מה סוגרים בשיחה" מחליף את סקשן המחיר.

### הסרת טענות לא מאומתות (index + features + app)
- הוסר: מחיר (1,090 ₪), סקשן תרומה "10% מהרווח" (+ ה-donate-toast ב-JS), "2K/4K", "ענן"/גיבוי בענן, "ראיית לילה", "170°", חיישן G/פגיעה/מצב חניה, גידור גיאוגרפי, התראות מהירות, "לחצן שיתוף", "ריבוי רכבים", "מעל 100 לקוחות".
- מונח "Ultra HD" נשאר כתיאור איכות כללי בלבד — **אינו מכריע רזולוציית פיקסלים**; לא הוסק FHD/4K.
- מספר טלפון: נשמר **053-6813013** (מאושר ע"י דוד 11.9). המספר שבפליירים (050-4174996) לא בשימוש.
- `site/js/config.js`: `price`/`priceText`/`installationPolicy` רוקנו; קופי CTA עודכן.
- עמודי `checkout.html` / `preorder.html` / `order-success.html` — מסלול הצ'קאאוט הישן, כבר לא מקושרים משום עמוד ראשי. לא נגעתי בהם — להחליט אם למחוק/להפנות.

### נכסים
- `site/assets/images/hero-studio-charcoal.webp` (51KB) + `-900.webp` (20KB). קובצי המקור לא שונו.

## 2026-09-11 — מסד חדש + קטלוג הסט הסופי של החומרים
- **Supabase**: נוצר פרויקט חדש `govari-site` (ap-south-1), הורצה `server/sql/bootstrap.sql`, אומת חיבור מקצה-לקצה (ליד בדיקה נכתב ל-`leads`/`lead_submissions`/`lead_events` ואז נוקה). `server/.env` מקומי מצביע על המסד החדש.
- **תיקון**: `server/src/outbox.js` — נוסף `FROM lead_events` לשאילתת הבריאות (באג ותיק שצף בחיבור Postgres ראשון).
- **קטלוג חומרים**: `assets/asset-catalog.md` עודכן עם "הסט הסופי" (22 PNG + וידאו) מתיקיית `מצלמת רכב חומרים -סופי מוכן` — כולל מיפוי לסקשנים ורשימת סתירות תוכן לאישור (טלפון 050-4174996 מול 053-6813013, FHD מול 4K, כתיב המותג).
- **וידאו**: `פרוייקט (1).mov` (8K, 224MB) → נדחס ל-`assets/videos/promo-reel.mp4` (~10MB) + `.webm` (~6.5MB) + פוסטר. עדיין לא משולב באתר.

## 2026-09-11 — ניקוי תשתית: מוכן לחיבור מסד/גיטהאב/Vercel חדשים
- **ניתוק מהתשתית הישנה**: המסד הישן (Supabase `gevkcslzkeosyrapdglz`) נמחק. הוסרו כל האזכורים שלו, של פרויקט ה-Vercel הישן (`prj_17VON…`, `govari-d7u3.vercel.app`) ושל מסלול הדיפלוי של Render.
- **נמחקו**: 11 קובצי audit/תכנון מסבבים קודמים (`AUDIT.md`, `CAMPAIGN-READINESS.md`, `HANDOFF.md`, `PRODUCTION-ALIGNMENT-PLAN.md`, `SUPABASE-AUDIT.md`, `INFRASTRUCTURE-INVENTORY.md`, `RESET-BASELINE.md`, `CLEAN-*.md`, `*-CONTRACT.md`); `render.yaml` + `deploy.sh`; נתוני dev מקומיים (`server/data/*.json`).
- **נוסף למעקב**: `server/sql/bootstrap.sql` — סכימה מאוחדת אידמפוטנטית (טבלאות + אינדקסים + FK + טריגר + RLS) להדבקה במסד Supabase ריק חדש.
- **`server/.env.example`** — הושלם: נוספו `IP_HASH_SALT`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE`, `ADMIN_USER/PASSWORD`, `OUTBOX_TICK_SECRET`, `SHEET_WEBHOOK_URL`. תבנית מלאה ל-Vercel.
- **`DEPLOY.md` / `README.md`** — מסלול פריסה אגנוסטי לריפו: repo חדש ב-GitHub → `git remote add origin` → push → Vercel Import.
- **git remote** `govarisystems` הוסר. הקוד אינו קשור לשום תשתית — מוכן ל-`git remote add origin <url>` חדש.
- קוד הריצה (`server/src/config.js`, `db.js`) לא נגע — כבר קרא הכול מ-env. אין סודות בהיסטוריית git.

## 2026-09-10 — צבע: הדר אטום + כפתור CTA אדום
- **הדר**: `.site-header` עכשיו רקע כהה אטום קבוע (`var(--bg)` #08080a) עם קו תחתון בכל העמודים, במקום שקוף שמתכהה בגלילה. במצב גלילה נשאר אטום עם צל עדין.
- **כפתור CTA ראשי** (`.btn-primary`): עבר מגרדיאנט זהב לגרדיאנט אדום מותגי (`--red-grad`, טקסט לבן, `--shadow-red` אמיתי). חל על כל כפתורי ה-CTA באתר (הדר, הירו, פסי CTA). `.btn-gold` (קישורי "גלו עוד") נשאר זהב.
- קבצים: `site/css/styles.css` בלבד.

## גרסה 2.0 — מעבר למשפך ליד (callback‑first) + צינור לידים עמיד
מטרה: תנועת מטא בתשלום → ליד (שם + טלפון → חוזרים אליו). לא צ'קאאוט, בלי לבקש תשלום.

### תשתית לידים (עדיפות: לא לאבד ליד)
- **`POST /api/leads`** — נקודת קצה חדשה. כתיבה אטומית של ליד ל-PostgreSQL (Supabase) בטרנזקציה אחת, ואז תשובת הצלחה. לא תלוי במייל/אנליטיקס.
- **סכימה** (`server/migrations/001_init_leads.sql`): `leads` (רשומה קנונית לפי טלפון מנורמל), `lead_submissions` (כל הגשה נשמרת — גם חוזרת), `lead_events` (outbox). אינדקסים על created_at / phone_normalized / status / utm_campaign. רצה אוטומטית ב-cold start.
- **Outbox** — כל התראה (ADMIN_EMAIL / META_CAPI / SHEET_BACKUP) היא אירוע עם ניסיונות חוזרים ו-backoff מעריכי. כשל התראה לא מוחק ולא חוסם ליד. פועל: `/api/outbox/tick` (Vercel Cron כל דקה / cron-job.org).
- **נירמול טלפון ישראלי** (`server/src/phone.js`) — `0501234567` · `050-123-4567` · `+972…` · `00972…` → E.164 אחיד. ליד לא אובד בגלל פורמט. 8 בדיקות יחידה (`server/test/phone.test.mjs`).
- **דדופ**: אותו טלפון → מעדכן את הליד הקנוני + מוסיף הגשה. `idempotency_key` מהדפדפן מונע כפילות בלחיצה כפולה / retry.
- **מצבי כשל**: מסד נופל → ניסיון מייל חירום; גם זה נכשל → הודעת אמת + WhatsApp/טלפון עם הפרטים שהוקלדו. אף פעם לא מצהירים "נשמר" בלי סינק עמיד שהצליח.
- **`GET /api/health`** — בריאות מסד + outbox (pending/failed/stuck) + דגלי email/CAPI. 503 כשמשהו תקוע.
- **`/admin/leads`** — ממשק ניהול מוגן Basic Auth (סינון, חיפוש, קליק-לחיוג/וואטסאפ, עדכון סטטוס, ייצוא CSV). כבוי ללא `ADMIN_USER/PASSWORD` (חלופה: דשבורד Supabase).

### פרונט — מובייל קודם, ליד קודם
- **הירו חדש** ב-`index.html`: כותרת "הרכב שלך. תמיד בקשר עין.", 3 נקודות תועלת, **טופס ליד קצר** (שם + טלפון + עיר אופציונלי) inline. מובייל: טקסט → מוצר → טופס.
- **`js/lead-form.js`** — טופס עמיד: progressive enhancement (הטופס עובד גם בלי JS), ניסיונות חוזרים, זיהוי אופליין + שליחה כשהחיבור חוזר, מניעת לחיצה כפולה, מצב הצלחה ("קיבלנו את הפרטים 👍"), מצב כשל עם WhatsApp/טלפון ממולאים. שדות לא מתנקים בכשל.
- **`js/config.js`** — מקור אמת אחד לצד לקוח (טלפון, וואטסאפ, מחיר, קופי, `metaPixelId`).
- **`js/track.js`** — Meta Pixel (נטען רק אם יש מזהה), לכידת UTM/fbclid/referrer ל-sessionStorage, אירועי משפך (`lead_form_view`, `lead_form_started`, `lead_submit_attempt/success/error`, `phone_click`, `whatsapp_click`), תמיכת dataLayer. אירוע `Lead` רק אחרי אישור שרת, עם `event_id` לדדופ מול CAPI.
- **סקשן "מה קורה אחרי שמשאירים פרטים"** — 3 צעדים (משאירים מספר → חוזרים ומתאמים → רק אחרי אישור, התקנה ותשלום). מסיר חרדת תשלום.
- **רצועת CTA דביקה במובייל** — "השאירו פרטים" + וואטסאפ + חיוג; נעלמת כשהטופס גלוי; מכבדת safe-area.
- **פחות חיכוך**: אימייל בצ'קאאוט → אופציונלי (גם בשרת). אין תקנון-חובה במסלול הליד. ה-CTA הראשי כבר לא "הזמנה/שריון/תשלום" אלא "רוצה לשמוע פרטים?" / "אני רוצה שיחזרו אליי".
- **"ללא תשלום"** — צומצם מ-~7 מופעים בעמוד הבית לאזכור רגוע ליד ה-CTA + סקשן ההסבר.
- `preorder.html` → הטופס הראשי הוא ליד (`/api/leads`); "הזמנה מלאה" נשאר כקישור משני.

### אבטחה
- כותרות: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (ב-`vercel.json` וב-Express).
- honeypot (`company`) בכל טופס ליד; rate-limit (12 / 10 דק' ללידים); גבול גוף 32kb; שאילתות פרמטריות (pg); Basic Auth עם `timingSafeEqual`; IP לא נשמר גולמי — SHA-256 עם מלח (`IP_HASH_SALT`); אין stack ללקוח.

### תוכן / עקביות (ר' AUDIT.md)
- `tel:` אוחד ל-`+972536813013` בכל האתר (היו 17× מקומי + 6× E.164).
- **הוסר** הסופרלטיב "הדגם היחיד שמצלם ומתריע 24/7" (לא בר-הוכחה) → "מצלמת רכב חכמה שמלווה אותך 24/7".
- **הוסרו** "כמות מוגבלת בהשקה" / "שנחת השבוע" (דחיפות לא מאומתת).
- ניסוח התרומה אוחד זמנית ל-"10% מהרווח על כל רכישה" בכל המופעים — **דרוש אישור דוד** (מהרווח vs מכל רכישה, שם עמותה).
- טענות מפרט לא מאומתות (2K, 170°, ראיית לילה, גיבוי ענן, גידור גיאוגרפי) — רשומות ב-`AUDIT.md §4` לאישור לפני קמפיין.
- Placeholders משפטיים `[להשלמה]` (ח.פ., כתובת, אחריות, אספקה, מחוז שיפוט, ממונה פרטיות, רכז נגישות) — צ'קליסט ב-`AUDIT.md §5`. **טעון בדיקת עו"ד.**

### חדש/משתנה — קבצים
- חדש: `server/src/{db,phone,leads,notify,outbox,admin}.js`, `server/migrations/001_init_leads.sql`, `server/test/phone.test.mjs`, `site/js/{config,track,lead-form}.js`, `AUDIT.md`.
- שונה: `server/{app,server.js}`, `server/src/{config,validate}.js`, `api/index.js`, `vercel.json`, `server/.env.example`, `site/{index,preorder,checkout,features,app,terms,privacy,accessibility,order-success}.html`, `site/css/styles.css`, `site/js/main.js`, `DEPLOY.md`.

---

## גרסה 1.0 — השקה ראשונית
- הוקם מבנה פרויקט + 8 סוכנים (בראשם creative-director ברמת Apple).
- נותח אתר הרפרנס proof.co.il (מבנה בלבד).
- קוטלגו נכסי הלקוח (60 וידאו, 44 תמונות) ב-assets/asset-catalog.md.
- מערכת עיצוב פרימיום: שחור · אדום ליון · זהב (מבוסס לוגו המותג).
- 4 עמודים: בית (index), המצלמה (features), האפליקציה (app), הזמנה מראש (preorder).
- נכסים דחוסים ל-web (WebP + וידאו h264 + פוסטרים). משקל אתר כולל ~8MB.
- כותרת ראשית: "הדגם היחיד שמצלם ומתריע 24/7". מחיר השקה 1,090₪. טלפון 053-6813013.
- ביקורת עיצוב: נחתך פס טקסט מובנה מתמונת ההירו למראה נקי; הירו מבנה חדש (כותרת מעל, מוצר מתחת).

## ממתין לאישור/השלמה מדוד
- מפרט מדויק (אחסון, מתח, ממדים), אחריות, אספקה והתקנה.
- שם/קישורי אפליקציה בחנויות (לא הוטמעו קישורים כדי לא להמציא).
- עדויות לקוחות אמיתיות (לא שולבו עדויות פיקטיביות).
- וידאו הדגמה מהכביש (קליפי C00xx 4K — דורשים חיתוך/העלאה ל-YouTube).

## גרסה 1.1 — מצב יום/לילה
- נוסף כפתור מעבר יום/לילה בהדר (כל 4 העמודים), עם שמירת בחירה (localStorage) וללא הבהוב טעינה.
- פלטת יום מלאה ותואמת עיצובית: רקע בהיר, טקסט כהה, אדום כאקצנט, זהב כהה יותר לקריאוּת.
- הלוגו קיבל "תג" כהה מעוגל כדי שיישב יפה גם על רקע בהיר.

## גרסה 1.3 — מיתוג גובארי (שחור·זהב) + הדגשת "ללא תשלום"
- **פלטה**: הוחלף האקצנט מכחול/אדום ל**זהב מטאלי** (--gold #c9a24e, --gold-2 #e7c877, --gold-grad).
  כפתור ראשי = זהב עם טקסט כהה. אדום נשמר להגדרה בלבד (חיווי הקלטה/התראה), לא בשימוש ויזואלי.
- **מצב תצוגה**: בוטל מתג יום/לילה — מצב כהה יחיד ועקבי (תואם לוגו האריה על שחור). נוקתה פלטת היום מ-CSS ומ-JS.
- **לוגו**: שולב לוגו המותג הרשמי (אריה זהב + "גובארי · מערכות מצלמות רכב") מתוך `logo.png` של הלקוח.
  הרקע הכהה הוסר (חיתוך אלפא לפי בהירות), נוצרו: `logo-govari-mark.png` (הדר), `logo-govari.png` (פוטר), `favicon.png` (ראש האריה).
- **מסר "ללא תשלום"**: מהשנייה הראשונה — רצועת מבצע זהב "ללא תשלום עכשיו", צ'יפ `.pay-free` בהירו/CTA,
  פּיל "0₪ בהזמנה". המחיר (1,090₪) ממשיך להופיע בכל שלבי הטרום-רכישה לשקיפות.
  preorder/checkout/order-success: הוחלף כל ניסוח "תשלום/סליקה" ב"שריון הזמנה — ללא תשלום, החיוב רק אחרי תיאום ואישור".
  נוספו שאלות נפוצות: "מתי משלמים?" ו"מה המחיר מסמן?".

## גרסה 1.2 — לוגו רשמי + מצב יום כברירת מחדל
- מצב יום (בהיר) הוגדר כברירת מחדל בכל העמודים.
- שולבו שני הלוגואים הרשמיים (מצלמה + "גוב ארי", לא לוגו האריה): הוסרו הרקעים (flood-fill ששומר על עדשת המצלמה), נחתכו ונדחסו.
- הדר: גרסת "mark" קומפקטית (אייקון + שם). פוטר: לוקאפ מלא עם סלוגן. מתחלף אוטומטית בהיר/כהה לפי מצב.
- נוסף favicon מאייקון המצלמה. לוגו האריה הישן הוסר מכל העמודים.
- דפי `privacy.html`, `terms.html` ו-`accessibility.html` אוחדו לשפת העיצוב העריכתית הבהירה של האתר, עם תאריך עדכון 11.09.2026 וקישורים נקיים ללא צבעי הזהב/כהה הישנים.
- הוסרו שאריות CSS ישנות של באנר תרומה/Toast שלא בשימוש, כדי לנקות עקבות של הגרסה הקודמת מהאתר.
- בוצע QA חוזר לאחר הניקוי: `/`, `/features.html`, `/app.html`, `/privacy.html`, `/terms.html`, `/accessibility.html` נטענים 200, ללא טענות מוצר אסורות בגוף ה-HTML. בדיקות השרת עברו 13/13.
- עודכן ה-Hero בדסקטופ כך שהכותרת והקופי יושבים כבלוק RTL ממוקד וימני, במקום להתפרס על כל רוחב המסך.
- תוקן כיוון הבלוק של ה-Hero ב-RTL כך שבדסקטופ הוא יושב בצד הימני בפועל.
- בעקבות QA שני של Claude, הוחלפה תמונת `app-mockup.webp` שהציגה סצנת פריצה/לילה במוקאפ ניטרלי חדש `app-mockup-neutral.svg`, שמציג ארבעה ערוצים ומפה בלבד ללא רמיזה להתראת פריצה או יכולת לא מאומתת. הנכס נשמר גם בתיקיית החומרים.
- נוקה ניסוח נוסף בתקנון ובתיאור ה-SVG כדי להימנע גם ממילים שמרמזות על הבטחת מניעת פריצה/גניבה.
- הוסרה הפעלת מצב כהה ישן מדפי `features.html` ו-`app.html`, ועודכן alt של מוקאפ האפליקציה לניסוח ניטרלי.
- בעקבות בדיקת heartbeat התגלה שדפי `index.html` ו-`app.html` חזרו לגרסה ישנה עם תרומה/2K ו-`features.html` נמחק. שלושת הדפים המרכזיים שוחזרו מחדש לגרסה העריכתית הנקייה, ו-`main.js` נוקה ממודלים/תרומה/התנהגויות ישנות.
- הוסרו שאריות `mil-badge` ו-CSS של תרומה מהדפים המשפטיים וממערכת העיצוב הישנה.
- `about.html` הוחלף מעמוד ישן עם תרומה לא מאומתת לעמוד שירות קצר ונקי בשפה העריכתית החדשה.

## 2026-09-11 — ניקוי נכסים ישנים מהאתר הציבורי
- הוסרו מתיקיית `site/assets/images/` נכסים ישנים שלא בשימוש ועלולים להחזיר מסרים לא מאומתים או שפה עיצובית קודמת: `app-mockup.webp`, `live-thief.webp`, `mil-badge.png`, `product-hero.webp`.
- האתר ממשיך להשתמש בנכסים הנקיים בלבד: `app-mockup-neutral.svg`, `camera-studio-v2.webp`, וחלקי המצלמה שנבנו לצורך חוויית הגלילה.

## 2026-09-11 — שיפור ביצועים לחלקי המצלמה בגלילה
- הומרו שלושת נכסי פירוק/חיבור המצלמה מ-PNG ל-WebP ועודכן דף הבית להשתמש בגרסאות הקלות: `camera-main-v2.webp`, `camera-mount-v2.webp`, `camera-rear-v2.webp`.
- הגרסאות החדשות נשמרו גם בתיקיית החומרים תחת `Website-Editorial-2026-09-11/` כדי שכל נכס שנוצר/עובד יישאר מסודר מחוץ לאתר.

## 2026-09-11 — הסרת כפילויות כבדות מהאתר הציבורי
- לאחר שה-WebP אומתו בדפדפן, הוסרו מהתיקייה הציבורית קבצי ה-PNG הכבדים של חלקי המצלמה. גרסאות המקור נשארו שמורות בתיקיית החומרים, והאתר מגיש רק את גרסאות ה-WebP הקלות.
- עודכן `content/content.md` כך שמקור האמת יפנה לגרסאות WebP המשמשות בפועל באתר.

## 2026-09-14 — שדרוג אנימציית פירוק המצלמה
- שודרג סקשן `02 / מבט פנימה` בדף הבית מאנימציה של שלושה חלקים חיצוניים בלבד להמחשת אנטומיה עשירה יותר: עדשות, אזורי חישה, ליבת מערכת, תקשורת 4G/GPS, תושבת ומצלמה אחורית.
- נוספו שכבות וקטוריות וקווי חיבור ב-CSS בלבד כדי לשמור על ביצועים וללא נכסים כבדים נוספים.
- הטקסט מסומן כהמחשה ויזואלית ולא כהוראת פירוק או מפרט יצרן, כדי לא להציג טענות לא מאומתות.

## 2026-09-14 — עמוד אפליקציה ותמונות SEO
- נוצרו שני נכסי אפליקציה חדשים ב-imagegen: `app-live-view-ui.webp` לצפייה בארבעה ערוצים ו־`app-route-ui.webp` למיקום/מסלול. נשמרו גם בתיקיית החומרים תחת `Website-Editorial-2026-09-11/`.
- שודרג `app.html` לעמוד תוכן מלא: מטא־תיאור SEO, Open Graph, JSON-LD, היררכיית H1/H2, סקשן תמונות, פירוט יכולות ו-CTA לליד.
- דף הבית עודכן להשתמש במוקאפ האפליקציה החדש במקום SVG ניטרלי, תוך שמירה על ניסוח "המחשה" וללא טענות לא מאומתות.

## 2026-09-14 — ניקוי מקור התוכן ושדרוג עמוד התכונות
- `content/content.md` נוקה מהנחיות ישנות על תרומה/פופאפ/מבנה שאינו קיים, ועודכן לשקף את האתר הנוכחי ואת גבולות המפרט המאומת.
- `features.html` שודרג לעמוד SEO מלא למצלמת רכב 4 ערוצים, כולל מטא־תיאור, Open Graph, JSON-LD ומפרט מאומת בלבד: 4 ערוצים, 360°, 4G, GPS, אפליקציה, הקלטה בלולאה, 2K בערוץ הראשי, מסך 3 אינץ׳ ותמיכה עד 512GB.

## 2026-09-14 — QA היידר, CTA וטופס ליד
- תוקן ההיידר בדף הבית כך שלא ייחתך או ידחס טקסט ברוחב צר ובמובייל, כולל כפתור הזמנה דו־שורי ברור.
- אוחד מסר ה-CTA המרכזי ל"הזמנה מיידית — ללא תשלום" בהירו, בטופס הליד, בפופאפ ובבר המובייל.
- שופר סקשן הליד: גריד יציב, שדות קריאים, כפתור מלא ורצועת תהליך שאינה חופפת.
- נוקתה שורת CSS יתומה ב-`styles.css` כדי לשמור על parsing תקין.

## 2026-09-15 — תיקון קומפוזיציית הירו
- הופחתה הדומיננטיות של תמונת המצלמה בהירו כדי שתתפקד כרקע מוצר ולא כשכבה מתחרה מעל הסרטון.
- נבנה אזור טקסט נקי יותר בדסקטופ ובמובייל: כותרת, קופי וכפתור CTA יושבים כבלוק ברור בלי חפיפה.
- הוסר תג "עושה מילואים" מתוך ההירו כדי למנוע עומס חזותי; התג נשאר בהיידר כהוכחת אמון עדינה.
- בוצע QA חזותי בצילומי Playwright בדסקטופ ובמובייל לאחר התיקון.

## 2026-09-14 — QA אמינות מפרט וקישורים
- תוקן Title בעמוד המצלמה: הוסר ניסוח "360" מכותרת ה-SEO כדי לשמור על קו המפרט המאומת — "כיסוי רחב במספר זוויות" במקום הבטחה לא מדויקת.
- הורצה בדיקת href/src לכל הדפים המרכזיים ונמצא שכל הנכסים והקישורים המקומיים קיימים.
- הורצו בדיקות שרת ולידים: 13/13 בדיקות עוברות, כולל ולידציית טלפון, דה־דופ, outbox ודרישת PostgreSQL בפרודקשן.

## 2026-09-14 — SEO canonical וסייטמאפ
- נוספו `canonical` ו־`og:url` לדפי הבית, מצלמה, אפליקציה, אודות, פרטיות, תנאים ונגישות כדי לחזק אינדוקס ושיתופים.
- `sitemap.xml` עודכן עם `lastmod` לכל הדפים המרכזיים.
- הורצה בדיקת href/src חוזרת לכל הדפים המרכזיים ונמצא שכל הנכסים המקומיים קיימים.

## 2026-09-14 — תיעוד תפעול לידים
- `server/README.md` עודכן למצב האמיתי של האתר: משפך לידים ללא סליקה וללא תשלום באתר.
- הוסר ערבוב תיעודי עם זרימת צ׳קאאוט/אישור לקוח ישנה כדי למנוע בלבול בהפעלת Resend, אדמין ו־outbox.
- נוספו צעדי הפעלת Resend ובדיקות פרסום שמדגישים שהמסד הוא מקור האמת ושמייל הוא שכבת התראה בלבד.

## 2026-09-14 — נגישות תפריט מובייל והתאמת CTA
- תפריט המובייל קיבל `aria-controls`, יעד `id`, סגירה בלחיצה על קישור וסגירה עם Escape לשיפור שימוש במקלדת וקוראי מסך.
- כפתורי CTA במובייל קיבלו רוחב בטוח כדי לא להיחתך בקצוות המסך.
- הורצו בדיקות JS ולידים וצילום QA למובייל.

## 2026-09-14 — ביצועי הירו במובייל
- נשמר סרטון ההירו, אך נוסף מקור וידאו קל יותר למובייל (`road-drive.mp4`) לפני הסרטון הקולנועי הכבד כדי להפחית משקל טעינה בנייד.
- נוסף `width`/`height` לתמונת המוצר הראשית בעמוד המצלמה לצמצום קפיצות פריסה.

## 2026-09-14 — תיקון CTA קבוע במובייל
- ה־CTA התחתון במובייל מוסתר בהירו ובתחילת סיפור המוצר כדי שלא יכסה כותרות ותוכן חשוב.
- נשמר CTA ברור בהיידר ובהירו, והסרגל התחתון חוזר רק אחרי שהמשתמש מתקדם בעמוד ומוסתר שוב באזור טופס הליד.

## 2026-09-14 — תיקון מובייל לדפי המצלמה והאפליקציה
- תוקנו חיתוכי כותרות וגלישה ויזואלית בדפי `features.html` ו־`app.html` במובייל.
- נוספו guardrails לקונטיינרים, כותרות, קישורי CTA ותגיות יכולת כדי לשמור על קומפוזיציה נקייה במסכי preview ומכשירים צרים.

## 2026-09-14 — שיפור דפי redirect תומכים
- דפי `checkout.html`, `preorder.html` ו־`order-success.html` קיבלו HTML תקין, H1, תיאור SEO וטקסט fallback ברור להזמנה ללא תשלום.
- נשמר redirect לטופס הליד, בלי סליקה ובלי מסר שמרמז על תשלום באתר.

## 2026-09-14 — ניקוי אינדוקס לדפי פעולה
- דפי redirect ו־404 קיבלו `noindex,follow`, תיאורי meta ו־canonical נקי כדי שלא יתחרו בדפי התוכן הראשיים.
- `robots.txt` עודכן לחסום דפי פעולה שאינם מיועדים לאינדוקס, תוך השארת דפי התוכן הראשיים ב־sitemap.

## 2026-09-14 — יישור מדיניות פרטיות לשפת ההזמנה
- עודכן נוסח מטרות השימוש במידע במדיניות הפרטיות ל"תיאום הזמנה ללא תשלום" במקום ניסוח ישן של בדיקת התאמה.
- עודכן תאריך מדיניות הפרטיות ליום השינוי.

## 2026-09-14 — Structured data לדף הבית
- נוסף JSON-LD לדף הבית עבור WebSite, LocalBusiness, Product ו־FAQPage על בסיס מידע מאומת בלבד.
- הסכימה כוללת טלפון, אימייל, עוסק, אזורי שירות ושאלות נפוצות קיימות — בלי מחיר מוצר, דירוגים או ביקורות לא מאומתים.

## 2026-09-14 — שיפור שיתוף חברתי
- `og:image` ו־`twitter:image` בדפי הבית, המצלמה והאפליקציה עודכנו לכתובות מוחלטות כדי לשפר תצוגת שיתוף בוואטסאפ, רשתות חברתיות ומנועי חיפוש.
- תמונת ה־Product structured data בעמוד המצלמה עודכנה גם היא ל־URL מוחלט.

## 2026-09-14 — Cache headers לנכסים סטטיים
- נוספו ב־Vercel cache headers לנכסי `assets/` עם cache ארוך ו־immutable לשיפור טעינות חוזרות של תמונות ווידאו.
- נוספו cache headers קצרים יותר ל־CSS ו־JS כדי לשפר ביצועים בלי להקשות על עדכוני עיצוב וקוד.

## 2026-09-14 — UX ונגישות בטופס הליד
- שדות הליד קיבלו `autocomplete` ישירות ב־HTML, כולל שם, טלפון ועיר, כדי לשפר מילוי אוטומטי גם לפני טעינת JavaScript.
- שדה הטלפון קיבל `dir="ltr"` ב־HTML, ואזור סטטוס הטופס קיבל `role="status"` ו־`aria-live` להודעות נגישות.

## 2026-09-15 — יישור תיאורי חבילות למודל לידים
- תיאורי `package.json` ו־`server/package.json` עודכנו ממונחי הזמנות/סליקה למודל האמיתי: משפך לידים ללא תשלום באתר, שמירה למסד והתראות Resend.
- לא שונה קוד ריצה; זהו ניקוי תחזוקתי כדי למנוע בלבול בפריסה ובתחזוקה עתידית.

## 2026-09-15 — Resend הופעל ונבדק בפרודקשן
- נוסף `RESEND_API_KEY` ל־Vercel Production ובוצעה פריסה מחדש.
- `/api/health` עבר ל־`email: on`.
- נשלח ליד בדיקה חי, נוצר אירוע `ADMIN_EMAIL` והאירוע עבר ל־`done`; ליד הבדיקה נוקה לאחר האימות.

## 2026-09-15 — QA כולל לבקשות עיצוב, יתרונות ומשפטי
- תוקן מבנה ההירו כך שהסרטון הוא רקע חי, והמצלמה מוצגת ככרטיס מוצר נפרד בלי חפיפה עם הכותרת וה-CTA.
- תוקנו אינטראקציות: תפריט מובייל, כפתור השהיית/הפעלת הסרטון והצגת כפתור התפריט רק במקום המתאים.
- שודרג סקשן היתרונות לשמונה יתרונות ברורים: 4 ערוצים, 4G, GPS, אפליקציה בעברית, תיעוד נסיעה/חניה, שירות מקומי, סים לשנה ואחריות.
- נבנה פוטר פרימיום מלא עם CTA, פרטי שירות, פרטי עוסק, יתרונות, ניווט וקישורים משפטיים.
- עודכנו עמודי תנאי השימוש ומדיניות הפרטיות לתאריך 15.09.2026 ואומת שמייל הקשר davidazulay75@gmail.com מופיע בהם.
- הורצו בדיקות JS, בדיקות שרת ולינק-צ'ק לנכסי האתר.

## 2026-09-15 — סבב המשך QA מובייל
- נבדק ההירו מחדש בדסקטופ ובמובייל לאחר הפיכת תמונת המצלמה לכרטיס מוצר נפרד מהסרטון.
- בוצע סבב תיקון נוסף להדר במובייל כדי לשמור על כפתור תפריט גלוי וממורכז לצד CTA הזמנה ללא תשלום.
- אומת מחדש ששרת הייצור מחובר ל-PostgreSQL, שהמייל פעיל, ושאין כשל בבריאות הלידים.

## 2026-09-15 — חיזוק מיתוג בהדר מובייל
- נוסף אלמנט מותג טקסטואלי אמיתי להדר מובייל כדי לשמור על נוכחות מותג גם כשהלוגו המלא קטן מדי למסך צר.
- הוגדרה פריסת מובייל פיזית להדר: תפריט משמאל, CTA במרכז, מותג מימין — ללא חפיפה מכוונת.
- הורצו בדיקות JS ובדיקות לידים לאחר השינוי.

## 2026-09-15 — ניקוי חוזים סופיים להדר מובייל וחיבורי לידים
- נוקה שכבת CSS כפולה בהדר המובייל כדי לשמור על פריסה אחת ברורה: תפריט משמאל, הזמנה במרכז ומותג מימין.
- אומת חיבור חי של האתר בפרודקשן: PostgreSQL פעיל, Resend פעיל, אדמין פעיל, ואין אירועי ליד תקועים בתור.
- נשלחה הגשת QA חיה דרך `/api/leads` ואומתה תשובת הצלחה עם מזהי ליד והגשה.

## 2026-09-15 — browser-verified handoff corrections
Hero now uses transparent camera with separate responsive copy, tablet/desktop navigation repaired, mobile pause/theme controls visible. Fixed sticky assembly overflow blank space and dialog keyboard focus. Customer copy and form disclosure polished. Vercel notification lifecycle and cron/admin reliability fixed; 17 backend tests pass. Remaining unverified launch gates documented in CURSOR-HANDOFF.md.

## 2026-09-15 — complete hero kit and photographic exploded story
Added independent mount/rear-camera hero layers controlled by scroll and reduced-motion support. Replaced CSS electronics with generated reference-based photographic artwork, scroll reveal and mobile pan. Original supplied reservist image now appears in hero/header, WhatsApp uses recognizable SVG and accessible green, policy pages are linked in the mobile navigation. Assets and generation prompt saved in owner's materials folder.

## 2026-09-15 — explicit day/night control
Replaced ambiguous theme icons with a labeled 44px day/night button, retained local preference, resolved system theme explicitly, and adapted original reservist badge contrast for light/dark. Browser checks passed at 390/820/1440. No database schema or lead-flow changes required.

## 2026-09-15 — whole-site themes and stale asset recovery
Added shared semantic theme stylesheet to all HTML pages: header, hero/video overlay, sections, forms, footer, dialogs, secondary pages and electronics stage. Added versioned CSS/JS URLs and changed CSS/JS cache to immediate revalidation to prevent new markup using stale layout code for an hour. Original badge receives theme-specific blending. Live screenshot complaint is consistent with stale pre-kit stylesheet; origin CSS itself matched current repo.

## 2026-09-15 — spatial product teardown and benefit icons
Reworked the scroll story so six conceptual components begin at the camera and separate along individual vectors: optics, image sensor, image processing, GPS, cellular 4G and enclosure. Added visible connector lines and component captions, including a reduced-motion final state. Replaced the eight benefit sequence numbers with purpose-built SVG icons. Updated the supplied reservist mark to a transparent asset and muted the red mount accent in the hero.

## 2026-09-16 — Conversion clarity
- Published owner-approved 899–1,499 ILS range, qualified by exact product and specifications; optional annual SIM separately priced.
- Changed homepage CTA to request an offer, moved pricing near opening, removed repeated app/trust sections.
- Added direct two-field popup form using existing reliable handler; delayed interruption and suppressed it during form interaction.
- Fixed light-theme form labels; clarified app/installation FAQ and optional WhatsApp contact.
- Missing owner evidence remains: app-store identity and actual screen recording, installation/customer testimonials, warranty details, response hours, donation reporting. No claims invented.

## 2026-09-16 — Popup feature badges
- Replaced repeated feature paragraph with four readable, theme-aware badges in a two-column grid. Separated price, benefits and form and shortened introductory copy.

## 2026-09-16 — Footer CTA and compact impact notice
- Fixed footer button sizing, centered text and dark contrast in both themes. Reduced social notice width and removed duplicate product badges.

## 2026-09-16 — Follow-up popup usability
- Reduced offer dialog spacing and repeated copy while retaining 46px inputs and 44px close control. Prevented donation notice from opening while a form is being completed or the main lead section is visible.

## 2026-09-16 — Unified design and interaction repairs
- Shared branded navigation with working mobile menu and theme controls on all secondary pages. Rounded feature tags, condensed secondary-page spacing, bounded app illustrations.
- Fixed RTL price ranges and stale price disclaimer/about CTA. Removed internal accessibility drafting note without asserting compliance.
- Modal now preserves and locks background position. Video retains mute/unmute control and no longer blocks scrolling.

## 2026-09-17 — App story layout
- Replaced oversized mobile app images with bounded contain-fit media; reduced panel spacing and title scale, removed sticky panel overlap, and applied semantic day/night colors. Added narrow-header gutters.

## 2026-09-17 — Email verification and independent backup preparation
- Submitted labeled owner-authorized production test; verified persisted submission, completed email event and Resend opened status.
- Added authenticated Google Sheets receiver and exact per-submission receipt validation, with duplicate protection and formula neutralization. 18 tests pass.
- External backup remains inactive pending owner destination access and production configuration; historical backfill and scheduling must be verified after activation.

## 2026-09-20 — Mobile conversion route and GA4 measurement
- Moved the primary two-field lead form directly after the offer, reducing its mobile position from roughly 11,800px to roughly 1,250px.
- Added a mobile-specific layout pass for the hero, header, CTA, offer cards, form, product media, FAQ and footer; verified 320px, 390px and 430px widths in light and dark themes without horizontal overflow.
- Disabled the automatic lead modal on touch-sized viewports so it does not interrupt the primary inline form; desktop exit/scroll behavior remains available.
- Replaced legal links in the mobile menu with direct price, FAQ and WhatsApp routes; legal pages remain available in the footer.
- Added GA4 funnel measurement for `G-NGEPF775BK`, including CTA clicks, form view/start/submit and a confirmed lead event only after a valid server receipt. No name or phone value is sent to analytics.
- Aligned the browser-side content configuration with the approved price range and lead wording.

## 2026-09-20 — Google Analytics 4 funnel measurement
- Added the Google tag (gtag.js, ID G-NGEPF775BK) via `js/config.js` (`ga4Id`) and `js/track.js`, loaded on every real page (including 404 and the redirect stubs). Single load per page, guarded against double-init.
- Reused the existing `govariTrack` funnel pipeline (already firing for the real lead flow) and mapped it to GA4 events instead of inventing new ones: `lead_form_view`/`lead_modal_view` → `start_process`, `lead_form_started` → `form_start`, `lead_submit_attempt` → `form_submit`, `lead_submit_success` → `lead` + `generate_lead` + `funnel_complete`. Every mapped event carries `step_name`/`funnel_step` and, when present, the session's `utm_source/medium/campaign/content/term` (already captured/persisted by `track.js`).
- Added a new `cta_click` event via one delegated, href-based click listener in `track.js` (tel:/wa.me/#lead links) — works across every page template with no HTML changes.
- Did not add `begin_checkout`/`purchase`/`sign_up`: the site has no real checkout or account flow (`checkout.html`/`preorder.html`/`order-success.html` are redirect stubs to the lead form; price is intentionally not sold online). Adding those would be inventing steps that don't occur.
- Added a `?ga_debug=1` switch (persists for the session) that turns on GA4 DebugView + console logging of every tracked event, for verifying real delivery.

## 2026-09-21 — Trust strip at the primary lead CTA
- Added a compact `.lead-assurance` strip inside the home lead form (`#lead`), directly under the "קבלו הצעה לרכב שלכם" button: 12-month warranty, no payment or credit-card details on the site, and free installation in the center/Jerusalem subject to coordination. All three are already-approved facts from `content/content.md` and were already published on the page (offer list, FAQ, FAQ schema) — nothing new was claimed.
- Removed the now-duplicated "אין תשלום באתר" sentence from the form note, since the strip states it one line above with more prominence. The consent and privacy wording is unchanged.
- Styling added in `site/css/editorial.css` (hairline rule, gold-tinted 17px stroke icons matching the existing benefit icon set, theme variables for light/dark) and a small size pass in `site/css/mobile-conversion.css`. Note: on mobile `.price-summary` and `.lead-promise` are hidden in the lead grid, so this strip is now the only trust anchor visible next to the mobile CTA.

## 2026-09-21 — Client-side lead validation failures are now measured
- Added a `lead_validation_error` funnel event in `site/js/lead-form.js`, fired only when a submit attempt is rejected in the browser before reaching the server. Parameters: `form` (home/popup), `reason` (`name_missing` / `name_too_short` / `phone_missing` / `phone_invalid` / `honeypot` / `fields_missing` / `cooldown`) and `field` (`full_name` / `phone` / honeypot input name / `form`). No name or phone value is ever sent.
- Mapped it in `site/js/track.js` through the existing `govariTrack` pipeline (`GA_EVENT_MAP` + `STEP_META`) to the GA4 event `form_validation_error` with `step_name=form_validation_error`, `funnel_step=2` — the drop-off between `form_start` and `form_submit`. No parallel measurement mechanism was introduced.
- Measurement only: wording, validation rules, error messages, focus behaviour and the submit flow are unchanged. Verified in a real browser against the local server — valid submission still returns 200 with a receipt and shows the success box, and invalid input still shows the same error message while emitting the new event.

## 2026-09-24 — Funnel audit validation and modal collision fix
- Prevent automatic lead and impact overlays from opening while the analytics consent choice is visible; this avoids covering form actions.
- Measure browser-native required-field failures without changing validation or sending field values to analytics.
- Added an isolated emergency-delivery regression test: Resend acceptance with database failure must still return 503, no synthetic lead IDs, and stable retry keys/payloads. No real email sent.
- Added a localhost-only browser regression script covering consent, a single GA initialization/conversion, same-key retries, malformed receipts, pending-draft recovery, offline editing and native validation.
- Verified 23 server tests and browser simulations; seven pages at 320/390/430/1440 had no horizontal overflow or page JS errors. Modal suppression while consent is pending and normal opening after choice both passed.
- Updated the full-funnel audit with explicit evidence limits, six customer journeys, outstanding independent backup/monitoring/Meta work, and correction that the donation pledge is already published. Earlier reliability/consent/mobile changes are recorded in commits f81aa70 and 616b110.
- Production inbox delivery, real iPhone/in-app-browser behavior, analytics account receipt and independent restore remain owner verification items. No database migration or credentials changed.

## 2026-09-27 — Connected Car Build homepage
- Rebuilt the homepage around immediate product/value/offer/CTA visibility, light blue-gray surfaces, amber actions and a full dark theme; retained the original logo and transparent reservist badge.
- Added locally hosted GSAP 3.15 ScrollTrigger: six desktop phases for conceptual electronics, front/rear installation, four views, phone, route and offer. Short viewports, mobile, reduced-motion and unavailable animation libraries receive readable static sections.
- Kept the existing lead form, consent, attribution and durable receipt/retry pipeline; moved the proposal form immediately after the story. No database or credential changes.
- Kept the road video with an operable pause/play control and the owner's demonstration video with native controls. No scroll lock or forced audio.
- Adopted the owner's explicit Sukkot offer: 1,099 ILS for camera + home installation, with optional annual SIM at 199 ILS, across homepage, feature/app copy, configuration and terms. Clarification about the older price range in the creative brief remains unanswered; no invented expiry/discount baseline.
- Added clearly labeled, code-drawn car/coverage and four-view illustrations; retained honest conceptual labels for internal components and app imagery. Local Heebo font files avoid blocking third-party font requests.
- Fixed an RTL overflow caused by an offscreen honeypot, removed a duplicate camera in the installation scene, and replaced the misleading four-channel still with a labeled four-panel illustration.
- Validation: 23 server tests passed. Local browser tests passed at 320/390/430/768/1024/1440px in light/dark, all six desktop phases, mobile navigation, pause/play, FAQ and form visibility. Reduced-motion and blocked-GSAP fallbacks passed. Lead simulations passed consent gating, one GA initialization, transient failures with stable idempotency, receipt validation, offline recovery and one confirmed conversion. No real lead/email was sent for these tests. Physical iPhone and inbox delivery were not tested in this release.


## 2026-09-30 — Live lead verification, plain Hebrew and unobtrusive measurement
- Sent two clearly labeled owner-authorized production test submissions (direct API and actual mobile-width browser form). Both received durable receipts; read-only PostgreSQL checks confirmed both submissions and their ADMIN_EMAIL events completed. Provider acceptance is verified; inbox placement and the owner's original failed attempt are not independently verified.
- Reproduced a client-side failure: an autofilled legacy company honeypot prevented any API request and showed a generic failure. Removed the homepage trap and the browser-only rejection; the payload remains an explicit allowlist and server validation/rate limiting remain. Added eastern Arabic/Persian digit normalization to match server phone handling.
- Reproduced a backend error in isolation: a throwing notification lifecycle registration returned 503 after a committed lead. Isolated notification scheduling so it cannot change a durable acknowledgement or trigger an emergency duplicate. Added a regression test. No schema or credential changes.
- Replaced abstract homepage, story, video and footer slogans with direct descriptions and retained approved product/price/service facts.
- Removed the interrupting analytics banner. Google defaults to denied storage/advertising consent with cookieless measurement; stored opt-outs remain off. Optional settings live in the privacy page. Advertising remains denied and Meta has a separate explicit gate. Contact data and raw page queries are excluded from measurement events.
- Validation: 32 automated server/measurement tests passed; browser recovery simulations passed same-key retries, autofilled legacy fields, phone normalization, malformed receipt rejection, offline edited drafts and a single confirmed conversion. Homepage passed six widths and both themes, six scroll phases, video controls, menus, FAQ, reduced motion and blocked animation fallback. Six secondary pages passed 320/390/1440 width checks; static HTML asset/link and duplicate-ID checks passed. Physical iPhone, analytics account reports and inbox placement remain unverified.

## 2026-09-30 — Previous homepage restored and hero media repaired
- Restored the owner-preferred Connected Car homepage design, including the transparent “עושה מילואים” brand mark, original light/dark palette, product assembly story and original product imagery.
- Reconnected the hero to the valid original aerial-road film (`highway-editorial.mp4`). The temporary `road-drive.mp4` file was invalid and could not be decoded, which is why the film did not play.
- Expanded that film across the full hero width with a readable contrast layer; product, phone, offer and actions remain visible above it on desktop and mobile.
- Rewrote visible channel counts as natural Hebrew and isolated `4G`/`GPS` tokens so mixed Hebrew, Latin letters and numbers retain the correct reading order.
- Replaced numbered/English-facing step labels in the homepage, product page and app page with natural Hebrew while retaining standard product terms such as `4G` and `GPS` in isolated left-to-right spans.
- No lead schema, database, price, warranty or product claim was changed in this restoration.


## 2026-10-01 — בדיקת QA חוזרת: נגישות ותצוגת ההירו
- בדיקה חיה לקריאה בלבד: האתר והסקריפטים מחזירים 200, PostgreSQL מדווח תקין, ואין התראות בתור/בתהליך/בכשל. גיבוי הגיליון החיצוני עדיין כבוי, כפי שתועד קודם. לא נשלחו לידים או הודעות בדיקה.
- שוחזר כשל נגישות: הפעלת העדפת תנועה מופחתת בזמן ביקור לא עצרה את שינוי גודל המצלמה בגלילה. המצלמה מתאפסת מיד וכעת מכבדת גם שינוי העדפה ללא רענון.
- כיתובי ההמחשה מעל הסרטון ירשו צבע כהה במצב יום. נקבע להם צבע בהיר קבוע שמתאים לרקע הסרטון הכהה בשני המצבים.
- אומת בדפדפן: שינוי העדפת תנועה בזמן אמת, גלילה לאחר השינוי, כיתובים בשני המצבים ורוחבים 320/390/768/1440 ללא גלילה אופקית או שגיאות JS. 32 בדיקות שרת ומדידה עברו. בריאות המסד אינה הוכחה לכתיבת ליד או להגעה לתיבת המייל בסבב זה.

## 2026-10-01 — כל תכונות הדגם האחרון במקום אחד
- רוכזו כל 12 התכונות שאישר דוד באזור ״מה כולל הדגם האחרון?״ בדף הבית, עם אייקון ותיאור קצר לכל תכונה. נשמר מיקום הטופס לפני האזור כדי לא להאריך את הדרך לפנייה.
- הושלם מפרט עמוד המצלמה: חיבור באמצעות SIM, צילום בחניה בנפרד מהקלטת לולאה, אחריות לשנה, תמיכה 24/7 והתקנה בבית הלקוח. נוספו תגיות התראות והקלטות בעמוד האפליקציה.
- מונחי 4G, GPS, SIM ו־24/7 מבודדים בכיווניות מתאימה לעברית. נשמרו המחיר, אזורי השירות ותלויות החשמל/הסים/הקליטה.
- אומת בדפדפן מקומי: שלושת העמודים ברוחבים 320/390/768/1440 ובשני מצבי צבע, ללא גלילה אופקית או שגיאות JS; 12 כרטיסים ללא חיתוך תוכן. צילום מסך מובייל נבדק חזותית. git diff --check עבר. זהו שינוי תוכן בלבד; לא נשלחו לידים ולא נדרשה מיגרציית מסד.
