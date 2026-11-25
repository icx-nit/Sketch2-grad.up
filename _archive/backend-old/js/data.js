/* ==========================================================================
   data.js: ข้อมูลตัวอย่าง (MOCK) ของ Dashboard ต้นแบบ UI
   --------------------------------------------------------------------------
   - ข่าว ลิงก์ และปฏิทิน คัดจากข้อมูลที่มีอยู่ในโปรเจกต์ (news.js, calendar.js)
   - ป๊อปอัป ชื่อเอกสารบางรายการ และหมวดหมู่ เป็นข้อมูลตัวอย่างที่ทีมเขียนขึ้น
   - เก็บในหน่วยความจำของหน้า รีเฟรชแล้วกลับเป็นค่าเริ่มต้น ไม่บันทึกลงเบราว์เซอร์
   - ห้ามนำไปใช้เป็นข้อมูลจริงใน Production
   ========================================================================== */
(function () {
  "use strict";

  window.GUBD = window.GUBD || {};

  var NEWS = [
    { id: "n1", titleTh: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาปลาย ปีการศึกษา 2569 (ครั้งที่ 1)", titleEn: "Qualifying Examination registration for doctoral students, late semester 2026 (round 1)", descTh: "เปิดรับสมัครสอบวัดคุณสมบัติ ดูรายละเอียดและสมัครที่ reg.up.ac.th", descEn: "Register for the qualifying examination at reg.up.ac.th", chip: "ประกาศสอบ", date: "2026-11-16", href: "https://www.facebook.com/photo?fbid=1446055740977843&set=a.415970597319701", image: "../assets/images/news/news-1.jpg", isNew: true, visible: true },
    { id: "n2", titleTh: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting", titleEn: "iThesis NexGen training via Zoom Cloud Meeting", descTh: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านการประชุมออนไลน์", descEn: "Online training on using the iThesis NexGen system", chip: "อบรม", date: "2026-04-08", href: "https://www.facebook.com/story.php?story_fbid=1463767892205499&id=100057169071688&mibextid=wwXIfr&rdid=fc9YBTei6y16ktV5#", image: "../assets/images/news/news-2.jpg", isNew: true, visible: true },
    { id: "n3", titleTh: "กำหนดการสมัครสอบวัดคุณสมบัติ สำหรับนิสิตปริญญาเอก ภาคฤดูร้อน ปีการศึกษา 2568", titleEn: "Qualifying Examination registration schedule, summer semester 2025", descTh: "ประกาศกำหนดการสมัครสอบวัดคุณสมบัติ สมัครได้ที่ www.reg.up.ac.th", descEn: "Registration schedule, apply at www.reg.up.ac.th", chip: "ประกาศสอบ", date: "2026-03-27", href: "https://grad.up.ac.th/uploads/news/69c5ff82d7866.jpg", image: "../assets/images/news/news-3.jpg", isNew: false, visible: true },
    { id: "n4", titleTh: "แจ้งปิดปรับปรุงระบบ iThesis ระหว่างวันที่ 25–31 มีนาคม 2569", titleEn: "iThesis maintenance: 25–31 March 2026", descTh: "ระบบ iThesis ปิดปรับปรุงช่วงวันที่ 25–31 มีนาคม 2569 ทำให้ใช้งานไม่ได้ชั่วคราว", descEn: "The iThesis system is offline for maintenance", chip: "แจ้งปิดระบบ", date: "2026-03-16", href: "https://grad.up.ac.th/uploads/news/69b78aaea6c19.jpg", image: "../assets/images/news/news-4.jpg", isNew: false, visible: true },
    { id: "n5", titleTh: "กำหนดการสมัครสอบประมวลความรู้ ปริญญาโท แผน ข หรือแผน 2", titleEn: "Comprehensive examination registration schedule, Master's Plan B (Plan 2)", descTh: "ประกาศกำหนดการสมัครสอบประมวลความรู้ สมัครได้ที่ www.reg.up.ac.th", descEn: "Registration schedule, apply at www.reg.up.ac.th", chip: "ประกาศสอบ", date: "2026-02-20", href: "https://grad.up.ac.th/uploads/news/6997be0141c61.jpg", image: "../assets/images/news/news-5.jpg", isNew: false, visible: true },
    { id: "n6", titleTh: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาปลาย ปีการศึกษา 2568 (ครั้งที่ 2)", titleEn: "Qualifying Examination registration for doctoral students, late semester 2025 (round 2)", descTh: "เปิดรับสมัครสอบวัดคุณสมบัติ (ครั้งที่ 2) สมัครได้ที่ reg.up.ac.th", descEn: "Register for round 2 at reg.up.ac.th", chip: "ประกาศสอบ", date: "2026-01-12", href: "https://grad.up.ac.th/uploads/news/6964515ce3149.jpg", image: "../assets/images/news/news-6.jpg", isNew: false, visible: true }
  ];

  var POPUPS = [
    { id: "p1", titleTh: "การสมัครสอบวัดคุณสมบัติ สำหรับนิสิตระดับปริญญาเอก ภาคการศึกษาต้น ปีการศึกษา 2569 (ครั้งที่ 2)", titleEn: "Qualifying Examination registration for doctoral students, semester 1/2026 (2nd round)", type: "ประกาศสอบ", date: "2026-08-24", href: "https://www.facebook.com/share/19RZRpB9uU/", order: 1, visible: true },
    { id: "p2", titleTh: "โครงการฝึกอบรมการใช้งานระบบ iThesis NexGen ผ่านสื่ออิเล็กทรอนิกส์จากระบบ Zoom Cloud Meeting", titleEn: "iThesis NexGen training via Zoom Cloud Meeting", type: "อบรม", date: "2026-04-08", href: "", order: 2, visible: true },
    { id: "p3", titleTh: "แจ้งปิดปรับปรุงระบบ iThesis ระหว่างวันที่ 25–31 มีนาคม 2569", titleEn: "iThesis maintenance: 25–31 March 2026", type: "แจ้งปิดระบบ", date: "2026-03-16", href: "", order: 3, visible: true }
  ];

  var DOCS = [
    { id: "d1", titleTh: "คู่มือสารนิพนธ์ มหาวิทยาลัยพะเยา พ.ศ. 2567", titleEn: "Graduate Study Guidebook, University of Phayao, B.E. 2567", category: "คู่มือสารนิพนธ์", ext: "pdf", date: "2024-09-19", visible: true },
    { id: "d2", titleTh: "เกณฑ์การสอบผ่านความรู้ภาษาอังกฤษของนิสิตระดับบัณฑิตศึกษา", titleEn: "Criteria for passing the English proficiency test for graduate students", category: "ขั้นตอนการศึกษา", ext: "pdf", date: "2024-09-19", visible: true },
    { id: "d3", titleTh: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ข หรือแผน 2", titleEn: "Procedures for Master's Degree student Plan B or Plan 2", category: "ขั้นตอนการศึกษา", ext: "pdf", date: "2024-09-19", visible: true },
    { id: "d4", titleTh: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาโท แผน ก หรือแผน 1", titleEn: "Procedures for Master's Degree student Plan A or Plan 1", category: "ขั้นตอนการศึกษา", ext: "pdf", date: "2024-09-19", visible: true },
    { id: "d5", titleTh: "ขั้นตอนการศึกษาของนิสิตระดับปริญญาเอก", titleEn: "Doctoral Student's Study Process", category: "ขั้นตอนการศึกษา", ext: "pdf", date: "2024-09-19", visible: true },
    { id: "d6", titleTh: "คู่มือการยื่นคำร้องแต่งตั้งอาจารย์บัณฑิตศึกษา", titleEn: "Guidelines for requesting appointment of graduate faculty members", category: "คู่มือยื่นคำร้อง", ext: "pdf", date: "2026-05-06", visible: true },
    { id: "d7", titleTh: "คู่มือการยื่นคำร้องแต่งตั้งอาจารย์พิเศษบัณฑิตศึกษา", titleEn: "Guidelines for requesting appointment of special graduate faculty members", category: "คู่มือยื่นคำร้อง", ext: "pdf", date: "2026-05-06", visible: false }
  ];

  var LINKS = [
    { id: "l1", nameTh: "มหาวิทยาลัยพะเยา", nameEn: "University of Phayao", group: "หน่วยงานอื่น", href: "https://up.ac.th", visible: true },
    { id: "l2", nameTh: "กองบริการการศึกษา", nameEn: "Academic Services Division", group: "หน่วยงานอื่น", href: "https://does.up.ac.th", visible: true },
    { id: "l3", nameTh: "ระบบบริการการศึกษา (REG)", nameEn: "Academic Services System", group: "ระบบอื่นๆ", href: "https://reg.up.ac.th", visible: true },
    { id: "l4", nameTh: "การรับสมัครบุคคลเข้าศึกษา", nameEn: "Admissions", group: "ระบบอื่นๆ", href: "https://admission.up.ac.th", visible: true },
    { id: "l5", nameTh: "ระบบฐานข้อมูลหลักสูตร (TQF Online)", nameEn: "TQF Online", group: "ระบบอื่นๆ", href: "https://tqf.up.ac.th", visible: true },
    { id: "l6", nameTh: "ระบบบริหารจัดการวิทยานิพนธ์ (iThesis)", nameEn: "iThesis", group: "ระบบอื่นๆ", href: "https://app.ithesis.co/", visible: true },
    { id: "l7", nameTh: "ระบบบริหารจัดการสหกิจศึกษา", nameEn: "Cooperative Education System", group: "ระบบอื่นๆ", href: "https://coop.up.ac.th", visible: true },
    { id: "l8", nameTh: "สำนักงานคณะกรรมการการอุดมศึกษา", nameEn: "Office of the Higher Education Commission", group: "หน่วยงานอื่น", href: "https://www.mua.go.th/index2.html", visible: true }
  ];

  var CATEGORIES = [
    { id: "c1", nameTh: "การสอบต่าง ๆ", nameEn: "Other examinations", page: "การสอบต่าง ๆ", visible: true },
    { id: "c2", nameTh: "วิทยานิพนธ์", nameEn: "Thesis", page: "ทุนอุดหนุนการทำวิทยานิพนธ์", visible: true },
    { id: "c3", nameTh: "การค้นคว้าด้วยตนเอง", nameEn: "Self-directed research", page: "ทุนอุดหนุนการทำวิทยานิพนธ์", visible: true },
    { id: "c4", nameTh: "ทุนอุดหนุนการทำวิทยานิพนธ์", nameEn: "Thesis research grant", page: "ทุนอุดหนุนการทำวิทยานิพนธ์", visible: true },
    { id: "c5", nameTh: "สัญญาลิขสิทธิ์", nameEn: "Copyright agreement", page: "ทุนอุดหนุนการทำวิทยานิพนธ์", visible: true },
    { id: "c6", nameTh: "คู่มือสารนิพนธ์", nameEn: "Thesis Guidebook", page: "คู่มือบัณฑิตศึกษา", visible: true },
    { id: "c7", nameTh: "ขั้นตอนการศึกษา", nameEn: "Study Steps", page: "คู่มือบัณฑิตศึกษา", visible: true },
    { id: "c8", nameTh: "คู่มือยื่นคำร้อง", nameEn: "Petition Guidelines", page: "คู่มือบัณฑิตศึกษา", visible: true },
    { id: "c9", nameTh: "ประกาศอื่น ๆ", nameEn: "Other Announcements", page: "ประกาศอื่น ๆ", visible: true }
  ];

  var OPTIONS = {
    newsChips: ["ประกาศสอบ", "อบรม", "แจ้งปิดระบบ", "ทั่วไป"],
    docExt: ["pdf", "docx", "xlsx"],
    linkGroups: ["หน่วยงานอื่น", "ระบบอื่นๆ", "ฐานข้อมูล"],
    calLabels: ["ลงทะเบียน", "คำร้อง", "การสอบ", "วิทยานิพนธ์", "พิจารณา", "ทุนอุดหนุน", "บศ.1", "อื่น ๆ"],
    catPages: ["การสอบต่าง ๆ", "ทุนอุดหนุนการทำวิทยานิพนธ์", "คู่มือบัณฑิตศึกษา", "ประกาศอื่น ๆ"],
    popupTypes: ["ประกาศสอบ", "อบรม", "แจ้งปิดระบบ", "กิจกรรม"],
    docCategories: function () { return CATEGORIES.map(function (c) { return c.nameTh; }); }
  };

  /* คืนสำเนาใหม่ทุกครั้ง เพื่อไม่ให้หน้าหนึ่งแก้ค่าของอีกหน้าโดยไม่ตั้งใจ */
  window.GUBD.options = OPTIONS;
  window.GUBD.getData = function (key) {
    var source = { news: NEWS, popups: POPUPS, documents: DOCS, links: LINKS, categories: CATEGORIES, calendar: window.GUBD.calendarSeed || [] };
    return source[key] ? JSON.parse(JSON.stringify(source[key])) : [];
  };
})();
