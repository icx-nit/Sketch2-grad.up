/* ==========================================================================
   navigation.js
   - Dropdown ของ "ประกาศมหาวิทยาลัยพะเยา" และ "วารสาร"
   - เปิดด้วย hover และ click (DESIGN.md ข้อ 8: transition 150–300ms)
   - รองรับ keyboard: Enter/Space, ArrowDown, Escape
   ========================================================================== */

(function () {
  "use strict";

  var items = Array.prototype.slice.call(
    document.querySelectorAll(".nav-item--dropdown")
  );

  if (!items.length) {
    return;
  }

  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function triggerOf(item) {
    return item.querySelector(".nav-link__toggle");
  }

  function linksOf(item) {
    return item.querySelectorAll(".dropdown__link");
  }

  function open(item) {
    items.forEach(function (other) {
      if (other !== item) {
        close(other);
      }
    });
    item.classList.add("is-open");
    var trigger = triggerOf(item);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }
  }

  function close(item) {
    item.classList.remove("is-open");
    var trigger = triggerOf(item);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  }

  function closeAll() {
    items.forEach(close);
  }

  items.forEach(function (item) {
    var trigger = triggerOf(item);
    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", function () {
      if (item.classList.contains("is-open")) {
        close(item);
      } else {
        open(item);
      }
    });

    trigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        open(item);
        var first = linksOf(item)[0];
        if (first) {
          first.focus();
        }
      }
    });

    if (canHover) {
      item.addEventListener("mouseenter", function () {
        open(item);
      });

      item.addEventListener("mouseleave", function () {
        /* เอาเมาส์ออกแล้วปิดทันที ไม่ค้างไว้ */
        close(item);
      });
    }

    item.addEventListener("focusout", function (event) {
      if (!item.contains(event.relatedTarget)) {
        close(item);
      }
    });

    Array.prototype.forEach.call(linksOf(item), function (link) {
      link.addEventListener("click", function () {
        close(item);
      });
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-item--dropdown")) {
      closeAll();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    var openItem = document.querySelector(".nav-item--dropdown.is-open");
    if (!openItem) {
      return;
    }

    var trigger = triggerOf(openItem);
    close(openItem);
    if (trigger) {
      trigger.focus();
    }
  });

  /* เมื่อเปลี่ยนช่วงขนาดหน้าจอ ให้ปิด dropdown ที่ค้างอยู่ */
  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var onBreakpointChange = function () {
    closeAll();
  };
  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onBreakpointChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(onBreakpointChange);
  }

  /* คงเส้นสีทองไว้ที่เมนูที่ถูกกด (active) — ลิงก์เปิดแท็บใหม่ (เช่น ประเมินความพึงพอใจ) ไม่ใช้เส้นนี้ */
  var topLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-list > .nav-item > .nav-link:not([target=\"_blank\"])")
  );

  function select(link) {
    topLinks.forEach(function (other) {
      other.classList.remove("is-active");
      if (other.tagName === "A") {
        other.removeAttribute("aria-current");
      }
    });
    link.classList.add("is-active");
    if (link.tagName === "A") {
      link.setAttribute("aria-current", "page");
    }
  }

  topLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      select(link);
    });
  });

  window.GUNavigation = { closeAll: closeAll };
})();

/* ------------------------------------------------------------------------
   เมนูหลักตามตำแหน่งการเลื่อน (หน้าแรก): ลิงก์ที่มี data-spy จะติดสว่างเมื่อส่วนนั้นอยู่ในจอ
   ------------------------------------------------------------------------ */
(function () {
  "use strict";

  var topLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-list > .nav-item > a.nav-link")
  );
  var spyLinks = topLinks.filter(function (link) {
    return link.hasAttribute("data-spy");
  });
  if (!spyLinks.length) {
    return;
  }

  var home = document.querySelector('.nav-list > .nav-item > a.nav-link[href="index.html"]');
  var targets = spyLinks
    .map(function (link) {
      return { link: link, el: document.getElementById(link.getAttribute("data-spy")) };
    })
    .filter(function (t) {
      return !!t.el;
    });
  if (!targets.length) {
    return;
  }

  var ticking = false;

  function update() {
    ticking = false;
    var line = window.innerHeight * 0.4;
    var current = null;
    targets.forEach(function (t) {
      var r = t.el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) {
        current = t.link;
      }
    });
    var active = current || home;
    topLinks.forEach(function (link) {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });
    if (active) {
      active.classList.add("is-active");
      active.setAttribute("aria-current", "page");
    }
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();

