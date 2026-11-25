/* ==========================================================================
   overview.js: หน้าภาพรวมของ Dashboard (ต้นแบบ UI)
   จัดรูปแบบตามภาพอ้างอิง: การ์ดสรุปซ้าย 2x2, กราฟพื้นที่ขวา, ตารางล่าสุดแบบแท็บ
   ตัวเลขทุกตัวคำนวณจากข้อมูลตัวอย่าง (data.js, data-calendar.js, stats-data.js) ไม่ใช่ข้อมูลจริง
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("bd-main");
  if (!root || !window.GUBD || !window.GUBD.ui) { return; }

  var ui = window.GUBD.ui;
  var h = ui.h;
  var I = window.GUBD.i18n;
  var t = ui.t;
  var charts = window.GUBD.charts;
  var PALETTE = ["var(--bd-chart-1)", "var(--bd-chart-2)", "var(--bd-chart-3)", "var(--bd-chart-4)", "var(--bd-chart-5)", "var(--bd-ok)"];
  var tab = "news";

  function list(name) { return window.GUBD.getData(name) || []; }
  function shown(rows) { return rows.filter(function (r) { return r.visible !== false; }); }
  function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }
  function pickTitle(r) { return I.lang() === "en" && r.titleEn ? r.titleEn : r.titleTh; }
  function pill(text, cls) { return h("span", { class: "bd-pill " + (cls || "bd-pill--tag"), text: text }); }

  function panel(title, sub, body, extra, cls) {
    return h("section", { class: "bd-card " + (cls || "") }, [
      h("header", { class: "bd-card__head" }, [
        h("div", null, [h("h2", { class: "bd-card__title", text: title }), sub ? h("p", { class: "bd-card__sub", text: sub }) : null]),
        extra || null
      ]),
      body
    ]);
  }

  function render() {
    ui.clear(root);
    var today = ui.todayISO();
    var news = list("news"), popups = list("popups"), docs = list("documents"), cal = list("calendar");
    var docsOn = shown(docs), newsOn = shown(news);
    var upcoming = cal.filter(function (r) { return (r.dateEnd || r.date) >= today; })
      .sort(function (a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; });

    root.appendChild(h("div", { class: "bd-pagehead" }, [
      h("div", null, [
        h("h1", { class: "bd-pagehead__title", text: t("ภาพรวม", "Overview") }),
        h("p", { class: "bd-pagehead__desc", text: t("วันนี้ " + ui.fmtDate(today) + " · ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่าง", "Today is " + ui.fmtDate(today) + " · all data is sample data") })
      ]),
      h("div", { class: "bd-pagehead__actions" }, [
        h("a", { class: "bd-btn bd-btn--primary", href: "news.html?new=1" }, [ui.icon("plus"), t("เพิ่มข่าว", "Add news")]),
        h("a", { class: "bd-btn bd-btn--ghost", href: "calendar.html?new=1" }, [ui.icon("calendar"), t("เพิ่มกิจกรรม", "Add activity")])
      ])
    ]));

    /* ---------- การ์ดสรุป 4 ใบ ---------- */
    var counts = {};
    docsOn.forEach(function (d) { counts[d.category] = (counts[d.category] || 0) + 1; });
    var parts = Object.keys(counts).map(function (n, i) { return { label: I.label(n), value: counts[n], color: PALETTE[i % PALETTE.length] }; });
    var donutCard = h("section", { class: "bd-card bd-stat" }, [
      h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(docsOn.length) }), h("span", { text: t("เอกสารที่แสดงอยู่", "documents shown") })]),
      h("div", { class: "bd-donut bd-donut--sm" }, [
        charts.donut(parts, String(docsOn.length), t("เอกสาร", "docs")),
        h("ul", null, parts.map(function (p) { return h("li", { style: "--c: " + p.color }, [h("span", null, [h("i"), p.label]), h("b", { text: ui.num(p.value) })]); }))
      ])
    ]);

    var topDocs = docs.slice().sort(function (a, b) { return (b.views || 0) - (a.views || 0); }).slice(0, 7);
    var maxV = Math.max.apply(null, topDocs.map(function (d) { return d.views || 0; }).concat([1]));
    var totalViews = docs.reduce(function (a, d) { return a + (d.views || 0); }, 0);
    var barsCard = h("section", { class: "bd-card bd-stat" }, [
      h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(totalViews) }), h("span", { text: t("ยอดเข้าชมเอกสาร (จำลอง)", "document views (sample)") })]),
      h("div", { class: "bd-minibars", role: "img", "aria-label": t("ยอดเข้าชม 7 อันดับแรก", "Top 7 documents by views") }, topDocs.map(function (d) {
        return h("span", { style: "height:" + Math.max(8, Math.round((d.views || 0) / maxV * 100)) + "%", title: pickTitle(d) + ": " + ui.num(d.views || 0) });
      }))
    ]);

    var pct = news.length ? Math.round(newsOn.length / news.length * 100) : 0;
    var newsCard = h("section", { class: "bd-card bd-stat" }, [
      h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(newsOn.length) }), h("span", { text: t("ข่าวที่แสดงอยู่", "news shown") })]),
      h("div", { class: "bd-stat__progress" }, [
        h("div", { class: "bd-stat__row" }, [h("span", { text: t("แสดงจากทั้งหมด " + ui.num(news.length), "of " + ui.num(news.length) + " total") }), h("b", { text: pct + "%" })]),
        h("div", { class: "bd-bar", role: "img", "aria-label": pct + "%" }, h("span", { style: "width:" + pct + "%" }))
      ])
    ]);

    var popOn = shown(popups).length;
    var evCard = h("section", { class: "bd-card bd-stat" }, [
      h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(upcoming.length) }), h("span", { text: t("กิจกรรมที่กำลังจะมาถึง", "upcoming activities") })]),
      h("div", { class: "bd-dates" }, upcoming.slice(0, 4).map(function (r) {
        var p = ui.parseISO(r.date);
        return h("span", { class: "bd-dates__item", title: pickTitle(r) }, [h("b", { text: String(p.d) }), h("small", { text: ui.monthShort(p.m - 1) })]);
      }).concat([h("span", { class: "bd-dates__more", text: t("ป๊อปอัปเปิดอยู่ " + popOn + "/3", "Pop-ups on " + popOn + "/3") })]))
    ]);

    var stats = window.GU_STATS && window.GU_STATS.years.length ? window.GU_STATS : null;
    var sum = stats ? stats.summarize(stats.years[0]) : null;
    function monthsOf(key) { return sum.months.map(function (m, i) { return { label: ui.monthShort(i), value: m[key] }; }); }
    var yr = stats ? (I.lang() === "en" ? stats.years[0] - 543 : stats.years[0]) : "";

    root.appendChild(h("div", { class: "bd-ov" }, [
      h("div", { class: "bd-ov__stats" }, [donutCard, barsCard, newsCard, evCard]),
      stats ? panel(t("คำร้อง บศ.1 ที่ยื่น", "GS.1 requests submitted"), t("ปีการศึกษา " + yr + " · ข้อมูลจำลอง", "Academic year " + yr + " · sample data"),
        h("div", { class: "bd-chart-wrap" }, [
          h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(sum.submitted) }), h("span", { text: t("คำร้องทั้งปี", "requests this year") })]),
          charts.area(monthsOf("submitted"), t("กราฟคำร้องที่ยื่นรายเดือน", "Monthly submitted requests"), 1)
        ]), h("a", { class: "bd-btn bd-btn--ghost bd-btn--sm", href: "statistics.html" }, t("ดูสถิติ", "Statistics")), "bd-ov__chart1") : null,
      renderRecent(news, popups, docs, cal),
      stats ? panel(t("ดำเนินการสำเร็จ", "Completed requests"), t("ปีการศึกษา " + yr + " · ข้อมูลจำลอง", "Academic year " + yr + " · sample data"),
        h("div", { class: "bd-chart-wrap" }, [
          h("p", { class: "bd-stat__big" }, [h("b", { text: ui.num(sum.completed) }), h("span", { text: t("สำเร็จ " + sum.rate.toFixed(1) + "%", sum.rate.toFixed(1) + "% completion rate") })]),
          charts.area(monthsOf("completed"), t("กราฟคำร้องที่ดำเนินการสำเร็จรายเดือน", "Monthly completed requests"), 2)
        ]), null, "bd-ov__chart2") : null
    ]));
  }

  function renderRecent(news, popups, docs, cal) {
    var tabs = [
      { id: "news", label: t("ข่าว", "News"), icon: "news", href: "news.html", rows: news.slice().sort(byDateDesc), type: function (r) { return r.chip; } },
      { id: "popups", label: t("ป๊อปอัป", "Pop-ups"), icon: "popups", href: "popups.html", rows: popups.slice().sort(byDateDesc), type: function (r) { return r.type; } },
      { id: "documents", label: t("เอกสาร", "Documents"), icon: "documents", href: "documents.html", rows: docs.slice().sort(byDateDesc), type: function (r) { return r.category; } },
      { id: "calendar", label: t("กิจกรรม", "Activities"), icon: "calendar", href: "calendar.html", rows: cal.slice().sort(function (a, b) { return a.date > b.date ? 1 : -1; }), type: function (r) { return r.label; } }
    ];
    var cur = tabs.filter(function (x) { return x.id === tab; })[0] || tabs[0];
    var tablist = h("div", { class: "bd-tabs", role: "tablist", "aria-label": t("ประเภทรายการล่าสุด", "Recent item type") }, tabs.map(function (x) {
      var b = h("button", { type: "button", role: "tab", class: "bd-tab", "aria-selected": x.id === cur.id ? "true" : "false" }, [ui.icon(x.icon), x.label]);
      b.addEventListener("click", function () { tab = x.id; render(); var again = root.querySelector('[role="tab"][aria-selected="true"]'); if (again) { again.focus(); } });
      return b;
    }));
    var body = h("tbody", null, cur.rows.slice(0, 5).map(function (r) {
      var vis = r.visible !== false;
      return h("tr", null, [
        h("td", { class: "bd-td-main" }, h("div", { class: "bd-cell-main" }, h("span", { class: "bd-cell-text" }, h("span", { class: "bd-cell-title", text: pickTitle(r) })))),
        h("td", { "data-label": t("ประเภท", "Type") }, pill(I.label(cur.type(r)))),
        h("td", { "data-label": t("วันที่", "Date") }, ui.fmtDate(r.date)),
        h("td", { "data-label": t("สถานะ", "Status") }, pill(vis ? t("แสดงอยู่", "Visible") : t("ซ่อนอยู่", "Hidden"), vis ? "bd-pill--ok" : "bd-pill--muted"))
      ]);
    }));
    return h("section", { class: "bd-card bd-card--flush bd-ov__recent" }, [
      h("header", { class: "bd-card__head bd-card__head--pad" }, [
        h("h2", { class: "bd-card__title", text: t("รายการล่าสุด", "Recent items") }),
        h("a", { class: "bd-btn bd-btn--ghost bd-btn--sm", href: cur.href }, [t("จัดการ", "Manage"), ui.icon("arrowRight")])
      ]),
      h("div", { class: "bd-recent__tabs" }, tablist),
      h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
        h("caption", { class: "visually-hidden", text: t("รายการล่าสุด", "Recent items") }),
        h("thead", null, h("tr", null, [t("รายการ", "Item"), t("ประเภท", "Type"), t("วันที่", "Date"), t("สถานะ", "Status")].map(function (x) { return h("th", { scope: "col", text: x }); }))),
        body
      ]))
    ]);
  }

  render();
  I.register("page", render);
})();
