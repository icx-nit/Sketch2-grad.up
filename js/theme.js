/* ==========================================================================
   theme.js
   - ใช้ data-theme บน <html> + CSS variables (DESIGN.md ข้อ 6 และ 12)
   - เรียกใช้ใน <head> เพื่อไม่ให้เกิดอาการกระพริบ (FOUC)
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "gu-theme";
  var root = document.documentElement;

  function readPreference() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === "dark" || saved === "light" ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function writePreference(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* localStorage ถูกปิดการใช้งาน – ใช้ได้เฉพาะรอบการใช้งานนี้ */
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        theme === "dark" ? "#100D1C" : "#4D238D"
      );
    }
  }

  function set(theme) {
    apply(theme);
    writePreference(theme);
    document.dispatchEvent(
      new CustomEvent("gu:themechange", { detail: { theme: theme } })
    );
  }

  function toggle() {
    set(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  /* ใช้ค่าที่บันทึกไว้ ถ้าไม่มีให้ตามระบบ */
  apply(readPreference() || systemTheme());

  /* ถ้าผู้ใช้ยังไม่เคยเลือก ให้เปลี่ยนตามระบบเมื่อระบบเปลี่ยน */
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var onSystemChange = function (event) {
    if (!readPreference()) {
      apply(event.matches ? "dark" : "light");
    }
  };
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onSystemChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(onSystemChange);
  }

  window.GUTheme = {
    get: current,
    set: set,
    toggle: toggle
  };
})();
