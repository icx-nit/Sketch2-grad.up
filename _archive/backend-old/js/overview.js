/* ==========================================================================
   overview.js: หน้าภาพรวมของ Dashboard (ต้นแบบ UI)
   ทุกตัวเลขคำนวณจากข้อมูลตัวอย่างใน data.js / data-calendar.js และ stats-data.js
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("bd-main");
  if (!root || !window.GUBD || !window.GUBD.ui) { return; }

  var ui = window.GUBD.ui;
  var h = ui.h;
  var charts = window.GUBD.charts;
  var PALETTE = ["var(--bd-chart-1)", "var(--bd-chart-2)", "var(--bd-chart-3)", "var(--bd-chart-4)", "var(--bd-chart-5)"];

  function list(name) { return window.GUBD.getData(name) || []; }
  function pct(part, total) { return total ? Math.round(part / total * 100) : 0; }
  function card(title, sub, body, extra) {
    return h("section", { class: "bd-card" }, [
      h("header", { class: "bd-card__head" }, [
        h("div", null, [h("h2", { class: "bd-card__title", text: title }), sub ? h("p", { class: "bd-card__sub", text: sub }) : null]),
        extra || null
      ]),
      body
    ]);
  }
  function dayBox(iso) {
    var p = ui.parseISO(iso) || { d: 0, m: 1 };
    return h("div", { class: "bd-feed__date" }, [
      h("span", { class: "bd-feed__day", text: String(p.d) }),
      h("span", { class: "bd-feed__mon", text: ui.MONTHS[p.m - 1] })
    ]);
  }
  function link(href, label, iconName) {
    return h("a", { class: "bd-btn bd-btn--ghost", href: href }, [ui.icon(iconName), label]);
  }
  function kpi(icon, label, value, note, percent) {
    var box = h("div", { class: "bd-kpi" }, [
      h("div", null, [
        h("p", { class: "bd-kpi__label" }, [ui.icon(icon), label]),
        h("p", { class: "bd-kpi__value", text: value }),
        h("p", { class: "bd-kpi__note", text: note })
      ]),
      charts.ring(percent)
    ]);
    return box;
  }

  /* ---------- ข้อมูล ---------- */
  var today = ui.todayISO();
  var news = list("news");
  var popups = list("popups");
  var docs = list("documents");
  var cal = list("calendar");
  var links = list("links");
  var cats = list("categories");

  var newsShown = news.filter(function (r) { return r.visible !== false; });
  var docsShown = docs.filter(function (r) { return r.visible !== false; });
  var popupsOn = popups.filter(function (r) { return r.visible !== false; });
  var upcoming = cal
    .filter(function (r) { return (r.dateEnd || r.date) >= today; })
    .sort(function (a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; });

  /* ---------- หัวหน้า ---------- */
  root.appendChild(h("div", { class: "bd-pagehead" }, [
    h("div", null, [
      h("h1", { class: "bd-pagehead__title", text: "สวัสดี ผู้ดูแลระบบ" }),
      h("p", { class: "bd-pagehead__desc", text: "ภาพรวมการจัดการเนื้อหาบัณฑิตวิทยาลัย วันนี้ " + ui.fmtDate(today) + " (ข้อมูลตัวอย่างทั้งหมด)" })
    ]),
    h("div", { class: "bd-pagehead__actions" }, [
      link("news.html?new=1", "เพิ่มข่าว", "plus"),
      link("calendar.html?new=1", "เพิ่มกิจกรรม", "calendar"),
      link("statistics.html", "ดูสถิติ บศ.1", "chart")
    ])
  ]));

  /* ---------- การ์ดสรุป ---------- */
  root.appendChild(h("div", { class: "bd-kpis" }, [
    kpi("news", "ข่าวที่แสดงอยู่", ui.num(newsShown.length), "จากทั้งหมด " + ui.num(news.length) + " รายการ", pct(newsShown.length, news.length)),
    kpi("documents", "เอกสารที่เปิดให้ดาวน์โหลด", ui.num(docsShown.length), "จากทั้งหมด " + ui.num(docs.length) + " รายการ", pct(docsShown.length, docs.length)),
    kpi("calendar", "กิจกรรมที่กำลังจะมาถึง", ui.num(upcoming.length), "จากปฏิทินทั้งหมด " + ui.num(cal.length) + " รายการ", pct(upcoming.length, cal.length)),
    kpi("popups", "ป๊อปอัปที่เปิดใช้งาน", ui.num(popupsOn.length) + " ใบ", "จากทั้งหมด " + ui.num(popups.length) + " ใบ (แสดงสูงสุด 3 ใบ)", pct(popupsOn.length, popups.length))
  ]));

  /* ---------- แถวที่ 1: สถิติและสัดส่วนเอกสาร ---------- */
  var row1 = h("div", { class: "bd-grid" });
  if (window.GU_STATS && window.GU_STATS.years && window.GU_STATS.years.length) {
    var year = window.GU_STATS.years[0];
    var sum = window.GU_STATS.summarize(year);
    var legend = h("ul", { class: "bd-legend" }, [
      h("li", null, [h("i", { style: "--c: var(--bd-chart-1)" }), "ยื่นคำร้อง"]),
      h("li", null, [h("i", { class: "is-line" }), "ดำเนินการสำเร็จ"])
    ]);
    var chartWrap = h("div", { class: "bd-chart-wrap" }, [charts.monthly(sum.months, "กราฟยื่นคำร้องและดำเนินการสำเร็จรายเดือน ปี " + year + " (ข้อมูลจำลอง)"), legend]);
    row1.appendChild(card(
      "คำร้องรายเดือน",
      "ปีการศึกษา " + year + " ทุกคณะ · ข้อมูลจำลอง",
      chartWrap,
      h("a", { class: "bd-btn bd-btn--ghost bd-btn--sm", href: "statistics.html" }, "ดูรายละเอียด")
    ));
  }

  var counts = {};
  docsShown.forEach(function (d) { counts[d.category] = (counts[d.category] || 0) + 1; });
  var parts = Object.keys(counts).map(function (name, i) { return { label: name, value: counts[name], color: PALETTE[i % PALETTE.length] }; });
  var donutBody = h("div", { class: "bd-donut" }, [
    charts.donut(parts, String(docsShown.length), "เอกสาร"),
    h("ul", null, parts.map(function (p) {
      return h("li", { style: "--c: " + p.color }, [h("span", null, [h("i"), p.label]), h("b", { text: ui.num(p.value) })]);
    }))
  ]);
  row1.appendChild(card("สัดส่วนเอกสารตามหมวดหมู่", "นับเฉพาะเอกสารที่แสดงอยู่", donutBody));
  root.appendChild(row1);

  /* ---------- แถวที่ 2: กิจกรรมและข่าวล่าสุด ---------- */
  var row2 = h("div", { class: "bd-grid bd-grid--even" });
  var upList = upcoming.slice(0, 5).map(function (r) {
    return h("li", null, [
      dayBox(r.date),
      h("div", null, [
        h("p", { class: "bd-feed__title", text: r.titleTh }),
        h("div", { class: "bd-feed__meta" }, [h("span", { class: "bd-pill bd-pill--tag", text: r.label }), h("span", { text: ui.fmtDate(r.date) + (r.dateEnd && r.dateEnd !== r.date ? " – " + ui.fmtDate(r.dateEnd) : "") })])
      ])
    ]);
  });
  row2.appendChild(card("กิจกรรมที่กำลังจะมาถึง", "เรียงตามวันที่เริ่ม", upList.length
    ? h("ul", { class: "bd-feed" }, upList)
    : ui.state("empty", "ไม่มีกิจกรรมที่กำลังจะมาถึง", "เพิ่มกิจกรรมในหน้าปฏิทินกิจกรรม"),
    link("calendar.html", "จัดการปฏิทิน", "arrowRight")));

  var newsList = newsShown.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).slice(0, 4).map(function (r) {
    return h("li", null, [
      dayBox(r.date),
      h("div", null, [
        h("p", { class: "bd-feed__title", text: r.titleTh }),
        h("div", { class: "bd-feed__meta" }, [h("span", { class: "bd-pill bd-pill--tag", text: r.chip }), r.isNew ? h("span", { class: "bd-pill bd-pill--new", text: "ใหม่" }) : null])
      ])
    ]);
  });
  row2.appendChild(card("ข่าวล่าสุด", "ข่าวที่แสดงอยู่ เรียงตามวันที่", newsList.length
    ? h("ul", { class: "bd-feed" }, newsList)
    : ui.state("empty", "ยังไม่มีข่าว", "เพิ่มข่าวในหน้าข่าวสาร"),
    link("news.html", "จัดการข่าว", "arrowRight")));
  root.appendChild(row2);

  /* ---------- แถวที่ 3: สถานะการเปิดใช้งานแต่ละส่วน ---------- */
  var sections = [
    { name: "ข่าวสาร", icon: "news", href: "news.html", rows: news },
    { name: "ป๊อปอัป", icon: "popups", href: "popups.html", rows: popups },
    { name: "เอกสารและคู่มือ", icon: "documents", href: "documents.html", rows: docs },
    { name: "ลิงก์และหน่วยงาน", icon: "link", href: "links.html", rows: links },
    { name: "หมวดหมู่", icon: "tag", href: "categories.html", rows: cats },
    { name: "ปฏิทินกิจกรรม", icon: "calendar", href: "calendar.html", rows: cal }
  ];
  var tbody = h("tbody", null, sections.map(function (s) {
    var shown = s.rows.filter(function (r) { return r.visible !== false; }).length;
    var p = pct(shown, s.rows.length);
    return h("tr", null, [
      h("td", { class: "bd-td-main" }, h("div", { class: "bd-status-name" }, [
        h("span", { class: "bd-status-name__icon" }, ui.icon(s.icon)),
        h("a", { href: s.href, text: s.name })
      ])),
      h("td", { "data-label": "ทั้งหมด", class: "bd-num", text: ui.num(s.rows.length) }),
      h("td", { "data-label": "แสดงอยู่", class: "bd-num", text: ui.num(shown) }),
      h("td", { "data-label": "สัดส่วนที่เปิดใช้งาน" }, h("div", { class: "bd-status-bar" }, [
        h("div", { class: "bd-bar", role: "img", "aria-label": "เปิดใช้งาน " + p + "%" }, h("span", { style: "width: " + p + "%" })),
        h("span", { class: "bd-num", text: p + "%" })
      ]))
    ]);
  }));
  root.appendChild(h("h2", { class: "bd-section-title", text: "สถานะการเปิดใช้งานแต่ละส่วน" }));
  root.appendChild(h("section", { class: "bd-card bd-card--flush" }, h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
    h("caption", { class: "visually-hidden", text: "สถานะการเปิดใช้งานแต่ละส่วน" }),
    h("thead", null, h("tr", null, [
      h("th", { scope: "col", text: "ส่วนของเว็บไซต์" }),
      h("th", { scope: "col", class: "bd-num", text: "ทั้งหมด" }),
      h("th", { scope: "col", class: "bd-num", text: "แสดงอยู่" }),
      h("th", { scope: "col", text: "สัดส่วนที่เปิดใช้งาน" })
    ])),
    tbody
  ]))));
})();
