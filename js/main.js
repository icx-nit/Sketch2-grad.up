/* ==========================================================================
   main.js
   - รวมการทำงานของปุ่มต่าง ๆ ใน header
   - เรียกใช้ module ย่อย: theme / i18n / font-size / navigation / components
   ========================================================================== */

(function () {
  "use strict";

  function initLanguage() {
    if (!window.GUI18n) {
      return;
    }

    window.GUI18n.apply(window.GUI18n.stored());

    var button = document.querySelector("[data-lang-toggle]");
    if (button) {
      button.addEventListener("click", function () {
        window.GUI18n.toggle();
      });
    }
  }

  function initThemeToggle() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button || !window.GUTheme) {
      return;
    }

    function sync() {
      button.setAttribute("aria-pressed", String(window.GUTheme.get() === "dark"));
    }

    button.addEventListener("click", function () {
      window.GUTheme.toggle();
      sync();
    });

    document.addEventListener("gu:themechange", sync);
    sync();
  }

  function initHeaderHeight() {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    /* เก็บความสูงจริงของ header ไว้ใช้คำนวณความสูงฮีโร่ (รองรับฟอนต์ที่ปรับขนาด) */
    function sync() {
      document.documentElement.style.setProperty(
        "--header-h",
        header.getBoundingClientRect().height + "px"
      );
    }

    sync();
    window.addEventListener("resize", sync);

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(sync).observe(header);
    }
  }

  function initAnnounceAnimation() {
    var root = document.documentElement;

    /* หน้านี้ไม่มี attribute นี้ (เช่นถูกฝังใน iframe) ปล่อยให้ CSS ทำงานปกติ */
    if (root.getAttribute("data-announce") === null) {
      return;
    }

    var news = document.querySelector("#news");
    var revealed = false;
    var revealComplete = false;
    var lockTimer = 0;
    var desktopQuery = window.matchMedia("(min-width: 48rem)");
    /* เฉพาะการเลื่อนเว็บเท่านั้น (ไม่นับคลิก/กดแป้น/โฟกัส) */
    var triggers = ["wheel", "touchmove"];
    /* ปุ่มเลื่อนหน้าที่ใช้เริ่มแอนิเมชันประกาศ */
    var scrollKeys = ["ArrowDown", "PageDown", " ", "Spacebar", "End"];

    /* ยังอยู่ "หน้าแรก" (ภาพปก + ประกาศ) อยู่หรือไม่
       ดูจากตำแหน่งส่วนข่าว: ถ้าข่าวยังไม่ขึ้นมาถึงครึ่งล่างของจอ = ยังอยู่หน้าแรก */
    function inFirstView() {
      if (!news) {
        return true;
      }
      return news.getBoundingClientRect().top > window.innerHeight * 0.75;
    }

    /* ล็อกสถานะสุดท้ายของประกาศไว้ตรง ๆ หลังอนิเมชันเลื่อนขึ้นจบ
       กันกรณีเบราว์เซอร์พัก/ยกเลิกอนิเมชัน (สลับแท็บ, โหมดประหยัดพลังงาน)
       แล้วประกาศย้อนกลับไปโปร่งใส/หายไป */
    function lockVisible() {
      if (!revealed) {
        return;
      }
      revealComplete = true;
      var announce = document.querySelector(".announce");
      if (!announce) {
        return;
      }
      announce.style.animation = "none";
      announce.style.opacity = "1";

      Array.prototype.forEach.call(
        document.querySelectorAll(".announce-card"),
        function (card) {
          card.style.animation = "none";
          card.style.opacity = "1";
        }
      );
    }

    /* ซ่อนประกาศเมื่อเลื่อนพ้นหน้าแรก (ไปหน้าข่าว) แล้วรอให้ผู้ใช้เลื่อนอีกครั้ง
       ตอนกลับมาหน้าแรก จึงจะเลื่อนประกาศขึ้นมาใหม่ */
    function hideAnnounce() {
      window.clearTimeout(lockTimer);

      var announce = document.querySelector(".announce");
      if (announce) {
        /* ล้างสไตล์ที่ lockVisible ใส่ไว้ เพื่อให้ CSS animation เล่นใหม่ได้ */
        announce.style.animation = "";
        announce.style.opacity = "";
      }

      Array.prototype.forEach.call(
        document.querySelectorAll(".announce-card"),
        function (card) {
          card.style.animation = "";
          card.style.opacity = "";
        }
      );

      revealed = false;
      revealComplete = false;
      root.setAttribute("data-announce", "wait");
    }

    /* ประกาศเลื่อนขึ้นมาจากด้านล่างของภาพปก (เมื่อผู้ใช้เริ่มเลื่อนเว็บในหน้าแรก) */
    function reveal() {
      if (revealed || !inFirstView()) {
        return;
      }
      revealed = true;
      revealComplete = false;
      if (root.getAttribute("data-announce") !== "in") {
        root.setAttribute("data-announce", "in");
      }
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(lockVisible, 1300);
    }

    function consumeScrollUntilRevealed(event) {
      if (!desktopQuery.matches || !inFirstView() || revealComplete) {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
      reveal();
    }

    /* เลื่อนจนส่วนข่าวขึ้นมาอยู่ในจอ = ซ่อนประกาศ */
    function onScroll() {
      if (!news || !revealed) {
        return;
      }
      if (news.getBoundingClientRect().top <= window.innerHeight * 0.7) {
        hideAnnounce();
      }
    }

    function onKey(event) {
      if (scrollKeys.indexOf(event.key) !== -1) {
        consumeScrollUntilRevealed(event);
      }
    }

    /* ลิงก์ในหน้า (เช่น เมนู "ข่าว") = แสดงประกาศโดยไม่ขัดจังหวะการเลื่อน */
    function onLinkClick(event) {
      var node = event.target;
      var link =
        node && node.closest ? node.closest('a[href^="#"]') : null;
      if (link) {
        reveal();
      }
    }

    function onBreakpointChange(event) {
      if (!event.matches) {
        reveal();
      }
    }

    /* มือถือ/แท็บเล็ต: ประกาศอยู่ใต้ภาพอยู่แล้ว ไม่ต้องซ่อน */
    if (!desktopQuery.matches) {
      reveal();
      return;
    }

    /* เดสก์ท็อป: ซ่อนประกาศไว้ จนกว่าผู้ใช้จะเลื่อน/ปัด/กดปุ่มเลื่อนหน้า */
    triggers.forEach(function (type) {
      window.addEventListener(type, consumeScrollUntilRevealed, {
        passive: false,
        capture: true
      });
    });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onLinkClick);
    /* ฟังการเลื่อนเพื่อซ่อนประกาศเมื่อออกจากหน้าแรก */
    window.addEventListener("scroll", onScroll, { passive: true });

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", onBreakpointChange);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onBreakpointChange);
    }
  }

  function init() {
    initLanguage();
    initThemeToggle();
    initHeaderHeight();
    initAnnounceAnimation();

    if (window.GUFontSize) {
      window.GUFontSize.init();
    }

    if (window.GUComponents) {
      window.GUComponents.init();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
