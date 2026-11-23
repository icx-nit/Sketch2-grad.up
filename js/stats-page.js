/* ==========================================================================
   stats-page.js: หน้าดูสถิติทั้งหมด (ตัวกรองปีการศึกษา เดือน คณะ สาขา และ Reset)
   - ตัวกรองเดือน: เลือกเดือนเพื่อดูตัวเลขย้อนหลังของเดือนนั้น (กราฟยังแสดงทั้งปีและไฮไลต์เดือนที่เลือก)
   ========================================================================== */
(function () {
  "use strict";

  var S = window.GU_STATS;
  var UI = window.GU_STATS_UI;
  var root = document.querySelector("[data-stats-page]");
  if (!S || !UI || !root) { return; }

  var q = function (sel) { return document.querySelector(sel); };
  var yearSel = q("#f-year");
  var monthSel = q("#f-month");
  var facSel = q("#f-faculty");
  var majSel = q("#f-major");
  var resetBtn = q("#f-reset");
  var chartHost = q("[data-pg-chart]");

  function option(value, text) {
    var o = document.createElement("option");
    o.value = value;
    o.textContent = text;
    return o;
  }

  function fillYears() {
    yearSel.innerHTML = "";
    S.years.forEach(function (y) { yearSel.appendChild(option(String(y), "ปีการศึกษา " + y)); });
  }

  /* รายการเดือนของปีนั้น (ไม่ขึ้นกับคณะ/สาขา เพื่อให้รายการเดือนคงที่) */
  function fillMonths() {
    var prev = monthSel.value;
    monthSel.innerHTML = "";
    monthSel.appendChild(option("", "เดือน"));
    S.summarize(Number(yearSel.value), "", "").months.forEach(function (m, i) {
      if (m.submitted > 0) { monthSel.appendChild(option(String(i), m.full)); }
    });
    if (prev !== "" && monthSel.querySelector('option[value="' + prev + '"]')) {
      monthSel.value = prev;
    }
  }

  function fillFaculties() {
    facSel.innerHTML = "";
    facSel.appendChild(option("", "ทุกคณะ"));
    S.faculties.forEach(function (f) { facSel.appendChild(option(f.id, f.name)); });
  }

  function fillMajors() {
    var faculty = facSel.value;
    majSel.innerHTML = "";
    majSel.appendChild(option("", "ทุกสาขา"));
    S.majorsOf(faculty).forEach(function (m) {
      var label = faculty ? m.name : m.name + " (" + S.nameOf(m.facultyId) + ")";
      majSel.appendChild(option(m.id, label));
    });
  }

  function renderTable(groups) {
    var tbody = q("[data-pg-table]");
    tbody.innerHTML = "";
    if (!groups.some(function (g) { return g.submitted > 0; })) {
      tbody.innerHTML = '<tr><td colspan="4" class="stats-empty">ยังไม่มีข้อมูลสำหรับแสดงผล</td></tr>';
      return;
    }
    groups.forEach(function (g) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<th scope="row">' + g.name + "</th><td>" + UI.fmt(g.submitted) + "</td><td>" +
        UI.fmt(g.completed) + "</td><td>" + UI.pct(g.rate) + "</td>";
      tbody.appendChild(tr);
    });
  }

  function update() {
    var year = Number(yearSel.value);
    var month = monthSel.value;
    var cur = S.summarize(year, facSel.value, majSel.value, month);

    UI.setCount(q("[data-pg-applicants]"), cur.applicants);
    UI.setCount(q("[data-pg-requests]"), cur.submitted);
    UI.setCount(q("[data-pg-completed]"), cur.completed);
    UI.setCount(q("[data-pg-rate]"), cur.rate, { decimals: 1, suffix: "%" });
    q("[data-pg-period]").textContent = S.period(year);

    var peak = UI.drawMonthly(chartHost, cur.months);
    var note = q("[data-pg-note]");
    if (peak === null) {
      note.textContent = "";
    } else if (month !== "") {
      note.textContent = "แสดงข้อมูลเฉพาะเดือน" + cur.months[Number(month)].full + " " + year;
    } else {
      note.textContent = "เดือน" + cur.months[peak].full + "มีจำนวนคำร้อง บศ.1 ที่ยื่นสูงสุด " + UI.fmt(cur.months[peak].submitted) + " คำร้อง";
    }

    if (month !== "") {
      var rect = chartHost.querySelector('.stats-chart__bars rect[data-idx="' + month + '"]');
      if (rect) { rect.classList.add("is-selected"); }
    }

    var byFaculty = cur.level === "faculty";
    q("[data-pg-group-title]").textContent = byFaculty ? "สถิติแยกตามคณะ" : "สถิติแยกตามสาขา";
    q("[data-pg-group-col]").textContent = byFaculty ? "คณะ" : "สาขา";
    UI.drawRanks(q("[data-pg-ranks]"), cur.groups);
    renderTable(cur.groups);
  }

  fillYears();
  fillFaculties();
  yearSel.value = String(S.years[0]);
  fillMonths();
  fillMajors();
  update();

  yearSel.addEventListener("change", function () { fillMonths(); update(); });
  monthSel.addEventListener("change", update);
  facSel.addEventListener("change", function () { fillMajors(); update(); });
  majSel.addEventListener("change", update);
  resetBtn.addEventListener("click", function () {
    yearSel.value = String(S.years[0]);
    monthSel.value = "";
    facSel.value = "";
    fillMonths();
    fillMajors();
    update();
  });
})();
