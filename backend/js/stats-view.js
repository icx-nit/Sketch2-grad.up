/* ==========================================================================
   stats-view.js: หน้าสถิติ บศ.1 แบบอ่านอย่างเดียว (ต้นแบบ UI)
   ใช้ window.GU_STATS จาก ../js/stats-data.js (ข้อมูลจำลองทั้งหมด)
   ปีในข้อมูลเป็น พ.ศ. ภาษาอังกฤษจะแสดงเป็น ค.ศ. และวาดใหม่เมื่อสลับภาษา
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("bd-main");
  var S = window.GU_STATS;
  if (!root || !window.GUBD || !window.GUBD.ui) { return; }
  var ui = window.GUBD.ui;
  var h = ui.h;
  var I = window.GUBD.i18n;
  var t = ui.t;
  var charts = window.GUBD.charts;

  function yearLabel(y) { return I.lang() === "en" ? "Academic year " + (y - 543) : "ปีการศึกษา " + y; }

  var state = null;

  function render() {
    ui.clear(root);
    if (!S) {
      root.appendChild(ui.state("error", t("ไม่พบข้อมูลสถิติ", "Statistics data not found"), t("ตรวจสอบว่าไฟล์ js/stats-data.js ถูกโหลดแล้ว", "Check that js/stats-data.js is loaded"), null));
      return;
    }
    if (!state) { state = { year: S.years[0], faculty: "", major: "", month: "" }; }

    root.appendChild(h("div", { class: "bd-pagehead" }, [
      h("div", null, [
        h("h1", { class: "bd-pagehead__title", text: t("สถิติ บศ.1", "GS.1 statistics") }),
        h("p", { class: "bd-pagehead__desc", text: t("สถิติการยื่นคำร้องแบบ บศ.1 และการดำเนินการสำเร็จ · ข้อมูลจำลองทั้งหมด", "GS.1 form submissions and completions · all sample data") })
      ]),
      h("div", { class: "bd-pagehead__actions" }, h("span", { class: "bd-readonly" }, [ui.icon("inbox"), t("มุมมองอ่านอย่างเดียว", "Read-only view")]))
    ]));

    root.appendChild(h("p", { class: "bd-note", role: "note" }, [ui.icon("alert"), h("span", { text: t(
      "ต้นแบบเป็นแบบอ่านอย่างเดียว ข้อมูลจริงต้องมาแทนค่า SOURCE ใน js/stats-data.js ทั้งแบบดึงจากระบบ REG หรือให้ทีมอัปโหลดไฟล์ JSON",
      "This prototype is read-only. Real data must replace SOURCE in js/stats-data.js, either pulled from the REG system or uploaded by the team as a JSON file") })]));
    var filterBox = h("section", { class: "bd-card" });
    var resultBox = h("div");
    root.appendChild(filterBox);
    root.appendChild(resultBox);

    function select(label, options, value, onChange) {
      var sel = h("select", { class: "bd-select", "aria-label": label }, options.map(function (o) {
        return h("option", { value: o.value, text: o.label });
      }));
      sel.value = value;
      sel.addEventListener("change", function () { onChange(sel.value); });
      return h("div", { class: "bd-field" }, [h("label", { class: "bd-field__label" }, label), sel]);
    }

    function majorOptions() {
      var list = state.faculty ? S.majorsOf(state.faculty) : S.majorsOf("");
      return [{ value: "", label: t("ทุกสาขา", "All majors") }].concat(list.map(function (m) { return { value: m.id, label: I.label(m.id, m.name) }; }));
    }

    function renderFilters() {
      ui.clear(filterBox);
      var yearOpts = S.years.map(function (y) { return { value: String(y), label: yearLabel(y) }; });
      var facOpts = [{ value: "", label: t("ทุกคณะ", "All faculties") }].concat(S.faculties.map(function (f) { return { value: f.id, label: I.label(f.id, f.name) }; }));
      var monthOpts = [{ value: "", label: t("ทั้งปี", "Whole year") }].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { return { value: String(i), label: ui.monthFull(i) }; }));

      var reset = h("button", { type: "button", class: "bd-btn bd-btn--ghost" }, t("รีเซ็ตตัวกรอง", "Reset filters"));
      reset.addEventListener("click", function () { state = { year: S.years[0], faculty: "", major: "", month: "" }; renderFilters(); renderResult(); });

      filterBox.appendChild(h("div", { class: "bd-card__head" }, [
        h("div", null, [h("h2", { class: "bd-card__title", text: t("ตัวกรองข้อมูล", "Filters") }), h("p", { class: "bd-card__sub", text: t("ข้อมูลจำลอง", "Sample data") })])
      ]));
      filterBox.appendChild(h("div", { class: "bd-filters" }, [
        select(t("ปีการศึกษา", "Academic year"), yearOpts, String(state.year), function (v) { state.year = Number(v); renderResult(); }),
        select(t("คณะ", "Faculty"), facOpts, state.faculty, function (v) { state.faculty = v; state.major = ""; renderFilters(); renderResult(); }),
        select(t("สาขา", "Major"), majorOptions(), state.major, function (v) { state.major = v; renderResult(); }),
        select(t("เดือน", "Month"), monthOpts, state.month, function (v) { state.month = v; renderResult(); }),
        reset
      ]));
    }

    function kpi(icon, label, value, note, percent) {
      var parts = [h("p", { class: "bd-kpi__label" }, [ui.icon(icon), label]), h("p", { class: "bd-kpi__value", text: value }), h("p", { class: "bd-kpi__note", text: note })];
      return h("div", { class: "bd-kpi" }, [h("div", null, parts), percent !== undefined ? charts.ring(percent) : null]);
    }

    function renderResult() {
      ui.clear(resultBox);
      var sum = S.summarize(state.year, state.faculty || undefined, state.major || undefined, state.month === "" ? undefined : state.month);
      if (!sum.submitted) {
        resultBox.appendChild(ui.state("empty", t("ไม่พบข้อมูลในตัวกรองนี้", "No data for these filters"), t("ลองเลือกปี คณะ หรือเดือนอื่น", "Try another year, faculty or month"),
          h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: function () { state.faculty = ""; state.major = ""; state.month = ""; renderFilters(); renderResult(); } }, t("ล้างตัวกรอง", "Clear filters"))));
        return;
      }

      resultBox.appendChild(h("div", { class: "bd-kpis" }, [
        kpi("user", t("ผู้สมัคร", "Applicants"), ui.num(sum.applicants), t("ทุกสถานะ", "All statuses")),
        kpi("documents", t("ยื่นคำร้อง", "Submitted"), ui.num(sum.submitted), t("จำนวนคำร้องทั้งหมด", "Total requests")),
        kpi("check", t("ดำเนินการสำเร็จ", "Completed"), ui.num(sum.completed), t("คำร้องที่เสร็จสิ้น", "Finished requests")),
        kpi("chart", t("อัตราความสำเร็จ", "Completion rate"), sum.rate.toFixed(1) + "%", t("สำเร็จ / ยื่นคำร้อง", "Completed / submitted"), Math.round(sum.rate))
      ]));

      var months = sum.months.map(function (m, i) { return { submitted: m.submitted, completed: m.completed, label: ui.monthShort(i) }; });
      var chartCard = h("section", { class: "bd-card" }, [
        h("header", { class: "bd-card__head" }, h("div", null, [h("h2", { class: "bd-card__title", text: t("จำนวนคำร้องรายเดือน", "Requests by month") }), h("p", { class: "bd-card__sub", text: t("ข้อมูลจำลอง · ตามตัวกรองคณะและสาขา", "Sample data · filtered by faculty and major") })])),
        charts.monthly(months, t("กราฟคำร้องรายเดือน " + yearLabel(state.year), "Monthly requests, " + yearLabel(state.year))),
        h("ul", { class: "bd-legend" }, [
          h("li", null, [h("i", { style: "--c: var(--bd-chart-1)" }), t("ยื่นคำร้อง", "Submitted")]),
          h("li", null, [h("i", { class: "is-line" }), t("ดำเนินการสำเร็จ", "Completed")])
        ])
      ]);
      resultBox.appendChild(h("div", { class: "bd-grid--full bd-grid" }, chartCard));

      var isFaculty = sum.level === "faculty";
      var head = isFaculty ? t("คณะ", "Faculty") : t("สาขา", "Major");
      var tbody = h("tbody", null, sum.groups.map(function (g) {
        var p = Math.round(g.rate);
        var name = I.label(g.id, g.name);
        return h("tr", null, [
          h("td", { class: "bd-td-main" }, h("div", { class: "bd-cell-main" }, h("span", { class: "bd-cell-title", text: name }))),
          h("td", { "data-label": t("ยื่นคำร้อง", "Submitted"), class: "bd-num", text: ui.num(g.submitted) }),
          h("td", { "data-label": t("สำเร็จ", "Completed"), class: "bd-num", text: ui.num(g.completed) }),
          h("td", { "data-label": t("อัตราความสำเร็จ", "Completion rate") }, h("div", { class: "bd-status-bar" }, [
            h("div", { class: "bd-bar", role: "img", "aria-label": t("อัตราความสำเร็จ ", "Completion rate ") + g.rate.toFixed(1) + "%" }, h("span", { style: "width: " + p + "%" })),
            h("span", { class: "bd-num", text: g.rate.toFixed(1) + "%" })
          ]))
        ]);
      }));
      resultBox.appendChild(h("section", { class: "bd-card bd-card--flush" }, [
        h("div", { class: "bd-card__head bd-card__head--pad" }, h("div", null, [
          h("h2", { class: "bd-card__title", text: t("แยกตาม", "By ") + head }),
          h("p", { class: "bd-card__sub", text: t("เรียงจากจำนวนคำร้องมากไปน้อย", "Sorted by number of requests, highest first") })
        ])),
        h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
          h("caption", { class: "visually-hidden", text: t("สถิติแยกตาม", "Statistics by ") + head }),
          h("thead", null, h("tr", null, [
            h("th", { scope: "col", text: head }),
            h("th", { scope: "col", class: "bd-num", text: t("ยื่นคำร้อง", "Submitted") }),
            h("th", { scope: "col", class: "bd-num", text: t("สำเร็จ", "Completed") }),
            h("th", { scope: "col", text: t("อัตราความสำเร็จ", "Completion rate") })
          ])),
          tbody
        ]))
      ]));
    }

    renderFilters();
    renderResult();
  }

  render();
  I.register("page", render);
})();
