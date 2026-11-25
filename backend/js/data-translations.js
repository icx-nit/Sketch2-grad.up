/* ==========================================================================
   data-translations.js: ข้อมูลตัวอย่างหน้า "จัดการคำแปลภาษาอังกฤษ"
   ดึงข้อความไทย/อังกฤษจริงจาก GUI18n (js/i18n.js) ส่วนสถานะ "ตรวจแล้ว" เป็นข้อมูลจำลอง
   ========================================================================== */
(function () {
  "use strict";
  var KEYS = ["page.title", "nav.label", "nav.home", "nav.announcements", "nav.news", "action.search", "action.language", "action.theme", "action.menu", "section.forms", "section.manual", "section.grant", "section.exams"];
  var base = window.GUBD.getData;
  window.GUBD.getData = function (key) {
    if (key !== "translations") { return base(key); }
    var I = window.GUI18n;
    if (!I) { return []; }
    return KEYS.map(function (k, i) {
      return { id: "t" + i, key: k, th: I.translate("th", k), en: I.translate("en", k), status: i % 4 === 0 ? "reviewed" : "pending", visible: true };
    }).filter(function (r) { return r.th !== r.key; });
  };
})();
