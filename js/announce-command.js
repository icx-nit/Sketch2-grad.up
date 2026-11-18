(function () {
  "use strict";

  /* ==========================================================================
     Data — รายการคำสั่งแต่งตั้งอาจารย์บัณฑิตศึกษา (ตามเว็บ GRAD)
     แถวข้อมูล: [ประเภท (0 = บัณฑิตศึกษา, 1 = พิเศษบัณฑิตศึกษา), ฉบับที่ (0 = ไม่มี),
                 รหัสไฟล์ PDF, วันที่ (ตามเว็บ), ยอดเข้าชม, ปีในชื่อคำสั่ง (ถ้าต่างจากแท็บ)]
     ========================================================================== */

  var SOURCE_URL = "https://grad.up.ac.th/announce/command";
  var PDF_BASE = "https://grad.up.ac.th/uploads/announce/";
  var PAGE_SIZE = 10;

  var ROWS = {
    "2569": [
      [0, 3, "6ad5722e69289fw7GW", "19 ต.ค. 2569", 19],
      [1, 3, "6ad5714018b6etNwYQ", "19 ต.ค. 2569", 10],
      [0, 2, "6a965241806a078wso", "31 ส.ค. 2569", 65],
      [1, 2, "6a94ff813816bihxqA", "31 ส.ค. 2569", 42],
      [0, 0, "6a7983b305d8bTmJ4k", "13 ก.ค. 2569", 176],
      [1, 0, "6a798432a2bb8Gly7y", "13 ก.ค. 2569", 92]
    ],
    "2568": [
      [0, 9, "6a8fac5ec7a23nCUhk", "27 ส.ค. 2569", 5],
      [1, 9, "6a54aade21069y5uqE", "13 ก.ค. 2569", 3],
      [0, 8, "6a1514843195b2vswr", "26 พ.ค. 2569", 53],
      [1, 8, "6a15143b711d4eOpH4", "26 พ.ค. 2569", 23],
      [0, 7, "69d87d034126f85wrb", "10 เม.ย. 2569", 55],
      [1, 7, "69d87cc0c769dWcbXd", "10 เม.ย. 2569", 39],
      [1, 6, "699bbdc5e7923guowM", "23 ก.พ. 2569", 85],
      [0, 6, "6996dc32310abaKQ5Z", "19 ก.พ. 2569", 64],
      [0, 5, "6969e1f46a3a0zRGAF", "12 ม.ค. 2569", 102],
      [1, 5, "6964a3255360038aRC", "12 ม.ค. 2569", 75],
      [0, 4, "68f88137ce99760FPN", "22 ต.ค. 2568", 112],
      [1, 4, "693b93e3e3a4eAzVGo", "22 ต.ค. 2568", 76],
      [0, 3, "68c1284314c0dcNlke", "10 ก.ย. 2568", 136],
      [1, 3, "68c1280b10bc0iUuyF", "10 ก.ย. 2568", 69],
      [0, 2, "68898195664afeWhcX", "30 ก.ค. 2568", 163],
      [1, 2, "6889816ca1b58Y2l3y", "30 ก.ค. 2568", 88],
      [0, 0, "686e23e74e099rhY7t", "23 มิ.ย. 2568", 426],
      [1, 0, "6923d1c7acd9aI2ZLd", "20 มิ.ย. 2568", 216]
    ],
    "2567": [
      [0, 8, "6854e95a7bf69Vh9pQ", "20 มิ.ย. 2568", 5],
      [1, 8, "6854e90ca902fYtgAg", "20 มิ.ย. 2568", 6],
      [0, 7, "67edf1759384bj1Wfg", "3 เม.ย. 2568", 159],
      [1, 7, "67edf1e3f12bcl6DaO", "2 เม.ย. 2568", 111],
      [0, 6, "67ecea9691935OH62s", "17 ก.พ. 2568", 108],
      [1, 6, "67b296df11639OYn4r", "17 ก.พ. 2568", 31],
      [1, 5, "676e672cb0d47WkHTf", "27 ธ.ค. 2567", 18],
      [0, 5, "676e66f10a5e4rBO19", "27 ธ.ค. 2567", 44],
      [0, 4, "671f5bf57c763nKmtt", "28 ต.ค. 2567", 41],
      [1, 4, "671f5ba7d7d07GOZSH", "28 ต.ค. 2567", 22],
      [0, 3, "66e924dd53f16RpyNX", "13 ก.ย. 2567", 46],
      [1, 3, "66e3d8c810ec92Qcaq", "13 ก.ย. 2567", 14],
      [1, 2, "66b03348c131cU8ah8", "1 ส.ค. 2567", 10],
      [0, 2, "66ab380a34590fPzSK", "26 ก.ค. 2567", 45],
      [1, 0, "66b03366e53c7yoBdp", "26 ก.ค. 2567", 31],
      [0, 0, "678f62b0e7d1am54tU", "13 มิ.ย. 2567", 65]
    ],
    "2566": [
      [0, 7, "668d06f03a543A1oET", "6 มิ.ย. 2567", 2],
      [1, 7, "666111d541af6aQb1n", "6 มิ.ย. 2567", 3],
      [0, 6, "6625ca8ab7551guj0v", "22 เม.ย. 2567", 2],
      [1, 6, "6625ca6076db2GdpZA", "22 เม.ย. 2567", 2],
      [0, 5, "65ee8db7ac17e2Oxry", "11 มี.ค. 2567", 1],
      [1, 5, "65ee8d4e09931bE8qq", "11 มี.ค. 2567", 2],
      [0, 4, "6593b40b3bcbd0QBtK", "2 ม.ค. 2567", 0],
      [1, 4, "65d6ab13e656cHoN2r", "2 ม.ค. 2567", 2],
      [0, 3, "653741e5f1dd14v0Y8", "24 ต.ค. 2566", 3],
      [1, 3, "6537417496623CBSmA", "24 ต.ค. 2566", 5],
      [0, 2, "64e72f50210d2BKhDB", "24 ส.ค. 2566", 3],
      [1, 2, "64e72de807678GhbO6", "24 ส.ค. 2566", 4],
      [0, 0, "65b355a974646alx4M", "18 ส.ค. 2566", 2],
      [1, 0, "648adcfdab843FJt4c", "15 มิ.ย. 2566", 3]
    ],
    "2565": [
      [1, 7, "644f426625eadZ9QrO", "30 เม.ย. 2566", 2],
      [0, 7, "644e310b61232morXF", "30 เม.ย. 2566", 1],
      [1, 6, "6408034adfee55crlv", "8 มี.ค. 2566", 2],
      [0, 6, "640809c4431a13Rr0S", "8 มี.ค. 2566", 0],
      [1, 5, "63cfa78785413WtdiI", "24 ม.ค. 2566", 2],
      [0, 5, "63cfa75aed2382zxBE", "24 ม.ค. 2566", 0],
      [1, 4, "6391b0f514ab7", "8 ธ.ค. 2565", 2],
      [0, 4, "638f08be6e41e", "6 ธ.ค. 2565", 0],
      [1, 3, "6358da427dd34", "26 ต.ค. 2565", 1],
      [0, 3, "635106267cbc2", "20 ต.ค. 2565", 1],
      [0, 2, "6358db2e9ee23", "22 ส.ค. 2565", 0],
      [1, 2, "630436d44a682", "22 ส.ค. 2565", 1],
      [0, 0, "6333afa580b10", "15 มิ.ย. 2565", 0],
      [1, 0, "62aff1721b809", "15 มิ.ย. 2565", 1]
    ],
    "2564": [
      [1, 9, "62a98548de59a", "15 มิ.ย. 2565", 2],
      [0, 10, "62a985020b121", "15 มิ.ย. 2565", 1],
      [0, 9, "6274dcf2f0625", "6 พ.ค. 2565", 0],
      [1, 8, "6274dc956f328", "6 พ.ค. 2565", 2],
      [1, 7, "622857608eb46", "9 มี.ค. 2565", 2],
      [0, 8, "622856f4cd212", "9 มี.ค. 2565", 0],
      [0, 7, "61fa2800e9f8b", "2 ก.พ. 2565", 1],
      [1, 6, "61fa27bc189de", "2 ก.พ. 2565", 2],
      [0, 6, "61a9e862bc906", "3 ธ.ค. 2564", 0],
      [0, 5, "61920fff65479", "15 ต.ค. 2564", 0],
      [1, 5, "616923550f521", "15 ต.ค. 2564", 1],
      [0, 4, "6125e4c896f78", "25 ส.ค. 2564", 0],
      [1, 4, "6125e45f5ad0e", "25 ส.ค. 2564", 1],
      [1, 3, "60e8071d05a87", "9 ก.ค. 2564", 1],
      [0, 3, "60e806de7a8c2", "9 ก.ค. 2564", 0],
      [1, 2, "60c809e298fba", "15 มิ.ย. 2564", 1],
      [0, 2, "60c809350f5bf", "15 มิ.ย. 2564", 0],
      [0, 0, "63898caf41401", "21 พ.ค. 2564", 0],
      [1, 0, "60b5df2f122ed", "21 พ.ค. 2564", 1]
    ],
    "2563": [
      [1, 5, "5f16b40f9e627", "21 ก.ค. 2563", 0],
      [0, 5, "5fc4a61d58c12", "21 ก.ค. 2563", 0],
      [1, 4, "5f16b3d451fe6", "21 ก.ค. 2563", 0],
      [0, 4, "5f16b3be9ffb0", "21 ก.ค. 2563", 0],
      [1, 3, "5f16b3a09f823", "21 ก.ค. 2563", 0],
      [0, 3, "5f16b382a8adc", "21 ก.ค. 2563", 0],
      [1, 2, "5f16b368a1eb5", "21 ก.ค. 2563", 0],
      [0, 2, "5f16b3469ab10", "21 ก.ค. 2563", 0],
      [1, 0, "5f16b322ed3e7", "21 ก.ค. 2563", 0],
      [0, 0, "5f16b3068830c", "21 ก.ค. 2563", 0],
      [0, 13, "60c80b56cbaf9", "15 มิ.ย. 2564", 1],
      [0, 12, "60d071108e83a", "21 พ.ค. 2564", 0],
      [1, 12, "60a71b27f1ba3", "21 พ.ค. 2564", 0],
      [0, 11, "60614b9d23a9f", "29 มี.ค. 2564", 0],
      [1, 11, "60614b4382f5a", "29 มี.ค. 2564", 0],
      [1, 10, "602f2c098ae61", "19 ก.พ. 2564", 1],
      [0, 10, "60bed05f63527", "19 ก.พ. 2564", 0],
      [1, 9, "5fd8865258233", "15 ธ.ค. 2563", 1],
      [0, 9, "5fd8614eacd9c", "15 ธ.ค. 2563", 1],
      [1, 6, "5fbde2dad32b6", "25 พ.ย. 2563", 2],
      [0, 6, "5fbde354e8b8a", "25 พ.ย. 2563", 0],
      [0, 7, "5f9f6d11f21eb", "2 พ.ย. 2563", 0],
      [0, 8, "605c5ad786738", "28 ต.ค. 2563", 0],
      [1, 8, "5f9918da1d22f", "28 ต.ค. 2563", 1],
      [1, 7, "5f6177cd0db76", "16 ก.ย. 2563", 1]
    ],
    "2562": [
      [1, 11, "5f16b22169bce", "21 ก.ค. 2563", 0],
      [0, 11, "5f16b20a7e8aa", "21 ก.ค. 2563", 0],
      [1, 10, "5f16b1f3b7c38", "21 ก.ค. 2563", 0],
      [0, 10, "5f16b1d38cd25", "21 ก.ค. 2563", 0],
      [1, 9, "5f16b1aa2f918", "21 ก.ค. 2563", 0],
      [0, 9, "5f16b18feaac6", "21 ก.ค. 2563", 0],
      [1, 8, "5e4cbfc390efa", "19 ก.พ. 2563", 0],
      [0, 8, "5e4cbfb039062", "19 ก.พ. 2563", 0],
      [1, 7, "5e4cbf7fdda4d", "19 ก.พ. 2563", 0],
      [0, 7, "5e4cbf9b8c27e", "19 ก.พ. 2563", 0],
      [1, 6, "5e4cbf62d4060", "19 ก.พ. 2563", 0],
      [0, 6, "5e4cbf4c51ccb", "19 ก.พ. 2563", 0],
      [1, 5, "5e4cbf3870f89", "19 ก.พ. 2563", 0],
      [0, 5, "5f16b3ef2dff4", "21 ก.ค. 2563", 0, "2563"],
      [0, 5, "5e4cbf224b651", "19 ก.พ. 2563", 0],
      [1, 4, "5e4cbee80c117", "19 ก.พ. 2563", 0],
      [0, 4, "5e4cbed050041", "19 ก.พ. 2563", 0],
      [1, 3, "5e4cbeafe0068", "19 ก.พ. 2563", 0],
      [0, 3, "5e4cbe8d4d457", "19 ก.พ. 2563", 0],
      [1, 2, "5e4cbe698113a", "19 ก.พ. 2563", 0],
      [0, 2, "5e4cbe4995465", "19 ก.พ. 2563", 0],
      [1, 0, "5e4cbe1c45199", "19 ก.พ. 2563", 0],
      [0, 0, "5e4cbdf89b059", "19 ก.พ. 2563", 1],
      [0, 13, "5f6176e1ba898", "16 ก.ย. 2563", 0],
      [0, 12, "5f3a345973743", "17 ส.ค. 2563", 0]
    ],
    "manual": []
  };

  /* ==========================================================================
     Build items
     ========================================================================== */

  var THAI_MONTHS = {
    "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04", "พ.ค.": "05", "มิ.ย.": "06",
    "ก.ค.": "07", "ส.ค.": "08", "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
  };

  function toIsoDate(label) {
    var parts = label.split(" ");
    var month = THAI_MONTHS[parts[1]];
    if (parts.length < 3 || !month) return "";
    var year = parseInt(parts[2], 10) - 543;
    return year + "-" + month + "-" + String(parseInt(parts[0], 10)).padStart(2, "0");
  }

  function buildItems(year) {
    var rows = ROWS[year] || [];
    return rows.map(function (r) {
      var isSpecial = r[0] === 1;
      var titleYear = r[5] || year;
      var title = "คำสั่งมหาวิทยาลัยพะเยา เรื่อง แต่งตั้งอาจารย์" + (isSpecial ? "พิเศษ" : "") +
        "บัณฑิตศึกษา มหาวิทยาลัยพะเยา ปีการศึกษา " + titleYear + (r[1] ? " ฉบับที่ " + r[1] : "");
      return {
        year: year,
        special: isSpecial,
        number: r[1],
        title: title,
        pdf: PDF_BASE + r[2] + ".pdf",
        label: r[3],
        date: toIsoDate(r[3]),
        views: r[4]
      };
    });
  }

  var COMMANDS = {};
  Object.keys(ROWS).forEach(function (year) {
    COMMANDS[year] = buildItems(year);
  });

  var ALL_ITEMS = [];
  Object.keys(COMMANDS).forEach(function (y) {
    ALL_ITEMS = ALL_ITEMS.concat(COMMANDS[y]);
  });

  /* ==========================================================================
     DOM references and icons
     ========================================================================== */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".year-tab"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var listEl = document.getElementById("command-list");
  var captionEl = document.getElementById("list-caption");
  var paginationEl = document.getElementById("pagination");
  var searchInput = document.getElementById("search-input");
  var sortBtn = document.getElementById("sort-btn");
  var sortLabel = document.getElementById("sort-label");
  var statCount = document.getElementById("stat-count");
  var statTotal = document.getElementById("stat-total");
  var statLatest = document.getElementById("stat-latest");

  var ICONS = {
    doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
    person: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"],
    calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
    eye: ["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
    download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
    external: ["M14 4h6v6", "M20 4l-9 9", "M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"],
    chevronLeft: ["M15 18l-6-6 6-6"],
    chevronRight: ["M9 18l6-6-6-6"]
  };

  function svgIcon(paths, cls) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    if (cls) svg.setAttribute("class", cls);
    paths.forEach(function (d) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });
    return svg;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ==========================================================================
     State
     ========================================================================== */

  var state = {
    year: "2569",
    filter: "all",
    query: "",
    newestFirst: true,
    page: 1
  };

  function itemsForYear(year) {
    return COMMANDS[year] || [];
  }

  function filteredItems() {
    var q = state.query.trim().toLowerCase();
    var list = itemsForYear(state.year).filter(function (item) {
      if (state.filter === "0" && item.special) return false;
      if (state.filter === "1" && !item.special) return false;
      if (q && item.title.toLowerCase().indexOf(q) === -1 && String(item.number).indexOf(q) === -1) return false;
      return true;
    });
    list.sort(function (a, b) {
      var cmp = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      return state.newestFirst ? -cmp : cmp;
    });
    return list;
  }

  /* ==========================================================================
     Rendering
     ========================================================================== */

  function buildRow(item) {
    var row = el("article", "doc-row " + (item.special ? "doc-row--special" : "doc-row--board"));

    var icon = el("div", "doc-row__icon");
    icon.appendChild(svgIcon(item.special ? ICONS.person : ICONS.doc));

    var body = el("div", "doc-row__body");

    var badges = el("div", "doc-row__badges");
    badges.appendChild(el("span", "badge badge--type", item.special ? "อาจารย์พิเศษบัณฑิตศึกษา" : "อาจารย์บัณฑิตศึกษา"));
    badges.appendChild(el("span", "badge badge--year", "ปีการศึกษา " + item.year));
    if (item.number) badges.appendChild(el("span", "badge badge--no", "ฉบับที่ " + item.number));

    var title = el("h3", "doc-row__title", item.title);

    var meta = el("ul", "doc-row__meta");
    var dateLi = el("li");
    dateLi.appendChild(svgIcon(ICONS.calendar));
    var time = el("time", null, item.label);
    if (item.date) time.setAttribute("datetime", item.date);
    dateLi.appendChild(time);
    var viewLi = el("li");
    viewLi.appendChild(svgIcon(ICONS.eye));
    viewLi.appendChild(el("span", null, item.views.toLocaleString("th-TH") + " ครั้ง"));
    meta.appendChild(dateLi);
    meta.appendChild(viewLi);

    body.appendChild(badges);
    body.appendChild(title);
    body.appendChild(meta);

    var actions = el("div", "doc-row__actions");
    var download = el("a", "btn btn--solid");
    download.href = item.pdf;
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.setAttribute("download", "");
    download.appendChild(svgIcon(ICONS.download));
    download.appendChild(el("span", null, "ดาวน์โหลด"));
    var preview = el("a", "doc-row__preview");
    preview.href = item.pdf;
    preview.target = "_blank";
    preview.rel = "noopener noreferrer";
    preview.appendChild(svgIcon(ICONS.eye));
    preview.appendChild(el("span", null, "ดูตัวอย่าง"));
    actions.appendChild(download);
    actions.appendChild(preview);

    row.appendChild(icon);
    row.appendChild(body);
    row.appendChild(actions);
    return row;
  }

  function buildEmpty(message, withSource) {
    var box = el("div", "doc-empty");
    box.appendChild(el("h3", null, message));
    box.appendChild(el("p", null, "ดูรายการทั้งหมดได้ที่เว็บไซต์ต้นฉบับ"));
    if (withSource) {
      var link = el("a", "btn btn--outline");
      link.href = SOURCE_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.appendChild(el("span", null, "เปิดเว็บไซต์ GRAD"));
      link.appendChild(svgIcon(ICONS.external));
      box.appendChild(link);
    }
    return box;
  }

  function renderPagination(total) {
    paginationEl.textContent = "";
    var pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) return;

    function pageButton(label, target, disabled, active, ariaLabel) {
      var b = el("button", "page-btn" + (active ? " is-active" : ""), label);
      b.type = "button";
      b.disabled = disabled;
      if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
      if (active) b.setAttribute("aria-current", "page");
      b.addEventListener("click", function () {
        state.page = target;
        renderList();
        listEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
      return b;
    }

    paginationEl.appendChild(pageButton("", Math.max(1, state.page - 1), state.page === 1, false, "หน้าก่อนหน้า"));
    paginationEl.lastChild.appendChild(svgIcon(ICONS.chevronLeft));
    for (var p = 1; p <= pages; p++) {
      paginationEl.appendChild(pageButton(String(p), p, false, p === state.page, "หน้า " + p));
    }
    paginationEl.appendChild(pageButton("", Math.min(pages, state.page + 1), state.page === pages, false, "หน้าถัดไป"));
    paginationEl.lastChild.appendChild(svgIcon(ICONS.chevronRight));
  }

  function renderList() {
    var list = filteredItems();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;

    listEl.textContent = "";
    var yearItems = itemsForYear(state.year);

    if (!yearItems.length) {
      listEl.appendChild(buildEmpty(
        state.year === "manual" ? "ยังไม่มีรายการคู่มือในหน้านี้" : "ยังไม่มีรายการของปีการศึกษา " + state.year + " ในหน้านี้",
        true
      ));
      captionEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }

    if (!list.length) {
      listEl.appendChild(buildEmpty("ไม่พบรายการที่ตรงกับการค้นหา", false));
      captionEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = list.slice(start, start + PAGE_SIZE);
    pageItems.forEach(function (item) {
      listEl.appendChild(buildRow(item));
    });

    var from = start + 1;
    var to = start + pageItems.length;
    captionEl.textContent = "แสดง " + from + "–" + to + " จากทั้งหมด " + list.length + " ฉบับ · ปีการศึกษา " +
      state.year + " · " + (state.newestFirst ? "เรียงจากล่าสุด" : "เรียงจากเก่าสุด");

    renderPagination(list.length);
  }

  function renderCounts() {
    var yearItems = itemsForYear(state.year);
    var boardCount = yearItems.filter(function (i) { return !i.special; }).length;
    var specialCount = yearItems.filter(function (i) { return i.special; }).length;
    chips.forEach(function (chip) {
      var key = chip.getAttribute("data-filter");
      var count = key === "all" ? yearItems.length : key === "0" ? boardCount : specialCount;
      var span = chip.querySelector(".chip__count");
      if (span) span.textContent = String(count);
    });
    statCount.textContent = yearItems.length + " ฉบับ";
    statTotal.textContent = ALL_ITEMS.length + " ฉบับ";
  }

  function setYear(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.setAttribute("tabindex", selected ? "0" : "-1");
    });
    listEl.setAttribute("aria-labelledby", tab.id);
    state.year = tab.getAttribute("data-year");
    state.page = 1;
    renderCounts();
    renderList();
  }

  /* ==========================================================================
     Events
     ========================================================================== */

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      setYear(tab);
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        setYear(next);
      }
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.filter = chip.getAttribute("data-filter");
      state.page = 1;
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      renderList();
    });
  });

  searchInput.addEventListener("input", function () {
    state.query = searchInput.value;
    state.page = 1;
    renderList();
  });

  sortBtn.addEventListener("click", function () {
    state.newestFirst = !state.newestFirst;
    state.page = 1;
    sortLabel.textContent = state.newestFirst ? "เรียงจากล่าสุด" : "เรียงจากเก่าสุด";
    sortBtn.setAttribute("aria-pressed", String(state.newestFirst));
    renderList();
  });

  /* ค่าสรุปเริ่มต้น: วันที่อัปเดตล่าสุดจากทุกปี */
  var latest = ALL_ITEMS.reduce(function (acc, item) {
    return item.date > acc.date ? item : acc;
  }, { date: "", label: "-" });
  statLatest.textContent = latest.label;

  var initialTab = document.querySelector(".year-tab[aria-selected='true']") || tabs[0];
  if (initialTab) setYear(initialTab);

  /* ==========================================================================
     Dropdown menus (click to toggle on touch, hover on desktop)
     ========================================================================== */

  var dropdowns = document.querySelectorAll(".tabbar__dropdown");

  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector(":scope > .tabbar__link");
    var menu = dropdown.querySelector(":scope > .tabbar__dropdown-menu");

    if (!trigger || !menu) return;

    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = dropdown.classList.contains("open");

      /* ปิด dropdown อื่นทั้งหมด */
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("open");
          other.querySelector(".tabbar__link").setAttribute("aria-expanded", "false");
        }
      });

      dropdown.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ปิด dropdown เมื่อคลิกที่อื่น */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".tabbar__dropdown")) {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove("open");
        dropdown.querySelector(".tabbar__link").setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ==========================================================================
     Font size controls
     ========================================================================== */

  var BASE_FONT_SIZE = 16;
  var STORAGE_KEY = "gu-font-size";
  var root = document.documentElement;

  function readFontSize() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      var val = saved ? parseInt(saved, 10) : 0;
      return (val >= 12 && val <= 24) ? val : 0;
    } catch {
      return 0;
    }
  }

  function writeFontSize(size) {
    try {
      localStorage.setItem(STORAGE_KEY, String(size));
    } catch { /* localStorage ถูกปิดใช้งาน */ }
  }

  var savedSize = readFontSize();
  if (savedSize > 0) {
    root.style.setProperty("--font-scale", savedSize / BASE_FONT_SIZE);
  }

  var sizeButtons = document.querySelectorAll("[data-font-size]");
  sizeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var action = btn.getAttribute("data-font-size");
      var currentSize = savedSize || BASE_FONT_SIZE;
      var newSize = currentSize;

      if (action === "decrease") {
        newSize = Math.max(12, currentSize - 1);
      } else if (action === "increase") {
        newSize = Math.min(24, currentSize + 1);
      } else if (action === "reset") {
        newSize = BASE_FONT_SIZE;
      }

      savedSize = newSize;
      root.style.setProperty("--font-scale", newSize / BASE_FONT_SIZE);
      writeFontSize(newSize);
    });
  });

  /* ==========================================================================
     Theme toggle (tabbar button)
     ========================================================================== */

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle && window.GUTheme) {
    function updateIcons() {
      var isDark = window.GUTheme.get() === "dark";
      themeToggle.setAttribute("aria-label", isDark ? "เปลี่ยนธีมเป็นสว่าง" : "เปลี่ยนธีมเป็นมืด");
    }

    themeToggle.addEventListener("click", function () {
      window.GUTheme.toggle();
    });

    document.addEventListener("gu:themechange", updateIcons);
    updateIcons();
  }

})();
