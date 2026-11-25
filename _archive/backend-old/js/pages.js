/* ==========================================================================
   pages.js: ตั้งค่าหน้าจัดการเนื้อหาทั้ง 6 หน้า (ต้นแบบ UI)
   อ่าน <body data-page> แล้วเรียก crud.mount() ด้วยค่าตั้งต้นของหน้านั้น
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;
  var O = window.GUBD.options;

  function titleCell(main, sub) {
    return h("span", { class: "bd-cell-text" }, [
      h("span", { class: "bd-cell-title", text: main || "-" }),
      sub ? h("span", { class: "bd-cell-sub", text: sub }) : null
    ]);
  }
  function tag(text) { return h("span", { class: "bd-pill bd-pill--tag", text: text || "-" }); }
  function url(text) { return h("span", { class: "bd-cell-url", text: text || "-" }); }
  function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  function byDateAsc(a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; }

  var CONFIGS = {
    news: {
      key: "news", title: "ข่าวสาร", singular: "ข่าว",
      desc: "จัดการข่าวสารที่แสดงในส่วนข่าวสารล่าสุดของหน้าเว็บไซต์ (ข้อมูลตัวอย่าง)",
      searchKeys: ["titleTh", "titleEn", "chip"],
      hideable: true,
      sort: byDateDesc,
      filters: [{ key: "chip", label: "กรองตามประเภท", all: "ทุกประเภท", options: function () { return O.newsChips; } }],
      columns: [
        { label: "หัวข้อข่าว", render: function (r) { return titleCell(r.titleTh, r.titleEn); } },
        { label: "ประเภท", render: function (r) { return tag(r.chip); } },
        { label: "วันที่", render: function (r) { return ui.fmtDate(r.date); } },
        { label: "ป้าย NEW", render: function (r) { return r.isNew ? h("span", { class: "bd-pill bd-pill--new", text: "ใหม่" }) : h("span", { class: "bd-muted", text: "-" }); } }
      ],
      defaults: function () { return { chip: "ทั่วไป", date: ui.todayISO(), isNew: false, visible: true, descTh: "", descEn: "", href: "" }; },
      fields: [
        { name: "titleTh", label: "หัวข้อ (ภาษาไทย)", required: true, full: true },
        { name: "titleEn", label: "หัวข้อ (English)", full: true },
        { name: "descTh", label: "คำอธิบายสั้น (ไทย)", type: "textarea", full: true },
        { name: "descEn", label: "คำอธิบายสั้น (English)", type: "textarea", full: true },
        { name: "chip", label: "ประเภท", type: "select", required: true, options: function () { return O.newsChips; } },
        { name: "date", label: "วันที่เผยแพร่", type: "date", required: true },
        { name: "href", label: "ลิงก์อ่านเพิ่มเติม", type: "url", placeholder: "https://", hint: "ต้องขึ้นต้นด้วย http:// หรือ https://", full: true },
        { name: "isNew", label: "ติดป้าย NEW", type: "checkbox" },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ]
    },

    popups: {
      key: "popups", title: "ประกาศป๊อปอัป", singular: "ป๊อปอัป",
      desc: "ป๊อปอัปที่แสดงเมื่อเปิดหน้าแรก (สูงสุด 3 ใบ เรียงตามลำดับ) ข้อมูลตัวอย่าง",
      searchKeys: ["titleTh", "titleEn", "type"],
      hideable: true,
      sort: function (a, b) { return a.order - b.order; },
      filters: [{ key: "type", label: "กรองตามประเภท", all: "ทุกประเภท", options: function () { return O.popupTypes; } }],
      columns: [
        { label: "หัวข้อประกาศ", render: function (r) { return titleCell(r.titleTh, r.titleEn); } },
        { label: "ประเภท", render: function (r) { return tag(r.type); } },
        { label: "วันที่", render: function (r) { return ui.fmtDate(r.date); } },
        { label: "ลำดับ", num: true, render: function (r) { return String(r.order); } }
      ],
      defaults: function () { return { type: "ประกาศสอบ", date: ui.todayISO(), order: 1, href: "", visible: true }; },
      fields: [
        { name: "titleTh", label: "หัวข้อ (ภาษาไทย)", required: true, full: true },
        { name: "titleEn", label: "หัวข้อ (English)", full: true },
        { name: "type", label: "ประเภท", type: "select", required: true, options: function () { return O.popupTypes; } },
        { name: "date", label: "วันที่", type: "date", required: true },
        { name: "order", label: "ลำดับการแสดง (1–3)", type: "number", required: true, hint: "ลำดับที่ซ้ำกันจะแสดงไม่ถูกต้อง" },
        { name: "href", label: "ลิงก์ (ถ้ามี)", type: "url", placeholder: "https://", hint: "ต้องขึ้นต้นด้วย http:// หรือ https://", full: true },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ],
      check: function (v) {
        var n = Number(v.order);
        if (v.order !== "" && (n < 1 || n > 3 || Math.floor(n) !== n)) { return { order: "ลำดับต้องเป็นจำนวนเต็ม 1 ถึง 3" }; }
        return {};
      }
    },

    documents: {
      key: "documents", title: "เอกสารและคู่มือ", singular: "เอกสาร",
      desc: "รายการเอกสาร คู่มือ และแบบฟอร์มที่แสดงในหน้าเว็บไซต์ (ต้นแบบ: ยังไม่อัปโหลดไฟล์จริง)",
      searchKeys: ["titleTh", "titleEn", "category"],
      hideable: true,
      sort: byDateDesc,
      filters: [
        { key: "category", label: "กรองตามหมวดหมู่", all: "ทุกหมวดหมู่", options: function () { return O.docCategories(); } },
        { key: "ext", label: "กรองตามชนิดไฟล์", all: "ทุกชนิดไฟล์", options: function () { return O.docExt; } }
      ],
      columns: [
        { label: "ชื่อเอกสาร", render: function (r) { return titleCell(r.titleTh, r.titleEn); } },
        { label: "หมวดหมู่", render: function (r) { return tag(r.category); } },
        { label: "ชนิดไฟล์", render: function (r) { return h("span", { class: "bd-cell-url", text: String(r.ext || "-").toUpperCase() }); } },
        { label: "วันที่", render: function (r) { return ui.fmtDate(r.date); } }
      ],
      defaults: function () { return { category: O.docCategories()[0], ext: "pdf", date: ui.todayISO(), visible: true }; },
      fields: [
        { name: "titleTh", label: "ชื่อเอกสาร (ภาษาไทย)", required: true, full: true },
        { name: "titleEn", label: "ชื่อเอกสาร (English)", full: true },
        { name: "category", label: "หมวดหมู่", type: "select", required: true, options: function () { return O.docCategories(); } },
        { name: "ext", label: "ชนิดไฟล์", type: "select", required: true, options: function () { return O.docExt; }, hint: "ต้นแบบนี้ยังไม่อัปโหลดไฟล์จริง" },
        { name: "date", label: "วันที่ประกาศ", type: "date", required: true },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ]
    },

    links: {
      key: "links", title: "ลิงก์และหน่วยงาน", singular: "ลิงก์",
      desc: "ลิงก์ไปยังหน่วยงานภายนอกและระบบอื่น ๆ ที่แสดงในหน้าเว็บไซต์",
      searchKeys: ["nameTh", "nameEn", "href", "group"],
      hideable: true,
      titleOf: function (r) { return r.nameTh; },
      filters: [{ key: "group", label: "กรองตามกลุ่ม", all: "ทุกกลุ่ม", options: function () { return O.linkGroups; } }],
      columns: [
        { label: "ชื่อลิงก์", render: function (r) { return titleCell(r.nameTh, r.nameEn); } },
        { label: "กลุ่ม", render: function (r) { return tag(r.group); } },
        { label: "ที่อยู่ลิงก์", render: function (r) { return url(r.href); } }
      ],
      defaults: function () { return { group: "หน่วยงานอื่น", href: "https://", visible: true }; },
      fields: [
        { name: "nameTh", label: "ชื่อ (ภาษาไทย)", required: true, full: true },
        { name: "nameEn", label: "ชื่อ (English)", full: true },
        { name: "group", label: "กลุ่ม", type: "select", required: true, options: function () { return O.linkGroups; } },
        { name: "href", label: "ที่อยู่ลิงก์", type: "url", required: true, placeholder: "https://", hint: "ต้องขึ้นต้นด้วย http:// หรือ https://", full: true },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ]
    },

    categories: {
      key: "categories", title: "หมวดหมู่เอกสาร", singular: "หมวดหมู่",
      desc: "หมวดหมู่ของเอกสาร และหน้าที่หมวดนั้นจะไปแสดงผล",
      searchKeys: ["nameTh", "nameEn", "page"],
      hideable: true,
      titleOf: function (r) { return r.nameTh; },
      filters: [{ key: "page", label: "กรองตามหน้าที่แสดงผล", all: "ทุกหน้า", options: function () { return O.catPages; } }],
      columns: [
        { label: "ชื่อหมวดหมู่", render: function (r) { return titleCell(r.nameTh, r.nameEn); } },
        { label: "หน้าที่แสดงผล", render: function (r) { return tag(r.page); } }
      ],
      defaults: function () { return { page: O.catPages[0], visible: true }; },
      fields: [
        { name: "nameTh", label: "ชื่อหมวดหมู่ (ภาษาไทย)", required: true, full: true },
        { name: "nameEn", label: "ชื่อหมวดหมู่ (English)", full: true },
        { name: "page", label: "หน้าที่แสดงผล", type: "select", required: true, options: function () { return O.catPages; } },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ]
    },

    calendar: {
      key: "calendar", title: "ปฏิทินกิจกรรม", singular: "กิจกรรม",
      desc: "กิจกรรมและกำหนดการในปฏิทินการศึกษา (ข้อมูลตัวอย่างคัดจากปฏิทินเดิมของเว็บไซต์)",
      searchKeys: ["titleTh", "titleEn", "label"],
      hideable: true,
      sort: byDateAsc,
      filters: [{ key: "label", label: "กรองตามประเภท", all: "ทุกประเภท", options: function () { return O.calLabels; } }],
      columns: [
        { label: "กิจกรรม", render: function (r) { return titleCell(r.titleTh, r.titleEn); } },
        { label: "ช่วงเวลา", render: function (r) {
          var range = ui.fmtDate(r.date);
          if (r.dateEnd && r.dateEnd !== r.date) { range += " – " + ui.fmtDate(r.dateEnd); }
          return range;
        } },
        { label: "ประเภท", render: function (r) { return tag(r.label); } }
      ],
      defaults: function () { return { label: "อื่น ๆ", date: ui.todayISO(), dateEnd: "", href: "", visible: true }; },
      fields: [
        { name: "titleTh", label: "ชื่อกิจกรรม (ภาษาไทย)", required: true, full: true },
        { name: "titleEn", label: "ชื่อกิจกรรม (English)", full: true },
        { name: "label", label: "ประเภท", type: "select", required: true, options: function () { return O.calLabels; } },
        { name: "date", label: "วันที่เริ่ม", type: "date", required: true },
        { name: "dateEnd", label: "วันที่สิ้นสุด", type: "date", hint: "เว้นว่างได้หากเป็นกิจกรรมวันเดียว" },
        { name: "href", label: "ลิงก์รายละเอียด (ถ้ามี)", type: "url", placeholder: "https://", hint: "ต้องขึ้นต้นด้วย http:// หรือ https://", full: true },
        { name: "visible", label: "แสดงบนเว็บไซต์", type: "checkbox" }
      ],
      check: function (v) {
        if (v.date && v.dateEnd && v.dateEnd < v.date) { return { dateEnd: "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม" }; }
        return {};
      }
    }
  };

  var page = document.body.getAttribute("data-page");
  if (CONFIGS[page] && window.GUBD.crud) { window.GUBD.crud.mount(CONFIGS[page]); }
  window.GUBD.pages = CONFIGS;
})();
