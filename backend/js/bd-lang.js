/* ==========================================================================
   bd-lang.js: ระบบภาษาของ Dashboard (ต้นแบบ UI)
   - ใช้ js/i18n.js ของเว็บหลักร่วมกัน (คีย์ gu-language และอีเวนต์ gu:languagechange)
   - pick(th, en) เลือกข้อความตามภาษาปัจจุบัน
   - label(value, th) แปลค่าที่เป็นตัวเลือก (หมวดหมู่ สถานะ คณะ ฯลฯ) โดยค่าที่เก็บยังเป็นภาษาไทย
   - register(key, fn) ให้แต่ละหน้าวาดใหม่เมื่อสลับภาษา
   ========================================================================== */
(function () {
  "use strict";

  window.GUBD = window.GUBD || {};
  var renderers = [];

  function current() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }

  function stored() {
    try { return localStorage.getItem("gu-language") === "en" ? "en" : "th"; } catch (e) { return "th"; }
  }

  /* ตั้งค่าภาษาตั้งแต่ก่อนวาดหน้า เพื่อไม่ให้ข้อความกระพริบเป็นอีกภาษา */
  var initial = stored();
  document.documentElement.setAttribute("lang", initial);
  document.documentElement.setAttribute("data-lang", initial);

  function pick(th, en) {
    return current() === "en" && en ? en : th;
  }

  function label(value, th) {
    var table = window.GUBD.labels || {};
    var fallback = th === undefined ? value : th;
    return current() === "en" && table[value] ? table[value] : fallback;
  }

  function toggle() {
    var next = current() === "en" ? "th" : "en";
    if (window.GUI18n && window.GUI18n.apply) {
      window.GUI18n.apply(next); /* เก็บค่าและส่ง gu:languagechange */
    } else {
      document.documentElement.setAttribute("lang", next);
      document.documentElement.setAttribute("data-lang", next);
      document.dispatchEvent(new CustomEvent("gu:languagechange", { detail: { lang: next } }));
    }
  }

  function register(key, fn) {
    for (var i = 0; i < renderers.length; i++) {
      if (renderers[i].key === key) { renderers[i].fn = fn; return; }
    }
    renderers.push({ key: key, fn: fn });
  }

  document.addEventListener("gu:languagechange", function () {
    renderers.forEach(function (r) { r.fn(); });
  });

  window.GUBD.i18n = { lang: current, pick: pick, label: label, toggle: toggle, register: register };
})();
