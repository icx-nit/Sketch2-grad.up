/* ==========================================================================
   pages.js: ตั้งค่าหน้าจัดการเนื้อหาทั้ง 6 หน้า (ต้นแบบ UI)
   อ่าน <body data-page> แล้วเรียก crud.mount() ด้วยค่าของหน้านั้น
   CONFIGS[page] เป็นฟังก์ชันเพื่อให้ข้อความสร้างใหม่ตามภาษาทุกครั้งที่วาด
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;
  var I = window.GUBD.i18n;
  var O = window.GUBD.options;
  var tx = window.GUBD.crud.tx;

  function pair(th, en) { return { th: th, en: en }; }
  function titleCell(main, sub) {
    return h("span", { class: "bd-cell-text" }, [
      h("span", { class: "bd-cell-title", text: main || "-" }),
      sub ? h("span", { class: "bd-cell-sub", text: sub }) : null
    ]);
  }
  /* ชื่อหลักตามภาษาปัจจุบัน ชื่ออีกภาษาเป็นบรรทัดรอง */
  function bilingual(th, en) {
    var en_ = I.lang() === "en";
    return en_ && en ? titleCell(en, th) : titleCell(th, en);
  }
  function tag(value) { return h("span", { class: "bd-pill bd-pill--tag", text: I.label(value) || "-" }); }
  function mono(text) { return h("span", { class: "bd-cell-url", text: text || "-" }); }
  function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  function byDateAsc(a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; }
  function todayISO() { return ui.todayISO(); }
  function isRecent(iso) {
    var p = ui.parseISO(iso); if (!p) { return false; }
    var diff = (new Date() - new Date(p.y, p.m - 1, p.d)) / 86400000;
    return diff >= 0 && diff <= 14;
  }
  function dash() { return h("span", { class: "bd-muted", text: "-" }); }

  var CONFIGS = {
    news: function () { return {
      key: "news", noun: pair("ข่าว", "news"),
      title: pair("ข่าวสาร", "News"),
      desc: pair("เพิ่ม/แก้ไข/ซ่อน/ลบข่าว กำหนดข่าวเด่น แนบรูปและลิงก์ ข่าวใหม่แสดงริบบิ้น \"ใหม่/NEW\" อัตโนมัติ (ข้อมูลตัวอย่าง)", "Add, edit, hide or delete news, set featured news, attach image and link. Recent news gets the NEW ribbon automatically (sample data)"),
      note: pair("กติกาตัวอย่าง: ข่าวที่เผยแพร่ภายใน 14 วันจะแสดงริบบิ้น ใหม่/NEW เอง (ค่า 14 วันเป็นข้อสมมติของต้นแบบ ปรับได้ภายหลัง)", "Sample rule: news published within 14 days gets the NEW ribbon automatically (14 days is a prototype assumption)"),
      searchPlaceholder: pair("ค้นหาข่าว...", "Search news..."), searchLabel: pair("ค้นหาข่าว", "Search news"),
      searchKeys: ["titleTh", "titleEn", "chip"], hideable: true, sort: byDateDesc,
      filters: [{ key: "chip", label: pair("กรองตามประเภท", "Filter by type"), all: pair("ทุกประเภท", "All types"), options: function () { return O.newsChips; } }],
      columns: [
        { label: pair("หัวข้อข่าว", "Headline"), render: function (r) { return bilingual(r.titleTh, r.titleEn); } },
        { label: pair("ประเภท", "Type"), render: function (r) { return tag(r.chip); } },
        { label: pair("วันที่", "Date"), render: function (r) { return ui.fmtDate(r.date); } },
        { label: pair("ป้ายกำกับ", "Badges"), render: function (r) {
          var b = [];
          if (r.featured) { b.push(h("span", { class: "bd-pill bd-pill--tag", text: I.pick("ข่าวเด่น", "Featured") })); }
          if (isRecent(r.date)) { b.push(h("span", { class: "bd-pill bd-pill--new", text: I.pick("ใหม่", "New") })); }
          return b.length ? h("span", { class: "bd-pills" }, b) : dash();
        } }
      ],
      defaults: function () { return { chip: "ทั่วไป", date: todayISO(), featured: false, visible: true, descTh: "", descEn: "", href: "", imageName: "" }; },
      fields: [
        { name: "titleTh", label: pair("หัวข้อ (ภาษาไทย)", "Headline (Thai)"), required: true, full: true },
        { name: "titleEn", label: pair("หัวข้อ (English)", "Headline (English)"), full: true },
        { name: "descTh", label: pair("คำอธิบายสั้น (ไทย)", "Short description (Thai)"), type: "textarea", full: true },
        { name: "descEn", label: pair("คำอธิบายสั้น (English)", "Short description (English)"), type: "textarea", full: true },
        { name: "chip", label: pair("ประเภท", "Type"), type: "select", required: true, options: function () { return O.newsChips; } },
        { name: "date", label: pair("วันที่เผยแพร่", "Publish date"), type: "date", required: true },
        { name: "imageName", label: pair("รูปประกอบ", "Image"), type: "file", accept: "image/*", hint: pair("ต้นแบบนี้ยังไม่อัปโหลดไฟล์จริง", "This prototype does not upload real files"), full: true },
        { name: "href", label: pair("ลิงก์ข่าวฉบับเต็ม", "Full-story link"), type: "url", placeholder: "https://", hint: pair("ต้องขึ้นต้นด้วย http:// หรือ https://", "Must start with http:// or https://"), full: true },
        { name: "featured", label: pair("กำหนดเป็นข่าวเด่น", "Mark as featured"), type: "checkbox" },
        { name: "visible", label: pair("แสดงบนเว็บไซต์", "Show on website"), type: "checkbox" }
      ]
    }; },

    popups: function () { return {
      key: "popups", noun: pair("ป๊อปอัป", "pop-up"),
      title: pair("ป๊อปอัปประชาสัมพันธ์", "Pop-up announcements"),
      desc: pair("จัดการการ์ด 3 ใบ (ลำดับ รูป ข้อความ ลิงก์ฉบับเต็ม) เปิด/ปิดการแสดง และดูประวัติป๊อปอัปที่เคยปิดไว้ (ข้อมูลตัวอย่าง)", "Manage the 3 cards (order, image, text, full link), switch them on or off, and see previously closed pop-ups (sample data)"),
      note: pair("เปิดแสดงพร้อมกันได้สูงสุด 3 ใบ ใช้ตัวกรอง \"ปิดแสดง\" เพื่อดูประวัติที่เคยปิดไว้", "At most 3 pop-ups can be on at once. Use the \"Off\" filter to see the closed history"),
      statusOn: pair("เปิดแสดง", "On"), statusOff: pair("ปิดแสดง", "Off"),
      searchPlaceholder: pair("ค้นหาป๊อปอัป...", "Search pop-ups..."), searchLabel: pair("ค้นหาป๊อปอัป", "Search pop-ups"),
      searchKeys: ["titleTh", "titleEn", "type"], hideable: true, sort: function (a, b) { return a.order - b.order; },
      canShow: function (rows, r) {
        var on = rows.filter(function (x) { return x !== r && x.visible !== false; }).length;
        return on >= 3 ? pair("เปิดได้สูงสุด 3 ใบ กรุณาปิดใบอื่นก่อน", "Only 3 pop-ups can be on. Turn another off first") : null;
      },
      filters: [{ key: "type", label: pair("กรองตามประเภท", "Filter by type"), all: pair("ทุกประเภท", "All types"), options: function () { return O.popupTypes; } }],
      columns: [
        { label: pair("หัวข้อประกาศ", "Notice title"), render: function (r) { return bilingual(r.titleTh, r.titleEn); } },
        { label: pair("ประเภท", "Type"), render: function (r) { return tag(r.type); } },
        { label: pair("ลำดับ", "Order"), num: true, render: function (r) { return String(r.order); } },
        { label: pair("ปิดเมื่อ", "Closed on"), render: function (r) { return r.visible === false && r.hiddenAt ? ui.fmtDate(r.hiddenAt) : dash(); } }
      ],
      defaults: function () { return { type: "ประกาศสอบ", date: todayISO(), order: 1, href: "", imageName: "", visible: false, hiddenAt: "" }; },
      fields: [
        { name: "titleTh", label: pair("ข้อความ (ภาษาไทย)", "Text (Thai)"), required: true, full: true },
        { name: "titleEn", label: pair("ข้อความ (English)", "Text (English)"), full: true },
        { name: "type", label: pair("ประเภท", "Type"), type: "select", required: true, options: function () { return O.popupTypes; } },
        { name: "order", label: pair("ลำดับการแสดง (1–3)", "Display order (1–3)"), type: "number", required: true },
        { name: "imageName", label: pair("รูปภาพ", "Image"), type: "file", accept: "image/*", hint: pair("ต้นแบบนี้ยังไม่อัปโหลดไฟล์จริง", "This prototype does not upload real files"), full: true },
        { name: "href", label: pair("ลิงก์ฉบับเต็ม (ถ้ามี)", "Full-version link (optional)"), type: "url", placeholder: "https://", hint: pair("ต้องขึ้นต้นด้วย http:// หรือ https://", "Must start with http:// or https://"), full: true },
        { name: "visible", label: pair("เปิดแสดง", "Show"), type: "checkbox" }
      ],
      check: function (v, rows, editing) {
        var out = {}, n = Number(v.order);
        if (v.order !== "" && (n < 1 || n > 3 || Math.floor(n) !== n)) { out.order = pair("ลำดับต้องเป็นจำนวนเต็ม 1 ถึง 3", "Order must be a whole number from 1 to 3"); }
        if (v.visible) {
          var on = rows.filter(function (x) { return x !== editing && x.visible !== false; }).length;
          if (on >= 3) { out.visible = pair("เปิดแสดงได้สูงสุด 3 ใบ", "Only 3 pop-ups can be on"); }
        }
        return out;
      }
    }; },

    documents: function () { return {
      key: "documents", noun: pair("เอกสาร", "document"),
      title: pair("เอกสารและคู่มือ", "Documents & guides"),
      desc: pair("จัดการหน้าประกาศทั้ง 6 หมวด อัปโหลด PDF ระบุปี วันที่ ประเภท ดูยอดเข้าชม และรวมเอกสารไทย-อังกฤษเป็นรายการเดียว (ข้อมูลตัวอย่าง)", "Manage the 6 announcement categories: upload PDFs, set year, date and type, see view counts, and keep the Thai and English files in one item (sample data)"),
      note: pair("ยอดเข้าชมเป็นตัวเลขจำลอง ต้นแบบยังไม่อัปโหลดไฟล์จริง", "View counts are sample numbers. The prototype does not upload real files"),
      searchPlaceholder: pair("ค้นหาเอกสาร...", "Search documents..."), searchLabel: pair("ค้นหาเอกสาร", "Search documents"),
      searchKeys: ["titleTh", "titleEn", "category", "year"], hideable: true, sort: byDateDesc,
      filters: [
        { key: "category", label: pair("กรองตามหมวดหมู่", "Filter by category"), all: pair("ทุกหมวดหมู่", "All categories"), options: function () { return O.docCategories(); } }
      ],
      columns: [
        { label: pair("ชื่อเอกสาร", "Document"), render: function (r) { return bilingual(r.titleTh, r.titleEn); } },
        { label: pair("หมวดหมู่", "Category"), render: function (r) { return tag(r.category); } },
        { label: pair("ปี / วันที่", "Year / date"), render: function (r) { return (I.lang() === "en" ? r.year - 543 : r.year) + " · " + ui.fmtDate(r.date); } },
        { label: pair("ไฟล์", "Files"), render: function (r) {
          return h("span", { class: "bd-pills" }, [h("span", { class: "bd-pill bd-pill--tag", text: "TH" }), r.fileEn ? h("span", { class: "bd-pill bd-pill--tag", text: "EN" }) : null]);
        } },
        { label: pair("เข้าชม", "Views"), num: true, render: function (r) { return ui.num(r.views || 0); } }
      ],
      defaults: function () { return { category: O.docCategories()[0], year: new Date().getFullYear() + 543, date: todayISO(), fileTh: "", fileEn: "", views: 0, visible: true }; },
      fields: [
        { name: "titleTh", label: pair("ชื่อเอกสาร (ภาษาไทย)", "Document name (Thai)"), required: true, full: true },
        { name: "titleEn", label: pair("ชื่อเอกสาร (English)", "Document name (English)"), full: true },
        { name: "category", label: pair("หมวดหมู่", "Category"), type: "select", required: true, options: function () { return O.docCategories(); } },
        { name: "year", label: pair("ปี (พ.ศ.)", "Year (B.E.)"), type: "number", required: true },
        { name: "date", label: pair("วันที่ประกาศ", "Published date"), type: "date", required: true },
        { name: "fileTh", label: pair("ไฟล์ PDF ภาษาไทย", "Thai PDF file"), type: "file", accept: "application/pdf", required: true, hint: pair("ต้นแบบนี้ยังไม่อัปโหลดไฟล์จริง", "This prototype does not upload real files"), full: true },
        { name: "fileEn", label: pair("ไฟล์ PDF ภาษาอังกฤษ (ถ้ามี)", "English PDF file (optional)"), type: "file", accept: "application/pdf", full: true },
        { name: "visible", label: pair("แสดงบนเว็บไซต์", "Show on website"), type: "checkbox" }
      ]
    }; },

    links: function () { return {
      key: "links", noun: pair("ลิงก์", "link"),
      title: pair("ลิงก์และหน่วยงาน", "Links & agencies"),
      desc: pair("จัดการลิงก์หน่วยงานอื่น เมนูฐานข้อมูล (Scopus, ISI, TCI, ERIC, PubMed, Google Scholar) และระบบอื่น ๆ (ITC, UP Meeting)", "Manage links to other agencies, the database menu (Scopus, ISI, TCI, ERIC, PubMed, Google Scholar) and other systems (ITC, UP Meeting)"),
      note: pair("รายการที่ยังไม่มีลิงก์ จะเว้นว่างไว้ เพราะยังไม่มีที่อยู่ที่ยืนยันแล้ว ห้ามเดาลิงก์เอง", "Items without a link are left empty because no confirmed address exists yet. Do not guess links"),
      searchPlaceholder: pair("ค้นหาลิงก์...", "Search links..."), searchLabel: pair("ค้นหาลิงก์", "Search links"),
      searchKeys: ["nameTh", "nameEn", "href", "group"], hideable: true, titleOf: function (r) { return r.nameTh; },
      filters: [{ key: "group", label: pair("กรองตามกลุ่ม", "Filter by group"), all: pair("ทุกกลุ่ม", "All groups"), options: function () { return O.linkGroups; } }],
      columns: [
        { label: pair("ชื่อลิงก์", "Link name"), render: function (r) { return bilingual(r.nameTh, r.nameEn); } },
        { label: pair("กลุ่ม", "Group"), render: function (r) { return tag(r.group); } },
        { label: pair("ที่อยู่ลิงก์", "Address"), render: function (r) { return mono(r.href); } }
      ],
      defaults: function () { return { group: "หน่วยงานอื่น", href: "https://", visible: true }; },
      fields: [
        { name: "nameTh", label: pair("ชื่อ (ภาษาไทย)", "Name (Thai)"), required: true, full: true },
        { name: "nameEn", label: pair("ชื่อ (English)", "Name (English)"), full: true },
        { name: "group", label: pair("กลุ่ม", "Group"), type: "select", required: true, options: function () { return O.linkGroups; } },
        { name: "href", label: pair("ที่อยู่ลิงก์", "Address"), type: "url", placeholder: "https://", hint: pair("ต้องขึ้นต้นด้วย http:// หรือ https://", "Must start with http:// or https://"), full: true },
        { name: "visible", label: pair("แสดงบนเว็บไซต์", "Show on website"), type: "checkbox" }
      ]
    }; },

    categories: function () { return {
      key: "categories", noun: pair("หมวดหมู่", "category"),
      title: pair("จัดการหมวดหมู่", "Categories"),
      desc: pair("เพิ่ม/แก้ชื่อหมวดของข่าว ประกาศ (เอกสาร) และกิจกรรมปฏิทิน", "Add or rename categories for news, announcements (documents) and calendar activities"),
      searchPlaceholder: pair("ค้นหาหมวดหมู่...", "Search categories..."), searchLabel: pair("ค้นหาหมวดหมู่", "Search categories"),
      searchKeys: ["nameTh", "nameEn"], hideable: true, titleOf: function (r) { return r.nameTh; },
      sort: function (a, b) { return O.catKinds.indexOf(a.kind) - O.catKinds.indexOf(b.kind); },
      filters: [{ key: "kind", label: pair("กรองตามชนิด", "Filter by kind"), all: pair("ทุกชนิด", "All kinds"), options: function () { return O.catKinds; } }],
      columns: [
        { label: pair("ชื่อหมวดหมู่", "Category name"), render: function (r) { return bilingual(r.nameTh, r.nameEn); } },
        { label: pair("ใช้กับ", "Used for"), render: function (r) { return tag(r.kind); } }
      ],
      defaults: function () { return { kind: "news", visible: true }; },
      fields: [
        { name: "nameTh", label: pair("ชื่อหมวดหมู่ (ภาษาไทย)", "Category name (Thai)"), required: true, full: true },
        { name: "nameEn", label: pair("ชื่อหมวดหมู่ (English)", "Category name (English)"), full: true },
        { name: "kind", label: pair("ใช้กับ", "Used for"), type: "select", required: true, options: function () { return O.catKinds; } },
        { name: "visible", label: pair("ใช้งาน", "In use"), type: "checkbox" }
      ]
    }; },

    translations: function () { return {
      key: "translations", noun: pair("คำแปล", "translation"), noAdd: true, noDelete: true,
      title: pair("จัดการคำแปลภาษาอังกฤษ", "English translations"),
      desc: pair("แก้ไขคำแปลที่สร้างด้วย AI ให้ถูกต้อง เพราะอาจแปลผิด แล้วทำเครื่องหมายว่าตรวจแล้ว", "Fix AI-generated translations, which may be wrong, then mark them as reviewed"),
      note: pair("ข้อความไทย/อังกฤษดึงจากไฟล์แปลจริง js/i18n.js ส่วนสถานะ \"ตรวจแล้ว\" เป็นข้อมูลจำลอง การแก้ในต้นแบบไม่ถูกบันทึกลงไฟล์", "Thai/English text comes from the real js/i18n.js. The reviewed status is sample data and edits are not written to the file"),
      searchPlaceholder: pair("ค้นหาคำแปล...", "Search translations..."), searchLabel: pair("ค้นหาคำแปล", "Search translations"),
      searchKeys: ["key", "th", "en"], titleOf: function (r) { return r.key; },
      filters: [{ key: "status", label: pair("กรองตามสถานะ", "Filter by status"), all: pair("ทุกสถานะ", "All statuses"), options: function () { return ["pending", "reviewed"]; } }],
      columns: [
        { label: pair("คีย์", "Key"), render: function (r) { return mono(r.key); } },
        { label: pair("ภาษาไทย", "Thai"), render: function (r) { return h("span", { class: "bd-cell-title", text: r.th }); } },
        { label: pair("ภาษาอังกฤษ", "English"), render: function (r) { return h("span", { class: "bd-cell-title", text: r.en || "-" }); } },
        { label: pair("สถานะ", "Status"), render: function (r) { return h("span", { class: "bd-pill " + (r.status === "reviewed" ? "bd-pill--ok" : "bd-pill--warn"), text: I.label(r.status, r.status) }); } }
      ],
      fields: [
        { name: "key", label: pair("คีย์", "Key"), readonly: true, full: true },
        { name: "th", label: pair("ข้อความภาษาไทย (ต้นฉบับ)", "Thai text (source)"), type: "textarea", readonly: true, full: true },
        { name: "en", label: pair("ข้อความภาษาอังกฤษ", "English text"), type: "textarea", required: true, full: true },
        { name: "status", label: pair("สถานะการตรวจ", "Review status"), type: "select", required: true, options: function () { return ["pending", "reviewed"]; } }
      ]
    }; },

    calendar: function () { return {
      key: "calendar", noun: pair("กิจกรรม", "activity"),
      title: pair("ปฏิทินกิจกรรม", "Activity calendar"),
      desc: pair("เพิ่ม/แก้ไข/ลบกิจกรรม กำหนดหมวด วันเริ่ม-สิ้นสุด ลิงก์ และคำอธิบาย", "Add, edit or delete activities; set category, start and end dates, link and description"),
      note: pair("ปัจจุบันปฏิทินของเว็บไซต์เก็บในเบราว์เซอร์ของเจ้าหน้าที่แต่ละคน (localStorage) เมื่อมี Backend จะรวมเป็นข้อมูลกลางที่ทุกคนเห็นเหมือนกัน", "Today the website calendar lives in each staff member's browser (localStorage). With a backend it becomes shared data that everyone sees"),
      searchPlaceholder: pair("ค้นหากิจกรรม...", "Search activities..."), searchLabel: pair("ค้นหากิจกรรม", "Search activities"),
      searchKeys: ["titleTh", "titleEn", "label"], hideable: true, sort: byDateAsc,
      filters: [{ key: "label", label: pair("กรองตามประเภท", "Filter by type"), all: pair("ทุกประเภท", "All types"), options: function () { return O.calLabels; } }],
      columns: [
        { label: pair("กิจกรรม", "Activity"), render: function (r) { return bilingual(r.titleTh, r.titleEn); } },
        { label: pair("ช่วงเวลา", "Period"), render: function (r) {
          var range = ui.fmtDate(r.date);
          if (r.dateEnd && r.dateEnd !== r.date) { range += " – " + ui.fmtDate(r.dateEnd); }
          return range;
        } },
        { label: pair("ประเภท", "Type"), render: function (r) { return tag(r.label); } }
      ],
      defaults: function () { return { label: "อื่น ๆ", date: todayISO(), dateEnd: "", href: "", visible: true }; },
      fields: [
        { name: "titleTh", label: pair("ชื่อกิจกรรม (ภาษาไทย)", "Activity name (Thai)"), required: true, full: true },
        { name: "titleEn", label: pair("ชื่อกิจกรรม (English)", "Activity name (English)"), full: true },
        { name: "label", label: pair("ประเภท", "Type"), type: "select", required: true, options: function () { return O.calLabels; } },
        { name: "date", label: pair("วันที่เริ่ม", "Start date"), type: "date", required: true },
        { name: "dateEnd", label: pair("วันที่สิ้นสุด", "End date"), type: "date", hint: pair("เว้นว่างได้หากเป็นกิจกรรมวันเดียว", "Leave empty for a one-day activity") },
        { name: "href", label: pair("ลิงก์รายละเอียด (ถ้ามี)", "Details link (optional)"), type: "url", placeholder: "https://", hint: pair("ต้องขึ้นต้นด้วย http:// หรือ https://", "Must start with http:// or https://"), full: true },
        { name: "visible", label: pair("แสดงบนเว็บไซต์", "Show on website"), type: "checkbox" }
      ],
      check: function (v) {
        if (v.date && v.dateEnd && v.dateEnd < v.date) { return { dateEnd: pair("วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม", "End date cannot be before the start date") }; }
        return {};
      }
    }; }
  };

  var page = document.body.getAttribute("data-page");
  function boot() {
    if (!CONFIGS[page]) { return; }
    window.GUBD.crud.mount(CONFIGS[page]());
  }
  if (CONFIGS[page]) { I.register("page", boot); boot(); }
})();
