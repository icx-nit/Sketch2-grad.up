/* ==========================================================================
   search.js
   ค้นหาจริงในหน้าเว็บ (client-side search)
   - สร้างดัชนีจากเนื้อหาจริงในหน้า: ข่าว ประกาศ บริการ หน่วยงาน ติดต่อ เมนู
   - ค้นได้ทั้งภาษาไทยและอังกฤษ รองรับหลายคำ (คั่นด้วยช่องว่าง)
   - แสดงผลลัพธ์ใต้ช่องค้นหา กดแล้วเลื่อนไปยังส่วนนั้น + ไฮไลต์
   - ลิงก์ภายนอกเปิดแท็บใหม่ · รองรับคีย์บอร์ด (↑ ↓ Enter Esc)
   ========================================================================== */

(function () {
  "use strict";

  var MAX_RESULTS = 8;

  /* --- เนื้อหาหลักของเว็บ (ข้อมูลจริงจาก grad.up.ac.th) --- */

  var STATIC = [
    {
      title: { th: "ข่าวสารและประกาศ", en: "News & announcements" },
      desc: {
        th: "ข่าวล่าสุด ประกาศสอบ การอบรม และประกาศปิดระบบ",
        en: "Latest news, exam notices, training and system announcements"
      },
      target: "#news",
      kw: "ข่าว ประกาศ news announcement exam ithesis training system อบรม สอบ",
      kind: "page"
    },
    {
      title: { th: "ปฏิทินกำหนดการสำคัญ", en: "Important dates calendar" },
      desc: {
        th: "ปฏิทินกิจกรรมและกำหนดการสำคัญของบัณฑิตวิทยาลัย",
        en: "Calendar of key events and academic deadlines"
      },
      target: "#calendar",
      kw: "ปฏิทิน กำหนดการ calendar schedule deadline activity",
      kind: "page"
    },
    {
      title: { th: "สถิติการดำเนินงาน", en: "Application statistics" },
      desc: {
        th: "จำนวนผู้ยื่นคำร้อง สถานะการดำเนินการ และกราฟรายเดือน",
        en: "Applications, processing status and monthly chart"
      },
      target: "#statistics",
      kw: "สถิติ ตัวเลข คำร้อง บศ.1 statistics chart application request",
      kind: "page"
    },
    {
      title: { th: "ติดต่อเรา", en: "Contact us" },
      desc: {
        th: "ที่อยู่ โทรศัพท์ อีเมล กองบริการการศึกษา มหาวิทยาลัยพะเยา",
        en: "Address, phone and email of the Division of Educational Services"
      },
      target: "#contact",
      kw: "ติดต่อ contact address phone email ที่อยู่ โทร อีเมล",
      kind: "page"
    },
    {
      title: { th: "บริการของเรา", en: "Our services" },
      desc: {
        th: "คำร้องออนไลน์ และข้อมูลสารสนเทศบัณฑิตศึกษา",
        en: "Online requests and graduate study information"
      },
      target: "#support-title",
      kw: "บริการ service คำร้อง request ระบบ reg",
      kind: "page"
    },
    {
      title: { th: "คำร้องออนไลน์", en: "Online requests" },
      desc: {
        th: "ยื่นเอกสารคำร้องและตรวจสอบสถานะผ่านระบบ reg.up.ac.th",
        en: "Submit requests and track status at reg.up.ac.th"
      },
      target: "https://reg.up.ac.th/",
      kw: "คำร้อง online request reg ยื่นเอกสาร",
      kind: "external"
    },
    {
      title: { th: "ข้อมูลสารสนเทศบัณฑิตศึกษา", en: "Graduate studies information" },
      desc: {
        th: "เว็บไซต์บัณฑิตวิทยาลัย มหาวิทยาลัยพะเยา",
        en: "Graduate School website, University of Phayao"
      },
      target: "https://grad.up.ac.th/",
      kw: "ข้อมูล graduate school grad หลักสูตร",
      kind: "external"
    },
    {
      title: { th: "รายชื่อวารสาร Scopus/ISI/TCI/ERIC", en: "Journals in Scopus/ISI/TCI/ERIC" },
      desc: {
        th: "ฐานข้อมูลวารสารสำหรับนิสิตบัณฑิตศึกษา",
        en: "Journal databases for graduate students"
      },
      target: "https://grad.up.ac.th/",
      kw: "วารสาร journal scopus isi tci eric",
      kind: "external"
    },
    {
      title: { th: "ประเมินความพึงพอใจ", en: "Satisfaction survey" },
      desc: {
        th: "แบบประเมินความพึงพอใจออนไลน์",
        en: "Online satisfaction questionnaire"
      },
      target: "https://forms.gle/6c73eaxoZytt5Krc8",
      kw: "ประเมิน ความพึงพอใจ survey satisfaction form",
      kind: "external"
    },
    {
      title: { th: "iThesis", en: "iThesis" },
      desc: {
        th: "ระบบบริหารจัดการวิทยานิพนธ์",
        en: "Thesis management system"
      },
      target: "https://app.ithesis.co/",
      kw: "ithesis วิทยานิพนธ์ thesis",
      kind: "external"
    },
    {
      title: { th: "เข้าสู่ระบบ", en: "Sign in" },
      desc: {
        th: "เข้าสู่ระบบสำหรับผู้ดูแลและนิสิตบัณฑิตศึกษา",
        en: "Sign in for administrators and graduate students"
      },
      target: "login.html",
      kw: "เข้าสู่ระบบ login sign in admin ผู้ดูแล",
      kind: "external"
    },
    {
      title: { th: "ปฏิทินการศึกษา", en: "Academic calendar" },
      desc: {
        th: "กำหนดการเปิด-ปิดภาคเรียนและการลงทะเบียน",
        en: "Semester dates and registration schedule"
      },
      target: "https://reg.up.ac.th/",
      kw: "ปฏิทินการศึกษา academic calendar ลงทะเบียน",
      kind: "external"
    },
    {
      title: { th: "อัตราค่าธรรมเนียมการศึกษา", en: "Tuition fees" },
      desc: {
        th: "ค่าธรรมเนียมการศึกษาระดับบัณฑิตศึกษา",
        en: "Graduate tuition and fees"
      },
      target: "https://reg.up.ac.th/",
      kw: "ค่าธรรมเนียม fee tuition ค่าเทอม",
      kind: "external"
    },
    {
      title: { th: "ประกาศมหาวิทยาลัยพะเยา", en: "University announcements" },
      desc: {
        th: "ระเบียบ ข้อบังคับ และประกาศอื่น ๆ",
        en: "Regulations, rules and other announcements"
      },
      target: "announce-other.html",
      kw: "ประกาศ ระเบียบ ข้อบังคับ announcement regulation",
      kind: "external"
    }
  ];

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  var ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<circle cx="11" cy="11" r="7"/><line x1="16.65" y1="16.65" x2="21" y2="21"/></svg>';

  var panel = document.getElementById("site-search");
  var form = panel ? panel.querySelector("form") : null;
  var input = document.getElementById("site-search-input");
  var toggle = document.querySelector("[data-search-toggle]");
  var box = document.querySelector("[data-search-results]");
  var statusEl = document.querySelector("[data-search-status]");
  var listEl = document.querySelector("[data-search-list]");

  if (!panel || !form || !input || !box || !listEl) {
    return;
  }

  var activeIndex = -1;
  var timer = 0;

  /* ------------------------------------------------------------------------
     ภาษา / ตัวช่วยข้อความ
     ------------------------------------------------------------------------ */

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en"
      ? "en"
      : "th";
  }

  function pick(value) {
    if (value && typeof value === "object") {
      return value[lang()] || value.th || value.en || "";
    }
    return value || "";
  }

  function t(key, fallback) {
    if (window.GUI18n && typeof window.GUI18n.translate === "function") {
      return window.GUI18n.translate(lang(), key);
    }
    return fallback;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function textOf(element) {
    return element ? String(element.textContent).replace(/\s+/g, " ").trim() : "";
  }

  /* ------------------------------------------------------------------------
     สร้างดัชนี: เนื้อหาคงที่ + เนื้อหาจริงที่อยู่บนหน้า
     ------------------------------------------------------------------------ */

  function addEntries(entries, extra) {
    extra.forEach(function (entry) {
      var title = pick(entry.title);
      if (!title) {
        return;
      }
      entries.push({
        title: entry.title,
        desc: entry.desc || "",
        target: entry.target || "",
        kw: entry.kw || "",
        kind: entry.kind || "page",
        category: entry.category || null
      });
    });
  }

  function collectEntries() {
    var entries = [];
    addEntries(entries, STATIC);

    /* ประกาศบนหน้าหลัก */
    Array.prototype.forEach.call(
      document.querySelectorAll(".announce-card"),
      function (card) {
        var title = textOf(card.querySelector(".announce-card__label"));
        if (!title) {
          return;
        }
        addEntries(entries, [
          {
            title: title,
            desc: {
              th: "ประกาศและบริการสำหรับนิสิตบัณฑิตศึกษา",
              en: "Announcements and services for graduate students"
            },
            target: card.getAttribute("href") || "#announcements",
            kw: "ประกาศ announcement",
            kind: "page",
            category: { th: "ประกาศ", en: "Announcements" }
          }
        ]);
      }
    );

    /* ข่าวจริงที่สร้างโดย news.js */
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-news-list] .news-card"),
      function (card) {
        var title = textOf(card.querySelector(".news-card__title"));
        if (!title) {
          return;
        }
        var chip = textOf(card.querySelector(".news-card__chip"));
        var date = textOf(card.querySelector(".news-card__date"));
        addEntries(entries, [
          {
            title: title,
            desc: [chip, date].filter(Boolean).join(" · "),
            target: card.getAttribute("href") || "#news",
            kw: "ข่าว news " + chip,
            kind: "external",
            category: { th: "ข่าว", en: "News" }
          }
        ]);
      }
    );

    /* ลิงก์ที่เกี่ยวข้องในส่วนข่าว */
    Array.prototype.forEach.call(
      document.querySelectorAll(".news-links__item"),
      function (link) {
        var name = textOf(link.querySelector(".news-links__name"));
        var host = textOf(link.querySelector(".news-links__host"));
        addEntries(entries, [
          {
            title: name,
            desc: host,
            target: link.getAttribute("href") || "",
            kw: "ลิงก์ link " + host,
            kind: "external",
            category: { th: "ลิงก์ที่เกี่ยวข้อง", en: "Related links" }
          }
        ]);
      }
    );

    /* บริการของเรา */
    Array.prototype.forEach.call(
      document.querySelectorAll(".support-service"),
      function (link) {
        addEntries(entries, [
          {
            title: textOf(link.querySelector(".support-service__name")),
            desc: textOf(link.querySelector(".support-service__desc")),
            target: link.getAttribute("href") || "#contact",
            kw: "บริการ service คำร้อง request",
            kind: "external",
            category: { th: "บริการ", en: "Services" }
          }
        ]);
      }
    );

    /* หน่วยงานที่เกี่ยวข้อง */
    Array.prototype.forEach.call(
      document.querySelectorAll(".support-agency"),
      function (link) {
        var host = textOf(link.querySelector(".support-agency__host"));
        addEntries(entries, [
          {
            title: textOf(link.querySelector(".support-agency__name")),
            desc: host,
            target: link.getAttribute("href") || "#contact",
            kw: "หน่วยงาน agency " + host,
            kind: "external",
            category: { th: "หน่วยงาน", en: "Agencies" }
          }
        ]);
      }
    );

    /* ที่อยู่ / โทรศัพท์ / อีเมล */
    Array.prototype.forEach.call(
      document.querySelectorAll(".support-contact__item"),
      function (item) {
        var label = textOf(item.querySelector(".support-contact__label"));
        var org = textOf(item.querySelector(".support-contact__org"));
        var link = item.querySelector("a[href]");
        var value = textOf(
          link || item.querySelector(".support-contact__value")
        );
        var target = link ? link.getAttribute("href") : "#contact";
        var isHash = target.charAt(0) === "#";

        addEntries(entries, [
          {
            title: label + (value ? ": " + value : ""),
            desc: org,
            target: target,
            kw: "ติดต่อ contact " + label + " " + value,
            kind: isHash ? "page" : "external",
            category: { th: "ติดต่อเรา", en: "Contact" }
          }
        ]);
      }
    );

    /* ตัดรายการซ้ำ (ชื่อ + ปลายทางเดียวกัน) */
    var seen = Object.create(null);
    return entries.filter(function (entry) {
      var key = normalize(pick(entry.title)) + "|" + entry.target;
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  /* ------------------------------------------------------------------------
     ค้นหาและจัดอันดับ
     ------------------------------------------------------------------------ */

  function score(entry, tokens, query) {
    var title = normalize(pick(entry.title));
    var desc = normalize(pick(entry.desc));
    var kw = normalize(entry.kw);
    var haystack = title + " " + desc + " " + kw + " " + normalize(entry.target);

    var i;
    for (i = 0; i < tokens.length; i++) {
      if (haystack.indexOf(tokens[i]) === -1) {
        return -1;
      }
    }

    if (title === query) {
      return 0;
    }
    if (title.indexOf(query) !== -1) {
      return 1;
    }

    var allInTitle = true;
    for (i = 0; i < tokens.length; i++) {
      if (title.indexOf(tokens[i]) === -1) {
        allInTitle = false;
        break;
      }
    }
    if (allInTitle) {
      return 2;
    }
    if (kw.indexOf(query) !== -1) {
      return 3;
    }
    return 4;
  }

  function find(query) {
    var tokens = normalize(query).split(" ").filter(Boolean);
    if (!tokens.length) {
      return [];
    }

    return collectEntries()
      .map(function (entry) {
        return { entry: entry, rank: score(entry, tokens, normalize(query)) };
      })
      .filter(function (item) {
        return item.rank !== -1;
      })
      .sort(function (a, b) {
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }
        return pick(a.entry.title).length - pick(b.entry.title).length;
      })
      .slice(0, MAX_RESULTS)
      .map(function (item) {
        return item.entry;
      });
  }

  /* ------------------------------------------------------------------------
     แสดงผล
     ------------------------------------------------------------------------ */

  function highlight(parent, text, tokens) {
    var lower = text.toLowerCase();
    var ranges = [];

    tokens.forEach(function (token) {
      if (!token) {
        return;
      }
      var from = 0;
      var index = lower.indexOf(token, from);
      while (index !== -1) {
        ranges.push([index, index + token.length]);
        from = index + token.length;
        index = lower.indexOf(token, from);
      }
    });

    if (!ranges.length) {
      parent.textContent = text;
      return;
    }

    ranges.sort(function (a, b) {
      return a[0] - b[0];
    });

    var merged = [];
    ranges.forEach(function (range) {
      var last = merged[merged.length - 1];
      if (last && range[0] <= last[1]) {
        last[1] = Math.max(last[1], range[1]);
      } else {
        merged.push([range[0], range[1]]);
      }
    });

    var position = 0;
    merged.forEach(function (range) {
      if (range[0] > position) {
        parent.appendChild(document.createTextNode(text.slice(position, range[0])));
      }
      var mark = document.createElement("mark");
      mark.textContent = text.slice(range[0], range[1]);
      parent.appendChild(mark);
      position = range[1];
    });

    if (position < text.length) {
      parent.appendChild(document.createTextNode(text.slice(position)));
    }
  }

  function isHomePage() {
    var path = window.location.pathname;
    return path === "" || path === "/" || /index\.html$/i.test(path);
  }

  function metaText(entry) {
    var parts = [];
    if (entry.category) {
      parts.push(pick(entry.category));
    }
    var target = entry.target || "";
    parts.push(
      target.charAt(0) === "#"
        ? t("search.onPage", "ในหน้านี้")
        : /^https?:/i.test(target)
          ? t("search.external", "ลิงก์ภายนอก")
          : t("search.pageLink", "หน้าเว็บ")
    );
    return parts.join(" · ");
  }

  function setActive(index, items) {
    if (!items.length) {
      activeIndex = -1;
      return;
    }
    activeIndex = (index + items.length) % items.length;
    Array.prototype.forEach.call(items, function (item, i) {
      item.classList.toggle("is-active", i === activeIndex);
    });
    var current = items[activeIndex];
    if (current) {
      current.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", current.id);
    }
  }

  function render(query, results) {
    var tokens = normalize(query).split(" ").filter(Boolean);
    var fragment = document.createDocumentFragment();
    activeIndex = -1;

    listEl.textContent = "";

    results.forEach(function (entry, index) {
      var li = document.createElement("li");
      var link = document.createElement("a");

      link.className = "search-result";
      link.id = "search-result-" + index;
      var isHash = entry.target.charAt(0) === "#";
      link.href = isHash && !isHomePage() ? "index.html" + entry.target : entry.target;
      link.setAttribute("role", "option");

      if (/^https?:/i.test(entry.target)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      var icon = document.createElement("span");
      icon.className = "search-result__icon";
      icon.innerHTML = ICON;

      var body = document.createElement("span");
      body.className = "search-result__body";

      var title = document.createElement("span");
      title.className = "search-result__title";
      highlight(title, pick(entry.title), tokens);

      var meta = document.createElement("span");
      meta.className = "search-result__meta";
      meta.textContent = metaText(entry);

      body.appendChild(title);
      body.appendChild(meta);

      var arrow = document.createElement("span");
      arrow.className = "search-result__arrow";
      arrow.innerHTML = ARROW;

      link.appendChild(icon);
      link.appendChild(body);
      link.appendChild(arrow);

      if (isHash && isHomePage()) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          jumpTo(entry.target);
        });
      } else {
        /* ลิงก์ภายนอก: ปิดช่องค้นหา แล้วปล่อยให้เปิดแท็บใหม่ตามปกติ */
        link.addEventListener("click", dismiss);
      }

      li.appendChild(link);
      fragment.appendChild(li);
    });

    listEl.appendChild(fragment);

    if (results.length) {
      statusEl.textContent = t(
        results.length === 1 ? "search.resultsCountOne" : "search.resultsCount",
        results.length === 1 ? "พบ 1 รายการ สำหรับ “{q}”" : "พบ {n} รายการ สำหรับ “{q}”"
      )
        .replace("{n}", String(results.length))
        .replace("{q}", query);
    } else {
      statusEl.textContent = t("search.noResults", "ไม่พบผลลัพธ์สำหรับ “{q}”")
        .replace("{q}", query);
    }

    box.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function hideResults() {
    box.hidden = true;
    listEl.textContent = "";
    statusEl.textContent = "";
    activeIndex = -1;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }

  function runSearch() {
    var query = input.value.trim();
    if (!query) {
      hideResults();
      return;
    }
    render(query, find(query.slice(0, 80)));
  }

  /* ------------------------------------------------------------------------
     ไปยังเป้าหมาย + ไฮไลต์
     ------------------------------------------------------------------------ */

  function closePanel() {
    dismiss();
    if (toggle) {
      toggle.focus();
    }
  }

  function dismiss() {
    hideResults();
    panel.hidden = true;
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function jumpTo(target) {
    var isHash = target.charAt(0) === "#";
    var element = isHash ? document.querySelector(target) : null;

    closePanel();

    if (isHash && (target === "#main" || target === "#top" || !element)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!element) {
      window.location.href = target;
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    element.classList.remove("is-search-target");
    void element.offsetWidth;
    element.classList.add("is-search-target");

    window.setTimeout(function () {
      element.classList.remove("is-search-target");
    }, 2300);
  }

  /* ------------------------------------------------------------------------
     เหตุการณ์
     ------------------------------------------------------------------------ */

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = input.value.trim();

    if (!query) {
      input.focus();
      return;
    }

    /* ค้นหาใหม่ทันที (ไม่รอ debounce) แล้วไปยังผลลัพธ์แรก */
    runSearch();

    var first = listEl.querySelector(".search-result");
    if (first) {
      first.click();
    }
  });

  input.addEventListener("input", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(runSearch, 160);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim() && box.hidden) {
      runSearch();
    }
  });

  input.addEventListener("keydown", function (event) {
    var items = listEl.querySelectorAll(".search-result");

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1, items);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1, items);
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      event.preventDefault();
      items[activeIndex].click();
      return;
    }

    if (event.key === "Escape") {
      hideResults();
    }
  });

  if (toggle) {
    toggle.addEventListener("click", function () {
      window.setTimeout(function () {
        if (panel.hidden) {
          hideResults();
        }
      }, 0);
    });
  }

  document.addEventListener("gu:languagechange", function () {
    if (!box.hidden && input.value.trim()) {
      runSearch();
    }
  });

  /* ให้กล่องผลการค้นหามีความกว้างเท่ากับช่องค้นหา (ไม่รวมปุ่ม "ค้นหา")
     คำนวณใหม่หลังการวาด (rAF) และเมื่อกล่องถูกแสดง/ซ่อน เพื่อไม่ให้ค่าเก่าค้าง */
  function alignResults() {
    window.requestAnimationFrame(function () {
      var inner = box.firstElementChild;
      if (!inner) {
        return;
      }
      var inputRect = input.getBoundingClientRect();
      if (!inputRect.width) {
        inner.style.maxWidth = "";
        inner.style.width = "";
        inner.style.marginLeft = "";
        inner.style.marginRight = "";
        return;
      }
      var boxRect = box.getBoundingClientRect();
      inner.style.maxWidth = "none";
      inner.style.width = inputRect.width + "px";
      inner.style.marginLeft = (inputRect.left - boxRect.left) + "px";
      inner.style.marginRight = "0";
    });
  }

  input.addEventListener("input", alignResults);
  window.addEventListener("resize", alignResults);
  if (typeof MutationObserver === "function") {
    var alignObserver = new MutationObserver(alignResults);
    alignObserver.observe(box, { attributes: true, attributeFilter: ["hidden"] });
    alignObserver.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  }
  alignResults();
})();
