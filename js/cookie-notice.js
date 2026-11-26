/* ==========================================================================
   cookie-notice.js
   แถบแจ้งนโยบายคุกกี้ (แสดงครั้งแรกที่เข้าเว็บ) พร้อมลิงก์ไปหน้านโยบาย
   - ไม่ใช้คุกกี้จริง: จำการกด "รับทราบ" ด้วย localStorage คีย์ gu-cookie-notice
   - ภาษาตาม html[data-lang] และอัปเดตเมื่อเปลี่ยนภาษา (gu:languagechange)
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "gu-cookie-notice";
  var TEXT = {
    th: {
      msg: "เว็บไซต์นี้ไม่ใช้คุกกี้เพื่อโฆษณาหรือติดตามผู้ใช้ และจัดเก็บเฉพาะการตั้งค่าของท่าน (ภาษา โหมดสี ขนาดตัวอักษร) ในเบราว์เซอร์",
      link: "อ่านนโยบายคุกกี้",
      ok: "รับทราบ"
    },
    en: {
      msg: "This website does not use cookies for advertising or tracking. It only stores your preferences (language, theme, font size) in your browser.",
      link: "Read the Cookie Policy",
      ok: "Got it"
    }
  };

  try {
    if (localStorage.getItem(KEY) === "1") return;
  } catch (e) {}

  var box = document.createElement("div");
  box.className = "cookie-notice";
  box.setAttribute("role", "region");
  box.setAttribute("aria-label", "Cookie notice");

  var p = document.createElement("p");
  p.className = "cookie-notice__text";
  var a = document.createElement("a");
  a.className = "cookie-notice__link";
  a.href = "cookie-policy.html";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "cookie-notice__btn";

  var msg = document.createElement("span");
  p.appendChild(msg);
  p.appendChild(document.createTextNode(" "));
  p.appendChild(a);
  box.appendChild(p);
  box.appendChild(btn);

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }
  function render() {
    var t = TEXT[lang()];
    msg.textContent = t.msg;
    a.textContent = t.link;
    btn.textContent = t.ok;
  }

  btn.addEventListener("click", function () {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    box.classList.remove("is-show");
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 400);
  });

  document.addEventListener("gu:languagechange", render);
  render();
  document.body.appendChild(box);
  setTimeout(function () { box.classList.add("is-show"); }, 600);
})();
