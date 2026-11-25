/* ==========================================================================
   ui.js: ตัวช่วยของ Dashboard (สร้าง DOM, ไอคอน, วันที่, ตัวเลข, Toast, Dialog, สถานะ)
   ไม่มี Dependency ภายนอก ไอคอนเป็น inline SVG แบบเส้น 24x24 ตาม DESIGN.md ข้อ 7
   ภาษาไทยใช้ปี พ.ศ. ภาษาอังกฤษใช้ ค.ศ.
   ========================================================================== */
(function () {
  "use strict";

  window.GUBD = window.GUBD || {};

  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    news: '<path d="M4 5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M8 8h5M8 12h5M8 16h5"/>',
    popups: '<path d="m3 11 14-6v14L3 13v-2Z"/><path d="M7 13.5V18a2 2 0 0 0 4 0v-2.5"/><path d="M20.5 9.5v5"/>',
    documents: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V4a1 1 0 0 1 1-1h9l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="8" cy="8" r="1.2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    chart: '<path d="M4 20h17"/><path d="M7 20v-7M12 20V6M17 20v-10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m14.5 7.5 3 3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.4 7.5C3.8 9.3 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="m6 7 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevronLeft: '<path d="m15 6-6 6 6 6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18h.01"/>',
    inbox: '<path d="M3 13h5l1 3h6l1-3h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2-8Z"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 8v4l3 2"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    login: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };

  function t(th, en) { return window.GUBD.i18n.pick(th, en); }
  function isEn() { return window.GUBD.i18n.lang() === "en"; }

  function icon(name, cls) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (cls) { svg.setAttribute("class", cls); }
    svg.innerHTML = ICONS[name] || "";
    return svg;
  }

  /* h("div", {class: "x", onclick: fn}, [child, "text"]) */
  function h(tag, attrs, kids) {
    var node = document.createElement(tag);
    var key;
    attrs = attrs || {};
    for (key in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) { continue; }
      var val = attrs[key];
      if (val === null || val === undefined || val === false) { continue; }
      if (key === "class") { node.className = val; }
      else if (key === "text") { node.textContent = val; }
      else if (key.indexOf("on") === 0 && typeof val === "function") { node.addEventListener(key.slice(2), val); }
      else if (val === true) { node.setAttribute(key, ""); }
      else { node.setAttribute(key, val); }
    }
    append(node, kids);
    return node;
  }

  function append(node, kids) {
    if (kids === undefined || kids === null) { return; }
    if (!Array.isArray(kids)) { kids = [kids]; }
    kids.forEach(function (kid) {
      if (kid === null || kid === undefined || kid === false) { return; }
      if (Array.isArray(kid)) { append(node, kid); return; }
      node.appendChild(typeof kid === "string" || typeof kid === "number" ? document.createTextNode(String(kid)) : kid);
    });
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  var MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  var MONTHS_FULL_TH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  var MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_FULL_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function monthShort(i) { return isEn() ? MONTHS_EN[i] : MONTHS_TH[i]; }
  function monthFull(i) { return isEn() ? MONTHS_FULL_EN[i] : MONTHS_FULL_TH[i]; }

  function parseISO(iso) {
    var p = String(iso || "").split("-");
    if (p.length !== 3) { return null; }
    return { y: Number(p[0]), m: Number(p[1]), d: Number(p[2]) };
  }
  function fmtDate(iso) {
    var p = parseISO(iso);
    if (!p || !p.y) { return "-"; }
    if (isEn()) { return p.d + " " + MONTHS_EN[p.m - 1] + " " + p.y; }
    return p.d + " " + MONTHS_TH[p.m - 1] + " " + (p.y + 543);
  }
  function fmtDateLong(date) {
    if (isEn()) { return date.getDate() + " " + MONTHS_FULL_EN[date.getMonth()] + " " + date.getFullYear(); }
    return date.getDate() + " " + MONTHS_FULL_TH[date.getMonth()] + " " + (date.getFullYear() + 543);
  }
  function z(n) { return (n < 10 ? "0" : "") + n; }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }
  function fmtTime(date) { return z(date.getHours()) + ":" + z(date.getMinutes()); }
  function num(n) { return Number(n).toLocaleString(isEn() ? "en-US" : "th-TH"); }

  /* ---------- Toast ---------- */
  var toastRoot = null;
  function toast(message) {
    if (!toastRoot) {
      toastRoot = h("div", { class: "bd-toasts", role: "status", "aria-live": "polite" });
      document.body.appendChild(toastRoot);
    }
    var node = h("div", { class: "bd-toast" }, [icon("check"), h("span", { text: message })]);
    toastRoot.appendChild(node);
    window.setTimeout(function () { if (node.parentNode) { node.parentNode.removeChild(node); } }, 3600);
  }

  /* ---------- Dialog (ใช้ <dialog> ของเบราว์เซอร์: โฟกัสวนใน Dialog และปิดด้วย Esc) ---------- */
  var openCount = 0;
  function lockScroll(lock) {
    openCount = Math.max(0, openCount + (lock ? 1 : -1));
    document.documentElement.style.overflow = openCount > 0 ? "hidden" : "";
  }

  function dialog(options) {
    var dlg = h("dialog", { class: "bd-dialog" + (options.small ? " bd-dialog--sm" : ""), "aria-labelledby": "bd-dlg-title" });
    var closeBtn = h("button", { type: "button", class: "bd-act", "aria-label": t("ปิด", "Close"), onclick: function () { dlg.close(); } }, icon("x"));
    var head = h("div", { class: "bd-dialog__head" }, [h("h2", { class: "bd-dialog__title", id: "bd-dlg-title", text: options.title }), closeBtn]);
    var body = h("div", { class: "bd-dialog__body" }, options.body);
    var foot = h("div", { class: "bd-dialog__foot" }, options.footer);
    var form = options.form ? h("form", { class: "bd-dialog__form", novalidate: true }, [head, body, foot]) : null;
    append(dlg, form ? [form] : [head, body, foot]);

    dlg.addEventListener("click", function (event) { if (event.target === dlg) { dlg.close(); } });
    dlg.addEventListener("close", function () {
      lockScroll(false);
      if (dlg.parentNode) { dlg.parentNode.removeChild(dlg); }
      if (options.returnFocus && document.body.contains(options.returnFocus)) { options.returnFocus.focus(); }
      if (options.onClose) { options.onClose(); }
    });
    document.body.appendChild(dlg);
    lockScroll(true);
    dlg.showModal();
    return { el: dlg, form: form, close: function () { dlg.close(); } };
  }

  function confirmDialog(options) {
    var cancel = h("button", { type: "button", class: "bd-btn bd-btn--ghost", text: t("ยกเลิก", "Cancel") });
    var ok = h("button", { type: "button", class: "bd-btn " + (options.danger ? "bd-btn--danger" : "bd-btn--primary"), text: options.confirmText || t("ยืนยัน", "Confirm") });
    var body = h("div", { class: "bd-confirm" }, [
      h("span", { class: "bd-confirm__icon" }, icon("alert")),
      h("div", { class: "bd-confirm__text" }, [h("strong", { text: options.heading }), h("p", { text: options.message })])
    ]);
    var d = dialog({ title: options.title || t("ยืนยันการดำเนินการ", "Confirm action"), small: true, body: body, footer: [cancel, ok], returnFocus: options.returnFocus });
    cancel.addEventListener("click", function () { d.close(); });
    ok.addEventListener("click", function () { d.close(); options.onConfirm(); });
    cancel.focus();
  }

  function stateBlock(kind, title, text, action) {
    var isError = kind === "error";
    return h("div", { class: "bd-state" + (isError ? " bd-state--error" : ""), role: isError ? "alert" : null }, [
      h("span", { class: "bd-state__icon" }, icon(isError ? "alert" : "inbox")),
      h("p", { class: "bd-state__title", text: title }),
      h("p", { class: "bd-state__text", text: text }),
      action
    ]);
  }

  function skeleton(rows) {
    var list = [];
    for (var i = 0; i < (rows || 5); i++) { list.push(h("div", { class: "bd-skel__row" })); }
    return h("div", { class: "bd-skel", "aria-busy": "true", "aria-label": t("กำลังโหลดข้อมูล", "Loading data") }, list);
  }

  function isHttpUrl(value) { return /^https?:\/\/[^\s]+$/i.test(value); }

  window.GUBD.ui = {
    h: h, icon: icon, clear: clear, append: append, num: num,
    fmtDate: fmtDate, fmtDateLong: fmtDateLong, todayISO: todayISO, fmtTime: fmtTime, parseISO: parseISO,
    monthShort: monthShort, monthFull: monthFull,
    toast: toast, dialog: dialog, confirm: confirmDialog,
    state: stateBlock, skeleton: skeleton, isHttpUrl: isHttpUrl, t: t
  };
})();
