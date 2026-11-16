/* ==========================================================================
   intro.js
   อนิเมชั่นก่อนเข้าสู่เว็บไซต์
   - ภาพเต็ม → แยกเปิดจากกลาง → โลโก้ซูมขึ้นบนพื้นขาว + กลีบดอกไม้ลอย
   - เริ่มนับเวลาเมื่อภาพพื้นหลังโหลดเสร็จ (กันภาพขาวแวบ)
   - คลิก หรือกด Esc เพื่อข้ามได้
   - เคารพ prefers-reduced-motion (ข้ามทันที)
   - แจ้ง event "gu:introdone" ให้ส่วนอื่น (เช่น popup ประชาสัมพันธ์) เริ่มทำงาน
   ========================================================================== */

(function () {
  "use strict";

  var overlay = document.querySelector("[data-intro-screen]");
  var root = document.documentElement;
  var finished = false;
  var started = false;
  var openTimer = 0;
  var finishTimer = 0;
  var fallbackTimer = 0;

  function finish() {
    if (finished || !overlay) {
      return;
    }
    finished = true;

    overlay.classList.add("intro--done");
    root.removeAttribute("data-intro");

    window.setTimeout(function () {
      overlay.hidden = true;
    }, 460);

    document.dispatchEvent(new Event("gu:introdone"));
  }

  if (!overlay) {
    root.removeAttribute("data-intro");
    return;
  }

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    finish();
    return;
  }

  overlay.classList.add("is-active");

  function startTimeline() {
    if (started || finished) {
      return;
    }
    started = true;
    window.clearTimeout(fallbackTimer);

    openTimer = window.setTimeout(function () {
      overlay.classList.add("intro--open");
    }, 700);

    finishTimer = window.setTimeout(finish, 2200);
  }

  /* รอให้ภาพพื้นหลังพร้อมก่อน แล้วค่อยเริ่ม (มีเพดานเวลากันค้าง) */
  var cover = new Image();
  cover.onload = startTimeline;
  cover.onerror = startTimeline;
  cover.src = "assets/images/ปก.png";
  fallbackTimer = window.setTimeout(startTimeline, 1600);

  function skip() {
    window.clearTimeout(openTimer);
    window.clearTimeout(finishTimer);
    window.clearTimeout(fallbackTimer);
    finish();
  }

  overlay.addEventListener("click", skip);
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      skip();
    }
  });
})();
