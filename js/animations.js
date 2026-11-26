/* ==========================================================================
   animations.js
   อนิเมชั่นเมื่อเลื่อนมาถึง (scroll reveal) ด้วย IntersectionObserver
   - สถิติการดำเนินงาน: การ์ดสรุป + แผงกราฟ + ตัวเลขวิ่ง + กราฟวาด
   - ส่วนติดต่อเรา: พาดหัว + ช่องทางติดต่อ (ที่อยู่ / โทรศัพท์ / อีเมล)
   - เล่นซ้ำทุกครั้งที่เลื่อนกลับเข้ามาในส่วนนั้น (ไม่ต้องกดรีเซ็ต)
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
    {
      selector: ".foot-contact__item",
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

    /* --- เปิด/ปิดคลาสตามการมองเห็น: เอา is-visible ออกเมื่อพ้นจอ
       เพื่อให้อนิเมชั่นเล่นใหม่ทุกครั้งที่เลื่อนกลับมา --- */
    if (targets.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            } else {
              entry.target.classList.remove("is-visible");
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
      );

      targets.forEach(function (element) {
        observer.observe(element);
      });
    }

    /* --- แผง "พร้อมให้บริการ": เลื่อนขึ้นแบบ 3D เมื่อใกล้ถึงส่วนนั้น --- */
    var supportSection = document.querySelector(".site-footer");

    if (supportSection) {
      supportSection.classList.add("js-rise");

      var riseObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            } else {
              entry.target.classList.remove("is-visible");
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" }
      );

      riseObserver.observe(supportSection);
    }

    initStats();
    initChartLine();
  }

  /* ==========================================================================
     สถิติการดำเนินงาน: ตัวเลขวิ่ง + กราฟวาด (เล่นซ้ำเมื่อเลื่อนกลับมา)
     ========================================================================== */

  function initStats() {
    var section = document.getElementById("statistics");
    if (!section) {
      return;
    }

    var counters = Array.prototype.slice.call(
      section.querySelectorAll("[data-count]")
    );

    var state = {
      running: false,
      raf: 0,
      endAt: 0
    };

    function format(element, value) {
      var decimals = Number(element.getAttribute("data-count-decimals") || 0);
      var prefix = element.getAttribute("data-count-prefix") || "";
      var suffix = element.getAttribute("data-count-suffix") || "";
      var valueText = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      return prefix + valueText + suffix;
    }

    function paint(element, value) {
      element.textContent = format(element, value);
    }

    function start() {
      if (state.running || !counters.length) {
        return;
      }

      state.running = true;

      var started = 0;
      var callFrame =
        window.requestAnimationFrame ||
        function (callback) {
          return window.setTimeout(function () {
            callback(Date.now());
          }, 16);
        };

      var longest = 0;

      counters.forEach(function (element) {
        var delay = Number(element.getAttribute("data-count-delay") || 0);
        var duration = Number(element.getAttribute("data-count-duration") || 1300);
        longest = Math.max(longest, delay + duration);
      });

      state.endAt = longest;

      function step(now) {
        if (!started) {
          started = now;
        }

        var elapsed = now - started;

        counters.forEach(function (element) {
          var target = Number(element.getAttribute("data-count"));
          var delay = Number(element.getAttribute("data-count-delay") || 0);
          var duration = Number(
            element.getAttribute("data-count-duration") || 1300
          );
          var progress = (elapsed - delay) / duration;

          if (progress < 0) {
            progress = 0;
          } else if (progress > 1) {
            progress = 1;
          }

          /* easeOutCubic: เริ่มเร็วแล้วค่อย ๆ ช้าลงตอนจบ */
          var eased = 1 - Math.pow(1 - progress, 3);
          paint(element, target * eased);
        });

        if (elapsed < state.endAt) {
          state.raf = callFrame(step);
        } else {
          counters.forEach(function (element) {
            paint(element, Number(element.getAttribute("data-count")));
          });
          state.running = false;
          state.raf = 0;
        }
      }

      state.raf = callFrame(step);
    }

    function reset() {
      if (state.raf) {
        if (window.cancelAnimationFrame) {
          window.cancelAnimationFrame(state.raf);
        } else {
          window.clearTimeout(state.raf);
        }
      }

      state.running = false;
      state.raf = 0;

      counters.forEach(function (element) {
        paint(element, 0);
      });
    }

    /* เริ่มที่ศูนย์ก่อน เพื่อไม่ให้เห็นเลขสุดท้ายค้างก่อนอนิเมชั่น */
    reset();

    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            /* เริ่มเมื่อเห็นส่วนสถิติอย่างน้อย ~18% ของความสูงส่วน */
            if (entry.intersectionRatio >= 0.18) {
              start();
            }
          } else {
            /* รีเซ็ตเมื่อพ้นจอทั้งส่วน แล้วจะเล่นใหม่ตอนเลื่อนกลับมา */
            reset();
          }
        });
      },
      { threshold: [0, 0.18, 0.5] }
    );

    statsObserver.observe(section);
  }

  /* คำนวณความยาวเส้นแนวโน้มจริง เพื่อวาดเส้นด้วย stroke-dashoffset */
  function initChartLine() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".stats-chart__trend-line"),
      function (line) {
        if (typeof line.getTotalLength === "function") {
          line.style.setProperty(
            "--chart-line-length",
            String(Math.ceil(line.getTotalLength()))
          );
        }
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
