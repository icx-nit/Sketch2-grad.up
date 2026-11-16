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

  var mount = document.querySelector("[data-news]");
  if (!mount) {
    return;
  }

  var listEl = mount.querySelector("[data-news-list]");
  var linksEl = mount.querySelector("[data-news-links]");

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

  var NEWS = [
    {
      image: "assets/images/news-1.jpg",
      href: "https://www.facebook.com/share/19RZRpB9uU/",
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: {
        th: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาต้น ปีการศึกษา 2569 (ครั้งที่ 2)",
        en: "Qualifying Examination registration for doctoral students, semester 1/2026 (2nd round)"
      },
      date: { th: "24 ส.ค. 2569", en: "24 Aug 2026" }
    },
    {
      image: "assets/images/news-2.jpg",
      href: "https://www.facebook.com/story.php?story_fbid=1463767892205499&id=100057169071688",
      chip: { th: "อบรม", en: "Training" },
      title: {
        th: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting",
        en: "iThesis NexGen training via Zoom Cloud Meeting"
      },
      date: { th: "8 เม.ย. 2569", en: "8 Apr 2026" }
    },
    {
      image: "assets/images/news-3.jpg",
      href: "https://grad.up.ac.th/uploads/news/69c5ff82d7866.jpg",
      chip: { th: "ประกาศสอบ", en: "Exam notice" },
      title: {
        th: "กำหนดการสมัครสอบวัดคุณสมบัติ สำหรับนิสิตปริญญาเอก ภาคฤดูร้อน ปีการศึกษา 2568",
        en: "Qualifying Examination schedule for doctoral students, summer semester 2025"
      },
      date: { th: "27 มี.ค. 2569", en: "27 Mar 2026" }
    },
    {
      image: "assets/images/news-4.jpg",
      href: "https://grad.up.ac.th/uploads/news/69b78aaea6c19.jpg",
      chip: { th: "แจ้งปิดระบบ", en: "System notice" },
      title: {
        th: "แจ้งปิดปรับปรุงระบบ iThesis ระหว่างวันที่ 25–31 มีนาคม 2569",
        en: "iThesis maintenance: 25–31 March 2026"
      },
      date: { th: "16 มี.ค. 2569", en: "16 Mar 2026" }
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
    var date = el("span", "news-card__date");
    var sr = el("span", "visually-hidden");

    card.appendChild(media);
    card.appendChild(chip);
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(sr);
    listEl.appendChild(card);

    return { card: card, chip: chip, title: title, date: date, sr: sr };
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

  function applyLang() {
    var l = lang();

    NEWS.forEach(function (item, index) {
      var ref = cards[index];
      ref.chip.textContent = item.chip[l];
      ref.title.textContent = item.title[l];
      ref.date.textContent = item.date[l];
      ref.sr.textContent = " (" + UI[l].open + ")";
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
    mount.classList.remove("is-armed", "is-in");
    mount.classList.add("is-armed");
    void mount.offsetWidth;
    mount.classList.add("is-in");
  }

  function resetReveal() {
    mount.classList.remove("is-armed", "is-in");
  }

  function inView() {
    var rect = mount.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
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
            syncVisibility(entry.isIntersecting);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
      );
      observer.observe(mount);
    } else {
      function checkVisibility() {
        syncVisibility(inView());
      }
      window.addEventListener("scroll", checkVisibility, { passive: true });
      window.addEventListener("resize", checkVisibility);
      checkVisibility();
    }
  }
})();
