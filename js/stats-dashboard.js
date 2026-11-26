/* ==========================================================================
   stats-dashboard.js: วาดกราฟและตัวเลขของระบบสถิติ (ใช้ร่วมหน้าแรกและหน้าสถิติทั้งหมด)
   ========================================================================== */
(function () {
  "use strict";

  var S = window.GU_STATS;
  if (!S) { return; }

  var NS = "http://www.w3.org/2000/svg";
  var X0 = 66, X1 = 730, Y_BASE = 234, PLOT_H = 200;

  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  function pct(v) { return v.toFixed(1) + "%"; }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) { parent.appendChild(n); }
    return n;
  }

  function smoothPath(pts) {
    var d = "M" + pts[0][0] + "," + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += " C" + c1x.toFixed(1) + "," + c1y.toFixed(1) + " " + c2x.toFixed(1) + "," + c2y.toFixed(1) + " " + p2[0] + "," + p2[1];
    }
    return d;
  }

  function setEmpty(host, text) {
    var msg = host.querySelector(".stats-empty");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "stats-empty";
      host.appendChild(msg);
    }
    msg.textContent = text;
  }

  function clearEmpty(host) {
    var msg = host.querySelector(".stats-empty");
    if (msg) { msg.parentNode.removeChild(msg); }
  }

  /* วาดกราฟแท่ง (ยื่น) + เส้น (สำเร็จ) ลงใน host ของ .stats-chart-wrap
     คืนค่า index ของเดือนที่ยื่นสูงสุด หรือ null เมื่อไม่มีข้อมูล */
  function drawMonthly(host, months) {
    var old = host.querySelector("svg.stats-chart");
    if (old) { old.parentNode.removeChild(old); }
    var badge = host.querySelector(".stats-chart__latest");

    var hasData = months.some(function (m) { return m.submitted > 0; });
    if (!hasData) {
      if (badge) { badge.textContent = ""; }
      setEmpty(host, "ยังไม่มีข้อมูลสำหรับแสดงผล");
      return null;
    }
    clearEmpty(host);

    var maxV = Math.max.apply(null, months.map(function (m) { return m.submitted; }));
    var step = Math.max(50, Math.ceil(maxV / 4 / 50) * 50);
    var top = step * 4;
    var yFor = function (v) { return Y_BASE - (v / top) * PLOT_H; };

    var peak = 0;
    months.forEach(function (m, i) { if (m.submitted > months[peak].submitted) { peak = i; } });

    var svg = el("svg", { class: "stats-chart", viewBox: "0 0 760 300", role: "img", "aria-label": "กราฟจำนวนคำร้อง บศ.1 รายเดือน" });
    var grid = el("g", { class: "stats-chart__grid", "aria-hidden": "true" }, svg);
    var axis = el("g", { class: "stats-chart__axis", "aria-hidden": "true" }, svg);
    for (var v = 0; v <= top; v += step) {
      var gy = yFor(v);
      el("line", { x1: X0, x2: X1, y1: gy, y2: gy }, grid);
      el("text", { x: 56, y: gy + 4, "text-anchor": "end" }, axis).textContent = fmt(v);
    }

    var slot = (X1 - X0) / months.length;
    var barW = Math.min(32, slot * 0.42);
    var bars = el("g", { class: "stats-chart__bars", "aria-hidden": "true" }, svg);
    var labels = el("g", { class: "stats-chart__axis", "aria-hidden": "true" }, svg);
    var pts = [];
    months.forEach(function (m, i) {
      var cx = X0 + slot * (i + 0.5);
      var yy = yFor(m.submitted);
      if (m.submitted > 0) {
        var rect = el("rect", { x: (cx - barW / 2).toFixed(1), y: yy.toFixed(1), width: barW.toFixed(1), height: (Y_BASE - yy).toFixed(1), rx: 8, "data-value": m.submitted, "data-idx": i }, bars);
        if (i === peak) { rect.setAttribute("class", "stats-chart__bar--latest"); }
        pts.push([cx, yFor(m.completed)]);
      }
      el("text", { class: "stats-chart__month", x: cx.toFixed(1), y: 270, "text-anchor": "middle" }, labels).textContent = m.label;
    });

    el("path", { class: "stats-chart__trend-line", d: smoothPath(pts), fill: "none" }, svg);
    var pg = el("g", { class: "stats-chart__points", "aria-hidden": "true" }, svg);
    pts.forEach(function (p, i) {
      var c = el("circle", { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 5 }, pg);
      if (i === peak) { c.setAttribute("class", "stats-chart__point--latest"); }
    });

    host.appendChild(svg);
    if (badge) { badge.textContent = "สูงสุด " + fmt(months[peak].submitted) + " คำร้อง"; }
    return peak;
  }

  /* แถบเปรียบเทียบรายคณะ/รายสาขา: แถบม่วง = ยื่น, แถบทอง = สำเร็จ */
  function drawRanks(list, groups) {
    list.innerHTML = "";
    if (!groups.some(function (g) { return g.submitted > 0; })) {
      var li0 = document.createElement("li");
      li0.className = "stats-empty";
      li0.textContent = "ยังไม่มีข้อมูลสำหรับแสดงผล";
      list.appendChild(li0);
      return;
    }
    var max = Math.max.apply(null, groups.map(function (g) { return g.submitted; })) || 1;
    groups.forEach(function (g) {
      var li = document.createElement("li");
      li.className = "stats-rank__item";
      li.innerHTML =
        '<div class="stats-rank__head"><span class="stats-rank__name">' + g.name + '</span>' +
        '<span class="stats-rank__rate">' + pct(g.rate) + '</span></div>' +
        '<div class="stats-rank__bar stats-rank__bar--sub"><span style="width:' + (g.submitted / max * 100).toFixed(2) + '%"></span><em>' + fmt(g.submitted) + '</em></div>' +
        '<div class="stats-rank__bar stats-rank__bar--done"><span style="width:' + (g.completed / max * 100).toFixed(2) + '%"></span><em>' + fmt(g.completed) + '</em></div>';
      list.appendChild(li);
    });
  }

  function setDonut(host, rate) {
    var done = host.querySelector(".stats-donut__seg--completed");
    var rest = host.querySelector(".stats-donut__seg--review");
    if (done) { done.style.strokeDasharray = rate.toFixed(2) + " " + (100 - rate).toFixed(2); }
    if (rest) { rest.style.strokeDasharray = (100 - rate).toFixed(2) + " " + rate.toFixed(2); rest.style.strokeDashoffset = (-rate).toFixed(2); }
  }

  function setCount(node, value, opt) {
    if (!node) { return; }
    var o = opt || {};
    var d = o.decimals || 0;
    node.setAttribute("data-count", String(value));
    if (d) { node.setAttribute("data-count-decimals", String(d)); }
    if (o.prefix) { node.setAttribute("data-count-prefix", o.prefix); }
    if (o.suffix) { node.setAttribute("data-count-suffix", o.suffix); }
    node.textContent = (o.prefix || "") + (d ? Number(value).toFixed(d) : fmt(value)) + (o.suffix || "");
  }

  function setTrend(node, value) {
    if (!node) { return; }
    var p = node.parentNode;
    if (value === null || !isFinite(value)) { p.style.display = "none"; return; }
    p.style.display = "";
    setCount(node, Math.abs(value), { decimals: 1, prefix: value >= 0 ? "+" : "-", suffix: "%" });
  }

  function initHome() {
    var q = function (sel) { return document.querySelector(sel); };
    var latest = S.years[0];
    var cur = S.summarize(latest, "", "");
    var prev = S.years.length > 1 ? S.summarize(S.years[1], "", "") : null;

    setCount(q('[data-stat="applicants"]'), cur.applicants);
    setTrend(q('[data-stat="applicantsTrend"]'), prev && prev.applicants ? (cur.applicants - prev.applicants) / prev.applicants * 100 : null);
    setCount(q('[data-stat="requests"]'), cur.submitted);
    setTrend(q('[data-stat="requestsTrend"]'), prev && prev.submitted ? (cur.submitted - prev.submitted) / prev.submitted * 100 : null);
    setCount(q('[data-stat="completed"]'), cur.completed);
    setCount(q('[data-stat="rate"]'), cur.rate, { decimals: 1, suffix: "%" });

    var period = q('[data-stat="period"]');
    if (period) { period.textContent = S.period(latest); }

    var wrap = q("[data-stats-monthly]");
    var peak = drawMonthly(wrap, cur.months);
    var note = q('[data-stat="peakNote"]');
    if (note) {
      note.textContent = peak === null ? "" :
        "เดือน" + cur.months[peak].full + "มีจำนวนคำร้อง บศ.1 ที่ยื่นสูงสุด " + fmt(cur.months[peak].submitted) + " คำร้อง";
    }

    var donut = q("[data-stats-donut]");
    setDonut(donut, cur.rate);
    donut.setAttribute("aria-label", "คำร้องที่ดำเนินการสำเร็จ " + fmt(cur.completed) + " จากคำร้องที่ยื่นทั้งหมด " + fmt(cur.submitted) + " คำร้อง");
    setCount(q('[data-stat="donutRate"]'), cur.rate, { decimals: 1, suffix: "%" });
    setCount(q('[data-stat="badgeTotal"]'), cur.submitted);
    setCount(q('[data-stat="listDone"]'), cur.completed);
    setCount(q('[data-stat="listDonePct"]'), cur.rate, { decimals: 1, suffix: "%" });
    setCount(q('[data-stat="listTotal"]'), cur.submitted);

    var fp = q('[data-stat="facultyPeriod"]');
    if (fp) { fp.textContent = S.period(latest); }
    drawRanks(q("[data-stats-faculty]"), cur.groups);
  }

  window.GU_STATS_UI = {
    fmt: fmt,
    pct: pct,
    setCount: setCount,
    drawMonthly: drawMonthly,
    drawRanks: drawRanks,
    setDonut: setDonut
  };

  if (document.querySelector("[data-stats-home]")) { initHome(); }
})();
