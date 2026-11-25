/* ==========================================================================
   charts.js: กราฟ SVG ที่เขียนเอง (ไม่ใช้ Library)
   - monthly(): กราฟแท่ง = ยื่นคำร้อง, เส้น = ดำเนินการสำเร็จ
   - donut(): กราฟวงกลมสัดส่วน   - ring(): วงแหวนความคืบหน้าของการ์ดสรุป
   สีอ้างจากตัวแปร CSS (--bd-chart-*) จึงปรับตามโหมดสว่าง/มืดอัตโนมัติ
   ========================================================================== */
(function () {
  "use strict";

  window.GUBD = window.GUBD || {};
  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text !== undefined) { n.textContent = text; }
    return n;
  }

  function niceMax(v) {
    if (v <= 0) { return 10; }
    var pow = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var n = v / pow;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * pow;
  }

  function monthly(months, label) {
    var W = 800, H = 300, L = 46, R = 12, T = 14, B = 30;
    var pw = W - L - R, ph = H - T - B;
    var max = niceMax(Math.max.apply(null, months.map(function (m) { return Math.max(m.submitted, m.completed); })));
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "bd-chart", role: "img", "aria-label": label });
    svg.appendChild(el("title", {}, label));

    for (var i = 0; i <= 4; i++) {
      var y = T + ph - (ph * i / 4);
      svg.appendChild(el("line", { x1: L, x2: W - R, y1: y, y2: y, class: "bd-chart__grid" }));
      svg.appendChild(el("text", { x: L - 8, y: y + 4, "text-anchor": "end" }, String(Math.round(max * i / 4))));
    }

    var step = pw / months.length;
    var bw = Math.min(30, step * 0.5);
    var pts = [];
    months.forEach(function (m, idx) {
      var cx = L + step * idx + step / 2;
      svg.appendChild(el("text", { x: cx, y: H - 9, "text-anchor": "middle" }, m.label));
      if (m.submitted > 0) {
        var bh = ph * m.submitted / max;
        var bar = el("rect", { x: cx - bw / 2, y: T + ph - bh, width: bw, height: bh, rx: 6, class: "bd-chart__bar", tabindex: "0", "aria-label": m.full + " ยื่น " + m.submitted + " สำเร็จ " + m.completed });
        bar.appendChild(el("title", {}, m.full + ": ยื่น " + m.submitted + " / สำเร็จ " + m.completed));
        svg.appendChild(bar);
        pts.push([cx, T + ph - ph * m.completed / max]);
      }
    });
    if (pts.length > 1) {
      svg.appendChild(el("path", { class: "bd-chart__line", d: "M" + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") }));
    }
    pts.forEach(function (p) { svg.appendChild(el("circle", { cx: p[0], cy: p[1], r: 3.5, class: "bd-chart__dot" })); });
    return svg;
  }

  /* parts: [{ label, value, color }] */
  function donut(parts, centerText, centerSub) {
    var size = 150, r = 58, C = 2 * Math.PI * r;
    var total = parts.reduce(function (a, p) { return a + p.value; }, 0);
    var svg = el("svg", { viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": centerSub + " " + centerText });
    svg.appendChild(el("circle", { cx: size / 2, cy: size / 2, r: r, class: "bd-donut__track" }));
    var g = el("g", { transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")" });
    var acc = 0;
    parts.forEach(function (p) {
      if (!total || !p.value) { return; }
      var len = C * p.value / total;
      g.appendChild(el("circle", {
        cx: size / 2, cy: size / 2, r: r, class: "bd-donut__seg",
        "stroke-dasharray": Math.max(0, len - 2) + " " + C,
        "stroke-dashoffset": String(-acc),
        style: "stroke: " + p.color
      }));
      acc += len;
    });
    svg.appendChild(g);
    svg.appendChild(el("text", { x: size / 2, y: size / 2 + 2, "text-anchor": "middle", class: "bd-donut__total" }, centerText));
    svg.appendChild(el("text", { x: size / 2, y: size / 2 + 20, "text-anchor": "middle", class: "bd-donut__sub" }, centerSub));
    return svg;
  }

  /* ring(percent): วงแหวนแสดงสัดส่วน 0–100 */
  function ring(percent) {
    var size = 68, r = 28, C = 2 * Math.PI * r;
    var p = Math.max(0, Math.min(100, percent || 0));
    var wrap = document.createElement("div");
    wrap.className = "bd-ring";
    wrap.setAttribute("aria-hidden", "true");
    var svg = el("svg", { viewBox: "0 0 " + size + " " + size });
    svg.appendChild(el("circle", { cx: size / 2, cy: size / 2, r: r, class: "bd-ring__track" }));
    svg.appendChild(el("circle", { cx: size / 2, cy: size / 2, r: r, class: "bd-ring__arc", "stroke-dasharray": (C * p / 100) + " " + C }));
    wrap.appendChild(svg);
    var pct = document.createElement("span");
    pct.className = "bd-ring__pct";
    pct.textContent = Math.round(p) + "%";
    wrap.appendChild(pct);
    return wrap;
  }

  window.GUBD.charts = { monthly: monthly, donut: donut, ring: ring };
})();
