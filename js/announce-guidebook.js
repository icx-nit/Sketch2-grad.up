/* ==========================================================================
   announce-guidebook.js — หน้าคู่มือบัณฑิตศึกษา (ดีไซน์เดียวกับหน้าคำสั่งแต่งตั้ง)
   ข้อมูลจริงจากหน้า grad.up.ac.th/announce/guidebook
   (categoriesId=6 คู่มือสารนิพนธ์, 25 ขั้นตอนการศึกษา, 27 คู่มือยื่นคำร้อง)
   ไฟล์เอกสารเก็บไว้ในโปรเจกต์ที่ uploads/guides เพื่อให้ดาวน์โหลด/ดูตัวอย่างได้จริง
   ========================================================================== */

(function () {
  "use strict";

  var PAGE_SIZE = 10;
  var SOURCE_URL = "https://grad.up.ac.th/announce/guidebook";
  var FILE_BASE = "uploads/guides/";
  var PREVIEW_BASE = "uploads/guides/preview/";

  var CATEGORIES = [
    { id: "thesis-guide", label: "คู่มือสารนิพนธ์", en: "Thesis Guidebook" },
    { id: "study-steps", label: "ขั้นตอนการศึกษา", en: "Study Steps" },
    { id: "petition", label: "คู่มือยื่นคำร้อง", en: "Petition Guidelines" }
  ];

  /* ข้อมูลจริงจากหน้า grad.up.ac.th/announce/guidebook
     ไฟล์ PDF ทั้งหมดเก็บไว้ที่ uploads/guides */
  var FORMS = [
    { cat: "thesis-guide", code: "", num: 1, title: "คู่มือสารนิพนธ์ มหาวิทยาลัยพะเยา พ.ศ. 2567", en: "Graduate Study Guidebook, University of Phayao, B.E. 2567", label: "19 ก.ย. 2567", date: "2024-09-19", views: 420, file: "ann-235.pdf", ext: "pdf" },
    { cat: "study-steps", code: "EN", num: 2, title: "Criteria for passing the English proficiency test for graduate students (EN)", th: "เกณฑ์การสอบผ่านความรู้ภาษาอังกฤษของนิสิตระดับบัณฑิตศึกษา", label: "19 ก.ย. 2567", date: "2024-09-19", views: 13, file: "ann-243.pdf", ext: "pdf" },
    { cat: "study-steps", code: "TH", num: 3, title: "เกณฑ์การสอบผ่านความรู้ภาษาอังกฤษของนิสิตระดับบัณฑิตศึกษา (TH)", en: "Criteria for passing the English proficiency test for graduate students (Thai version)", label: "19 ก.ย. 2567", date: "2024-09-19", views: 38, file: "ann-242.pdf", ext: "pdf" },
    { cat: "study-steps", code: "EN", num: 4, title: "Procedures for Master's Degree student Plan B or Plan 2 (EN)", th: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ข หรือแผน 2", label: "19 ก.ย. 2567", date: "2024-09-19", views: 8, file: "ann-241.pdf", ext: "pdf" },
    { cat: "study-steps", code: "TH", num: 5, title: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ข หรือแผน 2 (TH)", en: "Procedures for Master's Degree student Plan B or Plan 2 (Thai version)", label: "19 ก.ย. 2567", date: "2024-09-19", views: 37, file: "ann-240.pdf", ext: "pdf" },
    { cat: "study-steps", code: "EN", num: 6, title: "Procedures for Master's Degree student Plan A or Plan 1 (EN)", th: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ก หรือแผน 1", label: "19 ก.ย. 2567", date: "2024-09-19", views: 12, file: "ann-239.pdf", ext: "pdf" },
    { cat: "study-steps", code: "TH", num: 7, title: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ก หรือแผน 1 (TH)", en: "Procedures for Master's Degree student Plan A or Plan 1 (Thai version)", label: "19 ก.ย. 2567", date: "2024-09-19", views: 68, file: "ann-238.pdf", ext: "pdf" },
    { cat: "study-steps", code: "EN", num: 8, title: "Doctoral Student's Study Process (EN)", th: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาเอก", label: "19 ก.ย. 2567", date: "2024-09-19", views: 5, file: "ann-236.pdf", ext: "pdf" },
    { cat: "study-steps", code: "TH", num: 9, title: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาเอก (TH)", en: "Doctoral Student's Study Process (Thai version)", label: "19 ก.ย. 2567", date: "2024-09-19", views: 44, file: "ann-237.pdf", ext: "pdf" },
    { cat: "petition", code: "", num: 10, title: "คู่มือการยื่นคำร้องแต่งตั้งอาจารย์บัณฑิตศึกษา", en: "Guidelines for requesting appointment of graduate faculty members", label: "6 พ.ค. 2569", date: "2026-05-06", views: 55, file: "ann-1283.pdf", ext: "pdf" },
    { cat: "petition", code: "", num: 11, title: "คู่มือการยื่นคำร้องแต่งตั้งอาจารย์พิเศษบัณฑิตศึกษา", en: "Guidelines for requesting appointment of special graduate faculty members", label: "6 พ.ค. 2569", date: "2026-05-06", views: 15, file: "ann-1282.pdf", ext: "pdf" },
  ];

  var ICONS = {
    doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
    calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
    eye: ["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
    download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
    external: ["M14 4h6v6", "M20 4l-9 9", "M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"],
    chevronLeft: ["M15 18l-6-6 6-6"],
    chevronRight: ["M9 18l6-6-6-6"],
    chevronsLeft: ["M11 17l-5-5 5-5", "M18 17l-5-5 5-5"],
    chevronsRight: ["M13 17l5-5-5-5", "M6 17l5-5-5-5"]
  };

  var tabsEl = document.getElementById("cat-tabs");
  var listEl = document.getElementById("command-list");
  var captionEl = document.getElementById("list-caption");
  var pageInfoEl = document.getElementById("page-info");
  var paginationEl = document.getElementById("pagination");
  var searchInput = document.getElementById("search-input");
  var suggestEl = document.getElementById("search-suggest");
  var sortBtn = document.getElementById("sort-btn");
  var sortLabel = document.getElementById("sort-label");
  var chipCountEl = document.getElementById("chip-count");

  if (!tabsEl || !listEl) {
    return;
  }

  var state = { cat: "thesis-guide", query: "", ascending: true, page: 1 };

  /* ---------- ข้อความสองภาษา (ไทย / English) ---------- */
  var PT = {
    th: {
      "doc.title": "คู่มือบัณฑิตศึกษา | GRAD UP",
      "crumb.home": "หน้าหลัก",
      "page.title": "คู่มือบัณฑิตศึกษา",
      "cat.label": "หมวดคู่มือ:",
      "stat.cats": "หมวดคู่มือ",
      "stat.total": "คู่มือทั้งหมด",
      "stat.files": "มีไฟล์แล้ว",
      "stat.latest": "อัปเดตล่าสุด",
      "count.cats": "{n} หมวด",
      "count.items": "{n} ฉบับ",
      "chip.all": "ทั้งหมด",
      "search.label": "ค้นหาคู่มือ",
      "search.placeholder": "ค้นหาจากชื่อคู่มือ",
      "sort.asc": "ลำดับเดิมจากเว็บ",
      "sort.desc": "ลำดับกลับด้าน",
      "caption": "แสดงคู่มือหมวด{cat} • {sort}",
      "badge.be": "พ.ศ. ",
      "btn.download": "ดาวน์โหลด",
      "btn.preview": "ดูตัวอย่าง",
      "btn.nofile": "ยังไม่มีไฟล์",
      "unit.views": "ครั้ง",
      "empty.none": "ยังไม่มีคู่มือในหมวดนี้",
      "empty.search": "ไม่พบรายการที่ตรงกับการค้นหา",
      "empty.note": "ดูรายการทั้งหมดได้ที่เว็บต้นทาง",
      "empty.link": "ไปที่หน้าคู่มือ",
      "pager.info": "แสดง {from}–{to} จาก {total} รายการ",
      "pager.label": "เปลี่ยนหน้า",
      "pager.first": "หน้าแรก",
      "pager.prev": "หน้าก่อนหน้า",
      "pager.next": "หน้าถัดไป",
      "pager.last": "หน้าสุดท้าย",
      "pager.page": "หน้า {n}",
      "theme.toLight": "เปลี่ยนธีมเป็นสว่าง",
      "theme.toDark": "เปลี่ยนธีมเป็นมืด"
    },
    en: {
      "doc.title": "Graduate Study Guidebook | GRAD UP",
      "crumb.home": "Home",
      "page.title": "Graduate Study Guidebook",
      "cat.label": "Guide category:",
      "stat.cats": "Categories",
      "stat.total": "Total guides",
      "stat.files": "With files",
      "stat.latest": "Last updated",
      "count.cats": "{n} categories",
      "count.items": "{n} items",
      "chip.all": "All",
      "search.label": "Search guides",
      "search.placeholder": "Search by guide title",
      "sort.asc": "Original website order",
      "sort.desc": "Reverse order",
      "caption": "Showing guides in {cat} • {sort}",
      "badge.be": "B.E. ",
      "btn.download": "Download",
      "btn.preview": "Preview",
      "btn.nofile": "No file yet",
      "unit.views": "views",
      "empty.none": "No guides in this category yet",
      "empty.search": "No guides match your search",
      "empty.note": "See all items on the original website",
      "empty.link": "Open the guidebook page",
      "pager.info": "Showing {from}–{to} of {total} items",
      "pager.label": "Pagination",
      "pager.first": "First page",
      "pager.prev": "Previous page",
      "pager.next": "Next page",
      "pager.last": "Last page",
      "pager.page": "Page {n}",
      "theme.toLight": "Switch to light theme",
      "theme.toDark": "Switch to dark theme"
    }
  };

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }

  function t(key, vars) {
    var str = PT[lang()][key] || PT.th[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return str;
  }

  /* วันที่: ไทยใช้ข้อความเดิม ภาษาอังกฤษแปลงจากค่า ISO */
  function dateLabel(item) {
    if (lang() !== "en" || !item.date) return item.label;
    var d = new Date(item.date + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ชื่อรายการ: ภาษาอังกฤษใช้ค่า en ถ้ามี */
  function titleOf(item) {
    if (lang() === "en") return item.en || item.title;
    return item.th || item.title;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgIcon(paths) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) {
      var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });
    return svg;
  }

  function categoryLabel(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    if (!c) return "";
    return lang() === "en" && c.en ? c.en : c.label;
  }

  function itemsForCat(cat) {
    return FORMS.filter(function (f) { return f.cat === cat; });
  }

  function numberOf(item) {
    return item.num || 0;
  }

  function fileUrl(item) {
    return FILE_BASE + item.file;
  }

  function previewUrl(item) {
    if (item.ext === "pdf") return FILE_BASE + item.file;
    return PREVIEW_BASE + item.file.replace(/\.[^.]+$/, "") + ".pdf";
  }

  function downloadFilename(item) {
    var base = item.title.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();
    if (!base) base = item.code || item.file.replace(/\.[^.]+$/, "");
    return base + "." + item.ext;
  }

  function badgeText(item) {
    if (item.code) return item.code;
    if (item.date) return t("badge.be") + (parseInt(item.date.slice(0, 4), 10) + 543);
    return item.label;
  }

  /* คู่มือทุกหมวดเรียงตามลำดับเดิมของเว็บ (num) */
  function sortText() {
    return state.ascending ? t("sort.asc") : t("sort.desc");
  }

  /* ค้นหาแบบ AND ทุกคำที่พิมพ์ ตัวเลขล้วนจับกับเลข บศ./บข. หรือวันที่เป็นคำเต็ม */
  function matchesAllTokens(item, tokens) {
    var hay = (item.title + " " + item.label).toLowerCase();
    var words = hay.split(/\s+/);
    return tokens.every(function (token) {
      if (/^\d+$/.test(token)) {
        return String(item.num) === token || words.indexOf(token) !== -1;
      }
      return hay.indexOf(token) !== -1;
    });
  }

  function tokensOf(text) {
    return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  function filteredItems() {
    var tokens = tokensOf(state.query);
    var list = itemsForCat(state.cat).filter(function (item) {
      return !tokens.length || matchesAllTokens(item, tokens);
    });
    list.sort(function (a, b) {
      var cmp = numberOf(a) - numberOf(b);
      return state.ascending ? cmp : -cmp;
    });
    return list;
  }

  function updateSortLabel() {
    if (sortLabel) sortLabel.textContent = sortText();
  }

  /* ---------- แท็บหมวด ---------- */

  function renderTabs() {
    tabsEl.textContent = "";
    CATEGORIES.forEach(function (cat, i) {
      var selected = cat.id === state.cat;
      var count = itemsForCat(cat.id).length;
      var tab = el("button", "year-tab", categoryLabel(cat.id) + " (" + count + ")");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.id = "cat-tab-" + cat.id;
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("aria-controls", "command-list");
      tab.tabIndex = selected ? 0 : -1;
      tab.addEventListener("click", function () {
        state.cat = cat.id;
        state.page = 1;
        renderAll();
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = CATEGORIES[(i + 1) % CATEGORIES.length];
        if (e.key === "ArrowLeft") next = CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length];
        if (next) {
          e.preventDefault();
          state.cat = next.id;
          state.page = 1;
          renderAll();
          var target = document.getElementById("cat-tab-" + next.id);
          if (target) target.focus();
        }
      });
      tabsEl.appendChild(tab);
    });
  }

  /* ---------- แถวรายการ ---------- */

  /* รายการ TH กับ EN ที่อยู่ติดกันในหมวดเดียวกัน รวมเป็นแถวเดียว (ให้เลือกภาษาได้) */
  function groupEntries(list) {
    var entries = [];
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var b = list[i + 1];
      if (a.code && b && b.code && b.cat === a.cat && b.code !== a.code) {
        entries.push({ items: [a, b], cat: a.cat, num: a.num });
        i++;
      } else {
        entries.push({ items: [a], cat: a.cat, num: a.num });
      }
    }
    return entries;
  }

  function itemByCode(entry, code) {
    return entry.items.filter(function (x) { return x.code === code; })[0] || entry.items[0];
  }

  /* ชื่อที่แสดง: ตัดรหัส (TH) / (EN) ท้ายชื่อออก */
  function pairTitle(item) {
    return item.title.replace(/\s*\((TH|EN)\)\s*$/, "");
  }

  function buildRow(entry, activeCode) {
    var isPair = entry.items.length > 1;
    var item = isPair ? itemByCode(entry, activeCode) : entry.items[0];

    var row = el("article", "doc-row doc-row--board");

    var icon = el("div", "doc-row__icon");
    icon.appendChild(svgIcon(ICONS.doc));

    var body = el("div", "doc-row__body");
    var badges = el("div", "doc-row__badges");
    if (isPair) {
      var toggle = el("div", "doc-row__lang");
      toggle.setAttribute("role", "group");
      ["TH", "EN"].forEach(function (code) {
        var on = code === item.code;
        var b = el("button", "doc-row__lang-btn" + (on ? " is-active" : ""), code === "TH" ? "ไทย" : "EN");
        b.type = "button";
        b.setAttribute("aria-pressed", String(on));
        b.addEventListener("click", function () {
          if (on) return;
          row.replaceWith(buildRow(entry, code));
        });
        toggle.appendChild(b);
      });
      badges.appendChild(toggle);
    } else {
      if (item.cat !== "study-steps" && item.cat !== "thesis-guide") {
        /* ไม่แสดงป้ายหมวดในรายการคู่มือ */
      }
      if (!item.code) badges.appendChild(el("span", "badge badge--year", badgeText(item)));
    }

    var title = el("h3", "doc-row__title", isPair ? pairTitle(item) : titleOf(item));

    var meta = el("ul", "doc-row__meta");
    var dateLi = el("li");
    dateLi.appendChild(svgIcon(ICONS.calendar));
    var time = el("time", null, dateLabel(item));
    if (item.date) time.setAttribute("datetime", item.date);
    dateLi.appendChild(time);
    var viewLi = el("li");
    viewLi.appendChild(svgIcon(ICONS.eye));
    viewLi.appendChild(el("span", null, item.views.toLocaleString(lang() === "en" ? "en-US" : "th-TH") + " " + t("unit.views")));
    meta.appendChild(dateLi);
    meta.appendChild(viewLi);

    body.appendChild(badges);
    body.appendChild(title);
    body.appendChild(meta);

    var actions = el("div", "doc-row__actions");
    if (item.file) {
      var download = el("a", "cmd-btn cmd-btn--solid");
      download.href = fileUrl(item);
      download.setAttribute("download", downloadFilename(item));
      download.appendChild(svgIcon(ICONS.download));
      download.appendChild(el("span", null, t("btn.download")));
      actions.appendChild(download);

      var preview = el("a", "doc-row__preview");
      preview.href = previewUrl(item);
      preview.target = "_blank";
      preview.rel = "noopener noreferrer";
      preview.appendChild(svgIcon(ICONS.eye));
      preview.appendChild(el("span", null, t("btn.preview")));
      actions.appendChild(preview);
    } else {
      var off = el("span", "cmd-btn cmd-btn--solid is-disabled");
      off.setAttribute("aria-disabled", "true");
      off.appendChild(svgIcon(ICONS.download));
      off.appendChild(el("span", null, t("btn.nofile")));
      actions.appendChild(off);

      var offPreview = el("span", "doc-row__preview is-disabled");
      offPreview.setAttribute("aria-disabled", "true");
      offPreview.appendChild(svgIcon(ICONS.eye));
      offPreview.appendChild(el("span", null, t("btn.preview")));
      actions.appendChild(offPreview);
    }

    row.appendChild(icon);
    row.appendChild(body);
    row.appendChild(actions);
    return row;
  }

  function buildEmpty(message) {
    var box = el("div", "doc-empty");
    box.appendChild(el("h3", null, message));
    box.appendChild(el("p", null, t("empty.note")));
    var link = el("a", "cmd-btn cmd-btn--outline");
    link.href = SOURCE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(el("span", null, t("empty.link")));
    link.appendChild(svgIcon(ICONS.external));
    box.appendChild(link);
    return box;
  }

  /* ---------- การแบ่งหน้า ---------- */

  function renderPagination(total) {
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    var cur = state.page;
    var from = (cur - 1) * PAGE_SIZE + 1;
    var to = Math.min(total, cur * PAGE_SIZE);
    pageInfoEl.textContent = t("pager.info", { from: from, to: to, total: total });
    paginationEl.textContent = "";

    function go(target) {
      state.page = target;
      renderList();
      listEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function navButton(icon, label, target, disabled) {
      var b = el("button", "page-btn");
      b.type = "button";
      b.disabled = disabled;
      b.setAttribute("aria-label", label);
      b.appendChild(svgIcon(icon));
      b.addEventListener("click", function () { go(target); });
      return b;
    }

    paginationEl.appendChild(navButton(ICONS.chevronsLeft, t("pager.first"), 1, cur === 1));
    paginationEl.appendChild(navButton(ICONS.chevronLeft, t("pager.prev"), Math.max(1, cur - 1), cur === 1));
    for (var p = 1; p <= pages; p++) {
      (function (page) {
        var b = el("button", "page-btn" + (page === cur ? " is-active" : ""), String(page));
        b.type = "button";
        b.setAttribute("aria-label", t("pager.page", { n: page }));
        if (page === cur) b.setAttribute("aria-current", "page");
        b.addEventListener("click", function () { go(page); });
        paginationEl.appendChild(b);
      })(p);
    }
    paginationEl.appendChild(navButton(ICONS.chevronRight, t("pager.next"), Math.min(pages, cur + 1), cur === pages));
    paginationEl.appendChild(navButton(ICONS.chevronsRight, t("pager.last"), pages, cur === pages));
  }

  /* ---------- รายการหลัก ---------- */

  function renderList() {
    var list = filteredItems();
    var entries = groupEntries(list);
    var pages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;

    listEl.textContent = "";
    captionEl.textContent = t("caption", { cat: categoryLabel(state.cat), sort: sortText() });
    updateSortLabel();

    if (!itemsForCat(state.cat).length) {
      listEl.appendChild(buildEmpty(t("empty.none")));
      pageInfoEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }
    if (!list.length) {
      listEl.appendChild(buildEmpty(t("empty.search")));
      pageInfoEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }

    var start = (state.page - 1) * PAGE_SIZE;
    entries.slice(start, start + PAGE_SIZE).forEach(function (entry) {
      var first = entry.items[0];
      var defaultCode = entry.items.length > 1 ? (lang() === "en" ? "EN" : "TH") : first.code;
      listEl.appendChild(buildRow(entry, defaultCode));
    });
    renderPagination(entries.length);
  }

  function renderCounts() {
    var n = itemsForCat(state.cat).length;
    if (chipCountEl) chipCountEl.textContent = "(" + n + ")";
    var withFile = FORMS.filter(function (f) { return !!f.file; }).length;
    var latest = FORMS.reduce(function (acc, f) {
      return !acc || f.date > acc.date ? f : acc;
    }, null);
    var set = function (id, text) {
      var node = document.getElementById(id);
      if (node) node.textContent = text;
    };
    set("stat-cats", t("count.cats", { n: CATEGORIES.length }));
    set("stat-total", t("count.items", { n: FORMS.length }));
    set("stat-with", t("count.items", { n: withFile }));
    set("stat-latest", latest ? dateLabel(latest) : "-");
  }

  function renderAll() {
    renderTabs();
    renderCounts();
    renderList();
  }

  /* ---------- รายการแนะนำขณะพิมพ์ ---------- */

  function renderSuggest() {
    var tokens = tokensOf(searchInput.value);
    suggestEl.textContent = "";
    if (!tokens.length) {
      suggestEl.hidden = true;
      return;
    }
    var matches = itemsForCat(state.cat).filter(function (item) {
      return matchesAllTokens(item, tokens);
    }).slice(0, 8);
    if (!matches.length) {
      suggestEl.hidden = true;
      return;
    }
    matches.forEach(function (item) {
      var li = el("li");
      var btn = el("button", "search-suggest__btn");
      btn.type = "button";
      btn.appendChild(el("span", "search-suggest__title", titleOf(item)));
      btn.appendChild(el("span", "search-suggest__meta", badgeText(item) + " · " + item.label));
      btn.addEventListener("click", function () {
        searchInput.value = item.title;
        state.query = item.title;
        state.page = 1;
        suggestEl.hidden = true;
        renderList();
      });
      li.appendChild(btn);
      suggestEl.appendChild(li);
    });
    suggestEl.hidden = false;
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      state.page = 1;
      renderList();
      renderSuggest();
    });
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) renderSuggest();
    });
    searchInput.addEventListener("blur", function () {
      suggestEl.hidden = true;
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") suggestEl.hidden = true;
    });
  }
  if (suggestEl) {
    suggestEl.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", function () {
      state.ascending = !state.ascending;
      state.page = 1;
      sortBtn.setAttribute("aria-pressed", String(!state.ascending));
      renderList();
    });
  }

  /* สลับภาษาไทย / English ของหน้านี้ (ปุ่มภาษาใช้ตัวควบคุมกลางจาก i18n.js) */
  function applyPageLang() {
    document.querySelectorAll("[data-pt]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-pt"));
    });
    document.querySelectorAll("[data-pt-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-pt-aria")));
    });
    document.querySelectorAll("[data-pt-placeholder]").forEach(function (node) {
      node.setAttribute("placeholder", t(node.getAttribute("data-pt-placeholder")));
    });
    document.title = t("doc.title");
    renderAll();
    updateSortLabel();
  }

  if (window.GUI18n) {
    document.addEventListener("gu:languagechange", applyPageLang);
    var langButton = document.querySelector("[data-lang-toggle]");
    if (langButton) {
      langButton.addEventListener("click", function () {
        window.GUI18n.toggle();
      });
    }
    window.GUI18n.apply(window.GUI18n.stored());
    applyPageLang();
  } else {
    applyPageLang();
  }

  var themeButton = document.querySelector("[data-theme-toggle]");
  if (themeButton && window.GUTheme) {
    var updateThemeIcons = function () {
      var isDark = window.GUTheme.get() === "dark";
      themeButton.setAttribute("aria-label", isDark ? t("theme.toLight") : t("theme.toDark"));
      themeButton.setAttribute("aria-pressed", String(isDark));
    };
    themeButton.addEventListener("click", function () {
      window.GUTheme.toggle();
    });
    document.addEventListener("gu:themechange", updateThemeIcons);
    updateThemeIcons();
  }

  /* อนิเมชันเข้าหน้าเฉพาะตอนโหลดครั้งแรก (เหมือนหน้าคำสั่งแต่งตั้ง) */
  document.documentElement.classList.add("cmd-intro");
  setTimeout(function () {
    document.documentElement.classList.remove("cmd-intro");
  }, 1600);

  if (window.GUFontSize) {
    window.GUFontSize.init();
  }
  if (window.GUComponents) {
    window.GUComponents.init();
  }

  renderAll();
})();
