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

  function init() {
    var size = readSize();
    apply(size, false);

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
