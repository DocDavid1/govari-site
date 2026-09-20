/* ============================================================
   גוב ארי — מקור אמת אחד לעובדות העסק (צד לקוח).
   כל טלפון / וואטסאפ / מחיר / קופי חוזר — מכאן בלבד.
   שרת: server/src/config.js (משתני סביבה).
   ============================================================ */
(function () {
  'use strict';

  var GOVARI = {
    brand: 'גוב ארי מערכות',

    // --- יצירת קשר (לאישור סופי מול דוד לפני קמפיין) ---
    phone: '053-6813013',
    phoneE164: '+972536813013',
    whatsapp: '972536813013',
    email: 'davidazulay75@gmail.com',

    // --- מחיר מאושר --- הטווח תלוי במוצר המדויק ובמפרט הטכני.
    price: null,
    priceText: '899–1,499 ₪',
    priceNote: 'בהתאם למוצר המדויק ולמפרט הטכני',

    // --- מדיניות ---
    noPaymentLine: 'אין תשלום באתר',
    installationPolicy: 'התקנה חינם באזור המרכז וירושלים, בכפוף לתיאום ולהתאמה לרכב',

    // --- Meta Pixel (הדבק כאן את מזהה הפיקסל; ריק = הפיקסל כבוי, האתר עובד רגיל) ---
    metaPixelId: '',

    // --- Google Analytics 4 (Measurement ID; ריק = GA4 כבוי, האתר עובד רגיל) ---
    ga4Id: 'G-NGEPF775BK',

    // --- נקודת קצה ללידים ---
    leadEndpoint: '/api/leads',

    // --- קופי CTA אחיד ---
    cta: {
      primary: 'קבלת הצעה לרכב שלכם',
      primaryShort: 'קבלת הצעה',
      button: 'קבלו הצעה לרכב שלכם',
      reassure: 'ללא עלות וללא התחייבות · חוזרים אליכם עם התאמה ומחיר',
      whatsapp: 'שאלה מהירה בוואטסאפ',
    },
  };

  GOVARI.waHref = function (text) {
    var base = 'https://wa.me/' + GOVARI.whatsapp;
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  };
  GOVARI.telHref = 'tel:' + GOVARI.phoneE164;

  window.GOVARI = GOVARI;
})();
