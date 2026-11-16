/* ==========================================================================
   animations.js
   เปิดอนิเมชั่นเมื่อเลื่อนมาถึง (scroll reveal) ด้วย IntersectionObserver
   - สถิติการดำเนินงาน: การ์ดสรุป + แผงกราฟ
   - ส่วนติดต่อเรา: พาดหัว + ช่องทางติดต่อ (ที่อยู่ / โทรศัพท์ / อีเมล)
   - เคารพ prefers-reduced-motion: ข้ามทั้งหมดและแสดงเนื้อหาปกติ
   - ถ้าเบราว์เซอร์ไม่รองรับ จะไม่ซ่อนเนื้อหาเลย
   ========================================================================== */

(function () {
  "use strict";

  var GROUPS = [
    { selector: ".stats-section__head", className: "js-reveal" },
    {
      selector: ".stats-card",
      className: "js-reveal js-reveal--zoom",
      step: 110
    },
    {
      selector: ".stats-panel",
      className: "js-reveal",
      step: 140,
      start: 120
    },
    { selector: ".support-hero__title", className: "js-reveal" },
    { selector: ".support-hero__rule", className: "js-reveal--line" },
    { selector: ".support-contact__title", className: "js-reveal" },
    {
      selector: ".support-contact__item",
      className: "js-reveal",
      step: 120
    }
  ];

  function reducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function init() {
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      return;
    }

    document.documentElement.classList.add("js-anim");

    var targets = [];

    GROUPS.forEach(function (group) {
      Array.prototype.forEach.call(
        document.querySelectorAll(group.selector),
        function (element, index) {
          element.classList.add.apply(
            element.classList,
            group.className.split(" ")
          );

          var delay = (group.start || 0) + index * (group.step || 0);
          if (delay) {
            element.style.setProperty("--reveal-delay", delay + "ms");
          }

          targets.push(element);
        }
      );
    });

    if (!targets.length) {
      return;
    }

    function show(element) {
      element.classList.add("is-visible");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach(function (element) {
      observer.observe(element);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
