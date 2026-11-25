/* ==========================================================================
   layout.js: สร้าง Sidebar และ Topbar ครอบ <main id="bd-main"> ของทุกหน้า
   - Sidebar ย่อ/ขยายได้ (จำในหน่วยความจำของหน้า ไม่เพิ่มคีย์ localStorage)
   - จอ < 900px เป็น Drawer เปิดจากปุ่มเมนู
   - สลับธีมผ่าน GUTheme จาก ../js/theme.js (คีย์ gu-theme เดิมของเว็บ)
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;

  var NAV = [
    { title: "ภาพรวม", items: [{ id: "overview", label: "ภาพรวม", href: "index.html", icon: "dashboard" }] },
    {
      title: "จัดการเนื้อหา",
      items: [
        { id: "news", label: "ข่าวสาร", href: "news.html", icon: "news" },
        { id: "popups", label: "ประกาศป๊อปอัป", href: "popups.html", icon: "popups" },
        { id: "documents", label: "เอกสารและคู่มือ", href: "documents.html", icon: "documents" },
        { id: "links", label: "ลิงก์และหน่วยงาน", href: "links.html", icon: "link" },
        { id: "categories", label: "หมวดหมู่", href: "categories.html", icon: "tag" },
        { id: "calendar", label: "ปฏิทินกิจกรรม", href: "calendar.html", icon: "calendar" }
      ]
    },
    {
      title: "รายงาน",
      items: [{ id: "statistics", label: "สถิติ บศ.1", href: "statistics.html", icon: "chart" }]
    }
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
    var current = findPage(pageId);
    var title = current ? current.label : "ภาพรวม";

    /* ---------- Sidebar ---------- */
    var brand = h("a", { class: "bd-brand", href: "index.html", "aria-label": "GRAD UP Dashboard หน้าภาพรวม" }, [
      h("span", { class: "bd-brand__mark" }, h("img", { src: "../assets/images/grad-logo.png", alt: "", width: "30", height: "30" })),
      h("span", { class: "bd-brand__text" }, [h("span", { class: "bd-brand__name", text: "GRAD UP" }), h("span", { class: "bd-brand__sub", text: "ระบบจัดการเนื้อหา" })])
    ]);

    var nav = h("nav", { class: "bd-nav", "aria-label": "เมนูหลัก" });
    NAV.forEach(function (group) {
      var box = h("div", { class: "bd-nav__group" }, h("p", { class: "bd-nav__title", text: group.title }));
      group.items.forEach(function (item) {
        box.appendChild(h("a", {
          class: "bd-nav__link", href: item.href, title: item.label,
          "aria-current": item.id === pageId ? "page" : null
        }, [ui.icon(item.icon, "bd-nav__icon"), h("span", { class: "bd-nav__label", text: item.label })]));
      });
      nav.appendChild(box);
    });

    var collapseBtn = h("button", { type: "button", class: "bd-collapse", "aria-pressed": "false" }, [
      ui.icon("panel"), h("span", { class: "bd-collapse__label", text: "ย่อเมนู" })
    ]);
    var sidebar = h("aside", { class: "bd-sidebar", id: "bd-sidebar", "aria-label": "เมนูด้านข้าง" }, [
      brand, nav, h("div", { class: "bd-sidebar__foot" }, collapseBtn)
    ]);

    /* ---------- Topbar ---------- */
    var menuBtn = h("button", { type: "button", class: "bd-icon-btn bd-menu-btn", "aria-label": "เปิดเมนู", "aria-controls": "bd-sidebar", "aria-expanded": "false" }, ui.icon("menu"));

    var crumbs = h("nav", { class: "bd-crumbs", "aria-label": "เส้นทางหน้า" }, [
      h("a", { href: "index.html", text: "แดชบอร์ด" }),
      ui.icon("chevronRight"),
      h("span", { "aria-current": "page", text: title })
    ]);

    var todayChip = h("span", { class: "bd-today" }, [ui.icon("clock"), ui.fmtDateLong(new Date())]);

    var themeBtn = h("button", { type: "button", class: "bd-icon-btn" });
    function paintTheme() {
      var dark = window.GUTheme && window.GUTheme.get() === "dark";
      ui.clear(themeBtn);
      themeBtn.appendChild(ui.icon(dark ? "sun" : "moon"));
      themeBtn.setAttribute("aria-label", dark ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด");
      themeBtn.setAttribute("title", dark ? "โหมดสว่าง" : "โหมดมืด");
    }
    themeBtn.addEventListener("click", function () { if (window.GUTheme) { window.GUTheme.toggle(); } });
    document.addEventListener("gu:themechange", paintTheme);
    paintTheme();

    /* เมนูผู้ใช้ (ต้นแบบ: ยังไม่เชื่อมระบบบัญชี) */
    var userBtn = h("button", { type: "button", class: "bd-user__btn", "aria-expanded": "false", "aria-haspopup": "true", "aria-controls": "bd-user-pop" }, [
      h("span", { class: "bd-user__avatar", "aria-hidden": "true", text: "ผ" }),
      h("span", { class: "bd-user__who" }, [h("span", { class: "bd-user__name", text: "ผู้ดูแลระบบ" }), h("span", { class: "bd-user__role", text: "บัญชีตัวอย่าง" })]),
      ui.icon("chevronDown")
    ]);
    var pop = h("div", { class: "bd-pop", id: "bd-user-pop", hidden: true }, [
      h("p", { class: "bd-pop__note", text: "ต้นแบบ UI: ยังไม่เชื่อมระบบบัญชีผู้ใช้" }),
      h("a", { href: "../index.html" }, [ui.icon("home"), "กลับไปเว็บไซต์หลัก"]),
      h("a", { href: "../login.html" }, [ui.icon("login"), "หน้าเข้าสู่ระบบ"])
    ]);
    var user = h("div", { class: "bd-user" }, [userBtn, pop]);

    function closePop(returnFocus) {
      pop.hidden = true;
      userBtn.setAttribute("aria-expanded", "false");
      if (returnFocus) { userBtn.focus(); }
    }
    userBtn.addEventListener("click", function () {
      var open = pop.hidden;
      pop.hidden = !open;
      userBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (event) { if (!user.contains(event.target)) { closePop(false); } });

    var topbar = h("header", { class: "bd-topbar" }, [
      menuBtn,
      h("div", { class: "bd-topbar__lead" }, [crumbs, h("p", { class: "bd-topbar__title", text: title })]),
      h("div", { class: "bd-topbar__tools" }, [todayChip, themeBtn, user])
    ]);

    var proto = h("p", { class: "bd-proto", role: "note" }, [
      ui.icon("alert"),
      h("span", { text: "ต้นแบบ UI: ข้อมูลเป็นข้อมูลตัวอย่างที่เก็บในหน้านี้ชั่วคราว รีเฟรชแล้วกลับเป็นค่าเริ่มต้น ยังไม่มีระบบเข้าสู่ระบบและยังไม่เชื่อมระบบจริง" })
    ]);

    var scrim = h("div", { class: "bd-scrim", "aria-hidden": "true" });

    /* ---------- ประกอบโครง ---------- */
    var shell = h("div", { class: "bd-shell" });
    var mainWrap = h("div", { class: "bd-main" }, [topbar, proto]);
    main.parentNode.insertBefore(shell, main);
    main.classList.add("bd-content");
    mainWrap.appendChild(main);
    shell.appendChild(sidebar);
    shell.appendChild(mainWrap);
    shell.appendChild(scrim);

    /* ---------- พฤติกรรม ---------- */
    var mobile = window.matchMedia("(max-width: 899px)");

    function setCollapsed(on) {
      shell.classList.toggle("is-collapsed", on);
      collapseBtn.setAttribute("aria-pressed", on ? "true" : "false");
      collapseBtn.setAttribute("title", on ? "ขยายเมนูด้านข้าง" : "ย่อเมนูด้านข้าง");
    }
    function setOpen(on) {
      shell.classList.toggle("is-open", on);
      menuBtn.setAttribute("aria-expanded", on ? "true" : "false");
      menuBtn.setAttribute("aria-label", on ? "ปิดเมนู" : "เปิดเมนู");
      document.documentElement.style.overflow = on ? "hidden" : "";
    }

    /* แท็บเล็ต (900–1199px) เริ่มแบบย่อเพื่อเหลือพื้นที่เนื้อหา */
    setCollapsed(window.innerWidth >= 900 && window.innerWidth < 1200);

    collapseBtn.addEventListener("click", function () { setCollapsed(!shell.classList.contains("is-collapsed")); });
    menuBtn.addEventListener("click", function () { setOpen(!shell.classList.contains("is-open")); });
    scrim.addEventListener("click", function () { setOpen(false); menuBtn.focus(); });
    nav.addEventListener("click", function (event) { if (mobile.matches && event.target.closest("a")) { setOpen(false); } });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") { return; }
      if (!pop.hidden) { closePop(true); }
      else if (shell.classList.contains("is-open")) { setOpen(false); menuBtn.focus(); }
    });
    var onMq = function () { if (!mobile.matches) { setOpen(false); } };
    if (mobile.addEventListener) { mobile.addEventListener("change", onMq); } else { mobile.addListener(onMq); }

    document.title = (current ? current.label : "ภาพรวม") + " | GRAD UP Dashboard (ต้นแบบ)";
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", build); }
  else { build(); }
})();
