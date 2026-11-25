/* ==========================================================================
   layout.js: สร้าง Sidebar และ Topbar ครอบ <main id="bd-main"> ของทุกหน้า
   - Sidebar ย่อ/ขยายได้ จอ < 900px เป็น Drawer เปิดจากปุ่มเมนู
   - สลับธีมผ่าน GUTheme (คีย์ gu-theme) และสลับภาษาผ่าน GUI18n (คีย์ gu-language)
   - วาดข้อความใหม่ทุกครั้งที่เปลี่ยนภาษา (renderer "layout")
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;
  var I = window.GUBD.i18n;
  var t = ui.t;

  var NAV = [
    { th: "ภาพรวม", en: "Overview", items: [
      { id: "overview", th: "ภาพรวม", en: "Overview", href: "index.html", icon: "dashboard" }
    ] },
    { th: "จัดการเนื้อหา", en: "Content", items: [
      { id: "news", th: "ข่าวสาร", en: "News", href: "news.html", icon: "news" },
      { id: "popups", th: "ประกาศป๊อปอัป", en: "Pop-up notices", href: "popups.html", icon: "popups" },
      { id: "documents", th: "เอกสารและคู่มือ", en: "Documents & guides", href: "documents.html", icon: "documents" },
      { id: "links", th: "ลิงก์และหน่วยงาน", en: "Links & agencies", href: "links.html", icon: "link" },
      { id: "categories", th: "หมวดหมู่", en: "Categories", href: "categories.html", icon: "tag" },
      { id: "translations", th: "คำแปลภาษาอังกฤษ", en: "English translations", href: "translations.html", icon: "globe" },
      { id: "calendar", th: "ปฏิทินกิจกรรม", en: "Activity calendar", href: "calendar.html", icon: "calendar" }
    ] },
    { th: "รายงาน", en: "Reports", items: [
      { id: "statistics", th: "สถิติ บศ.1", en: "GS.1 statistics", href: "statistics.html", icon: "chart" }
    ] }
  ];

  function findPage(id) {
    var found = null;
    NAV.forEach(function (g) { g.items.forEach(function (i) { if (i.id === id) { found = i; } }); });
    return found;
  }

  function build() {
    var main = document.getElementById("bd-main");
    if (!main) { return; }
    var pageId = document.body.getAttribute("data-page") || "overview";

    /* โครงคงที่ สร้างครั้งเดียว ส่วนเนื้อหาด้านในวาดใหม่ทุกครั้ง */
    var shell = h("div", { class: "bd-shell" });
    var sidebar = h("aside", { class: "bd-sidebar", id: "bd-sidebar" });
    var topbar = h("header", { class: "bd-topbar" });
    var proto = h("p", { class: "bd-proto", role: "note" });
    var scrim = h("div", { class: "bd-scrim", "aria-hidden": "true" });
    var mainWrap = h("div", { class: "bd-main" }, [topbar, proto]);
    main.parentNode.insertBefore(shell, main);
    main.classList.add("bd-content");
    mainWrap.appendChild(main);
    shell.appendChild(sidebar);
    shell.appendChild(mainWrap);
    shell.appendChild(scrim);

    var mobile = window.matchMedia("(max-width: 899px)");
    var refs = { collapse: null, menu: null, theme: null, lang: null, user: null, pop: null, userBtn: null };

    function setCollapsed(on) {
      shell.classList.toggle("is-collapsed", on);
      if (refs.collapse) {
        refs.collapse.setAttribute("aria-pressed", on ? "true" : "false");
        refs.collapse.setAttribute("title", on ? t("ขยายเมนูด้านข้าง", "Expand sidebar") : t("ย่อเมนูด้านข้าง", "Collapse sidebar"));
      }
    }
    function setOpen(on) {
      shell.classList.toggle("is-open", on);
      if (refs.menu) {
        refs.menu.setAttribute("aria-expanded", on ? "true" : "false");
        refs.menu.setAttribute("aria-label", on ? t("ปิดเมนู", "Close menu") : t("เปิดเมนู", "Open menu"));
      }
      document.documentElement.style.overflow = on ? "hidden" : "";
    }
    function closePop(returnFocus) {
      if (!refs.pop) { return; }
      refs.pop.hidden = true;
      refs.userBtn.setAttribute("aria-expanded", "false");
      if (returnFocus) { refs.userBtn.focus(); }
    }

    var SOURCES = [
      { key: "news", page: "news.html", icon: "news", th: "ข่าวสาร", en: "News", f: ["titleTh", "titleEn"] },
      { key: "popups", page: "popups.html", icon: "popups", th: "ป๊อปอัป", en: "Pop-ups", f: ["titleTh", "titleEn"] },
      { key: "documents", page: "documents.html", icon: "documents", th: "เอกสาร", en: "Documents", f: ["titleTh", "titleEn"] },
      { key: "links", page: "links.html", icon: "link", th: "ลิงก์", en: "Links", f: ["nameTh", "nameEn"] },
      { key: "categories", page: "categories.html", icon: "tag", th: "หมวดหมู่", en: "Categories", f: ["nameTh", "nameEn"] },
      { key: "calendar", page: "calendar.html", icon: "calendar", th: "กิจกรรม", en: "Activities", f: ["titleTh", "titleEn"] }
    ];

    /* ค้นหารวมทุกส่วนจากข้อมูลตัวอย่าง กด / เพื่อโฟกัสช่องค้นหา */
    function buildSearch() {
      var input = h("input", { type: "search", class: "bd-gsearch__input", placeholder: t("ค้นหาข่าว เอกสาร กิจกรรม...", "Search news, documents, activities..."), "aria-label": t("ค้นหาทั้งระบบ", "Search everything"), autocomplete: "off", "aria-controls": "bd-gsearch-list" });
      var listEl = h("ul", { class: "bd-gsearch__list", id: "bd-gsearch-list", hidden: true });
      var box = h("div", { class: "bd-gsearch" }, [ui.icon("search"), input, h("kbd", { text: "/", "aria-hidden": "true" }), listEl]);
      function run() {
        var q = input.value.trim().toLowerCase();
        ui.clear(listEl);
        if (!q) { listEl.hidden = true; return; }
        var hits = [];
        SOURCES.forEach(function (src) {
          (window.GUBD.getData(src.key) || []).forEach(function (row) {
            var hay = src.f.map(function (k) { return String(row[k] || ""); }).join(" ").toLowerCase();
            if (hay.indexOf(q) !== -1) { hits.push({ src: src, row: row }); }
          });
        });
        hits.slice(0, 8).forEach(function (x) {
          var name = I.lang() === "en" && (x.row[x.src.f[1]]) ? x.row[x.src.f[1]] : x.row[x.src.f[0]];
          listEl.appendChild(h("li", null, h("a", { href: x.src.page + "?q=" + encodeURIComponent(input.value.trim()) }, [ui.icon(x.src.icon), h("span", { class: "bd-gsearch__name", text: name }), h("small", { text: t(x.src.th, x.src.en) })])));
        });
        if (!hits.length) { listEl.appendChild(h("li", { class: "bd-gsearch__none", text: t("ไม่พบรายการที่ตรงกัน", "No matching items") })); }
        listEl.hidden = false;
      }
      input.addEventListener("input", run);
      input.addEventListener("focus", run);
      document.addEventListener("click", function (e) { if (!box.contains(e.target)) { listEl.hidden = true; } });
      input.addEventListener("keydown", function (e) { if (e.key === "Escape") { listEl.hidden = true; input.blur(); } });
      return box;
    }
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") {
        var el = document.querySelector(".bd-gsearch__input");
        if (el) { e.preventDefault(); el.focus(); }
      }
    });

    function paint() {
      var current = findPage(pageId);
      var title = current ? t(current.th, current.en) : t("ภาพรวม", "Overview");
      var dark = window.GUTheme && window.GUTheme.get() === "dark";
      var en = I.lang() === "en";

      /* ---------- Sidebar ---------- */
      ui.clear(sidebar);
      var brand = h("a", { class: "bd-brand", href: "index.html", "aria-label": t("GRAD UP Dashboard หน้าภาพรวม", "GRAD UP Dashboard, overview") }, [
        h("span", { class: "bd-brand__mark" }, h("img", { src: "../assets/images/grad-logo.png", alt: "", width: "30", height: "30" })),
        h("span", { class: "bd-brand__text" }, [h("span", { class: "bd-brand__name", text: "GRAD UP" }), h("span", { class: "bd-brand__sub", text: t("ระบบจัดการเนื้อหา", "Content management") })])
      ]);
      var nav = h("nav", { class: "bd-nav", "aria-label": t("เมนูหลัก", "Main menu") });
      NAV.forEach(function (group) {
        var box = h("div", { class: "bd-nav__group" }, h("p", { class: "bd-nav__title", text: t(group.th, group.en) }));
        group.items.forEach(function (item) {
          var label = t(item.th, item.en);
          box.appendChild(h("a", { class: "bd-nav__link", href: item.href, title: label, "aria-current": item.id === pageId ? "page" : null }, [
            ui.icon(item.icon, "bd-nav__icon"), h("span", { class: "bd-nav__label", text: label })
          ]));
        });
        nav.appendChild(box);
      });
      nav.addEventListener("click", function (event) { if (mobile.matches && event.target.closest("a")) { setOpen(false); } });
      refs.collapse = h("button", { type: "button", class: "bd-collapse" }, [ui.icon("panel"), h("span", { class: "bd-collapse__label", text: t("ย่อเมนู", "Collapse") })]);
      refs.collapse.addEventListener("click", function () { setCollapsed(!shell.classList.contains("is-collapsed")); });
      sidebar.appendChild(brand);
      sidebar.appendChild(nav);
      sidebar.appendChild(h("div", { class: "bd-sidebar__foot" }, refs.collapse));
      setCollapsed(shell.classList.contains("is-collapsed"));

      /* ---------- Topbar ---------- */
      ui.clear(topbar);
      refs.menu = h("button", { type: "button", class: "bd-icon-btn bd-menu-btn", "aria-controls": "bd-sidebar", "aria-expanded": "false", "aria-label": t("เปิดเมนู", "Open menu") }, ui.icon("menu"));
      refs.menu.addEventListener("click", function () { setOpen(!shell.classList.contains("is-open")); });
      var crumbs = h("nav", { class: "bd-crumbs", "aria-label": t("เส้นทางหน้า", "Breadcrumb") }, [
        h("a", { href: "index.html", text: t("แดชบอร์ด", "Dashboard") }), ui.icon("chevronRight"),
        h("span", { "aria-current": "page", text: title })
      ]);
      var todayChip = h("span", { class: "bd-today" }, [ui.icon("clock"), ui.fmtDateLong(new Date())]);

      refs.lang = h("button", { type: "button", class: "bd-lang-btn", "aria-label": en ? "Switch to Thai" : "เปลี่ยนเป็นภาษาอังกฤษ", title: en ? "Switch to Thai" : "เปลี่ยนเป็นภาษาอังกฤษ" }, [
        ui.icon("globe"), h("span", { text: en ? "TH" : "EN" })
      ]);
      refs.lang.addEventListener("click", function () { I.toggle(); });

      refs.theme = h("button", { type: "button", class: "bd-switch", role: "switch", "aria-checked": dark ? "true" : "false", "aria-label": t("โหมดมืด", "Dark mode"), title: dark ? t("สลับเป็นโหมดสว่าง", "Switch to light mode") : t("สลับเป็นโหมดมืด", "Switch to dark mode") }, [
        ui.icon("sun"), ui.icon("moon"), h("span", { class: "bd-switch__thumb" })
      ]);
      refs.theme.addEventListener("click", function () { if (window.GUTheme) { window.GUTheme.toggle(); } });

      refs.userBtn = h("button", { type: "button", class: "bd-user__btn", "aria-expanded": "false", "aria-haspopup": "true", "aria-controls": "bd-user-pop" }, [
        h("span", { class: "bd-user__avatar", "aria-hidden": "true", text: t("ผ", "A") }),
        h("span", { class: "bd-user__who" }, [h("span", { class: "bd-user__name", text: t("ผู้ดูแลระบบ", "Administrator") }), h("span", { class: "bd-user__role", text: t("บัญชีตัวอย่าง", "Sample account") })]),
        ui.icon("chevronDown")
      ]);
      refs.pop = h("div", { class: "bd-pop", id: "bd-user-pop", hidden: true }, [
        h("p", { class: "bd-pop__note", text: t("ต้นแบบ UI: ยังไม่เชื่อมระบบบัญชีผู้ใช้", "UI prototype: user account system not connected") }),
        h("a", { href: "../index.html" }, [ui.icon("home"), t("กลับไปเว็บไซต์หลัก", "Back to the main website")]),
        h("a", { href: "../login.html" }, [ui.icon("login"), t("หน้าเข้าสู่ระบบ", "Sign-in page")])
      ]);
      refs.user = h("div", { class: "bd-user" }, [refs.userBtn, refs.pop]);
      refs.userBtn.addEventListener("click", function () {
        var open = refs.pop.hidden;
        refs.pop.hidden = !open;
        refs.userBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });

      topbar.appendChild(refs.menu);
      topbar.appendChild(h("div", { class: "bd-topbar__lead" }, [crumbs, h("p", { class: "bd-topbar__title", text: title })]));
      topbar.appendChild(buildSearch());
      topbar.appendChild(h("div", { class: "bd-topbar__tools" }, [todayChip, refs.lang, refs.theme, refs.user]));

      /* ---------- แถบแจ้งว่าเป็นต้นแบบ ---------- */
      ui.clear(proto);
      proto.appendChild(ui.icon("alert"));
      proto.appendChild(h("span", { text: t(
        "ต้นแบบ UI: ข้อมูลเป็นข้อมูลตัวอย่างที่เก็บในหน้านี้ชั่วคราว รีเฟรชแล้วกลับเป็นค่าเริ่มต้น ยังไม่มีระบบเข้าสู่ระบบและยังไม่เชื่อมระบบจริง",
        "UI prototype: sample data is kept on this page only. Refreshing restores the defaults. There is no sign-in and no live system connection."
      ) }));

      document.title = title + " | GRAD UP Dashboard (" + t("ต้นแบบ", "prototype") + ")";
      var desc = document.querySelector('meta[name="description"]');
      if (desc) { desc.setAttribute("content", t("ต้นแบบ UI ของระบบจัดการเนื้อหา GRAD UP ใช้ข้อมูลจำลอง", "UI prototype of the GRAD UP content management system, using sample data")); }
    }

    /* ---------- พฤติกรรมที่ไม่ต้องวาดใหม่ ---------- */
    setCollapsed(window.innerWidth >= 900 && window.innerWidth < 1200);
    scrim.addEventListener("click", function () { setOpen(false); if (refs.menu) { refs.menu.focus(); } });
    document.addEventListener("click", function (event) { if (refs.user && !refs.user.contains(event.target)) { closePop(false); } });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") { return; }
      if (refs.pop && !refs.pop.hidden) { closePop(true); }
      else if (shell.classList.contains("is-open")) { setOpen(false); if (refs.menu) { refs.menu.focus(); } }
    });
    var onMq = function () { if (!mobile.matches) { setOpen(false); } };
    if (mobile.addEventListener) { mobile.addEventListener("change", onMq); } else { mobile.addListener(onMq); }
    document.addEventListener("gu:themechange", paint);

    paint();
    I.register("layout", paint);
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", build); }
  else { build(); }
})();
