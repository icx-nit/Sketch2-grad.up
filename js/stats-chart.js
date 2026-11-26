/* ==========================================================================
   stats-chart.js
   - เมื่อชี้เมาส์ (หรือแตะ) คอลัมน์ในกราฟ จะแสดงจำนวนยอดเหนือแท่ง
     พร้อมไฮไลต์แท่งและอนิเมชันป๊อปอัปเบา ๆ
   - ค่าคำนวณจากความสูงแท่ง โดยแท่งที่สูงสุด (พ.ย.) คือ 328 ราย
   ========================================================================== */

(function () {
  "use strict";

  var svg = document.querySelector(".stats-chart");
  if (!svg) {
    return;
  }

  var NS = "http://www.w3.org/2000/svg";
  var MAX_VALUE = 0;
  var bars = Array.prototype.slice.call(svg.querySelectorAll(".stats-chart__bars rect"));
  if (!bars.length) {
    return;
  }

  var tallest = bars.reduce(function (acc, rect) {
    return Math.max(acc, parseFloat(rect.getAttribute("height")));
  }, 0);
  var scale = tallest ? MAX_VALUE / tallest : 0;
  var unit = document.documentElement.getAttribute("data-lang") === "en" ? " cases" : " คำร้อง";

  var layer = document.createElementNS(NS, "g");
  layer.setAttribute("class", "stats-chart__tips");
  svg.appendChild(layer);

  function make(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function show(index) {
    bars.forEach(function (rect, i) {
      rect.classList.toggle("is-active", i === index);
    });
    tips.forEach(function (tip, i) {
      tip.classList.toggle("is-on", i === index);
    });
  }

  function hide() {
    bars.forEach(function (rect) {
      rect.classList.remove("is-active");
    });
    tips.forEach(function (tip) {
      tip.classList.remove("is-on");
    });
  }

  var tips = bars.map(function (rect, i) {
    var x = parseFloat(rect.getAttribute("x"));
    var width = parseFloat(rect.getAttribute("width"));
    var top = parseFloat(rect.getAttribute("y"));
    var value = rect.getAttribute("data-value") !== null ? Number(rect.getAttribute("data-value")) : Math.round(parseFloat(rect.getAttribute("height")) * scale);
    var centerX = x + width / 2;

    /* พื้นที่รับเมาส์กว้างกว่าแท่ง เพื่อให้ชี้ง่าย */
    var hit = make("rect", {
      class: "stats-chart__hit",
      x: x - 14,
      y: 30,
      width: width + 28,
      height: 214,
      fill: "transparent"
    });
    layer.appendChild(hit);

    var tip = make("g", { class: "stats-chart__tip", "aria-hidden": "true" });
    var label = value + unit;
    var boxWidth = Math.max(54, label.length * 7.2 + 14);
    var boxY = Math.max(top - 40, 2);
    tip.appendChild(make("rect", {
      x: centerX - boxWidth / 2,
      y: boxY,
      width: boxWidth,
      height: 26,
      rx: 8
    }));
    var text = make("text", {
      x: centerX,
      y: boxY + 17.5,
      "text-anchor": "middle"
    });
    text.textContent = label;
    tip.appendChild(text);
    layer.appendChild(tip);

    hit.addEventListener("pointerenter", function () {
      show(i);
    });
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("click", function () {
      show(i);
    });

    return tip;
  });

  svg.addEventListener("pointerleave", hide);
})();
