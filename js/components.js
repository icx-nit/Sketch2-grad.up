/* ==========================================================================
   components.js
   - ช่องค้นหา (เปิด/ปิดด้วยปุ่มแว่นขยาย)
   - Drawer เมนู 3 ขีด (ประเมินความพึงพอใจ / UP-Meeting / iThesis / เข้าสู่ระบบ)
   - จัดการ focus, Escape และล็อกการเลื่อนหน้าขณะเปิด drawer
   ========================================================================== */

(function () {
  "use strict";

  var FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  /* ------------------------------------------------------------------------
     Search
     ------------------------------------------------------------------------ */

  function initSearch() {
    var toggle = document.querySelector("[data-search-toggle]");
    var panel = document.getElementById("site-search");
    var input = document.getElementById("site-search-input");
    var form = panel ? panel.querySelector("form") : null;

    if (!toggle || !panel) {
      return;
    }

    function openSearch() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (input) {
        input.focus();
      }
    }

    function closeSearch(returnFocus) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (panel.hidden) {
        openSearch();
      } else {
        closeSearch(true);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closeSearch(true);
      }
    });

    /* ยังไม่มีระบบค้นหาหลังบ้าน – ป้องกันการโหลดหน้าใหม่ */
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }
  }

  /* ------------------------------------------------------------------------
     Drawer
     ------------------------------------------------------------------------ */

  function initDrawer() {
    var drawer = document.getElementById("site-drawer");
    var openButton = document.querySelector("[data-drawer-open]");
    var panel = drawer ? drawer.querySelector(".drawer__panel") : null;

    if (!drawer || !openButton || !panel) {
      return;
    }

    var lastFocused = null;

    function focusables() {
      return Array.prototype.filter.call(
        panel.querySelectorAll(FOCUSABLE),
        function (element) {
          return element.offsetParent !== null;
        }
      );
    }

    function openDrawer() {
      lastFocused = document.activeElement;
      drawer.hidden = false;
      drawer.removeAttribute("inert");
      drawer.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");

      /* บังคับ reflow หนึ่งครั้ง เพื่อให้ transition เริ่มจากสถานะปิด */
      void drawer.offsetWidth;
      drawer.classList.add("is-open");

      var first = focusables()[0];
      if (first) {
        first.focus();
      }
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      openButton.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      drawer.setAttribute("inert", "");
      document.body.classList.remove("is-locked");

      window.setTimeout(function () {
        drawer.hidden = true;
      }, 180);

      if (lastFocused && lastFocused !== document.body) {
        lastFocused.focus();
      } else {
        openButton.focus();
      }
    }

    openButton.addEventListener("click", openDrawer);

    Array.prototype.forEach.call(
      drawer.querySelectorAll("[data-drawer-close]"),
      function (element) {
        element.addEventListener("click", closeDrawer);
      }
    );

    Array.prototype.forEach.call(
      drawer.querySelectorAll(".drawer__link"),
      function (link) {
        link.addEventListener("click", closeDrawer);
      }
    );

    document.addEventListener("keydown", function (event) {
      if (drawer.hidden) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      var list = focusables();
      if (!list.length) {
        return;
      }

      var first = list[0];
      var last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function init() {
    initSearch();
    initDrawer();
  }

  window.GUComponents = { init: init };
})();
