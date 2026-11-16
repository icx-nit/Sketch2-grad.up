/* ==========================================================================
   i18n.js
   - แปลข้อความจริงทั้งหน้าเว็บด้วย data-i18n attributes
   - จำภาษาที่เลือกไว้ใน localStorage
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "gu-language";
  var DEFAULT_LANG = "th";

  var dictionary = {
    th: {
      "page.title": "มหาวิทยาลัยพะเยา | University of Phayao",
      "page.description":
        "เว็บไซต์มหาวิทยาลัยพะเยา ข่าว ประกาศ วารสาร และบริการสำหรับนักศึกษา",

      "a11y.skip": "ข้ามไปยังเนื้อหาหลัก",

      "action.search": "ค้นหา",
      "action.language": "เปลี่ยนภาษา",
      "action.theme": "สลับโหมดมืดและสว่าง",
      "action.menu": "เมนู",
      "action.fontGroup": "ขนาดตัวอักษร",
      "action.fontDecrease": "ลดขนาดตัวอักษร (A-)",
      "action.fontReset": "ขนาดตัวอักษรปกติ (A)",
      "action.fontIncrease": "เพิ่มขนาดตัวอักษร (A+)",

      "nav.label": "เมนูหลัก",
      "nav.home": "หน้าหลัก",
      "nav.announcements": "ประกาศมหาวิทยาลัยพะเยา",
      "nav.news": "ข่าว",
      "nav.journal": "วารสาร",
      "nav.contact": "ติดต่อเรา",

      "announce.regulations": "ระเบียบ • ข้อบังคับ • ประกาศ",
      "announce.calendar": "ปฏิทินการศึกษา",
      "announce.fees": "อัตราค่าธรรมเนียมการศึกษา",
      "announce.other": "ประกาศอื่นๆ",

      "journal.scopus": "รายชื่อวารสารในฐานข้อมูล Scopus/ISI/TCI/ERIC",

      "drawer.title": "เมนูเพิ่มเติม",
      "drawer.close": "ปิดเมนู",
      "drawer.satisfaction": "ประเมินความพึงพอใจ",
      "drawer.upmeeting": "UP-Meeting",
      "drawer.ithesis": "iThesis",
      "drawer.login": "เข้าสู่ระบบ",

      "search.label": "ค้นหาในเว็บไซต์",
      "search.placeholder": "ค้นหาในเว็บไซต์...",
      "search.submit": "ค้นหา",
      "search.close": "ปิดช่องค้นหา",

      "hero.title": "มหาวิทยาลัยพะเยา",
      "hero.tagline": "ก้าวสู่อนาคต...ไปด้วยกัน",

      "news.title": "ข่าวสารและประกาศ",
      "news.latest": "ข่าวล่าสุด",
      "news.all": "ดูข่าวทั้งหมด",
      "news.linksTitle": "ลิงก์ที่เกี่ยวข้อง",

      "calendar.title": "ปฏิทินกำหนดการสำคัญ",
      "calendar.previous": "เดือนก่อนหน้า",
      "calendar.next": "เดือนถัดไป",
      "calendar.today": "วันนี้",
      "calendar.prompt": "เลือกวันที่เพื่อดูรายละเอียดกำหนดการ",
      "calendar.back": "กลับไปปฏิทิน",
      "calendar.detailsKicker": "กำหนดการของวันที่เลือก",
      "calendar.emptyTitle": "ยังไม่มีข้อมูลกำหนดการ",
      "calendar.emptyDescription":
        "ขณะนี้ยังไม่มีข้อมูลกิจกรรมที่ยืนยันได้สำหรับวันที่นี้",
      "calendar.sourceNote":
        "กำหนดการและเอกสารจะแสดงเมื่อมีข้อมูลที่ยืนยันได้จากเว็บไซต์ทางการ",

      "stats.title": "สถิติการดำเนินงาน",
      "stats.applicants.label": "จำนวนผู้ยื่นคำร้อง บศ.1",
      "stats.people": "คน",
      "stats.previousTerm": "จากเทอมก่อน",
      "stats.total.label": "จำนวนคำร้องทั้งหมด",
      "stats.requests": "คำร้อง",
      "stats.previousSemester": "จากภาคที่ผ่านมา",
      "stats.completed.label": "จำนวนคำร้องที่ดำเนินการสำเร็จ",
      "stats.successRate": "อัตราความสำเร็จ",
      "stats.monthly.title": "สถิติการยื่นคำร้อง บศ.1 รายเดือน",
      "stats.monthly.period": "ภาคการศึกษาที่ 1/2569 (มิ.ย. - พ.ย. 2569)",
      "stats.monthly.requests": "จำนวน บศ.1",
      "stats.monthly.trend": "แนวโน้มเฉลี่ย",
      "stats.chart.legend": "คำอธิบายกราฟ",
      "stats.monthly.latest": "ล่าสุด 328 ราย",
      "stats.monthly.svgTitle": "จำนวนคำร้อง บศ.1 รายเดือน",
      "stats.monthly.svgDescription":
        "กราฟตั้งแต่เดือนมิถุนายนถึงพฤศจิกายน โดยพฤศจิกายนมีคำร้อง 328 ราย",
      "stats.monthly.note": "เดือนพฤศจิกายนมีผู้ยื่นคำร้อง บศ.1 สูงสุด 328 ราย",
      "stats.month.jun": "มิ.ย.",
      "stats.month.jul": "ก.ค.",
      "stats.month.aug": "ส.ค.",
      "stats.month.sep": "ก.ย.",
      "stats.month.oct": "ต.ค.",
      "stats.month.nov": "พ.ย.",
      "stats.status.title": "สัดส่วนสถานะคำร้องทั้งหมด",
      "stats.status.subtitle": "จำแนกตามขั้นตอนการดำเนินการในระบบ",
      "stats.status.total": "ทั้งหมด",
      "stats.status.completed": "ดำเนินการสำเร็จ",
      "stats.status.review": "อยู่ระหว่างตรวจสอบ",
      "stats.status.documents": "รอนิสิตแก้ไข/เอกสารเพิ่ม",
      "stats.status.accessible":
        "สถานะคำร้อง: สำเร็จ 3,290 ราย อยู่ระหว่างตรวจสอบ 198 ราย และรอเอกสาร 72 ราย",
      "stats.status.note":
        "คำร้องที่อยู่ระหว่างดำเนินการจะได้รับการอนุมัติภายใน 3-5 วันทำการ",

      "support.eyebrow": "บัณฑิตวิทยาลัย · มหาวิทยาลัยพะเยา",
      "support.heroTitle": "พร้อมให้บริการ ทำงานเป็นทีม ยิ้มแย้มแจ่มใส ใส่ใจคุณภาพ",
      "support.services": "บริการของเรา",
      "support.openSystem": "เปิดระบบ",
      "support.serviceRequest": "คำร้องออนไลน์",
      "support.serviceRequestDesc":
        "การยื่นเอกสารคำร้อง และสามารถตรวจสอบได้อย่างรวดเร็ว",
      "support.serviceInfo": "ข้อมูลสารสนเทศ",
      "support.serviceInfoDesc": "ข้อมูลบัณฑิตศึกษาของมหาวิทยาลัยพะเยา",
      "support.agencies": "หน่วยงานที่เกี่ยวข้อง",
      "support.agencyMua": "สำนักงานคณะกรรมการการอุดมศึกษา",
      "support.agencyUp": "มหาวิทยาลัยพะเยา",
      "support.agencyDoes": "กองบริการการศึกษา",
      "support.contactTitle": "ติดต่อเรา",
      "support.addressLabel": "ที่อยู่",
      "support.addressOrg": "กองบริการการศึกษา มหาวิทยาลัยพะเยา",
      "support.address":
        "เลขที่ 19 หมู่ที่ 2 ตำบลแม่กา อำเภอเมืองพะเยา จังหวัดพะเยา 56000",
      "support.phoneLabel": "โทรศัพท์",
      "support.phone": "054-466-666 ต่อ 1831, 1832",
      "support.emailLabel": "อีเมล",
      "support.visitors": "จำนวนผู้เข้าชม",
      "support.updated": "อัปเดตล่าสุด",

      "section.announceTitle": "ประกาศ",
      "section.appointment": "คำสั่งแต่งตั้งอาจารย์บัณฑิตศึกษา",
      "section.forms": "แบบฟอร์ม",
      "section.manual": "คู่มือบัณฑิตศึกษา",
      "section.grant": "ทุนอุดหนุนการทำวิทยานิพนธ์",
      "section.exams": "การสอบต่าง ๆ"
    },

    en: {
      "page.title": "University of Phayao",
      "page.description":
        "University of Phayao website: news, announcements, journals and student services",

      "a11y.skip": "Skip to main content",

      "action.search": "Search",
      "action.language": "Change language",
      "action.theme": "Toggle dark mode",
      "action.menu": "Menu",
      "action.fontGroup": "Text size",
      "action.fontDecrease": "Decrease text size (A-)",
      "action.fontReset": "Reset text size (A)",
      "action.fontIncrease": "Increase text size (A+)",

      "nav.label": "Main navigation",
      "nav.home": "Home",
      "nav.announcements": "Announcements",
      "nav.news": "News",
      "nav.journal": "Journals",
      "nav.contact": "Contact Us",

      "announce.regulations": "Regulations • Rules • Announcements",
      "announce.calendar": "Academic Calendar",
      "announce.fees": "Tuition Fees",
      "announce.other": "Other Announcements",

      "journal.scopus": "Journals indexed in Scopus/ISI/TCI/ERIC",

      "drawer.title": "More",
      "drawer.close": "Close menu",
      "drawer.satisfaction": "Satisfaction Survey",
      "drawer.upmeeting": "UP-Meeting",
      "drawer.ithesis": "iThesis",
      "drawer.login": "Sign in",

      "search.label": "Search the website",
      "search.placeholder": "Search the website...",
      "search.submit": "Search",
      "search.close": "Close search",

      "hero.title": "University of Phayao",
      "hero.tagline": "Step into the future... together",

      "news.title": "News & Announcements",
      "news.latest": "Latest news",
      "news.all": "View all news",
      "news.linksTitle": "Related links",

      "calendar.title": "Important dates",
      "calendar.previous": "Previous month",
      "calendar.next": "Next month",
      "calendar.today": "Today",
      "calendar.prompt": "Select a date to view its schedule",
      "calendar.back": "Back to calendar",
      "calendar.detailsKicker": "Schedule for selected date",
      "calendar.emptyTitle": "No verified schedule yet",
      "calendar.emptyDescription":
        "There is no verified event information for this date yet.",
      "calendar.sourceNote":
        "Events and documents will appear when verified information is available from the official website.",

      "stats.title": "Graduate application statistics",
      "stats.applicants.label": "Form บศ.1 applicants",
      "stats.people": "people",
      "stats.previousTerm": "from previous term",
      "stats.total.label": "Total applications",
      "stats.requests": "applications",
      "stats.previousSemester": "from previous semester",
      "stats.completed.label": "Applications completed",
      "stats.successRate": "success rate",
      "stats.monthly.title": "Monthly Form บศ.1 applications",
      "stats.monthly.period": "Semester 1/2026 (Jun - Nov 2026)",
      "stats.monthly.requests": "Form บศ.1 applications",
      "stats.monthly.trend": "Average trend",
      "stats.chart.legend": "Chart legend",
      "stats.monthly.latest": "Latest: 328 applications",
      "stats.monthly.svgTitle": "Monthly Form บศ.1 applications",
      "stats.monthly.svgDescription":
        "Chart from June through November, with 328 applications in November.",
      "stats.monthly.note": "November had the highest number of Form บศ.1 applications: 328.",
      "stats.month.jun": "Jun",
      "stats.month.jul": "Jul",
      "stats.month.aug": "Aug",
      "stats.month.sep": "Sep",
      "stats.month.oct": "Oct",
      "stats.month.nov": "Nov",
      "stats.status.title": "Application status breakdown",
      "stats.status.subtitle": "By current processing stage",
      "stats.status.total": "Total",
      "stats.status.completed": "Completed",
      "stats.status.review": "Under review",
      "stats.status.documents": "Awaiting student updates/documents",
      "stats.status.accessible":
        "Application status: 3,290 completed, 198 under review, and 72 awaiting documents.",
      "stats.status.note":
        "Applications in progress are expected to be approved within 3-5 business days.",

      "support.eyebrow": "Graduate School · University of Phayao",
      "support.heroTitle":
        "Ready to serve, working as a team, always smiling, committed to quality",
      "support.services": "Our services",
      "support.openSystem": "Open system",
      "support.serviceRequest": "Online requests",
      "support.serviceRequestDesc":
        "Submit request documents and track their status in real time.",
      "support.serviceInfo": "Information",
      "support.serviceInfoDesc":
        "Graduate studies information of the University of Phayao.",
      "support.agencies": "Related agencies",
      "support.agencyMua": "Office of the Higher Education Commission",
      "support.agencyUp": "University of Phayao",
      "support.agencyDoes": "Division of Educational Services",
      "support.contactTitle": "Contact us",
      "support.addressLabel": "Address",
      "support.addressOrg": "Division of Educational Services, University of Phayao",
      "support.address": "19 Moo 2, Mae Ka, Mueang Phayao, Phayao 56000, Thailand",
      "support.phoneLabel": "Phone",
      "support.phone": "054-466-666 ext. 1831, 1832",
      "support.emailLabel": "Email",
      "support.visitors": "Visitors",
      "support.updated": "Last updated",

      "section.announceTitle": "Announcements",
      "section.appointment": "Graduate Faculty Appointment Orders",
      "section.forms": "Forms",
      "section.manual": "Graduate Studies Handbook",
      "section.grant": "Thesis Support Grants",
      "section.exams": "Examinations"
    }
  };

  function readLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === "th" || saved === "en" ? saved : DEFAULT_LANG;
    } catch (error) {
      return DEFAULT_LANG;
    }
  }

  function translate(lang, key) {
    if (dictionary[lang] && dictionary[lang][key]) {
      return dictionary[lang][key];
    }
    if (dictionary[DEFAULT_LANG][key]) {
      return dictionary[DEFAULT_LANG][key];
    }
    return key;
  }

  function getLang() {
    return document.documentElement.getAttribute("data-lang") === "en"
      ? "en"
      : "th";
  }

  function apply(lang) {
    var next = lang === "en" ? "en" : "th";

    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("data-lang", next);

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n]"),
      function (element) {
        element.textContent = translate(next, element.getAttribute("data-i18n"));
      }
    );

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n-aria-label]"),
      function (element) {
        element.setAttribute(
          "aria-label",
          translate(next, element.getAttribute("data-i18n-aria-label"))
        );
      }
    );

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n-placeholder]"),
      function (element) {
        element.setAttribute(
          "placeholder",
          translate(next, element.getAttribute("data-i18n-placeholder"))
        );
      }
    );

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-i18n-title]"),
      function (element) {
        element.setAttribute(
          "title",
          translate(next, element.getAttribute("data-i18n-title"))
        );
      }
    );

    var badge = document.querySelector("[data-lang-badge]");
    if (badge) {
      badge.textContent = next === "th" ? "TH" : "EN";
      badge.setAttribute("lang", next);
    }

    document.title = translate(next, "page.title");
    var description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", translate(next, "page.description"));
    }

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* ไม่สามารถบันทึกได้ – ยังใช้งานได้ในรอบนี้ */
    }

    document.dispatchEvent(
      new CustomEvent("gu:languagechange", { detail: { lang: next } })
    );
  }

  function setLang(lang) {
    apply(lang);
  }

  function toggle() {
    apply(getLang() === "th" ? "en" : "th");
  }

  window.GUI18n = {
    apply: apply,
    setLang: setLang,
    toggle: toggle,
    getLang: getLang,
    stored: readLang,
    translate: translate
  };
})();
