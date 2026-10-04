# מקורות מדיה חיצוניים

## וידאו כביש לדף הבית

- שם באתר המקור: Aerial shot to a big highway in a city
- מקור: Mixkit
- קישור: https://mixkit.co/free-stock-video/aerial-shot-to-a-big-highway-in-a-city-49798/
- קובץ באתר: `site/assets/videos/highway-editorial.mp4`
- פוסטר באתר: `site/assets/images/highway-editorial.jpg`
- שימוש באתר: רקע אווירה של כביש בדף הבית. אין להציג אותו כצילום שהופק מהמצלמה.

## נכסי מוצר שנוצרו

הנכסים `camera-studio-v2`, `camera-main-v2`, `camera-mount-v2`, `camera-rear-v2` נוצרו על בסיס צילומי המצלמה שסופקו על ידי דוד. הם משמשים כהדמיות מוצר באתר, ולכן מופיע לידם ניסוח שקוף שמדובר בהדמיה המבוססת על צילומי המוצר.

## איורים ריאליסטיים שנוצרו ב-AI (2026-10-04)

- קבצים: `site/assets/product/generated/install-car-top.webp` (מבט על רכב, הדמיה למיקומי ההתקנה) ו-`four-channel-views.webp` (ארבע זוויות צילום: קדימה, אחורה, פנים הרכב, זווית נוספת — נוצרו ב-gpt-image-2 והורכבו לרשת 2×2).
- נוצרו באמצעות OpenAI Images API (gpt-image-1.5) לבקשת דוד. אינם צילומים של המוצר או של חלקיו הפנימיים.
- ניסוח באתר נשאר: ״מיקומי התקנה להמחשה״, ״פריסת הערוצים להמחשה״ ו״המחשת רכיבים עקרונית; אינה תרשים פירוק או מפרט פנימי של היצרן״. ״מארז״ מוצג מתמונת המוצר (`camera-main-v2.webp`).
- מפתח ה-API שמור מקומית ב-`.env.images` (מחוץ ל-git) ואינו נטען באתר או בשרת.
- `site/assets/images/camera-studio-cut.webp`: הסרת רקע מ-`camera-studio-v2` באמצעות OpenAI Images edits (input_fidelity=high, רקע שקוף). המוצר עצמו לא שונה; משמש בדף המצלמה ובשלב ההצעה במובייל עם אנימציית ריחוף.
