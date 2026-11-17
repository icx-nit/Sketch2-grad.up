(function () {
  "use strict";

  /* ==========================================================================
     Data — รายการคำสั่งแต่งตั้งอาจารย์บัณฑิตศึกษา (ตามเว็บ GRAD)
     ปีที่ยังไม่มีข้อมูลจะแสดงสถานะว่างพร้อมลิงก์ไปยังเว็บต้นฉบับ
     ========================================================================== */

  var SOURCE_URL = "https://grad.up.ac.th/announce/command";

  var COMMANDS = {
    "2569": [
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์บัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569 ฉบับที่ 3",
        date: "2026-10-19", label: "19 ต.ค. 2569", views: 19,
        pdf: "https://grad.up.ac.th/uploads/announce/6ad5722e69289fw7GW.pdf"
      },
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์พิเศษบัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569 ฉบับที่ 3",
        date: "2026-10-19", label: "19 ต.ค. 2569", views: 10,
        pdf: "https://grad.up.ac.th/uploads/announce/6ad5714018b6etNwYQ.pdf"
      },
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์บัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569 ฉบับที่ 2",
        date: "2026-08-31", label: "31 ส.ค. 2569", views: 65,
        pdf: "https://grad.up.ac.th/uploads/announce/6a965241806a078wso.pdf"
      },
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์พิเศษบัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569 ฉบับที่ 2",
        date: "2026-08-31", label: "31 ส.ค. 2569", views: 42,
        pdf: "https://grad.up.ac.th/uploads/announce/6a94ff813816bihxqA.pdf"
      },
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์บัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569",
        date: "2026-07-13", label: "13 ก.ค. 2569", views: 176,
        pdf: "https://grad.up.ac.th/uploads/announce/6a7983b305d8bTmJ4k.pdf"
      },
      {
        title: "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์พิเศษบัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา 2569",
        date: "2026-07-13", label: "13 ก.ค. 2569", views: 92,
        pdf: "https://grad.up.ac.th/uploads/announce/6a798432a2bb8Gly7y.pdf"
      }
    ]
  };

  /* ==========================================================================
     Year tabs + list rendering
     ========================================================================== */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".year-tab"));
  var grid = document.getElementById("command-grid");
  var panel = document.getElementById("command-panel-body");
  var statCount = document.getElementById("stat-count");

  var ICON_EYE = "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z";
  var ICON_ARROW = "M7 17 17 7M7 7h10v10";

  function svgIcon(pathD, extraClass) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    if (extraClass) svg.setAttribute("class", extraClass);
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", pathD);
    svg.appendChild(path);
    if (pathD === ICON_EYE) {
      var circle = document.createElementNS(NS, "circle");
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "3");
      svg.appendChild(circle);
    }
    return svg;
  }

  function buildCard(item, index) {
    var card = document.createElement("article");
    card.className = "cmd-card";

    var top = document.createElement("div");
    top.className = "cmd-card__top";

    var badge = document.createElement("span");
    badge.className = "cmd-card__badge";
    badge.textContent = "คำสั่งแต่งตั้ง";

    var num = document.createElement("span");
    num.className = "cmd-card__index";
    num.textContent = String(index + 1).padStart(2, "0");

    top.appendChild(badge);
    top.appendChild(num);

    var title = document.createElement("h3");
    title.className = "cmd-card__title";
    title.textContent = item.title;

    var foot = document.createElement("div");
    foot.className = "cmd-card__foot";

    var meta = document.createElement("ul");
    meta.className = "cmd-card__meta";

    var liDate = document.createElement("li");
    var time = document.createElement("time");
    time.setAttribute("datetime", item.date);
    time.textContent = item.label;
    liDate.appendChild(time);

    var liViews = document.createElement("li");
    liViews.className = "cmd-card__views";
    liViews.appendChild(svgIcon(ICON_EYE));
    var viewsText = document.createElement("span");
    viewsText.textContent = item.views.toLocaleString("th-TH") + " ครั้ง";
    liViews.appendChild(viewsText);

    meta.appendChild(liDate);
    meta.appendChild(liViews);

    var link = document.createElement("a");
    link.className = "cmd-card__pdf";
    link.href = item.pdf;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    var linkText = document.createElement("span");
    linkText.textContent = "เปิดอ่าน PDF";
    link.appendChild(linkText);
    link.appendChild(svgIcon(ICON_ARROW));

    foot.appendChild(meta);
    foot.appendChild(link);

    card.appendChild(top);
    card.appendChild(title);
    card.appendChild(foot);
    return card;
  }

  function buildEmpty(year) {
    var box = document.createElement("div");
    box.className = "cmd-empty";

    var heading = document.createElement("h3");
    heading.textContent = year === "manual"
      ? "ยังไม่มีรายการคู่มือในหน้านี้"
      : "ยังไม่มีรายการของปีการศึกษา " + year + " ในหน้านี้";

    var desc = document.createElement("p");
    desc.textContent = "ดูรายการทั้งหมดได้ที่เว็บไซต์ต้นฉบับ";

    var link = document.createElement("a");
    link.className = "command-source-link command-source-link--dark";
    link.href = SOURCE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    var linkText = document.createElement("span");
    linkText.textContent = "เปิดเว็บไซต์ GRAD";
    link.appendChild(linkText);
    link.appendChild(svgIcon(ICON_ARROW));

    box.appendChild(heading);
    box.appendChild(desc);
    box.appendChild(link);
    return box;
  }

  function render(year) {
    var items = COMMANDS[year];
    grid.textContent = "";

    if (items && items.length) {
      items.forEach(function (item, i) {
        grid.appendChild(buildCard(item, i));
      });
      statCount.textContent = String(items.length);
    } else {
      grid.appendChild(buildEmpty(year));
      statCount.textContent = "0";
    }
  }

  function activate(tab, moveFocus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.setAttribute("tabindex", selected ? "0" : "-1");
    });
    panel.setAttribute("aria-labelledby", tab.id);
    render(tab.getAttribute("data-year"));
    if (moveFocus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      activate(tab, false);
    });

    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        activate(next, true);
      }
    });
  });

  var initial = document.querySelector(".year-tab[aria-selected='true']") || tabs[0];
  if (initial) activate(initial, false);

  /* ==========================================================================
     Dropdown menus (click to toggle on touch, hover on desktop)
     ========================================================================== */

  var dropdowns = document.querySelectorAll(".tabbar__dropdown");

  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector(":scope > .tabbar__link");
    var menu = dropdown.querySelector(":scope > .tabbar__dropdown-menu");

    if (!trigger || !menu) return;

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = dropdown.classList.contains("open");

      /* ปิด dropdown อื่นทั้งหมด */
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("open");
          other.querySelector(".tabbar__link").setAttribute("aria-expanded", "false");
        }
      });

      dropdown.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ปิด dropdown เมื่อคลิกที่อื่น */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".tabbar__dropdown")) {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove("open");
        dropdown.querySelector(".tabbar__link").setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ==========================================================================
     Font size controls
     ========================================================================== */

  var BASE_FONT_SIZE = 16;
  var STORAGE_KEY = "gu-font-size";
  var root = document.documentElement;

  function readFontSize() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      var val = saved ? parseInt(saved, 10) : 0;
      return (val >= 12 && val <= 24) ? val : 0;
    } catch {
      return 0;
    }
  }

  function writeFontSize(size) {
    try {
      localStorage.setItem(STORAGE_KEY, String(size));
    } catch { /* localStorage ถูกปิดใช้งาน */ }
  }

  var savedSize = readFontSize();
  if (savedSize > 0) {
    root.style.setProperty("--font-scale", savedSize / BASE_FONT_SIZE);
  }

  var sizeButtons = document.querySelectorAll("[data-font-size]");
  sizeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var action = btn.getAttribute("data-font-size");
      var currentSize = savedSize || BASE_FONT_SIZE;
      var newSize = currentSize;

      if (action === "decrease") {
        newSize = Math.max(12, currentSize - 1);
      } else if (action === "increase") {
        newSize = Math.min(24, currentSize + 1);
      } else if (action === "reset") {
        newSize = BASE_FONT_SIZE;
      }

      savedSize = newSize;
      root.style.setProperty("--font-scale", newSize / BASE_FONT_SIZE);
      writeFontSize(newSize);
    });
  });

  /* ==========================================================================
     Theme toggle (tabbar button)
     ========================================================================== */

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle && window.GUTheme) {
    function updateIcons() {
      var isDark = window.GUTheme.get() === "dark";
      themeToggle.setAttribute("aria-label", isDark ? "เปลี่ยนธีมเป็นสว่าง" : "เปลี่ยนธีมเป็นมืด");
    }

    themeToggle.addEventListener("click", function () {
      window.GUTheme.toggle();
    });

    document.addEventListener("gu:themechange", updateIcons);
    updateIcons();
  }

})();
