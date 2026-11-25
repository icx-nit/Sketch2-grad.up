/* ==========================================================================
   crud.js: หน้าจัดการข้อมูลแบบ เพิ่ม/แก้ไข/ซ่อน/ลบ (ต้นแบบ UI)
   - ข้อมูลอยู่ในหน่วยความจำ (GUBD.store) รีเฟรชแล้วรีเซ็ต ไม่ใช้ localStorage หรือฐานข้อมูล
   - สลับภาษาแล้วหน้าวาดใหม่ แต่ยังคงข้อมูลและการค้นหาที่ทำค้างไว้
   - ค้นหา กรอง แบ่งหน้า ฟอร์มใน Dialog ตรวจความถูกต้อง และยืนยันก่อนลบ
   - ?state=loading | empty | error ใช้ดูหน้าตาสถานะต่าง ๆ  |  ?new=1 เปิดฟอร์มเพิ่มทันที
   cfg.noun = {th, en} ชื่อของรายการ  |  ข้อความทุกตัวเป็น {th, en} หรือสตริงธรรมดา
   ========================================================================== */
(function () {
  "use strict";

  var ui = window.GUBD.ui;
  var h = ui.h;
  var I = window.GUBD.i18n;
  var STORE = window.GUBD.store = window.GUBD.store || {};

  /* ข้อความที่อาจเป็น {th, en} หรือสตริงธรรมดา */
  function tx(v) {
    if (v === undefined || v === null) { return ""; }
    return typeof v === "string" ? v : I.pick(v.th, v.en);
  }

  function pair(th, en) { return { th: th, en: en }; }

  function mount(cfg) {
    var root = document.getElementById("bd-main");
    if (!root) { return; }
    ui.clear(root);

    var params = new URLSearchParams(window.location.search);
    var forced = params.get("state");
    var noun = cfg.noun;
    var nounTh = noun.th, nounEn = noun.en;
    var pageSize = cfg.pageSize || 8;

    var st = STORE[cfg.key];
    if (!st) {
      st = STORE[cfg.key] = {
        rows: forced === "empty" ? [] : window.GUBD.getData(cfg.key),
        log: [], seq: 0, loaded: false, opened: false,
        view: { q: "", raw: "", filters: {}, status: "", page: 1 }
      };
      st.seq = st.rows.length + 1;
    }
    var view = st.view;
    if (params.get("q") && !st.qApplied) { st.qApplied = true; view.raw = params.get("q"); view.q = view.raw.trim().toLowerCase(); }
    var addBtn = h("button", { type: "button", class: "bd-btn bd-btn--primary" }, [ui.icon("plus"), I.pick("เพิ่ม" + nounTh, "Add " + nounEn)]);
    addBtn.addEventListener("click", function () { openForm(null, addBtn); });

    root.appendChild(h("div", { class: "bd-pagehead" }, [
      h("div", null, [h("h1", { class: "bd-pagehead__title", text: tx(cfg.title) }), h("p", { class: "bd-pagehead__desc", text: tx(cfg.desc) })]),
      h("div", { class: "bd-pagehead__actions" }, cfg.noAdd ? null : addBtn)
    ]));
    if (cfg.note) { root.appendChild(h("p", { class: "bd-note", role: "note" }, [ui.icon("alert"), h("span", { text: tx(cfg.note) })])); }

    /* ---------- แถบเครื่องมือ ---------- */
    var searchInput = h("input", { type: "search", class: "bd-input", placeholder: tx(cfg.searchPlaceholder), "aria-label": tx(cfg.searchLabel), autocomplete: "off" });
    searchInput.value = view.raw;
    var toolbar = h("div", { class: "bd-toolbar", role: "search" }, [h("div", { class: "bd-search" }, [ui.icon("search"), searchInput])]);
    var filterEls = {};
    (cfg.filters || []).forEach(function (f) {
      var sel = h("select", { class: "bd-select", "aria-label": tx(f.label) }, [h("option", { value: "", text: tx(f.all) })].concat(f.options().map(function (o) {
        return h("option", { value: o, text: I.label(o) });
      })));
      sel.value = view.filters[f.key] || "";
      sel.addEventListener("change", function () { view.filters[f.key] = sel.value; view.page = 1; render(); });
      filterEls[f.key] = sel;
      toolbar.appendChild(sel);
    });
    var statusSel = null;
    if (cfg.hideable) {
      statusSel = h("select", { class: "bd-select", "aria-label": I.pick("สถานะการแสดงผล", "Display status") }, [
        h("option", { value: "", text: I.pick("ทุกสถานะ", "All statuses") }),
        h("option", { value: "show", text: I.pick("แสดงอยู่", "Visible") }),
        h("option", { value: "hide", text: I.pick("ซ่อนอยู่", "Hidden") })
      ]);
      statusSel.value = view.status;
      statusSel.addEventListener("change", function () { view.status = statusSel.value; view.page = 1; render(); });
      toolbar.appendChild(statusSel);
    }
    var countEl = h("p", { class: "bd-toolbar__count", "aria-live": "polite" });
    toolbar.appendChild(countEl);
    searchInput.addEventListener("input", function () { view.raw = searchInput.value; view.q = searchInput.value.trim().toLowerCase(); view.page = 1; render(); });

    var body = h("div");
    var card = h("section", { class: "bd-card bd-card--flush", "aria-label": I.pick("รายการ" + nounTh, nounEn + " list") }, [toolbar, body]);
    root.appendChild(card);

    /* ---------- ประวัติการเปลี่ยนแปลง ---------- */
    var logList = h("ul", { class: "bd-log" });
    root.appendChild(h("details", { class: "bd-details" }, [
      h("summary", null, [ui.icon("history"), I.pick("ประวัติการเปลี่ยนแปลงในรอบนี้ (ล้างเมื่อรีเฟรช)", "Change history this session (cleared on refresh)")]),
      h("div", { class: "bd-details__body" }, logList)
    ]));
    function renderLog() {
      ui.clear(logList);
      if (!st.log.length) { logList.appendChild(h("li", { class: "bd-muted", text: I.pick("ยังไม่มีการเปลี่ยนแปลงในรอบนี้", "No changes yet this session") })); return; }
      st.log.slice().reverse().forEach(function (e) { logList.appendChild(h("li", null, [h("time", { text: e.time }), h("span", { text: tx(e.text) })])); });
    }
    function addLog(th, en) { st.log.push({ time: ui.fmtTime(new Date()), text: { th: th, en: en } }); renderLog(); }
    renderLog();

    /* ---------- กรอง/ค้นหา ---------- */
    function titleOf(r) { return cfg.titleOf ? cfg.titleOf(r) : (r.titleTh || r.nameTh || r.id); }

    function visibleRows() {
      var list = st.rows.filter(function (r) {
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

    function resetFilters() {
      view.q = ""; view.raw = ""; view.filters = {}; view.status = ""; view.page = 1;
      searchInput.value = "";
      Object.keys(filterEls).forEach(function (k) { filterEls[k].value = ""; });
      if (statusSel) { statusSel.value = ""; }
      render();
    }

    /* ---------- ตาราง ---------- */
    function render() {
      ui.clear(body);
      var pending = forced === "loading" || (!st.loaded && forced !== "error");
      if (pending) {
        countEl.textContent = "";
        body.appendChild(ui.skeleton(5));
        return;
      }
      if (forced === "error") {
        countEl.textContent = "";
        body.appendChild(ui.state("error", I.pick("โหลดข้อมูลไม่สำเร็จ", "Could not load data"),
          I.pick("ไม่สามารถดึงรายการได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง", "Could not fetch the items right now. Please try again."),
          h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: function () { window.location.href = window.location.pathname; } }, I.pick("ลองใหม่", "Try again"))));
        return;
      }

      var list = visibleRows();
      var pages = Math.max(1, Math.ceil(list.length / pageSize));
      if (view.page > pages) { view.page = pages; }
      var slice = list.slice((view.page - 1) * pageSize, view.page * pageSize);
      countEl.textContent = I.pick("แสดง " + list.length + " จาก " + st.rows.length + " รายการ", "Showing " + list.length + " of " + st.rows.length + " items");

      if (!st.rows.length) {
        body.appendChild(ui.state("empty", I.pick("ยังไม่มี" + nounTh, "No " + nounEn + " yet"),
          I.pick("เริ่มต้นโดยกดปุ่ม \"เพิ่ม" + nounTh + "\" ด้านบน", "Start by clicking \"Add " + nounEn + "\" above"),
          h("button", { type: "button", class: "bd-btn bd-btn--primary", onclick: function () { openForm(null, null); } }, [ui.icon("plus"), I.pick("เพิ่ม" + nounTh, "Add " + nounEn)])));
        return;
      }
      if (!list.length) {
        body.appendChild(ui.state("empty", I.pick("ไม่พบรายการที่ตรงกัน", "No matching items"),
          I.pick("ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง", "Try a different search or clear the filters"),
          h("button", { type: "button", class: "bd-btn bd-btn--ghost", onclick: resetFilters }, I.pick("ล้างการค้นหาและตัวกรอง", "Clear search and filters"))));
        return;
      }

      var thead = h("tr", null, cfg.columns.map(function (c) { return h("th", { scope: "col", text: tx(c.label) }); }));
      if (cfg.hideable) { thead.appendChild(h("th", { scope: "col", text: I.pick("สถานะ", "Status") })); }
      thead.appendChild(h("th", { scope: "col", class: "bd-col-actions", text: I.pick("จัดการ", "Actions") }));

      var tbody = h("tbody");
      slice.forEach(function (r) {
        var tr = h("tr", { class: r.visible === false ? "is-hidden" : "" });
        cfg.columns.forEach(function (c, i) {
          var cell = c.render(r);
          tr.appendChild(i === 0
            ? h("td", { class: "bd-td-main" }, h("div", { class: "bd-cell-main" }, cell))
            : h("td", { "data-label": tx(c.label), class: c.num ? "bd-num" : "" }, cell));
        });
        if (cfg.hideable) {
          var vis = r.visible !== false;
          tr.appendChild(h("td", { "data-label": I.pick("สถานะ", "Status") }, h("span", { class: "bd-pill " + (vis ? "bd-pill--ok" : "bd-pill--muted"), text: vis ? tx(cfg.statusOn || pair("แสดงอยู่", "Visible")) : tx(cfg.statusOff || pair("ซ่อนอยู่", "Hidden")) })));
        }
        var name = titleOf(r);
        var editBtn = h("button", { type: "button", class: "bd-act", title: I.pick("แก้ไข", "Edit"), "aria-label": I.pick("แก้ไข ", "Edit ") + name }, ui.icon("edit"));
        editBtn.addEventListener("click", function () { openForm(r, editBtn); });
        var acts = [editBtn];
        if (cfg.hideable) {
          var hidden = r.visible === false;
          var tg = h("button", { type: "button", class: "bd-act", title: hidden ? I.pick("แสดง", "Show") : I.pick("ซ่อน", "Hide"), "aria-label": (hidden ? I.pick("แสดง ", "Show ") : I.pick("ซ่อน ", "Hide ")) + name }, ui.icon(hidden ? "eye" : "eyeOff"));
          tg.addEventListener("click", function () {
            if (hidden && cfg.canShow) {
              var block = cfg.canShow(st.rows, r);
              if (block) { ui.toast(tx(block)); return; }
            }
            r.visible = hidden;
            r.hiddenAt = hidden ? "" : ui.todayISO();
            addLog((hidden ? "แสดง" : "ซ่อน") + nounTh + ": " + name, (hidden ? "Showed " : "Hid ") + nounEn + ": " + name);
            ui.toast(I.pick((hidden ? "แสดง" : "ซ่อน") + nounTh + "แล้ว", nounEn + (hidden ? " shown" : " hidden")));
            render();
          });
          acts.push(tg);
        }
        var delBtn = h("button", { type: "button", class: "bd-act bd-act--danger", title: I.pick("ลบ", "Delete"), "aria-label": I.pick("ลบ ", "Delete ") + name }, ui.icon("trash"));
        delBtn.addEventListener("click", function () { askDelete(r, delBtn); });
        if (!cfg.noDelete) { acts.push(delBtn); }
        tr.appendChild(h("td", { class: "bd-col-actions" }, acts));
        tbody.appendChild(tr);
      });

      body.appendChild(h("div", { class: "bd-table-wrap" }, h("table", { class: "bd-table" }, [
        h("caption", { class: "visually-hidden", text: I.pick("รายการ" + nounTh, nounEn + " list") }), h("thead", null, thead), tbody
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
      nav.appendChild(btn(I.pick("หน้าก่อนหน้า", "Previous page"), view.page - 1, view.page === 1, "chevronLeft"));
      for (var p = 1; p <= pages; p++) { nav.appendChild(btn(I.pick("หน้า " + p, "Page " + p), p, false, null, p === view.page)); }
      nav.appendChild(btn(I.pick("หน้าถัดไป", "Next page"), view.page + 1, view.page === pages, "chevronRight"));
      var from = (view.page - 1) * pageSize + 1;
      var to = Math.min(total, view.page * pageSize);
      return h("div", { class: "bd-pager" }, [h("span", { text: I.pick("รายการที่ " + from + "–" + to + " จาก " + total, "Items " + from + "–" + to + " of " + total) }), nav]);
    }

    /* ---------- ลบ (ต้องยืนยันก่อนเสมอ) ---------- */
    function askDelete(r, opener) {
      var name = titleOf(r);
      ui.confirm({
        title: I.pick("ยืนยันการลบ" + nounTh, "Confirm delete"), danger: true,
        confirmText: I.pick("ลบ" + nounTh, "Delete"), returnFocus: opener,
        heading: I.pick("ลบ \"" + name + "\" ?", "Delete \"" + name + "\"?"),
        message: (cfg.hideable ? I.pick("หากต้องการเก็บไว้ดูย้อนหลัง แนะนำให้ใช้ปุ่ม \"ซ่อน\" แทนการลบ ", "To keep it for later, use Hide instead of Delete. ") : "")
          + I.pick("ในต้นแบบนี้ข้อมูลจะกลับมาเมื่อรีเฟรชหน้า", "In this prototype the data returns on refresh."),
        onConfirm: function () {
          st.rows = st.rows.filter(function (x) { return x !== r; });
          addLog("ลบ" + nounTh + ": " + name, "Deleted " + nounEn + ": " + name);
          ui.toast(I.pick("ลบ" + nounTh + "แล้ว", nounEn + " deleted"));
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
        if (f.section) { grid.appendChild(h("p", { class: "bd-form__section", text: tx(f.section) })); }
        var id = "bd-f-" + f.name;
        var val = data[f.name];
        var el;
        if (f.type === "textarea") { el = h("textarea", { class: "bd-textarea", id: id, rows: "3" }); el.value = val || ""; }
        else if (f.type === "select") {
          el = h("select", { class: "bd-select", id: id }, [h("option", { value: "", text: I.pick("-- เลือก --", "-- Select --") })].concat(f.options().map(function (o) { return h("option", { value: o, text: I.label(o) }); })));
          el.value = val || "";
        }
        else if (f.type === "checkbox") { el = h("input", { type: "checkbox", id: id }); el.checked = !!val; }
        else if (f.type === "file") {
          el = h("input", { class: "bd-input", id: id, type: "file", accept: f.accept || null });
          el._name = val || "";
          el.addEventListener("change", function () { el._name = el.files && el.files[0] ? el.files[0].name : el._name; });
        }
        else {
          el = h("input", { class: "bd-input", id: id, type: f.type === "date" ? "date" : (f.type === "number" ? "number" : "text"), placeholder: tx(f.placeholder) || null, autocomplete: "off" });
          el.value = val === undefined || val === null ? "" : val;
        }
        inputs[f.name] = el;
        if (f.readonly) { el.readOnly = true; el.setAttribute("aria-readonly", "true"); if (el.tagName === "SELECT") { el.disabled = true; } }

        var err = h("p", { class: "bd-field__error", id: id + "-err", hidden: true });
        errors[f.name] = err;
        var describedBy = (f.hint || f.type === "file" ? [id + "-hint"] : []).concat([id + "-err"]);
        el.setAttribute("aria-describedby", describedBy.join(" "));
        if (f.required) { el.setAttribute("aria-required", "true"); }

        var hintText = tx(f.hint);
        if (f.type === "file" && val) { hintText = (hintText ? hintText + " · " : "") + I.pick("ไฟล์ปัจจุบัน: ", "Current file: ") + val; }
        var hint = hintText ? h("p", { class: "bd-field__hint", id: id + "-hint", text: hintText }) : null;
        var wrap;
        if (f.type === "checkbox") {
          wrap = h("div", { class: "bd-field" + (f.full ? " bd-field--full" : "") }, [h("label", { class: "bd-check", for: id }, [el, tx(f.label)]), hint, err]);
        } else {
          wrap = h("div", { class: "bd-field" + (f.full ? " bd-field--full" : "") }, [
            h("label", { class: "bd-field__label", for: id }, [tx(f.label), f.required ? h("span", { class: "bd-field__req", "aria-hidden": "true", text: "*" }) : null]),
            el, hint, err
          ]);
        }
        grid.appendChild(wrap);
      });

      var cancel = h("button", { type: "button", class: "bd-btn bd-btn--ghost", text: I.pick("ยกเลิก", "Cancel") });
      var save = h("button", { type: "submit", class: "bd-btn bd-btn--primary", text: isEdit ? I.pick("บันทึกการแก้ไข", "Save changes") : I.pick("เพิ่ม" + nounTh, "Add " + nounEn) });
      var d = ui.dialog({
        title: isEdit ? I.pick("แก้ไข" + nounTh, "Edit " + nounEn) : I.pick("เพิ่ม" + nounTh, "Add " + nounEn),
        form: true, body: grid, footer: [cancel, save], returnFocus: opener
      });
      cancel.addEventListener("click", function () { d.close(); });

      function setError(name, msg) {
        if (!errors[name]) { return true; }
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
          values[f.name] = f.type === "checkbox" ? el.checked : (f.type === "file" ? el._name : el.value.trim());
        });
        var firstBad = null;
        cfg.fields.forEach(function (f) {
          var v = values[f.name];
          var msg = "";
          if (f.required && (v === "" || v === false)) { msg = I.pick("กรุณากรอก" + tx(f.label), "Please enter " + tx(f.label)); }
          else if (f.type === "url" && v && !ui.isHttpUrl(v)) { msg = I.pick("ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://", "Links must start with http:// or https://"); }
          if (!setError(f.name, msg) && !firstBad) { firstBad = inputs[f.name]; }
        });
        if (cfg.check) {
          var extra = cfg.check(values, st.rows, row) || {};
          Object.keys(extra).forEach(function (name) {
            setError(name, tx(extra[name]));
            if (!firstBad && inputs[name]) { firstBad = inputs[name]; }
          });
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
          out[f.name] = f.type === "checkbox" ? el.checked : (f.type === "file" ? el._name : (f.type === "number" ? Number(el.value) : el.value.trim()));
        });
        if (isEdit) {
          Object.keys(out).forEach(function (k) { row[k] = out[k]; });
          addLog("แก้ไข" + nounTh + ": " + titleOf(row), "Edited " + nounEn + ": " + titleOf(row));
          ui.toast(I.pick("บันทึกการแก้ไขแล้ว", "Changes saved"));
        } else {
          out.id = cfg.key + "-new-" + (st.seq++);
          if (cfg.hideable && out.visible === undefined) { out.visible = true; }
          if (cfg.created) { cfg.created(out); }
          st.rows.push(out);
          addLog("เพิ่ม" + nounTh + ": " + titleOf(out), "Added " + nounEn + ": " + titleOf(out));
          ui.toast(I.pick("เพิ่ม" + nounTh + "แล้ว", nounEn + " added"));
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
    if (forced !== "loading" && forced !== "error" && !st.loaded) {
      window.setTimeout(function () {
        st.loaded = true;
        render();
        if (!st.opened && params.get("new") === "1") { st.opened = true; openForm(null, addBtn); }
      }, 350);
    }
  }

  window.GUBD.crud = { mount: mount, tx: tx };
})();
