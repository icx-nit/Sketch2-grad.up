/* ==========================================================================
   announce-other.js — หน้าประกาศอื่น ๆ (ดีไซน์เดียวกับหน้าคำสั่งแต่งตั้ง)
   ข้อมูลจริงจากหน้า grad.up.ac.th/announce/other (ประกาศอื่น ๆ 1 รายการ)
   ไฟล์เอกสารเก็บไว้ในโปรเจกต์ที่ uploads/other เพื่อให้ดาวน์โหลด/ดูตัวอย่างได้จริง
   ========================================================================== */

(function () {
  "use strict";

  var PAGE_SIZE = 10;
  var SOURCE_URL = "https://grad.up.ac.th/announce/other";
  var FILE_BASE = "uploads/other/";
  var PREVIEW_BASE = "uploads/other/preview/";

  var CATEGORIES = [
    { id: "other", label: "ประกาศอื่น ๆ", en: "Other Announcements" }
  ];

  /* ข้อมูลจริงจากหน้า grad.up.ac.th/announce/other */
  var FORMS = [
    { cat: "other", code: "", num: 1, title: "ประกาศ ก.พ.อ. เรื่องหลักเกณฑ์การพิจารณาวารสารทางวิชาการ สำหรับเผยแพร่ผลงานทางวิชาการ พ.ศ. 2562", en: "Announcement of the Higher Education Civil Service Committee (ก.พ.อ.): criteria for considering academic journals for publishing academic work, B.E. 2562", label: "19 ก.พ. 2563", date: "2020-02-19", views: 11, file: "ann-8.pdf", ext: "pdf" }
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

  var state = { cat: "other", query: "", ascending: true, page: 1 };

  /* ---------- ข้อความสองภาษา (ไทย / English) ---------- */
  var PT = {
    th: {
      "doc.title": "ประกาศอื่น ๆ | GRAD UP",
      "crumb.home": "หน้าหลัก",
      "page.title": "ประกาศอื่น ๆ",
      "cat.label": "หมวดประกาศ:",
      "stat.cats": "หมวดประกาศ",
      "stat.total": "ประกาศทั้งหมด",
      "stat.files": "มีไฟล์แนบ",
      "stat.latest": "อัปเดตล่าสุด",
      "count.cats": "{n} หมวด",
      "count.items": "{n} ฉบับ",
      "chip.all": "ทั้งหมด",
      "search.label": "ค้นหาประกาศ",
      "search.placeholder": "ค้นหาจากชื่อประกาศ",
      "sort.asc": "ลำดับเดิมจากเว็บ",
      "sort.desc": "ลำดับกลับด้าน",
      "caption": "แสดงประกาศ{cat} • {sort}",
      "badge.be": "พ.ศ. ",
      "btn.download": "ดาวน์โหลด",
      "btn.preview": "ดูตัวอย่าง",
      "btn.nofile": "ยังไม่มีไฟล์",
      "unit.views": "ครั้ง",
      "empty.none": "ยังไม่มีประกาศในหมวดนี้",
      "empty.search": "ไม่พบรายการที่ตรงกับการค้นหา",
      "empty.note": "ดูรายการทั้งหมดได้ที่เว็บต้นทาง",
      "empty.link": "ไปที่หน้าประกาศอื่น ๆ",
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
      "doc.title": "Other Announcements | GRAD UP",
      "crumb.home": "Home",
      "page.title": "Other Announcements",
      "cat.label": "Announcement category:",
      "stat.cats": "Categories",
      "stat.total": "Total announcements",
      "stat.files": "With attachments",
      "stat.latest": "Last updated",
      "count.cats": "{n} categories",
      "count.items": "{n} items",
      "chip.all": "All",
      "search.label": "Search announcements",
      "search.placeholder": "Search by announcement title",
      "sort.asc": "Original website order",
      "sort.desc": "Reverse order",
      "caption": "Showing announcements in {cat} • {sort}",
      "badge.be": "B.E. ",
      "btn.download": "Download",
      "btn.preview": "Preview",
      "btn.nofile": "No file yet",
      "unit.views": "views",
      "empty.none": "No announcements in this category yet",
      "empty.search": "No guides match your search",
      "empty.note": "See all items on the original website",
      "empty.link": "Open the other announcements page",
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

  /* ประกาศเรียงตามลำดับเดิมของเว็บ (num) */
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

  function buildRow(item) {
    var row = el("article", "doc-row doc-row--board");

    var icon = el("div", "doc-row__icon");
    icon.appendChild(svgIcon(ICONS.doc));

    var body = el("div", "doc-row__body");
    var badges = el("div", "doc-row__badges");
    badges.appendChild(el("span", "badge badge--type", categoryLabel(item.cat)));
    /* รายการที่มีรหัส EN/TH (ขั้นตอนการศึกษา) แสดงแค่ป้ายหมวด */
    if (!item.code) badges.appendChild(el("span", "badge badge--year", badgeText(item)));

    var title = el("h3", "doc-row__title", titleOf(item));

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
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
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
    list.slice(start, start + PAGE_SIZE).forEach(function (item) {
      listEl.appendChild(buildRow(item));
    });
    renderPagination(list.length);
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
