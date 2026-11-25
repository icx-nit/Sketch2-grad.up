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
      "nav.announcements": "ข้อบังคับ / ประกาศ",
      "nav.news": "ข่าว",
      "nav.journal": "ฐานข้อมูล",
      "nav.contact": "ติดต่อเรา",
      "nav.systems": "ระบบอื่นๆ",
      "nav.agencies": "หน่วยงานอื่นๆ",
      "foot.desc": "ศูนย์บริการและส่งเสริมการศึกษา มหาวิทยาลัยพะเยา มุ่งมั่นพัฒนาการให้บริการด้วย ระบบดิจิทัลที่ทันสมัย สะดวก รวดเร็ว และตรวจสอบได้",
      "foot.hoursMain": "เวลาทำการ 08:30 - 16:30 น.",
      "foot.hoursNote": "(ยกเว้น : วันหยุดราชการ)",

      "announce.regulations": "ระเบียบ • ข้อบังคับ • ประกาศ",
      "announce.calendar": "ปฏิทินการศึกษา",
      "announce.fees": "อัตราค่าธรรมเนียมการศึกษา",
      "announce.other": "ประกาศอื่นๆ",

      "journal.scopus": "รายชื่อวารสารในฐานข้อมูล Scopus/ISI/TCI/ERIC",
      "db.scopus.desc": "ฐานข้อมูลบทคัดย่อและการอ้างอิงของวารสารวิชาการที่ผ่านการพิจารณาโดยผู้ทรงคุณวุฒิ",
      "db.isi.desc": "ฐานข้อมูลการอ้างอิงและค้นหางานวิจัยของ Clarivate",
      "db.tci.desc": "รายชื่อวารสารวิชาการไทยที่ได้รับการรับรองจากศูนย์ TCI",
      "db.eric.desc": "ห้องสมุดออนไลน์ด้านงานวิจัยและข้อมูลทางการศึกษา",
      "db.pubmed.desc": "ฐานข้อมูลงานวิจัยด้านชีวการแพทย์และวิทยาศาสตร์สุขภาพ (MEDLINE)",
      "db.pubmed.enter": "เข้าสู่ PubMed",
      "db.pubmed.enterDesc": "ค้นหาบทความวิจัยทางการแพทย์และสุขภาพ",
      "db.pubmed.faq": "คำถามที่พบบ่อย (FAQ)",
      "db.pubmed.faqDesc": "วิธีค้นหาและตรวจสอบวารสารที่อยู่ใน MEDLINE",
      "db.wos.desc": "ค้นหาวารสารที่เหมาะกับงานวิจัย จากหลายดัชนีบนแพลตฟอร์ม Web of Science",
      "db.predatory.title": "รายชื่อสำนักพิมพ์/วารสารที่ควรระมัดระวังในการตีพิมพ์",
      "db.predatory.desc": "รายชื่อที่จัดทำโดย Scholarly Open Access (เก็บถาวรจาก Web Archive)",

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
      "search.results": "ผลการค้นหา",
      "search.resultsCount": "พบ {n} รายการ สำหรับ “{q}”",
      "search.resultsCountOne": "พบ 1 รายการ สำหรับ “{q}”",
      "search.noResults": "ไม่พบผลลัพธ์สำหรับ “{q}” ลองค้นหาคำอื่น",
      "search.onPage": "ในหน้านี้",
      "search.external": "ลิงก์ภายนอก",

      "hero.title": "มหาวิทยาลัยพะเยา",
      "hero.tagline": "ก้าวสู่อนาคต...ไปด้วยกัน",

      "news.title": "ข่าวสารและประกาศ",
      "news.latest": "ข่าวล่าสุด",
      "news.all": "ดูข่าวทั้งหมด",
      "news.linksTitle": "หน่วยงานอื่นๆ",

      "calendar.title": "ปฏิทินกำหนดการสำคัญ",
      "calendar.previous": "เดือนก่อนหน้า",
      "calendar.next": "เดือนถัดไป",
      "calendar.today": "วันนี้",
      "calendar.prompt": "เลือกวันที่เพื่อดูรายละเอียดกำหนดการ",
      "calendar.noEventsMonth": "เดือนนี้ไม่มีกิจกรรมสำคัญของงานทะเบียนและบัณฑิตศึกษา",
      "calendar.back": "กลับไปปฏิทิน",
      "calendar.detailsKicker": "กำหนดการของวันที่เลือก",
      "calendar.emptyTitle": "ยังไม่มีข้อมูลกำหนดการ",
      "calendar.emptyDescription":
        "ขณะนี้ยังไม่มีข้อมูลกิจกรรมที่ยืนยันได้สำหรับวันที่นี้",
      "calendar.staffManage": "จัดการกำหนดการ (เจ้าหน้าที่)",
      "calendar.staffModalTitle": "จัดการกำหนดการปฏิทินการศึกษา (สำหรับเจ้าหน้าที่)",
      "calendar.sourceNote":
        "ข้อมูลจากประกาศปฏิทินการศึกษาบัณฑิตศึกษา ปีการศึกษา 2569 (reg.up.ac.th) และประกาศ/ข่าวของบัณฑิตวิทยาลัย (grad.up.ac.th) — ตรวจสอบกำหนดการล่าสุดได้ที่ grad.up.ac.th",

      "stats.title": "ภาพรวมสถิติ",
      "stats.applicants.label": "จำนวนผู้ยื่นคำร้อง บศ.1",
      "stats.people": "คน",
      "stats.previousTerm": "จากปีการศึกษาก่อน",
      "stats.total.label": "จำนวนคำร้องทั้งหมด",
      "stats.requests": "คำร้อง",
      "stats.previousSemester": "จากปีการศึกษาก่อน",
      "stats.completed.label": "จำนวนคำร้องที่ดำเนินการสำเร็จ",
      "stats.successRate": "อัตราความสำเร็จ",
      "stats.monthly.title": "สถิติการยื่นคำร้อง บศ.1 รายเดือน",
      "stats.monthly.period": "ภาคการศึกษาที่ 1/2569 (มิ.ย. - พ.ย. 2569)",
      "stats.monthly.requests": "จำนวน บศ.1",
      "stats.monthly.trend": "ดำเนินการสำเร็จ",
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
      "stats.status.title": "สัดส่วนคำร้องที่ดำเนินการสำเร็จ",
      "stats.status.subtitle": "เทียบกับจำนวนคำร้องที่ยื่นทั้งหมด",
      "stats.status.total": "ทั้งหมด",
      "stats.status.completed": "ดำเนินการสำเร็จ",
      "stats.status.review": "อยู่ระหว่างตรวจสอบ",
      "stats.status.documents": "รอนิสิตแก้ไข/เอกสารเพิ่ม",
      "stats.status.accessible":
        "สถานะคำร้อง: สำเร็จ 3,290 ราย อยู่ระหว่างตรวจสอบ 198 ราย และรอเอกสาร 72 ราย",
      "stats.status.note":
        "คำร้องที่อยู่ระหว่างดำเนินการจะได้รับการอนุมัติภายใน 3-5 วันทำการ",

      "support.heroTitle": "พร้อมให้บริการ ทำงานเป็น⁠ทีม ยิ้มแย้มแจ่มใส ใส่ใจคุณภาพ",
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

      "footer.rights": "สงวนลิขสิทธิ์",
      "footer.designedBy": "ออกแบบโดย",
      "footer.logoSource": "และแหล่งที่มาของโลโก้โดย",
      "footer.admin": "ผู้ดูแลระบบ",
      "footer.cookies": "นโยบายคุกกี้",
      "footer.login": "เข้าสู่ระบบ",

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
      "nav.announcements": "Regulations / Announcements",
      "nav.news": "News",
      "nav.journal": "Databases",
      "nav.contact": "Contact Us",
      "nav.systems": "Other Systems",
      "nav.agencies": "Other Agencies",
      "foot.desc": "Graduate education support and service center, University of Phayao, committed to providing modern, convenient, fast, and verifiable digital services.",
      "foot.hoursMain": "Office hours 08:30 - 16:30",
      "foot.hoursNote": "(Excluding public holidays)",

      "announce.regulations": "Regulations • Rules • Announcements",
      "announce.calendar": "Academic Calendar",
      "announce.fees": "Tuition Fees",
      "announce.other": "Other Announcements",

      "journal.scopus": "Journals indexed in Scopus/ISI/TCI/ERIC",
      "db.scopus.desc": "Abstract and citation database of peer-reviewed academic literature",
      "db.isi.desc": "Citation indexing and research search database from Clarivate",
      "db.tci.desc": "List of Thai academic journals certified by the TCI Centre",
      "db.eric.desc": "Online library of education research and information",
      "db.pubmed.desc": "Database of biomedical and health sciences research (MEDLINE)",
      "db.pubmed.enter": "Go to PubMed",
      "db.pubmed.enterDesc": "Search medical and health research articles",
      "db.pubmed.faq": "Frequently Asked Questions (FAQ)",
      "db.pubmed.faqDesc": "How to search and verify journals indexed in MEDLINE",
      "db.wos.desc": "Find journals suited to your research across multiple indexes on the Web of Science platform",
      "db.predatory.title": "List of Publishers/Journals to Be Cautious About When Publishing",
      "db.predatory.desc": "List compiled by Scholarly Open Access (archived from Web Archive)",

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
      "search.results": "Search results",
      "search.resultsCount": "{n} results for “{q}”",
      "search.resultsCountOne": "1 result for “{q}”",
      "search.noResults": "No results for “{q}”. Try another keyword.",
      "search.onPage": "On this page",
      "search.external": "External link",

      "hero.title": "University of Phayao",
      "hero.tagline": "Step into the future... together",

      "news.title": "News & Announcements",
      "news.latest": "Latest news",
      "news.all": "View all news",
      "news.linksTitle": "Other Agencies",

      "calendar.title": "Important dates",
      "calendar.previous": "Previous month",
      "calendar.next": "Next month",
      "calendar.today": "Today",
      "calendar.prompt": "Select a date to view its schedule",
      "calendar.noEventsMonth": "No scheduled events for this month",
      "calendar.back": "Back to calendar",
      "calendar.detailsKicker": "Schedule for selected date",
      "calendar.emptyTitle": "No verified schedule yet",
      "calendar.emptyDescription":
        "There is no verified event information for this date yet.",
      "calendar.staffManage": "Manage schedule (Staff)",
      "calendar.staffModalTitle": "Manage Academic Calendar (Staff)",
      "calendar.sourceNote":
        "Data from the 2026 graduate academic calendar (reg.up.ac.th) and Graduate School announcements and news (grad.up.ac.th) — check the latest schedule at grad.up.ac.th",

      "stats.title": "Statistics Overview",
      "stats.applicants.label": "Form บศ.1 applicants",
      "stats.people": "people",
      "stats.previousTerm": "from last academic year",
      "stats.total.label": "Total applications",
      "stats.requests": "applications",
      "stats.previousSemester": "from last academic year",
      "stats.completed.label": "Applications completed",
      "stats.successRate": "success rate",
      "stats.monthly.title": "Monthly Form บศ.1 applications",
      "stats.monthly.period": "Semester 1/2026 (Jun - Nov 2026)",
      "stats.monthly.requests": "Form บศ.1 applications",
      "stats.monthly.trend": "Completed",
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
      "stats.status.title": "Completion Ratio",
      "stats.status.subtitle": "Compared with total submitted requests",
      "stats.status.total": "Total",
      "stats.status.completed": "Completed",
      "stats.status.review": "Under review",
      "stats.status.documents": "Awaiting student updates/documents",
      "stats.status.accessible":
        "Application status: 3,290 completed, 198 under review, and 72 awaiting documents.",
      "stats.status.note":
        "Applications in progress are expected to be approved within 3-5 business days.",

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

      "footer.rights": "All Rights Reserved",
      "footer.designedBy": "Designed by",
      "footer.logoSource": "and logo source by",
      "footer.admin": "Admin",
      "footer.cookies": "Cookie Policy",
      "footer.login": "Login",

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
