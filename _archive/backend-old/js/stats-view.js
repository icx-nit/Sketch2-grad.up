/* ==========================================================================
   stats-view.js: หน้าสถิติ บศ.1 แบบอ่านอย่างเดียว (ต้นแบบ UI)
   ใช้ window.GU_STATS จาก ../js/stats-data.js (ข้อมูลจำลองทั้งหมด)
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("bd-main");
  var S = window.GU_STATS;
  if (!root || !window.GUBD || !window.GUBD.ui) { return; }
  var ui = window.GUBD.ui;
  var h = ui.h;
  var charts = window.GUBD.charts;

  if (!S) {
    root.appendChild(ui.state("error", "ไม่พบข้อมูลสถิติ", "ตรวจสอบว่าไฟล์ js/stats-data.js ถูกโหลดแล้ว", null));
    return;
  }

  var state = { year: S.years[0], faculty: "", major: "", month: "" };

  root.appendChild(h("div", { class: "bd-pagehead" }, [
    h("div", null, [
      h("h1", { class: "bd-pagehead__title", text: "สถิติ บศ.1" }),
      h("p", { class: "bd-pagehead__desc", text: "สถิติการยื่นคำร้องแบบ บศ.1 และการดำเนินการสำเร็จ · ข้อมูลจำลองทั้งหมด" })
    ]),
    h("div", { class: "bd-pagehead__actions" }, h("span", { class: "bd-readonly" }, [ui.icon("inbox"), "มุมมองอ่านอย่างเดียว"]))
  ]));

  /* ---------- ตัวกรอง ---------- */
  function select(label, options, value, onChange) {
    var sel = h("select", { class: "bd-select", "aria-label": label }, options.map(function (o) {
      return h("option", { value: o.value, text: o.label });
    }));
    sel.value = value;
    sel.addEventListener("change", function () { onChange(sel.value); });
    return h("div", { class: "bd-field" }, [h("label", { class: "bd-field__label" }, label), sel]);
  }

  var filterBox = h("section", { class: "bd-card" });
  var resultBox = h("div");
  root.appendChild(filterBox);
  root.appendChild(resultBox);

  function majorOptions() {
    var list = state.faculty ? S.majorsOf(state.faculty) : S.majorsOf("");
    return [{ value: "", label: "ทุกสาขา" }].concat(list.map(function (m) { return { value: m.id, label: m.name }; }));
  }

  function renderFilters() {
    ui.clear(filterBox);
    var yearOpts = S.years.map(function (y) { return { value: String(y), label: "ปี " + y }; });
    var facOpts = [{ value: "", label: "ทุกคณะ" }].concat(S.faculties.map(function (f) { return { value: f.id, label: f.name }; }));
    var monthOpts = [{ value: "", label: "ทั้งปี" }].concat(ui.MONTHS_FULL.map(function (m, i) { return { value: String(i), label: m }; }));

    var reset = h("button", { type: "button", class: "bd-btn bd-btn--ghost" }, "รีเซ็ตตัวกรอง");
    reset.addEventListener("click", function () { state = { year: S.years[0], faculty: "", major: "", month: "" }; renderFilters(); renderResult(); });

    filterBox.appendChild(h("div", { class: "bd-card__head" }, [
      h("div", null, [h("h2", { class: "bd-card__title", text: "ตัวกรองข้อมูล" }), h("p", { class: "bd-card__sub", text: S.period ? S.period(state.year) : "" })])
    ]));
    filterBox.appendChild(h("div", { class: "bd-filters" }, [
      select("ปีการศึกษา", yearOpts, String(state.year), function (v) { state.year = Number(v); renderResult(); }),
      select("คณะ", facOpts, state.faculty, function (v) { state.faculty = v; state.major = ""; renderFilters(); renderResult(); }),
      select("สาขา", majorOptions(), state.major, function (v) { state.major = v; renderResult(); }),
      select("เดือน", monthOpts, state.month, function (v) { state.month = v; renderResult(); }),
      reset
    ]));
  }

  function renderResult() {
    ui.clear(resultBox);
    var sum = S.summarize(state.year, state.faculty || undefined, state.major || undefined, state.month === "" ? undefined : state.month);
    if (!sum.submitted) {
      resultBox.appendChild(ui.state("empty", "ไม่พบข้อมูลในตัวกรองนี้", "ลองเลือกปี คณะ หรือเดือนอื่น", h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: function () { state.faculty = ""; state.major = ""; state.month = ""; renderFilters(); renderResult(); } }, "ล้างตัวกรอง")));
      return;
    }

    resultBox.appendChild(h("div", { class: "bd-kpis" }, [
      kpi("user", "ผู้สมัคร", ui.num(sum.applicants), "ทุกสถานะ"),
      kpi("documents", "ยื่นคำร้อง", ui.num(sum.submitted), "จำนวนคำร้องทั้งหมด"),
      kpi("check", "ดำเนินการสำเร็จ", ui.num(sum.completed), "คำร้องที่เสร็จสิ้น"),
      kpi("chart", "อัตราความสำเร็จ", sum.rate.toFixed(1) + "%", "สำเร็จ / ยื่นคำร้อง", Math.round(sum.rate))
    ]));

    var chartCard = h("section", { class: "bd-card" }, [
      h("header", { class: "bd-card__head" }, h("div", null, [h("h2", { class: "bd-card__title", text: "จำนวนคำร้องรายเดือน" }), h("p", { class: "bd-card__sub", text: "ข้อมูลจำลอง · ตามตัวกรองคณะและสาขา" })])),
      charts.monthly(sum.months, "กราฟคำร้องรายเดือน ปี " + state.year),
      h("ul", { class: "bd-legend" }, [
        h("li", null, [h("i", { style: "--c: var(--bd-chart-1)" }), "ยื่นคำร้อง"]),
        h("li", null, [h("i", { class: "is-line" }), "ดำเนินการสำเร็จ"])
      ])
    ]);
    resultBox.appendChild(h("div", { class: "bd-grid--full bd-grid" }, chartCard));

    var head = sum.level === "faculty" ? "คณะ" : "สาขา";
    var tbody = h("tbody", null, sum.groups.map(function (g) {
      var p = Math.round(g.rate);
      return h("tr", null, [
        h("td", { class: "bd-td-main" }, h("div", { class: "bd-cell-main" }, h("span", { class: "bd-cell-title", text: g.name }))),
        h("td", { "data-label": "ยื่นคำร้อง", class: "bd-num", text: ui.num(g.submitted) }),
        h("td", { "data-label": "สำเร็จ", class: "bd-num", text: ui.num(g.completed) }),
        h("td", { "data-label": "อัตราความสำเร็จ" }, h("div", { class: "bd-status-bar" }, [
          h("div", { class: "bd-bar", role: "img", "aria-label": "อัตราความสำเร็จ " + g.rate.toFixed(1) + "%" }, h("span", { style: "width: " + p + "%" })),
          h("span", { class: "bd-num", text: g.rate.toFixed(1) + "%" })
        ]))
      ]);
    }));
    resultBox.appendChild(h("section", { class: "bd-card bd-card--flush" }, [
      h("div", { class: "bd-card__head bd-card__head--pad" }, h("div", null, [h("h2", { class: "bd-card__title", text: "แยกตาม" + head }), h("p", { class: "bd-card__sub", text: "เรียงจากจำนวนคำร้องมากไปน้อย" })])),
      h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
        h("caption", { class: "visually-hidden", text: "สถิติแยกตาม" + head }),
        h("thead", null, h("tr", null, [
          h("th", { scope: "col", text: head }),
          h("th", { scope: "col", class: "bd-num", text: "ยื่นคำร้อง" }),
          h("th", { scope: "col", class: "bd-num", text: "สำเร็จ" }),
          h("th", { scope: "col", text: "อัตราความสำเร็จ" })
        ])),
        tbody
      ]))
    ]));
  }

  function kpi(icon, label, value, note, percent) {
    var parts = [h("p", { class: "bd-kpi__label" }, [ui.icon(icon), label]), h("p", { class: "bd-kpi__value", text: value }), h("p", { class: "bd-kpi__note", text: note })];
    return h("div", { class: "bd-kpi" }, [h("div", null, parts), percent !== undefined ? charts.ring(percent) : null]);
  }

  renderFilters();
  renderResult();
})();
