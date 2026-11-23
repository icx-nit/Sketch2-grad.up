/* ==========================================================================
   news.js
   ส่วนข่าวสาร (ชั้นที่ 2 ของหน้าแรก) — รูปแบบตามภาพอ้างอิง (ภาพที่ 2)
   - ซ้าย: การ์ดเดียว = หัวข้อ + "ดูข่าวทั้งหมด" + แถวข่าว/ประกาศสำคัญ
           แต่ละแถว: ภาพย่อ · ป้ายประเภท · หัวข้อ · วันที่
   - ขวา: ลิงก์ที่เกี่ยวข้องของบัณฑิตวิทยาลัย/มหาวิทยาลัยพะเยา
   - ข้อมูลอ้างอิงจากเว็บไซต์ทางการ https://grad.up.ac.th/
   - แสดงผลเมื่อเลื่อนมาถึง (IntersectionObserver) + รองรับ prefers-reduced-motion
   ========================================================================== */

(function () {
  "use strict";

  /* ส่วนรายการข่าว (อยู่ก่อนภาพรวมสถิติ) และส่วนหน่วยงานอื่นๆ (อยู่ด้านบน) แยกกันเป็นคนละ section */
  var mount = document.querySelector("[data-news]");
  if (!mount) {
    return;
  }

  var linksMount = document.querySelector("[data-news-links-section]");
  var mounts = linksMount ? [mount, linksMount] : [mount];

  var listEl = mount.querySelector("[data-news-list]");
  var linksEl = document.querySelector("[data-news-links]");

  function svg(paths) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
      'focusable="false">' +
      paths +
      "</svg>"
    );
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

  var ICONS = {
    arrowUpRight: svg('<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>'),
    cap: svg(
      '<path d="M22 9.5 12 5 2 9.5l10 4.5 10-4.5Z"/>' +
        '<path d="M6 11.6V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.4"/>'
    ),
    building: svg(
      '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>' +
        '<path d="M9.5 21v-5h5v5"/>'
    ),
    book: svg(
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/>' +
        '<path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5"/>'
    ),
    userPlus: svg(
      '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/>' +
        '<path d="M18.5 8v6M15.5 11h6"/>'
    ),
    layers: svg('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
    fileText: svg(
      '<path d="M15 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6Z"/>' +
        '<path d="M14 2v4h5"/><path d="M9 13h6M9 17h6"/>'
    ),
    briefcase: svg(
      '<rect x="3" y="7" width="18" height="13" rx="2"/>' +
        '<path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7"/>' +
        '<path d="M3 12.5h18"/>'
    )
  };

  /* ------------------------------------------------------------------------
     ข่าว/ประกาศสำคัญ — อ้างอิงจาก grad.up.ac.th (ข่าวล่าสุด)
     ------------------------------------------------------------------------ */

  /* ข่าว 6 รายการ (ข่าวใหม่ 2 + ข่าวเก่า 4) จากภาพอ้างอิง grad.up.ac.th
     ลิงก์ทุกข่าวชี้ไปหน้าหลักของ grad.up.ac.th เพราะยังไม่มี URL รายข่าวที่ยืนยันได้ */
  var GRAD_HOME = "https://grad.up.ac.th/";
  var NEWS = [
    {
      image: "assets/images/news/news-1.jpg", href: "https://www.facebook.com/photo?fbid=1446055740977843&set=a.415970597319701", isNew: true,
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: { th: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาปลาย ปีการศึกษา 2569 (ครั้งที่ 1)", en: "Qualifying Examination registration for doctoral students, late semester 2026 (round 1)" },
      desc: { th: "เปิดรับสมัครสอบวัดคุณสมบัติ ดูรายละเอียดและสมัครที่ reg.up.ac.th", en: "Register for the qualifying examination at reg.up.ac.th" },
      date: { th: "16 พ.ย. 2569", en: "16 Nov 2026" }
    },
    {
      image: "assets/images/news/news-2.jpg", href: "https://www.facebook.com/story.php?story_fbid=1463767892205499&id=100057169071688&mibextid=wwXIfr&rdid=fc9YBTei6y16ktV5#", isNew: true,
      chip: { th: "อบรม", en: "Training" },
      title: { th: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting", en: "iThesis NexGen training via Zoom Cloud Meeting" },
      desc: { th: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านการประชุมออนไลน์", en: "Online training on using the iThesis NexGen system" },
      date: { th: "8 เม.ย. 2569", en: "8 Apr 2026" }
    },
    {
      image: "assets/images/news/news-3.jpg", href: "https://grad.up.ac.th/uploads/news/69c5ff82d7866.jpg",
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: { th: "กำหนดการสมัครสอบวัดคุณสมบัติ สำหรับนิสิตปริญญาเอก ภาคฤดูร้อน ปีการศึกษา 2568", en: "Qualifying Examination schedule for doctoral students, summer 2025" },
      desc: { th: "ประกาศกำหนดการสมัครสอบวัดคุณสมบัติ สมัครได้ที่ www.reg.up.ac.th", en: "Registration schedule, apply at www.reg.up.ac.th" },
      date: { th: "27 มี.ค. 2569", en: "27 Mar 2026" }
    },
    {
      image: "assets/images/news/news-4.jpg", href: "https://grad.up.ac.th/uploads/news/69b78aaea6c19.jpg",
      chip: { th: "แจ้งปิดระบบ", en: "System notice" },
      title: { th: "แจ้งปิดปรับปรุงระบบ iThesis ระหว่างวันที่ 25–31 มีนาคม 2569", en: "iThesis maintenance: 25–31 March 2026" },
      desc: { th: "ระบบ iThesis ปิดปรับปรุงช่วงวันที่ 25–31 มีนาคม 2569 ทำให้ใช้งานไม่ได้ชั่วคราว", en: "The iThesis system is offline for maintenance from 25 to 31 March 2026" },
      date: { th: "16 มี.ค. 2569", en: "16 Mar 2026" }
    },
    {
      image: "assets/images/news/news-5.jpg", href: "https://grad.up.ac.th/uploads/news/6997be0141c61.jpg",
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: { th: "กำหนดการสมัครสอบประมวลความรู้ สำหรับนิสิตปริญญาโท แผน ข หรือแผน 2 ภาคการศึกษาที่ 3 ปีการศึกษา 2568", en: "Comprehensive exam schedule for master's students, plan B, semester 3, 2025" },
      desc: { th: "ประกาศกำหนดการสมัครสอบประมวลความรู้ สมัครได้ที่ www.reg.up.ac.th", en: "Registration schedule, apply at www.reg.up.ac.th" },
      date: { th: "20 ก.พ. 2569", en: "20 Feb 2026" }
    },
    {
      image: "assets/images/news/news-6.jpg", href: "https://grad.up.ac.th/uploads/news/6964515ce3149.jpg",
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: { th: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาปลาย ปีการศึกษา 2568 (ครั้งที่ 2)", en: "Qualifying Examination registration for doctoral students, late semester 2025 (round 2)" },
      desc: { th: "เปิดรับสมัครสอบวัดคุณสมบัติ (ครั้งที่ 2) สมัครได้ที่ reg.up.ac.th", en: "Register for round 2 at reg.up.ac.th" },
      date: { th: "12 ม.ค. 2569", en: "12 Jan 2026" }
    }
  ];

  /* ------------------------------------------------------------------------
     ลิงก์ที่เกี่ยวข้อง — อ้างอิงจากส่วน "ลิงก์ที่เกี่ยวข้อง" ของ grad.up.ac.th
     ------------------------------------------------------------------------ */

  var LINKS = [
    {
      icon: "cap",
      host: "up.ac.th",
      href: "https://up.ac.th",
      name: { th: "มหาวิทยาลัยพะเยา", en: "University of Phayao" }
    },
    {
      icon: "building",
      host: "does.up.ac.th",
      href: "https://does.up.ac.th",
      name: { th: "กองบริการการศึกษา", en: "Academic Services Division" }
    },
    {
      icon: "book",
      host: "reg.up.ac.th",
      href: "https://reg.up.ac.th",
      name: { th: "ระบบบริการการศึกษา", en: "Academic Services System" }
    },
    {
      icon: "userPlus",
      host: "admission.up.ac.th",
      href: "https://admission.up.ac.th",
      name: { th: "การรับสมัครบุคคลเข้าศึกษา", en: "Admissions" }
    },
    {
      icon: "layers",
      host: "tqf.up.ac.th",
      href: "https://tqf.up.ac.th",
      name: { th: "ระบบฐานข้อมูลหลักสูตร (TQF Online)", en: "Curriculum Database (TQF Online)" }
    },
    {
      icon: "fileText",
      host: "app.ithesis.co",
      href: "https://app.ithesis.co/",
      name: {
        th: "ระบบบริหารจัดการวิทยานิพนธ์ (iThesis)",
        en: "Thesis Management System (iThesis)"
      }
    },
    {
      icon: "briefcase",
      host: "coop.up.ac.th",
      href: "https://coop.up.ac.th",
      name: { th: "ระบบบริหารจัดการสหกิจศึกษา", en: "Cooperative Education System" }
    },
    {
      icon: "cap",
      host: "mua.go.th",
      href: "https://www.mua.go.th/index2.html",
      name: {
        th: "สำนักงานคณะกรรมการการอุดมศึกษา",
        en: "Office of the Higher Education Commission"
      }
    },
    {
      icon: "building",
      host: "does.ac.th",
      href: "https://does.ac.th",
      name: { th: "กองบริการการศึกษา (does.ac.th)", en: "Division of Educational Services" }
    }
  ];

  var UI = {
    th: { open: "เปิดในแท็บใหม่" },
    en: { open: "opens in a new tab" }
  };

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en"
      ? "en"
      : "th";
  }

  /* ------------------------------------------------------------------------
     สร้างการ์ดข่าว
     ------------------------------------------------------------------------ */

  var cards = NEWS.map(function (item) {
    var card = el("a", "news-card");
    card.href = item.href;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    var media = el("span", "news-card__media");
    var img = el("img", "news-card__img");
    img.src = item.image;
    /* ภาพเป็นโปสเตอร์ที่ข้อความซ้ำกับหัวข้อข่าว จึงไม่ต้องอ่านซ้ำ */
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);

    var chip = el("span", "news-card__chip");
    var title = el("span", "news-card__title");
    var desc = el("span", "news-card__desc");
    var date = el("span", "news-card__date");
    var sr = el("span", "visually-hidden");
    var foot = el("span", "news-card__foot");
    var more = el("span", "news-card__more", "อ่านต่อ \u2192");

    foot.appendChild(date);
    foot.appendChild(more);
    card.appendChild(media);
    card.appendChild(chip);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(foot);
    card.appendChild(sr);
    if (!item.isNew) {
      listEl.appendChild(card);
    }

    return { card: card, chip: chip, title: title, desc: desc, date: date, sr: sr, item: item };
  });

  /* ------------------------------------------------------------------------
     สร้างลิงก์ที่เกี่ยวข้อง
     ------------------------------------------------------------------------ */

  var linkRefs = LINKS.map(function (item) {
    var li = document.createElement("li");
    var link = el("a", "news-links__item");
    link.href = item.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    var icon = el("span", "news-links__icon", ICONS[item.icon]);
    icon.setAttribute("aria-hidden", "true");

    var text = el("span", "news-links__text");
    var name = el("span", "news-links__name");
    var host = el("span", "news-links__host");
    host.textContent = item.host;
    text.appendChild(name);
    text.appendChild(host);

    var arrow = el("span", "news-links__arrow", ICONS.arrowUpRight);
    arrow.setAttribute("aria-hidden", "true");

    link.appendChild(icon);
    link.appendChild(text);
    link.appendChild(arrow);
    li.appendChild(link);
    linksEl.appendChild(li);

    return { name: name };
  });

  /* ------------------------------------------------------------------------
     ข้อความตามภาษา
     ------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------
     เรื่องเด่น / ข่าวสารล่าสุด: สไลด์เด่น เลื่อนอัตโนมัติ + กดเลื่อนเองได้
     ------------------------------------------------------------------------ */
  var newRoot = mount.querySelector("[data-news-new]");
  var viewportEl = mount.querySelector("[data-news-new-viewport]");
  var dotsEl = mount.querySelector("[data-news-dots]");
  var prevBtn = mount.querySelector("[data-news-prev]");
  var nextBtn = mount.querySelector("[data-news-next]");
  var slideRefs = [];
  var dotRefs = [];
  var slideIndex = 0;
  var slideTimer = 0;
  var slidePaused = false;
  var AUTOPLAY_MS = 5000;

  var newItems = NEWS.filter(function (item) {
    return !!item.isNew;
  });

  function buildSlides() {
    if (!viewportEl) return;
    newItems.forEach(function (item) {
      var a = el("a", "news-hero__slide");
      a.href = item.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      var img = el("img", "news-hero__img");
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";

      var content = el("span", "news-hero__content");
      var chip = el("span", "news-card__chip");
      var title = el("span", "news-hero__title");
      var desc = el("span", "news-hero__desc");
      var date = el("span", "news-hero__date");
      var more = el("span", "news-hero__more", "อ่านประกาศฉบับเต็ม →");
      content.appendChild(chip);
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(date);
      content.appendChild(more);

      a.appendChild(img);
      var badgeWrap = el("span", "news-hero__badge-wrap");
      badgeWrap.appendChild(el("span", "news-hero__badge", "NEW"));
      if (!viewportEl.querySelector(".news-hero__badge-wrap")) {
        viewportEl.appendChild(badgeWrap);
      }
      a.appendChild(content);
      viewportEl.appendChild(a);
      slideRefs.push({ slide: a, chip: chip, title: title, desc: desc, date: date, item: item });
    });

    if (dotsEl) {
      newItems.forEach(function (_, i) {
        var dot = el("button", "news-hero__dot");
        dot.type = "button";
        dot.setAttribute("aria-label", String(i + 1));
        dot.addEventListener("click", function () {
          goSlide(i);
          restartSlides();
        });
        dotsEl.appendChild(dot);
        dotRefs.push(dot);
      });
    }
  }

  function goSlide(index) {
    var count = slideRefs.length;
    if (!count) return;
    slideIndex = (index + count) % count;
    slideRefs.forEach(function (ref, i) {
      ref.slide.classList.toggle("is-current", i === slideIndex);
      ref.slide.setAttribute("aria-hidden", String(i !== slideIndex));
      ref.slide.tabIndex = i === slideIndex ? 0 : -1;
    });
    dotRefs.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === slideIndex);
    });
  }

  function restartSlides() {
    window.clearInterval(slideTimer);
    if (slideRefs.length > 1 && !slidePaused) {
      slideTimer = window.setInterval(function () {
        goSlide(slideIndex + 1);
      }, AUTOPLAY_MS);
    }
  }

  function setSlidePaused(value) {
    slidePaused = value;
    restartSlides();
  }

  if (newRoot && slideRefs.length === 0) {
    buildSlides();
    if (slideRefs.length) {
      goSlide(0);
    }
    if (slideRefs.length <= 1) {
      newRoot.classList.add("is-single");
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goSlide(slideIndex - 1);
        restartSlides();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goSlide(slideIndex + 1);
        restartSlides();
      });
    }
    newRoot.addEventListener("mouseenter", function () { setSlidePaused(true); });
    newRoot.addEventListener("mouseleave", function () { setSlidePaused(false); });
    newRoot.addEventListener("focusin", function () { setSlidePaused(true); });
    newRoot.addEventListener("focusout", function () { setSlidePaused(false); });

    var touchX = null;
    if (viewportEl) {
      viewportEl.addEventListener("touchstart", function (e) {
        touchX = e.changedTouches[0].clientX;
      }, { passive: true });
      viewportEl.addEventListener("touchend", function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) return;
        goSlide(dx < 0 ? slideIndex + 1 : slideIndex - 1);
        restartSlides();
      });
    }
    restartSlides();
  }

  /* ------------------------------------------------------------------------
     ประกาศและข่าวสารทั่วไป: แถวเดียว 3 การ์ดต่อหน้า (จอเล็กลดลง) + ลูกศร
     ------------------------------------------------------------------------ */
  var rowEl = mount.querySelector("[data-news-row]");
  var rowPrev = mount.querySelector("[data-news-row-prev]");
  var rowNext = mount.querySelector("[data-news-row-next]");
  var rowPage = 0;

  function rowPer() {
    return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function renderRow() {
    var pages = Math.max(1, Math.ceil(listEl.children.length / rowPer()));
    if (rowPage > pages - 1) rowPage = pages - 1;
    if (rowPage < 0) rowPage = 0;
    listEl.style.setProperty("--per", rowPer());
    listEl.style.setProperty("--page", rowPage);
    if (rowPrev) rowPrev.disabled = rowPage === 0;
    if (rowNext) rowNext.disabled = rowPage >= pages - 1;
    if (rowEl) rowEl.classList.toggle("is-single", pages <= 1);
  }

  if (rowPrev) {
    rowPrev.addEventListener("click", function () {
      rowPage -= 1;
      renderRow();
    });
  }
  if (rowNext) {
    rowNext.addEventListener("click", function () {
      rowPage += 1;
      renderRow();
    });
  }
  window.addEventListener("resize", renderRow);
  renderRow();

  /* ------------------------------------------------------------------------
     Pop-up "ข่าวสารและประกาศทั้งหมด": ✕ / คลิกพื้นหลัง / Esc ปิดได้ ไม่รีเฟรชหน้า
     ------------------------------------------------------------------------ */
  var modalEl = document.querySelector("[data-news-modal]");
  var modalList = document.querySelector("[data-news-modal-list]");
  var openBtn = mount.querySelector("[data-news-open]");
  var lastFocus = null;

  function buildModal() {
    if (!modalList) return;
    var l = lang();
    modalList.innerHTML = "";
    NEWS.forEach(function (item) {
      var a = el("a", "news-modal__card");
      a.href = item.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      var media = el("span", "news-modal__media");
      var img = el("img");
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      var foot = el("span", "news-card__foot");
      foot.appendChild(el("span", "news-card__date", item.date[l]));
      foot.appendChild(el("span", "news-card__more", "อ่านต่อ →"));
      a.appendChild(media);
      a.appendChild(el("span", "news-card__chip", item.chip[l]));
      a.appendChild(el("span", "news-card__title", item.title[l]));
      a.appendChild(el("span", "news-card__desc", item.desc[l]));
      a.appendChild(foot);
      modalList.appendChild(a);
    });
  }

  function openModal() {
    if (!modalEl) return;
    buildModal();
    lastFocus = document.activeElement;
    modalEl.hidden = false;
    document.body.classList.add("news-modal-open");
    var closeBtn = modalEl.querySelector(".news-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.hidden = true;
    document.body.classList.remove("news-modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (modalEl) {
    modalEl.querySelectorAll("[data-news-modal-close]").forEach(function (node) {
      node.addEventListener("click", closeModal);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function applyLang() {
    var l = lang();

    NEWS.forEach(function (item, index) {
      var ref = cards[index];
      ref.chip.textContent = item.chip[l];
      ref.title.textContent = item.title[l];
      ref.desc.textContent = item.desc[l];
      ref.date.textContent = item.date[l];
      ref.sr.textContent = " (" + UI[l].open + ")";
    });

    slideRefs.forEach(function (ref) {
      ref.chip.textContent = ref.item.chip[l];
      ref.title.textContent = ref.item.title[l];
      ref.desc.textContent = ref.item.desc[l];
      ref.date.textContent = ref.item.date[l];
    });

    LINKS.forEach(function (item, index) {
      linkRefs[index].name.textContent = item.name[l];
    });
  }

  document.addEventListener("gu:languagechange", applyLang);
  applyLang();

  /* ------------------------------------------------------------------------
     แสดงผลเมื่อเลื่อนมาถึงส่วนข่าว
     ------------------------------------------------------------------------ */

  function reveal() {
    mounts.forEach(function (m) {
      m.classList.remove("is-armed", "is-in");
      m.classList.add("is-armed");
    });
    void mount.offsetWidth;
    mounts.forEach(function (m) {
      m.classList.add("is-in");
    });
  }

  function resetReveal() {
    mounts.forEach(function (m) {
      m.classList.remove("is-armed", "is-in");
    });
  }

  function inView() {
    var rect = mount.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
  }

  /* แต่ละส่วน (รายการข่าว / หน่วยงานอื่นๆ) ทำอนิเมชันของตัวเองเมื่อเข้าจอ */
  function inViewEl(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
  }

  function revealOne(el) {
    el.classList.remove("is-armed", "is-in");
    el.classList.add("is-armed");
    void el.offsetWidth;
    el.classList.add("is-in");
  }

  function resetOne(el) {
    el.classList.remove("is-armed", "is-in");
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var visible = false;

    function syncVisibility(nextVisible) {
      if (nextVisible === visible) {
        return;
      }
      visible = nextVisible;
      if (visible) {
        reveal();
      } else {
        resetReveal();
      }
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              revealOne(entry.target);
            } else {
              resetOne(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
      );
      mounts.forEach(function (m) {
        observer.observe(m);
      });
    } else {
      function checkVisibility() {
        mounts.forEach(function (m) {
          if (inViewEl(m)) {
            revealOne(m);
          } else {
            resetOne(m);
          }
        });
      }
      window.addEventListener("scroll", checkVisibility, { passive: true });
      window.addEventListener("resize", checkVisibility);
      checkVisibility();
    }
  }
})();
