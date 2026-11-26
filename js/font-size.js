/* ==========================================================================
   font-size.js
   - ปรับขนาดตัวอักษรทั้งหน้าเว็บด้วยการเปลี่ยน font-size ของ <html>
   - ทุกขนาดใน CSS ใช้ rem จึงขยาย/ลดพร้อมกันทั้งระบบ
   - กดเพิ่ม/ลดได้ต่อเนื่อง (ไม่มีเพดานจำนวนครั้ง) โดยมีขั้นต่ำ 12px กันหน้าพัง
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "gu-font-size";
  var DEFAULT_SIZE = 16;
  var MIN_SIZE = 12;
  var STEP = 1;
  var root = document.documentElement;

  function clamp(size) {
    if (!isFinite(size)) {
      return DEFAULT_SIZE;
    }
    return Math.max(MIN_SIZE, Math.round(size));
  }

  function readSize() {
    try {
      var saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return isFinite(saved) ? clamp(saved) : DEFAULT_SIZE;
    } catch (error) {
      return DEFAULT_SIZE;
    }
  }

  function writeSize(size) {
    try {
      localStorage.setItem(STORAGE_KEY, String(size));
    } catch (error) {
      /* ไม่สามารถบันทึกได้ – ยังใช้งานได้ในรอบนี้ */
    }
  }

  function currentSize() {
    return parseInt(window.getComputedStyle(root).fontSize, 10) || DEFAULT_SIZE;
  }

  function apply(size, persist) {
    var next = clamp(size);
    root.style.fontSize = next + "px";

    if (persist !== false) {
      writeSize(next);
    }

    var group = document.querySelector("[data-font-size]");
    if (group) {
      group.setAttribute("data-size", String(next));
    }

    document.dispatchEvent(
      new CustomEvent("gu:fontsizechange", { detail: { size: next } })
    );

    return next;
  }

  function increase() {
    return apply(currentSize() + STEP);
  }

  function decrease() {
    return apply(currentSize() - STEP);
  }

  function reset() {
    return apply(DEFAULT_SIZE);
  }

  /* ปุ่มหลัก = โหมดที่เลือกอยู่ (A- / A / A+) กดซ้ำได้ไม่จำกัด
     ลูกศรเปิดรายการด้านล่าง แสดงเฉพาะโหมดอื่นที่ยังไม่ได้เลือก
     เลือกจากรายการ = เปลี่ยนโหมดและปรับขนาดหนึ่งขั้น แล้วปิดรายการ */
  function bindMenu() {
    var act = document.querySelector("[data-font-act]");
    var toggle = document.querySelector("[data-font-toggle]");
    var menu = document.querySelector(".font-size__menu");
    if (!act || !toggle || !menu) {
      return;
    }

    var LABELS = { decrease: "A-", reset: "A", increase: "A+" };
    var TITLES = {
      decrease: "ลดขนาดตัวอักษร",
      reset: "ขนาดตัวอักษรปกติ",
      increase: "เพิ่มขนาดตัวอักษร"
    };
    var items = Array.prototype.slice.call(menu.querySelectorAll("[data-font-pick]"));

    function setMode(mode) {
      act.setAttribute("data-font", mode);
      act.textContent = LABELS[mode];
      act.setAttribute("aria-label", TITLES[mode]);
      items.forEach(function (item) {
        item.hidden = item.getAttribute("data-font-pick") === mode;
      });
    }

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var mode = item.getAttribute("data-font-pick");
        setMode(mode);
        if (mode === "decrease") {
          decrease();
        } else if (mode === "increase") {
          increase();
        } else {
          reset();
        }
        setOpen(false);
      });
    });

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(menu.hidden);
    });

    document.addEventListener("click", function (event) {
      if (!menu.hidden && !event.target.closest(".font-size--menu")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    setMode(act.getAttribute("data-font") || "reset");
    setOpen(false);
  }

  function init() {
    var size = readSize();
    apply(size, false);
    bindMenu();

    var controls = document.querySelectorAll("[data-font]");
    Array.prototype.forEach.call(controls, function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-font");
        if (action === "increase") {
          increase();
        } else if (action === "decrease") {
          decrease();
        } else {
          reset();
        }
      });
    });
  }

  window.GUFontSize = {
    init: init,
    increase: increase,
    decrease: decrease,
    reset: reset,
    get: currentSize
  };
})();
