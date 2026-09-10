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

    // --- מחיר --- לא מוצג באתר. מחיר ותנאים נמסרים בשיחה. אין להזין ערך עד אישור מפורש של דוד.
    price: null,
    priceText: '',
    priceNote: '',

    // --- מדיניות ---
    noPaymentLine: 'אין תשלום באתר',
    // מדיניות התקנה/אספקה — לא מנוסחת באתר עד אישור פרטים מדויקים מדוד.
    installationPolicy: '',

    // --- Meta Pixel (הדבק כאן את מזהה הפיקסל; ריק = הפיקסל כבוי, האתר עובד רגיל) ---
    metaPixelId: '',

    // --- נקודת קצה ללידים ---
    leadEndpoint: '/api/leads',

    // --- קופי CTA אחיד ---
    cta: {
      primary: 'בקשת הזמנה ללא תשלום',
      primaryShort: 'בקשת הזמנה',
      button: 'בקשת הזמנה ללא תשלום',
      reassure: 'אין תשלום באתר · שם וטלפון בלבד',
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
