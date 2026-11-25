/* ==========================================================================
   crud.js: หน้าจัดการข้อมูลแบบ เพิ่ม/แก้ไข/ซ่อน/ลบ (ต้นแบบ UI)
   - ข้อมูลอยู่ในหน่วยความจำของหน้า รีเฟรชแล้วรีเซ็ต ไม่ใช้ localStorage หรือฐานข้อมูล
   - ค้นหา กรอง แบ่งหน้า ฟอร์มใน Dialog ตรวจความถูกต้อง และยืนยันก่อนลบ
   - ?state=loading | empty | error ใช้ดูหน้าตาสถานะต่าง ๆ  |  ?new=1 เปิดฟอร์มเพิ่มทันที
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;

  function mount(cfg) {
    var root = document.getElementById("bd-main");
    if (!root) { return; }

    var params = new URLSearchParams(window.location.search);
    var forced = params.get("state");
    var rows = forced === "empty" ? [] : window.GUBD.getData(cfg.key);
    var seq = rows.length + 1;
    var log = [];
    var view = { q: "", filters: {}, status: "", page: 1 };
    var pageSize = cfg.pageSize || 8;
    var loading = true;

    var addBtn = h("button", { type: "button", class: "bd-btn bd-btn--primary" }, [ui.icon("plus"), "เพิ่ม" + cfg.singular]);
    addBtn.addEventListener("click", function () { openForm(null, addBtn); });

    root.appendChild(h("div", { class: "bd-pagehead" }, [
      h("div", null, [h("h1", { class: "bd-pagehead__title", text: cfg.title }), h("p", { class: "bd-pagehead__desc", text: cfg.desc })]),
      h("div", { class: "bd-pagehead__actions" }, addBtn)
    ]));

    /* ---------- แถบเครื่องมือ ---------- */
    var searchInput = h("input", { type: "search", class: "bd-input", placeholder: cfg.searchPlaceholder || "ค้นหา...", "aria-label": "ค้นหา" + cfg.singular, autocomplete: "off" });
    var toolbar = h("div", { class: "bd-toolbar", role: "search" }, [h("div", { class: "bd-search" }, [ui.icon("search"), searchInput])]);
    var filterEls = {};
    (cfg.filters || []).forEach(function (f) {
      var sel = h("select", { class: "bd-select", "aria-label": f.label }, [h("option", { value: "", text: f.all })].concat(f.options().map(function (o) { return h("option", { value: o, text: o }); })));
      sel.addEventListener("change", function () { view.filters[f.key] = sel.value; view.page = 1; render(); });
      filterEls[f.key] = sel;
      toolbar.appendChild(sel);
    });
    var statusSel = null;
    if (cfg.hideable) {
      statusSel = h("select", { class: "bd-select", "aria-label": "สถานะการแสดงผล" }, [
        h("option", { value: "", text: "ทุกสถานะ" }), h("option", { value: "show", text: "แสดงอยู่" }), h("option", { value: "hide", text: "ซ่อนอยู่" })
      ]);
      statusSel.addEventListener("change", function () { view.status = statusSel.value; view.page = 1; render(); });
      toolbar.appendChild(statusSel);
    }
    var countEl = h("p", { class: "bd-toolbar__count", "aria-live": "polite" });
    toolbar.appendChild(countEl);
    searchInput.addEventListener("input", function () { view.q = searchInput.value.trim().toLowerCase(); view.page = 1; render(); });

    var body = h("div");
    var card = h("section", { class: "bd-card bd-card--flush", "aria-label": "รายการ" + cfg.singular }, [toolbar, body]);
    root.appendChild(card);

    /* ---------- ประวัติการเปลี่ยนแปลง (ชั่วคราว) ---------- */
    var logList = h("ul", { class: "bd-log" });
    root.appendChild(h("details", { class: "bd-details" }, [
      h("summary", null, [ui.icon("history"), "ประวัติการเปลี่ยนแปลงในรอบนี้ (ล้างเมื่อรีเฟรช)"]),
      h("div", { class: "bd-details__body" }, logList)
    ]));
    function renderLog() {
      ui.clear(logList);
      if (!log.length) { logList.appendChild(h("li", { class: "bd-muted", text: "ยังไม่มีการเปลี่ยนแปลงในรอบนี้" })); return; }
      log.slice().reverse().forEach(function (e) { logList.appendChild(h("li", null, [h("time", { text: e.time }), h("span", { text: e.text })])); });
    }
    function addLog(text) { log.push({ time: ui.fmtTime(new Date()), text: text }); renderLog(); }
    renderLog();

    /* ---------- กรอง/ค้นหา ---------- */
    function visibleRows() {
      var list = rows.filter(function (r) {
        if (view.q) {
          var hay = (cfg.searchKeys || []).map(function (k) { return String(r[k] || ""); }).join(" ").toLowerCase();
          if (hay.indexOf(view.q) === -1) { return false; }
        }
        for (var k in view.filters) {
          if (view.filters[k] && r[k] !== view.filters[k]) { return false; }
        }
        if (view.status === "show" && r.visible === false) { return false; }
        if (view.status === "hide" && r.visible !== false) { return false; }
        return true;
      });
      if (cfg.sort) { list.sort(cfg.sort); }
      return list;
    }

    function titleOf(r) { return cfg.titleOf ? cfg.titleOf(r) : (r.titleTh || r.nameTh || r.id); }

    function resetFilters() {
      view = { q: "", filters: {}, status: "", page: 1 };
      searchInput.value = "";
      Object.keys(filterEls).forEach(function (k) { filterEls[k].value = ""; });
      if (statusSel) { statusSel.value = ""; }
      render();
    }

    /* ---------- ตาราง ---------- */
    function render() {
      ui.clear(body);
      if (forced === "loading" || loading) {
        countEl.textContent = "";
        body.appendChild(ui.skeleton(5));
        return;
      }
      if (forced === "error") {
        countEl.textContent = "";
        body.appendChild(ui.state("error", "โหลดข้อมูลไม่สำเร็จ", "ไม่สามารถดึงรายการ" + cfg.singular + "ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
          h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: function () { window.location.href = window.location.pathname; } }, "ลองใหม่")));
        return;
      }

      var list = visibleRows();
      var pages = Math.max(1, Math.ceil(list.length / pageSize));
      if (view.page > pages) { view.page = pages; }
      var slice = list.slice((view.page - 1) * pageSize, view.page * pageSize);
      countEl.textContent = "แสดง " + list.length + " จาก " + rows.length + " รายการ";

      if (!rows.length) {
        body.appendChild(ui.state("empty", "ยังไม่มี" + cfg.singular, "เริ่มต้นโดยกดปุ่ม \"เพิ่ม" + cfg.singular + "\" ด้านบน",
          h("button", { type: "button", class: "bd-btn bd-btn--primary", onclick: function () { openForm(null, null); } }, [ui.icon("plus"), "เพิ่ม" + cfg.singular])));
        return;
      }
      if (!list.length) {
        body.appendChild(ui.state("empty", "ไม่พบรายการที่ตรงกัน", "ลองเปลี่ยนคำค้นหรือล้างตัวกรอง",
          h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: resetFilters }, "ล้างการค้นหาและตัวกรอง")));
        return;
      }

      var thead = h("tr", null, cfg.columns.map(function (c) { return h("th", { scope: "col", text: c.label }); }));
      if (cfg.hideable) { thead.appendChild(h("th", { scope: "col", text: "สถานะ" })); }
      thead.appendChild(h("th", { scope: "col", class: "bd-col-actions", text: "จัดการ" }));

      var tbody = h("tbody");
      slice.forEach(function (r) {
        var tr = h("tr", { class: r.visible === false ? "is-hidden" : "" });
        cfg.columns.forEach(function (c, i) {
          var cell = c.render(r);
          tr.appendChild(i === 0
            ? h("td", { class: "bd-td-main" }, h("div", { class: "bd-cell-main" }, cell))
            : h("td", { "data-label": c.label, class: c.num ? "bd-num" : "" }, cell));
        });
        if (cfg.hideable) {
          tr.appendChild(h("td", { "data-label": "สถานะ" }, h("span", { class: "bd-pill " + (r.visible === false ? "bd-pill--muted" : "bd-pill--ok"), text: r.visible === false ? "ซ่อนอยู่" : "แสดงอยู่" })));
        }
        var editBtn = h("button", { type: "button", class: "bd-act", title: "แก้ไข", "aria-label": "แก้ไข " + titleOf(r) }, ui.icon("edit"));
        editBtn.addEventListener("click", function () { openForm(r, editBtn); });
        var acts = [editBtn];
        if (cfg.hideable) {
          var hidden = r.visible === false;
          var tg = h("button", { type: "button", class: "bd-act", title: hidden ? "แสดง" : "ซ่อน", "aria-label": (hidden ? "แสดง " : "ซ่อน ") + titleOf(r) }, ui.icon(hidden ? "eye" : "eyeOff"));
          tg.addEventListener("click", function () {
            r.visible = hidden;
            addLog((hidden ? "แสดง" : "ซ่อน") + cfg.singular + ": " + titleOf(r));
            ui.toast((hidden ? "แสดง" : "ซ่อน") + cfg.singular + "แล้ว");
            render();
          });
          acts.push(tg);
        }
        var delBtn = h("button", { type: "button", class: "bd-act bd-act--danger", title: "ลบ", "aria-label": "ลบ " + titleOf(r) }, ui.icon("trash"));
        delBtn.addEventListener("click", function () { askDelete(r, delBtn); });
        acts.push(delBtn);
        tr.appendChild(h("td", { class: "bd-col-actions" }, acts));
        tbody.appendChild(tr);
      });

      body.appendChild(h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
        h("caption", { class: "visually-hidden", text: "รายการ" + cfg.singular }), h("thead", null, thead), tbody
      ])));
      if (pages > 1) { body.appendChild(pager(list.length, pages)); }
    }

    function pager(total, pages) {
      var nav = h("div", { class: "bd-pager__nav" });
      function btn(label, page, disabled, iconName, current) {
        var b = h("button", { type: "button", class: "bd-pager__btn", "aria-label": label, disabled: disabled, "aria-current": current ? "page" : null }, iconName ? ui.icon(iconName) : String(page));
        b.addEventListener("click", function () { view.page = page; render(); card.scrollIntoView({ block: "nearest" }); });
        return b;
      }
      nav.appendChild(btn("หน้าก่อนหน้า", view.page - 1, view.page === 1, "chevronLeft"));
      for (var p = 1; p <= pages; p++) { nav.appendChild(btn("หน้า " + p, p, false, null, p === view.page)); }
      nav.appendChild(btn("หน้าถัดไป", view.page + 1, view.page === pages, "chevronRight"));
      var from = (view.page - 1) * pageSize + 1;
      return h("div", { class: "bd-pager" }, [h("span", { text: "รายการที่ " + from + "–" + Math.min(total, view.page * pageSize) + " จาก " + total }), nav]);
    }

    /* ---------- ลบ (ต้องยืนยันก่อนเสมอ) ---------- */
    function askDelete(r, opener) {
      ui.confirm({
        title: "ยืนยันการลบ" + cfg.singular, danger: true, confirmText: "ลบ" + cfg.singular, returnFocus: opener,
        heading: "ลบ \"" + titleOf(r) + "\" ?",
        message: (cfg.hideable ? "หากต้องการเก็บไว้ดูย้อนหลัง แนะนำให้ใช้ปุ่ม \"ซ่อน\" แทนการลบ " : "") + "ในต้นแบบนี้ข้อมูลจะกลับมาเมื่อรีเฟรชหน้า",
        onConfirm: function () {
          rows = rows.filter(function (x) { return x !== r; });
          addLog("ลบ" + cfg.singular + ": " + titleOf(r));
          ui.toast("ลบ" + cfg.singular + "แล้ว");
          render();
        }
      });
    }

    /* ---------- ฟอร์มเพิ่ม/แก้ไข ---------- */
    function openForm(row, opener) {
      var isEdit = !!row;
      var data = row ? row : (cfg.defaults ? cfg.defaults() : {});
      var inputs = {};
      var errors = {};
      var grid = h("div", { class: "bd-form" });

      cfg.fields.forEach(function (f) {
        if (f.section) { grid.appendChild(h("p", { class: "bd-form__section", text: f.section })); }
        var id = "bd-f-" + f.name;
        var val = data[f.name];
        var el;
        if (f.type === "textarea") { el = h("textarea", { class: "bd-textarea", id: id, rows: "3" }); el.value = val || ""; }
        else if (f.type === "select") {
          el = h("select", { class: "bd-select", id: id }, [h("option", { value: "", text: "-- เลือก --" })].concat(f.options().map(function (o) { return h("option", { value: o, text: o }); })));
          el.value = val || "";
        }
        else if (f.type === "checkbox") { el = h("input", { type: "checkbox", id: id }); el.checked = !!val; }
        else {
          el = h("input", { class: "bd-input", id: id, type: f.type === "date" ? "date" : (f.type === "number" ? "number" : "text"), placeholder: f.placeholder || null, autocomplete: "off" });
          el.value = val === undefined || val === null ? "" : val;
        }
        inputs[f.name] = el;

        var err = h("p", { class: "bd-field__error", id: id + "-err", hidden: true });
        errors[f.name] = err;
        var describedBy = (f.hint ? [id + "-hint"] : []).concat([id + "-err"]);
        el.setAttribute("aria-describedby", describedBy.join(" "));
        if (f.required) { el.setAttribute("aria-required", "true"); }

        var hint = f.hint ? h("p", { class: "bd-field__hint", id: id + "-hint", text: f.hint }) : null;
        var wrap;
        if (f.type === "checkbox") {
          wrap = h("div", { class: "bd-field" + (f.full ? " bd-field--full" : "") }, [h("label", { class: "bd-check", for: id }, [el, f.label]), hint, err]);
        } else {
          wrap = h("div", { class: "bd-field" + (f.full ? " bd-field--full" : "") }, [
            h("label", { class: "bd-field__label", for: id }, [f.label, f.required ? h("span", { class: "bd-field__req", "aria-hidden": "true", text: "*" }) : null]),
            el, hint, err
          ]);
        }
        grid.appendChild(wrap);
      });

      var cancel = h("button", { type: "button", class: "bd-btn bd-btn--ghost", text: "ยกเลิก" });
      var save = h("button", { type: "submit", class: "bd-btn bd-btn--primary", text: isEdit ? "บันทึกการแก้ไข" : "เพิ่ม" + cfg.singular });
      var d = ui.dialog({ title: (isEdit ? "แก้ไข" : "เพิ่ม") + cfg.singular, form: true, body: grid, footer: [cancel, save], returnFocus: opener });
      cancel.addEventListener("click", function () { d.close(); });

      function setError(name, msg) {
        errors[name].hidden = !msg;
        errors[name].textContent = msg || "";
        if (msg) { inputs[name].setAttribute("aria-invalid", "true"); }
        else { inputs[name].removeAttribute("aria-invalid"); }
        return !msg;
      }

      function validate() {
        var values = {};
        cfg.fields.forEach(function (f) {
          var el = inputs[f.name];
          values[f.name] = f.type === "checkbox" ? el.checked : el.value.trim();
        });
        var firstBad = null;
        cfg.fields.forEach(function (f) {
          var v = values[f.name];
          var msg = "";
          if (f.required && (v === "" || v === false)) { msg = "กรุณากรอก" + f.label; }
          else if (f.type === "url" && v && !ui.isHttpUrl(v)) { msg = "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://"; }
          if (!setError(f.name, msg) && !firstBad) { firstBad = inputs[f.name]; }
        });
        if (cfg.check) {
          var extra = cfg.check(values) || {};
          Object.keys(extra).forEach(function (name) {
            setError(name, extra[name]);
            if (!firstBad) { firstBad = inputs[name]; }
          });
          if (Object.keys(extra).length) { firstBad = firstBad || null; }
          if (Object.keys(extra).length) { if (firstBad) { firstBad.focus(); } return false; }
        }
        if (firstBad) { firstBad.focus(); return false; }
        return true;
      }

      d.form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validate()) { return; }
        var out = {};
        cfg.fields.forEach(function (f) {
          var el = inputs[f.name];
          out[f.name] = f.type === "checkbox" ? el.checked : (f.type === "number" ? Number(el.value) : el.value.trim());
        });
        if (isEdit) {
          Object.keys(out).forEach(function (k) { row[k] = out[k]; });
          addLog("แก้ไข" + cfg.singular + ": " + titleOf(row));
          ui.toast("บันทึกการแก้ไขแล้ว");
        } else {
          out.id = cfg.key + "-new-" + (seq++);
          if (cfg.hideable && out.visible === undefined) { out.visible = true; }
          rows.push(out);
          addLog("เพิ่ม" + cfg.singular + ": " + titleOf(out));
          ui.toast("เพิ่ม" + cfg.singular + "แล้ว");
          view.page = 1;
        }
        d.close();
        render();
      });

      var firstInput = d.el.querySelector("input:not([type=checkbox]), select, textarea");
      if (firstInput) { firstInput.focus(); }
    }

    /* ---------- เริ่มทำงาน ---------- */
    render();
    if (forced !== "loading") {
      window.setTimeout(function () {
        loading = false;
        render();
        if (params.get("new") === "1" && forced !== "error") { openForm(null, addBtn); }
      }, 350);
    }
  }

  window.GUBD.crud = { mount: mount };
})();
