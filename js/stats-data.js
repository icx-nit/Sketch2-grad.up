/* ==========================================================================
   stats-data.js: ข้อมูลจำลอง (MOCK) สำหรับระบบสถิติการยื่นคำร้อง บศ.1
   --------------------------------------------------------------------------
   เมื่อเชื่อมฐานข้อมูลจริงแล้ว ให้แทนค่า SOURCE ด้วยข้อมูลที่ดึงจากระบบ
   ทุกส่วน (การ์ด กราฟ วงกลม รายคณะ และตาราง) คำนวณจากชุดข้อมูลนี้ชุดเดียวกัน
   นับเฉพาะ 2 ประเภท: ยื่นคำร้องทั้งหมด และดำเนินการสำเร็จ
   ========================================================================== */
(function () {
  "use strict";

  /* เรียงตามปฏิทิน ม.ค.–ธ.ค. (ข้อมูลต้นทางเก็บตามปีการศึกษาเริ่ม มิ.ย.) */
  var MONTH_LABELS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  var MONTH_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  var FACULTY_DEFS = [
    { id: "sci", name: "คณะวิทยาศาสตร์", majors: [
      { id: "sci-cs", name: "สาขาวิทยาการคอมพิวเตอร์", weight: 3 },
      { id: "sci-chem", name: "สาขาเคมี", weight: 2 }
    ] },
    { id: "nur", name: "คณะพยาบาลศาสตร์", majors: [
      { id: "nur-nurse", name: "สาขาพยาบาลศาสตร์", weight: 4 }
    ] },
    { id: "law", name: "คณะนิติศาสตร์", majors: [
      { id: "law-law", name: "สาขานิติศาสตร์", weight: 2 }
    ] },
    { id: "mgt", name: "คณะการจัดการ", majors: [
      { id: "mgt-mgt", name: "สาขาการจัดการ", weight: 3 },
      { id: "mgt-mkt", name: "สาขาการตลาด", weight: 2 }
    ] }
  ];

  var NAMES = {};
  var MAJORS = [];
  var MAJOR_FACULTY = {};
  FACULTY_DEFS.forEach(function (f) {
    NAMES[f.id] = f.name;
    f.majors.forEach(function (m) {
      NAMES[m.id] = m.name;
      MAJOR_FACULTY[m.id] = f.id;
      MAJORS.push({ id: m.id, name: m.name, weight: m.weight, facultyId: f.id });
    });
  });

  /* ข้อมูลต้นทาง (mock): ยอดรายเดือนของแต่ละปีการศึกษา และจำนวนผู้ยื่นทั้งปี */
  var SOURCE = {
    /* startMonth = ลำดับปฏิทินของเดือนแรกในอาร์เรย์ (0 = ม.ค., 5 = มิ.ย.)
       ปี 2569 เป็นข้อมูลปฏิทิน ม.ค.–พ.ย. 2569 (ม.ค.–พ.ค. ตรงกับช่วงท้ายของปีการศึกษา 2568) */
    2569: {
      period: "ข้อมูลจำลอง ม.ค. - พ.ย. 2569",
      applicants: 1248,
      startMonth: 0,
      submitted: [230, 270, 300, 320, 309, 310, 420, 560, 590, 790, 890],
      completed: [210, 246, 272, 290, 289, 270, 370, 500, 550, 740, 860]
    },
    2568: {
      period: "ปีการศึกษา 2568 (มิ.ย. 2568 - พ.ค. 2569)",
      applicants: 1087,
      startMonth: 5,
      submitted: [240, 260, 300, 290, 270, 260, 240, 230, 270, 300, 320, 309],
      completed: [220, 236, 272, 265, 246, 236, 218, 210, 246, 272, 290, 289]
    }
  };

  /* แปลงลำดับเดือนของปีการศึกษา (0 = มิ.ย.) เป็นลำดับปฏิทิน (0 = ม.ค.) */
  function calIndex(acad) { return (acad + 5) % 12; }

  function split(total, weights) {
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    var out = weights.map(function (w) { return Math.floor(total * w / sum); });
    var rem = total - out.reduce(function (a, b) { return a + b; }, 0);
    for (var i = 0; rem > 0; i = (i + 1) % out.length, rem--) { out[i]++; }
    return out;
  }

  var records = [];
  var applicants = [];
  var years = Object.keys(SOURCE).map(Number).sort(function (a, b) { return b - a; });

  years.forEach(function (year) {
    var src = SOURCE[year];
    var weights = MAJORS.map(function (m) { return m.weight; });
    split(src.applicants, weights).forEach(function (count, j) {
      applicants.push({ year: year, major: MAJORS[j].id, count: count });
    });
    src.submitted.forEach(function (subTotal, m) {
      var subCells = split(subTotal, weights);
      var doneCells = split(src.completed[m], subCells);
      subCells.forEach(function (s, j) {
        records.push({ year: year, month: (src.startMonth + m) % 12, major: MAJORS[j].id, submitted: s, completed: doneCells[j] });
      });
    });
  });

  function inScope(r, faculty, major) {
    if (major) { return r.major === major; }
    if (faculty) { return MAJOR_FACULTY[r.major] === faculty; }
    return true;
  }

  function majorsOf(facultyId) {
    if (!facultyId) { return MAJORS.slice(); }
    return MAJORS.filter(function (m) { return m.facultyId === facultyId; });
  }

  function summarize(year, faculty, major, month) {
    var hasMonth = month !== undefined && month !== null && month !== "";
    var pick = hasMonth ? Number(month) : -1;
    var months = MONTH_LABELS.map(function (label, i) {
      return { label: label, full: MONTH_FULL[i], submitted: 0, completed: 0 };
    });
    var defs = major ? [major] : faculty ? majorsOf(faculty).map(function (m) { return m.id; })
      : FACULTY_DEFS.map(function (f) { return f.id; });
    var groupMap = {};
    defs.forEach(function (id) { groupMap[id] = { id: id, name: NAMES[id], submitted: 0, completed: 0 }; });

    var submitted = 0, completed = 0, appl = 0;
    records.forEach(function (r) {
      if (r.year !== year || !inScope(r, faculty, major)) { return; }
      months[r.month].submitted += r.submitted;
      months[r.month].completed += r.completed;
      if (hasMonth && r.month !== pick) { return; }
      submitted += r.submitted;
      completed += r.completed;
      var key = major || faculty ? r.major : MAJOR_FACULTY[r.major];
      groupMap[key].submitted += r.submitted;
      groupMap[key].completed += r.completed;
    });
    applicants.forEach(function (a) {
      if (a.year === year && inScope({ major: a.major }, faculty, major)) { appl += a.count; }
    });

    var active = 0;
    months.forEach(function (m, i) { if (m.submitted > 0) { active = i + 1; } });

    var groups = defs.map(function (id) {
      var g = groupMap[id];
      g.rate = g.submitted > 0 ? g.completed / g.submitted * 100 : 0;
      return g;
    }).sort(function (a, b) { return b.submitted - a.submitted; });

    return {
      year: year,
      applicants: appl,
      submitted: submitted,
      completed: completed,
      rate: submitted > 0 ? completed / submitted * 100 : 0,
      months: months,
      groups: groups,
      level: major || faculty ? "major" : "faculty"
    };
  }

  window.GU_STATS = {
    years: years,
    faculties: FACULTY_DEFS,
    majorsOf: majorsOf,
    nameOf: function (id) { return NAMES[id] || ""; },
    facultyOf: function (majorId) { return MAJOR_FACULTY[majorId] || ""; },
    period: function (year) { return SOURCE[year] ? SOURCE[year].period : ""; },
    summarize: summarize
  };
})();
