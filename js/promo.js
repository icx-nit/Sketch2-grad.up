/* ==========================================================================
   promo.js
   ประชาสัมพันธ์มหาวิทยาลัย (ป๊อปอัพ + กล่องการ์ดมุมขวาล่าง)
   - เปิดเว็บ: ป๊อปอัพเด้งขึ้นกลางจอ (แสดงเฉพาะหน้าแรก = ภาพปก + ประกาศ)
   - กดกากบาท / Esc / คลิกพื้นหลัง = ย่อลงเป็นการ์ดมุมขวาล่าง
   - กล่องมุมขวาล่างเป็น "กล่องเดียว" อยู่กับที่ ไม่มีอนิเมชันของกล่อง
     สลับการ์ดอัตโนมัติทุก 4.2 วิ: เฉพาะตัวการ์ดใบเก่าลอยขึ้น+จางหาย
     แล้วใบใหม่ลอยขึ้นเข้าที่ในกล่อง (กดลูกศรหรือจุดเพื่อข้ามดูเองได้)
   - กดการ์ด = เปิดรายละเอียดกลางจอ, ปิดแล้วกลับไปมุมขวาล่างเหมือนเดิม
   - เลื่อนพ้นหน้าแรกไปหน้าข่าวแล้ว กล่อง/ป๊อปอัพจะซ่อน (กลับมาแล้วแสดงอีกครั้ง)
   - ข้อความรองรับไทย/อังกฤษ ตามปุ่มสลับภาษาของเว็บ
   ========================================================================== */

(function () {
  "use strict";

  var mount = document.querySelector("[data-promo]");
  if (!mount) {
    return;
  }

  function svg(paths) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
      'focusable="false">' +
      paths +
      "</svg>"
    );
  }

  var ICONS = {
    job: svg(
      '<rect x="3" y="7" width="18" height="13" rx="2"/>' +
        '<path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7"/>' +
        '<path d="M3 12.5h18"/>'
    ),
    event: svg(
      '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/>' +
        '<path d="M8 2.5v4M16 2.5v4M3 10h18"/>' +
        '<path d="m9 15 2 2 4-4"/>'
    ),
    notice: svg(
      '<path d="m3 11 18-6v14L3 13v-2Z"/>' +
        '<path d="M7.5 12.5v5a2.5 2.5 0 0 0 5 0v-4"/>'
    ),
    calendar: svg(
      '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/>' +
        '<path d="M8 2.5v4M16 2.5v4M3 10h18"/>'
    ),
    arrowRight: svg('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
    arrowUpRight: svg('<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>'),
    chevronLeft: svg('<path d="m14 6-6 6 6 6"/>'),
    chevronRight: svg('<path d="m10 6 6 6-6 6"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>')
  };

  var DATA = [
    {
      icon: "notice",
      type: "notice",
      image: "assets/images/promo-exam.jpg",
      tag: { th: "ประกาศสอบ", en: "Exam notice" },
      badge: { th: "ใหม่", en: "New" },
      source: {
        th: "กองบริการการศึกษา มหาวิทยาลัยพะเยา",
        en: "Academic Services Division, University of Phayao"
      },
      title: {
        th: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาต้น ปีการศึกษา 2569 (ครั้งที่ 2)",
        en: "Qualifying Examination registration for doctoral students, semester 1/2026 (2nd round)"
      },
      meta: {
        th: "24 ส.ค. 2569 · เปิดรับสมัครถึง 28 ส.ค. 2569",
        en: "24 Aug 2026 · applications close 28 Aug 2026"
      },
      date: {
        day: "24",
        mon: { th: "ส.ค.", en: "Aug" },
        year: { th: "2569", en: "2026" }
      },
      body: {
        th: [
          "การสมัครสอบวัดคุณสมบัติ (Qualifying Examination) สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาต้น ปีการศึกษา 2569 (ครั้งที่ 2) เปิดรับสมัครและชำระเงินค่าสมัครสอบ ระหว่างวันที่ 24–28 สิงหาคม 2569",
          "ยื่นคำร้องได้ที่ www.reg.up.ac.th เมนูคำร้องนิสิต > ยื่นคำร้อง > เลือก QE สมัครสอบวัดคุณสมบัติ (Qualifying Examination) > ชำระเงินผ่าน QR Payment"
        ],
        en: [
          "Registration and payment for the Qualifying Examination (doctoral students, semester 1/2026, 2nd round) are open from 24 to 28 August 2026.",
          "Submit your request at www.reg.up.ac.th: Student Requests > Submit a request > QE (Qualifying Examination) > pay via QR Payment."
        ]
      },
      link: "https://www.facebook.com/share/19RZRpB9uU/"
    },
    {
      icon: "event",
      type: "event",
      image: "assets/images/promo-training.jpg",
      tag: { th: "อบรม", en: "Training" },
      badge: { th: "", en: "" },
      source: {
        th: "กองบริการการศึกษา มหาวิทยาลัยพะเยา",
        en: "Academic Services Division, University of Phayao"
      },
      title: {
        th: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting",
        en: "iThesis NexGen training via Zoom Cloud Meeting"
      },
      meta: {
        th: "8 เม.ย. 2569 · อบรมออนไลน์",
        en: "8 Apr 2026 · Online training"
      },
      date: {
        day: "8",
        mon: { th: "เม.ย.", en: "Apr" },
        year: { th: "2569", en: "2026" }
      },
      body: {
        th: [
          "วันอังคารที่ 7 เมษายน 2569 กองบริการการศึกษา จัดโครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting",
          "โดยมี ผู้ช่วยศาสตราจารย์ ดร.นรินธน์ นนทมาลย์ ผู้ช่วยอธิการบดี กล่าวเปิดโครงการ ผู้สนใจสามารถติดตามกำหนดการอบรมครั้งถัดไปได้ที่เว็บไซต์กองบริการการศึกษา"
        ],
        en: [
          "On Tuesday 7 April 2026 the Academic Services Division held an online training session on the iThesis NexGen system via Zoom Cloud Meeting.",
          "The session was opened by Asst. Prof. Dr. Narin Nonthamand, Assistant to the President. Upcoming sessions are announced on the division's website."
        ]
      },
      link: "https://www.facebook.com/story.php?story_fbid=1463767892205499&id=100057169071688"
    },
    {
      icon: "notice",
      type: "notice",
      image: "assets/images/promo-system.jpg",
      tag: { th: "แจ้งปิดระบบ", en: "System notice" },
      badge: { th: "", en: "" },
      source: {
        th: "กองบริการการศึกษา มหาวิทยาลัยพะเยา",
        en: "Academic Services Division, University of Phayao"
      },
      title: {
        th: "แจ้งปิดปรับปรุงระบบ iThesis ระหว่างวันที่ 25–31 มีนาคม 2569",
        en: "iThesis maintenance: 25–31 March 2026"
      },
      meta: {
        th: "16 มี.ค. 2569 · ระบบไม่พร้อมใช้งานชั่วคราว",
        en: "16 Mar 2026 · temporary downtime"
      },
      date: {
        day: "16",
        mon: { th: "มี.ค.", en: "Mar" },
        year: { th: "2569", en: "2026" }
      },
      body: {
        th: [
          "ระบบ iThesis จะปิดปรับปรุงระหว่างวันที่ 25–31 มีนาคม 2569 ส่งผลให้ไม่สามารถใช้งานระบบได้ในช่วงวันและเวลาดังกล่าว",
          "ขออภัยในความไม่สะดวก หากต้องการความช่วยเหลือสามารถติดต่อได้ที่หมายเลข 054-466-666 ต่อ 1831, 1832"
        ],
        en: [
          "iThesis will be closed for maintenance from 25 to 31 March 2026, so the system cannot be used during that period.",
          "We apologise for the inconvenience. For assistance please call 054-466-666 ext. 1831, 1832."
        ]
      },
      link: "https://grad.up.ac.th/uploads/news/69b78aaea6c19.jpg"
    }
  ];

  var UI = {
    th: {
      region: "ประชาสัมพันธ์มหาวิทยาลัยพะเยา",
      prev: "ประกาศก่อนหน้า",
      next: "ประกาศถัดไป",
      close: "ปิดและย่อลงมุมขวาล่าง",
      dot: "ดูประกาศลำดับที่",
      open: "เปิดอ่านรายละเอียด",
      action: "อ่านประกาศฉบับเต็ม"
    },
    en: {
      region: "University of Phayao announcements",
      prev: "Previous announcement",
      next: "Next announcement",
      close: "Close and minimize to the bottom right",
      dot: "Show announcement",
      open: "Open details",
      action: "Read full announcement"
    }
  };

  var FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en"
      ? "en"
      : "th";
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (html) {
      node.innerHTML = html;
    }
    return node;
  }

  /* ------------------------------------------------------------------------
     สร้างการ์ด 3 ใบ + แถบควบคุม
     ------------------------------------------------------------------------ */

  var dock = el("div", "promo__dock");
  var stage = el("div", "promo__stage");
  var bar = el("div", "promo__bar");
  var dots = el("div", "promo__dots");
  var arrows = el("div", "promo__arrows");
  var refs = [];

  DATA.forEach(function (item, index) {
    var card = el("button", "promo-card");
    card.type = "button";
    card.dataset.type = item.type;

    /* ภาพปกนิ่งด้านบน + วงกลม "เปิดอ่าน" มุมขวา */
    var cover = el("span", "promo-card__cover");
    var img = el("img", "promo-card__img");
    img.src = item.image;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    var openMark = el("span", "promo-card__open", ICONS.arrowUpRight);
    cover.appendChild(img);
    cover.appendChild(openMark);

    var body = el("span", "promo-card__body");

    var top = el("span", "promo-card__top");
    var label = el("span", "promo-card__label", ICONS[item.icon]);
    var labelText = el("span", "");
    label.appendChild(labelText);
    var badge = el("span", "promo-card__badge");
    top.appendChild(label);
    top.appendChild(badge);

    var title = el("span", "promo-card__title");

    var foot = el("span", "promo-card__foot");
    var date = el("span", "promo-card__date");
    var day = el("span", "promo-card__day");
    var dmy = el("span", "promo-card__dmy");
    var mon = el("span", "promo-card__mon");
    var year = el("span", "promo-card__year");
    dmy.appendChild(mon);
    dmy.appendChild(year);
    date.appendChild(day);
    date.appendChild(dmy);

    var source = el("span", "promo-card__source");

    foot.appendChild(date);
    foot.appendChild(source);

    body.appendChild(top);
    body.appendChild(title);
    body.appendChild(foot);

    card.appendChild(cover);
    card.appendChild(body);

    card.addEventListener("click", function () {
      /* กดได้เฉพาะใบหน้าที่อยู่บนสุด */
      if (card.classList.contains("pos-0")) {
        openModal(index);
      }
    });

    stage.appendChild(card);
    refs[index] = {
      card: card,
      labelText: labelText,
      badge: badge,
      title: title,
      source: source,
      day: day,
      mon: mon,
      year: year
    };
  });

  var dotEls = DATA.map(function (item, index) {
    var dot = el("button", "promo__dot");
    dot.type = "button";
    dot.addEventListener("click", function () {
      show(index);
    });
    dots.appendChild(dot);
    return dot;
  });

  var prevBtn = el("button", "promo__arrow", ICONS.chevronLeft);
  prevBtn.type = "button";
  prevBtn.addEventListener("click", function () {
    step(-1);
  });

  var nextBtn = el("button", "promo__arrow", ICONS.chevronRight);
  nextBtn.type = "button";
  nextBtn.addEventListener("click", function () {
    step(1);
  });

  arrows.appendChild(prevBtn);
  arrows.appendChild(nextBtn);
  bar.appendChild(dots);
  bar.appendChild(arrows);
  dock.appendChild(stage);
  dock.appendChild(bar);
  dock.hidden = true;

  /* ------------------------------------------------------------------------
     กล่องประชาสัมพันธ์แสดงเฉพาะ "หน้าแรก" (ภาพปก + ประกาศ)
     เลื่อนพ้นภาพปกไปหน้าข่าวแล้ว = ซ่อนทั้งกล่องและป๊อปอัพ
     (กล่องเองอยู่กับที่ ไม่มีอนิเมชันของกล่อง)
     ------------------------------------------------------------------------ */

  var heroStage = document.querySelector(".hero-stage");
  var onFirstView = true;

  function isFirstView() {
    if (!heroStage) {
      return true;
    }
    /* ยังนับว่าอยู่ "หน้าแรก" ตราบใดที่ภาพปกยังครองพื้นที่ส่วนใหญ่ของจอ
       (เลื่อนลงจนหน้าข่าวเริ่มขึ้นมาแทนที่ = ออกจากหน้าแรกแล้ว) */
    var rect = heroStage.getBoundingClientRect();
    return rect.bottom > window.innerHeight * 0.6;
  }

  function hideModalNow() {
    window.clearTimeout(closeTimer);
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("is-locked");
  }

  function syncPromo() {
    var show = isFirstView();
    if (show === onFirstView) {
      return;
    }
    onFirstView = show;

    if (show) {
      if (modal.hidden) {
        dock.hidden = false;
        startTimer();
      }
    } else {
      stopTimer();
      dock.hidden = true;
      if (!modal.hidden) {
        hideModalNow();
      }
    }
  }

  /* ------------------------------------------------------------------------
     ป๊อปอัพ / รายละเอียดกลางจอ
     ------------------------------------------------------------------------ */

  var modal = el("div", "promo__modal");
  modal.hidden = true;

  var scrim = el("div", "promo__scrim");
  scrim.addEventListener("click", function () {
    closeModal();
  });

  var dialog = el("div", "promo__dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "promo-modal-title");
  dialog.tabIndex = -1;

  var closeBtn = el("button", "promo__close", ICONS.close);
  closeBtn.type = "button";
  closeBtn.addEventListener("click", function () {
    closeModal();
  });

  /* ภาพเดียวกับปกการ์ดมุมขวาล่าง + ป้ายหมวดทับอยู่บนภาพ */
  var media = el("figure", "promo__media");
  var mediaImg = el("img", "promo__media-img");
  mediaImg.alt = "";
  mediaImg.decoding = "async";
  var mediaChip = el("figcaption", "promo__media-chip");
  media.appendChild(mediaImg);
  media.appendChild(mediaChip);

  var content = el("div", "promo__content");
  var modalTitle = el("h2", "promo__title");
  modalTitle.id = "promo-modal-title";
  var modalMeta = el("p", "promo__meta");
  var modalBody = el("div", "promo__body");

  var actions = el("div", "promo__actions");
  var actionLink = el("a", "btn", "");

  content.appendChild(modalTitle);
  content.appendChild(modalMeta);
  content.appendChild(modalBody);
  content.appendChild(actions);
  actions.appendChild(actionLink);

  dialog.appendChild(closeBtn);
  dialog.appendChild(media);
  dialog.appendChild(content);
  modal.appendChild(scrim);
  modal.appendChild(dialog);

  mount.appendChild(dock);
  /* ป๊อปอัพต่อท้าย <body> เพื่อให้ลอยเหนือ header/drawer ได้จริง */
  document.body.appendChild(modal);

  /* ------------------------------------------------------------------------
     สลับการ์ด (เรียงลำดับในอาร์เรย์ = ลำดับการซ้อน)
     ------------------------------------------------------------------------ */

  var order = DATA.map(function (item, index) {
    return index;
  });
  var AUTO_MS = 4200;
  var timer = null;
  var modalIndex = 0;
  var closeTimer = null;
  var lastFront = null;

  function layout() {
    order.forEach(function (index, position) {
      var card = refs[index].card;
      card.classList.remove("pos-0", "pos-1", "pos-2");
      card.classList.add("pos-" + position);
      card.tabIndex = position === 0 ? 0 : -1;
      card.setAttribute("aria-hidden", position === 0 ? "false" : "true");
    });

    /* ใบใหม่ = ใบหน้าล่าสุด, ใบเก่า = ใบที่เพิ่งหลุดจากตำแหน่งหน้า */
    var nextFront = refs[order[0]].card;
    if (lastFront && lastFront !== nextFront) {
      /* เคลียร์คลาสอนิเมชันของทุกใบก่อน เพื่อกันคลาสค้างจากการกดเร็วๆ */
      refs.forEach(function (ref) {
        ref.card.classList.remove("is-leaving", "is-entering");
      });
      /* บังคับ reflow หนึ่งครั้งเพื่อให้อนิเมชันเริ่มใหม่ทุกครั้งที่สลับ */
      void nextFront.offsetWidth;
      lastFront.classList.add("is-leaving");
      nextFront.classList.add("is-entering");
    }
    lastFront = nextFront;

    dotEls.forEach(function (dot, index) {
      dot.setAttribute("aria-current", index === order[0] ? "true" : "false");
    });
  }

  /* พออนิเมชันสลับจบ ให้ถอดคลาสออก (กันคลาสค้าง) */
  stage.addEventListener("animationend", function (event) {
    var name = event.animationName;
    if (name === "promo-card-leave" || name === "promo-card-enter") {
      event.target.classList.remove("is-leaving", "is-entering");
    }
  });

  function step(direction) {
    if (order.length < 2) {
      return;
    }
    if (direction > 0) {
      order.push(order.shift());
    } else {
      order.unshift(order.pop());
    }
    layout();
  }

  function show(index) {
    var at = order.indexOf(index);
    if (at <= 0) {
      return;
    }
    order = order.slice(at).concat(order.slice(0, at));
    layout();
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (!modal.hidden) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timer = window.setInterval(function () {
      step(1);
    }, AUTO_MS);
  }

  /* หยุดสลับอัตโนมัติชั่วคราวขณะเอาเมาส์ชี้หรือโฟกัสอยู่ที่การ์ด */
  dock.addEventListener("pointerenter", stopTimer);
  dock.addEventListener("pointerleave", startTimer);
  dock.addEventListener("focusin", stopTimer);
  dock.addEventListener("focusout", function () {
    window.setTimeout(function () {
      if (!dock.contains(document.activeElement)) {
        startTimer();
      }
    }, 0);
  });

  /* ------------------------------------------------------------------------
     เนื้อหาตามภาษา
     ------------------------------------------------------------------------ */

  function fillModal(index) {
    var item = DATA[index];
    var l = lang();

    /* ภาพเดียวกับปกการ์ดมุมขวาล่าง */
    mediaImg.src = item.image;
    mediaChip.textContent = item.tag[l];
    modalTitle.textContent = item.title[l];

    modalMeta.innerHTML = ICONS.calendar + "<span></span>";
    modalMeta.lastElementChild.textContent = item.meta[l];

    modalBody.textContent = "";
    item.body[l].forEach(function (text) {
      var paragraph = document.createElement("p");
      paragraph.textContent = text;
      modalBody.appendChild(paragraph);
    });

    /* ปุ่มอ่านฉบับเต็ม: เปิดข่าว/ประกาศต้นฉบับบนเว็บจริง */
    actionLink.href = item.link;
    actionLink.target = "_blank";
    actionLink.rel = "noopener noreferrer";
    actionLink.innerHTML = "<span></span>" + ICONS.arrowRight;
    actionLink.firstElementChild.textContent = UI[l].action;
  }

  function applyLang() {
    var l = lang();

    DATA.forEach(function (item, index) {
      var ref = refs[index];
      ref.labelText.textContent = item.tag[l];
      ref.badge.textContent = item.badge[l];
      ref.title.textContent = item.title[l];
      ref.source.textContent = item.source[l];
      ref.day.textContent = item.date.day;
      ref.mon.textContent = item.date.mon[l];
      ref.year.textContent = item.date.year[l];
      ref.card.setAttribute(
        "aria-label",
        item.title[l] + " · " + UI[l].open
      );
    });

    dock.setAttribute("aria-label", UI[l].region);
    prevBtn.setAttribute("aria-label", UI[l].prev);
    nextBtn.setAttribute("aria-label", UI[l].next);
    closeBtn.setAttribute("aria-label", UI[l].close);
    dotEls.forEach(function (dot, index) {
      dot.setAttribute(
        "aria-label",
        UI[l].dot + " " + (index + 1) + " · " + DATA[index].tag[l]
      );
    });

    if (!modal.hidden) {
      fillModal(modalIndex);
    }
  }

  /* ------------------------------------------------------------------------
     เปิด / ปิดรายละเอียด
     ------------------------------------------------------------------------ */

  function openModal(index) {
    modalIndex = index;
    fillModal(index);
    modal.hidden = false;
    document.body.classList.add("is-locked");
    stopTimer();

    /* บังคับ reflow หนึ่งครั้ง ให้ transition เริ่มจากสถานะย่อที่มุมขวาล่าง */
    void modal.offsetWidth;
    modal.classList.add("is-open");
    dialog.focus({ preventScroll: true });
  }

  function closeModal() {
    if (modal.hidden) {
      return;
    }

    modal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    window.clearTimeout(closeTimer);

    closeTimer = window.setTimeout(function () {
      modal.hidden = true;
      document.body.classList.remove("is-locked");

      /* ย่อลงเป็นการ์ดมุมขวาล่าง (กล่องอยู่ที่เดิม ไม่มีอนิเมชันของกล่อง) */
      var firstView = isFirstView();
      dock.hidden = !firstView;

      if (firstView) {
        refs[order[0]].card.focus({ preventScroll: true });
        startTimer();
      }
    }, 300);
  }

  document.addEventListener("keydown", function (event) {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    var list = Array.prototype.filter.call(
      dialog.querySelectorAll(FOCUSABLE),
      function (element) {
        return element.offsetParent !== null;
      }
    );

    if (!list.length) {
      return;
    }

    var first = list[0];
    var last = list[list.length - 1];

    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("gu:languagechange", applyLang);

  /* ------------------------------------------------------------------------
     เริ่มทำงาน
     ------------------------------------------------------------------------ */

  applyLang();
  layout();

  /* ติดตามตำแหน่งหน้า: กล่องประชาสัมพันธ์มีเฉพาะหน้าแรก */
  window.addEventListener("scroll", syncPromo, { passive: true });
  window.addEventListener("resize", syncPromo);
  onFirstView = isFirstView();

  /* ป๊อปอัพเด้งขึ้นกลางจอหลังหน้าเว็บเริ่มนิ่ง (เฉพาะเมื่ออยู่หน้าแรก)
     ถ้าผู้ใช้เริ่มเลื่อน/กดอะไรไปแล้วก่อนหน้านั้น ให้แสดงเป็นการ์ดมุมขวาล่างแทน
     (ไม่ขวางการเลื่อนไปหน้าข่าว) */
  var interacted = false;
  ["pointerdown", "click", "wheel", "keydown", "touchstart"].forEach(function (type) {
    window.addEventListener(
      type,
      function () {
        interacted = true;
      },
      { passive: true, once: true }
    );
  });

  window.setTimeout(function () {
    if (!modal.hidden) {
      return;
    }
    if (!isFirstView()) {
      return;
    }
    if (interacted) {
      dock.hidden = false;
      startTimer();
      return;
    }
    openModal(0);
  }, 1100);
})();
