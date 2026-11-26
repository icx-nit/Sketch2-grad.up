/* ==========================================================================
   announce-form.js — หน้าแบบฟอร์มบัณฑิตศึกษา (ดีไซน์เดียวกับหน้าคำสั่งแต่งตั้ง)
   ข้อมูลจริงจากหน้า grad.up.ac.th/announce/form
   (categoriesId=1..4, หน้าที่ 1–2 ของหมวดวิทยานิพนธ์และการค้นคว้าด้วยตนเอง)
   ไฟล์เอกสารเก็บไว้ในโปรเจกต์ที่ uploads/forms เพื่อให้ดาวน์โหลด/ดูตัวอย่างได้จริง
   ========================================================================== */

(function () {
  "use strict";

  var PAGE_SIZE = 10;
  var SOURCE_URL = "https://grad.up.ac.th/announce/form";
  var FILE_BASE = "uploads/forms/";
  var PREVIEW_BASE = "uploads/forms/preview/";

  var CATEGORIES = [
    { id: 1, label: "วิทยานิพนธ์", en: "Thesis" },
    { id: 2, label: "การค้นคว้าด้วยตนเอง", en: "Self-directed research" },
    { id: 3, label: "ทุนอุดหนุนการทำวิทยานิพนธ์", en: "Thesis research grant" },
    { id: 4, label: "สัญญาลิขสิทธิ์", en: "Copyright agreement" }
  ];

  /* ข้อมูลจริงจากเว็บต้นทาง — ext ใช้เลือกปลายทางดาวน์โหลด
     (docx จะมีไฟล์ PDF แปลงไว้ที่ uploads/forms/preview สำหรับดูตัวอย่าง) */
  var FORMS = [
    { cat: 1, code: "บศ. 2", num: 2, title: "บศ. 2 แบบฟอร์มขออนุมัติแต่งตั้งคณะกรรมการที่ปรึกษาวิทยานิพนธ์", en: "GS. 2 Application for appointment of thesis advisory committee", codeEn: "GS. 2", label: "21 ก.ค. 2563", date: "2020-07-21", views: 313, ext: "pdf", file: "ann-71.pdf" },
    { cat: 1, code: "บศ. 3", num: 3, title: "บศ. 3 แบบฟอร์มขออนุมัติเปลี่ยนแปลงคณะกรรมการที่ปรึกษาวิทยานิพนธ์", en: "GS. 3 Application for change of thesis advisory committee", codeEn: "GS. 3", label: "21 ก.ค. 2563", date: "2020-07-21", views: 26, ext: "pdf", file: "ann-72.pdf" },
    { cat: 1, code: "บศ. 4", num: 4, title: "บศ. 4 แบบฟอร์มขออนุมัติเปลี่ยนแปลงชื่อเรื่องวิทยานิพนธ์", en: "GS. 4 Application for change of thesis title", codeEn: "GS. 4", label: "21 ก.ค. 2563", date: "2020-07-21", views: 90, ext: "pdf", file: "ann-73.pdf" },
    { cat: 1, code: "บศ. 5", num: 5, title: "บศ. 5 แบบฟอร์มขอรับการพิจารณาโครงร่างวิทยานิพนธ์", en: "GS. 5 Request for review of thesis proposal", codeEn: "GS. 5", label: "21 ก.ค. 2563", date: "2020-07-21", views: 310, ext: "pdf", file: "ann-74.pdf" },
    { cat: 1, code: "บศ. 6", num: 6, title: "บศ. 6 แบบฟอร์มขออนุมัติสมัครสอบโครงร่างวิทยานิพนธ์", en: "GS. 6 Application for thesis proposal defense", codeEn: "GS. 6", label: "21 ก.ค. 2563", date: "2020-07-21", views: 234, ext: "pdf", file: "ann-75.pdf" },
    { cat: 1, code: "บศ. 7", num: 7, title: "บศ. 7 แบบฟอร์มอนุมัติผลการพิจารณาโครงร่างวิทยานิพนธ์", en: "GS. 7 Approval of thesis proposal review results", codeEn: "GS. 7", label: "21 ก.ค. 2563", date: "2020-07-21", views: 211, ext: "pdf", file: "ann-76.pdf" },
    { cat: 1, code: "บศ. 8", num: 8, title: "บศ. 8 แบบฟอร์มขอให้ออกหนังสือถึงผู้เชี่ยวชาญ เพื่อตรวจแก้ไขเครื่องมือที่ใช้ในการวิจัย", en: "GS. 8 Request for letter to experts to review research instruments", codeEn: "GS. 8", label: "21 ก.ค. 2563", date: "2020-07-21", views: 60, ext: "pdf", file: "ann-77.pdf" },
    { cat: 1, code: "บศ. 9", num: 9, title: "บศ. 9 แบบฟอร์มขอให้ออกหนังสือเพื่อขอความร่วมมือเก็บข้อมูลเพื่อการวิจัย", en: "GS. 9 Request for letter seeking cooperation in research data collection", codeEn: "GS. 9", label: "21 ก.ค. 2563", date: "2020-07-21", views: 66, ext: "pdf", file: "ann-78.pdf" },
    { cat: 1, code: "บศ. 10", num: 10, title: "บศ. 10 แบบฟอร์มขออนุมัติสมัครสอบวิทยานิพนธ์", en: "GS. 10 Application for thesis defense", codeEn: "GS. 10", label: "21 ก.ค. 2563", date: "2020-07-21", views: 176, ext: "pdf", file: "ann-79.pdf" },
    { cat: 1, code: "บศ. 11", num: 11, title: "บศ. 11 แบบฟอร์มขออนุมัติแต่งตั้งคณะกรรมการสอบวิทยานิพนธ์", en: "GS. 11 Application for appointment of thesis examination committee", codeEn: "GS. 11", label: "21 ก.ค. 2563", date: "2020-07-21", views: 166, ext: "pdf", file: "ann-80.pdf" },
    { cat: 1, code: "บศ. 12", num: 12, title: "บศ. 12 แบบฟอร์มขออนุมัติเปลี่ยนแปลงการสอบวิทยานิพนธ์", en: "GS. 12 Application for change of thesis examination", codeEn: "GS. 12", label: "21 ก.ค. 2563", date: "2020-07-21", views: 22, ext: "pdf", file: "ann-81.pdf" },
    { cat: 1, code: "บศ. 13", num: 13, title: "บศ. 13 แบบฟอร์มส่งรายงานผลการสอบวิทยานิพนธ์", en: "GS. 13 Submission of thesis examination results report", codeEn: "GS. 13", label: "21 ก.ค. 2563", date: "2020-07-21", views: 155, ext: "pdf", file: "ann-82.pdf" },
    { cat: 1, code: "บศ. 14", num: 14, title: "บศ. 14 แบบฟอร์มรายงานผลการตรวจรูปแบบวิทยานิพนธ์", en: "GS. 14 Report on thesis format review results", codeEn: "GS. 14", label: "21 ก.ค. 2563", date: "2020-07-21", views: 92, ext: "pdf", file: "ann-83.pdf" },
    { cat: 1, code: "บศ. 15", num: 15, title: "บศ. 15 แบบฟอร์มนำส่งวิทยานิพนธ์ฉบับสมบูรณ์", en: "GS. 15 Submission of final thesis", codeEn: "GS. 15", label: "21 ก.ค. 2563", date: "2020-07-21", views: 177, ext: "pdf", file: "ann-84.pdf" },
    { cat: 1, code: "บศ. 16", num: 16, title: "บศ. 16 แบบฟอร์มขออนุมัติสำเร็จการศึกษา ของนิสิตระดับปริญญาโท", en: "GS. 16 Application for graduation, master's students", codeEn: "GS. 16", label: "21 ก.ค. 2563", date: "2020-07-21", views: 150, ext: "pdf", file: "ann-85.pdf" },
    { cat: 1, code: "บศ. 17", num: 17, title: "บศ. 17 แบบฟอร์มขออนุมัติสำเร็จการศึกษา ของนิสิตระดับปริญญาเอก", en: "GS. 17 Application for graduation, doctoral students", codeEn: "GS. 17", label: "21 ก.ค. 2563", date: "2020-07-21", views: 68, ext: "pdf", file: "ann-86.pdf" },

    { cat: 2, code: "บข. 1", num: 1, title: "บข. 1 แบบฟอร์มขออนุมัติแต่งตั้งอาจารย์ที่ปรึกษาค้นคว้าด้วยตนเอง", en: "IS. 1 Application for appointment of independent study advisor", codeEn: "IS. 1", label: "22 ก.ค. 2563", date: "2020-07-22", views: 156, ext: "pdf", file: "ann-87.pdf" },
    { cat: 2, code: "บข. 2", num: 2, title: "บข. 2 แบบฟอร์มขออนุมัติเปลี่ยนแปลงอาจารย์ที่ปรึกษาค้นคว้าด้วยตนเอง", en: "IS. 2 Application for change of independent study advisor", codeEn: "IS. 2", label: "22 ก.ค. 2563", date: "2020-07-22", views: 25, ext: "pdf", file: "ann-88.pdf" },
    { cat: 2, code: "บข. 3", num: 3, title: "บข. 3 แบบฟอร์มขออนุมัติเปลี่ยนแปลงชื่อเรื่องการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 3 Application for change of independent study title", codeEn: "IS. 3", label: "22 ก.ค. 2563", date: "2020-07-22", views: 56, ext: "pdf", file: "ann-89.pdf" },
    { cat: 2, code: "บข. 4", num: 4, title: "บข. 4 แบบฟอร์มขออนุมัติผลการพิจารณาโครงร่างการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 4 Approval of independent study proposal review results", codeEn: "IS. 4", label: "22 ก.ค. 2563", date: "2020-07-22", views: 87, ext: "pdf", file: "ann-90.pdf" },
    { cat: 2, code: "บข. 5", num: 5, title: "บข. 5 แบบฟอร์มขอให้ออกหนังสือถึงผู้เชี่ยวชาญเพื่อขอควาอมนุเคราะห์ตรวจแก้ไขเครื่องมือที่ใช้ในการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 5 Request for letter to experts to review independent study instruments", codeEn: "IS. 5", label: "22 ก.ค. 2563", date: "2020-07-22", views: 125, ext: "pdf", file: "ann-91.pdf" },
    { cat: 2, code: "บข. 6", num: 6, title: "บข. 6 แบบฟอร์มขอให้ออกหนังสือขอความร่วมมือเก็บข้อมูลการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 6 Request for letter seeking cooperation in independent study data collection", codeEn: "IS. 6", label: "22 ก.ค. 2563", date: "2020-07-22", views: 104, ext: "pdf", file: "ann-92.pdf" },
    { cat: 2, code: "บข. 7", num: 7, title: "บข. 7 แบบฟอร์มรายงานผลการตีพิมพ์เผยแพร่ผลงานการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 7 Report on publication of independent study results", codeEn: "IS. 7", label: "22 ก.ค. 2563", date: "2020-07-22", views: 116, ext: "pdf", file: "ann-93.pdf" },
    { cat: 2, code: "บข. 8", num: 8, title: "บข.8 แบบรายงานผลการตรวจรูปแบบการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 8 Report on independent study format review results", codeEn: "IS. 8", label: "22 ก.ค. 2563", date: "2020-07-22", views: 41, ext: "pdf", file: "ann-94.pdf" },
    { cat: 2, code: "บข. 9", num: 9, title: "บข. 9 แบบฟอร์มนำส่งเล่มการศึกษาค้นคว้าด้วยตนเองฉบับสมบูรณ์", en: "IS. 9 Submission of final independent study volume", codeEn: "IS. 9", label: "22 ก.ค. 2563", date: "2020-07-22", views: 76, ext: "pdf", file: "ann-95.pdf" },
    { cat: 2, code: "บข. 10", num: 10, title: "บข.10 แบบฟอร์มขออนุมัติสำเร็จการศึกษา ของนิสิตระดับปริญญาโท แผน ข", en: "IS. 10 Application for graduation, master's students, Plan B", codeEn: "IS. 10", label: "22 ก.ค. 2563", date: "2020-07-22", views: 99, ext: "pdf", file: "ann-96.pdf" },
    { cat: 2, code: "บข. 11", num: 11, title: "บข. 11 แบบฟอร์มขออนุมัติสอบการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 11 Application for independent study examination", codeEn: "IS. 11", label: "22 ก.ค. 2563", date: "2020-07-22", views: 97, ext: "pdf", file: "ann-97.pdf" },
    { cat: 2, code: "บข. 12", num: 12, title: "บข. 12 แบบฟอร์มขออนุมัติเปลี่ยนแปลงการสอบการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 12 Application for change of independent study examination", codeEn: "IS. 12", label: "22 ก.ค. 2563", date: "2020-07-22", views: 24, ext: "pdf", file: "ann-98.pdf" },
    { cat: 2, code: "บข. 13", num: 13, title: "บข. 13 แบบฟอร์มส่งรายงานผลสอบการศึกษาค้นคว้าด้วยตนเอง", en: "IS. 13 Submission of independent study examination results report", codeEn: "IS. 13", label: "22 ก.ค. 2563", date: "2020-07-22", views: 103, ext: "pdf", file: "ann-99.pdf" },

    { cat: 3, code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง กำหนดเกณฑ์การพิจารณาทุนอุหนุนการทำวิทยานิพนธ์ ระดับบัณฑิตศึกษา พ.ศ. 2567", en: "University of Phayao announcement: Criteria for considering thesis research grants, graduate level, B.E. 2567", label: "26 มิ.ย. 2567", date: "2024-06-26", views: 66, ext: "pdf", file: "ann-228.pdf" },
    { cat: 3, code: "", num: 0, title: "ประกาศมหาวิทยาพะเยา เรื่อง การสนับสนุนทุนอุดหนุนการทำวิทยานิพนธ์ ระดับบัณฑิตศึกษา มหาวิทยาลัยพะเยา พ.ศ. 2567", en: "University of Phayao announcement: Support for thesis research grants, graduate level, B.E. 2567", label: "26 มิ.ย. 2567", date: "2024-06-26", views: 54, ext: "pdf", file: "ann-227.pdf" },
    { cat: 3, code: "", num: 0, title: "ใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (ฉบับภาษาไทย)", en: "Application for thesis research grant (Thai version)", label: "5 เม.ย. 2566", date: "2023-04-05", views: 282, ext: "docx", file: "ann-191.docx" },
    { cat: 3, code: "", num: 0, title: "ใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (ฉบับภาษาไทย)", en: "Application for thesis research grant (Thai version)", label: "24 ก.ค. 2563", date: "2020-07-24", views: 81, ext: "pdf", file: "ann-101.pdf" },
    { cat: 3, code: "", num: 0, title: "ใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (ฉบับภาษาอังกฤษ)", en: "Application for thesis research grant (English version)", label: "6 พ.ค. 2568", date: "2025-05-06", views: 45, ext: "docx", file: "ann-1255.docx" },

    { cat: 4, code: "", num: 0, title: "สัญญาลิขสิทธิ์ วิทยานิพนธ์และการศึกษาค้นคว้าด้วยตนเอง (ฉบับภาษาไทย)", en: "Copyright agreement for thesis and independent study (Thai version)", label: "4 ส.ค. 2563", date: "2020-08-04", views: 211, ext: "docx", file: "ann-103.docx" },
    { cat: 4, code: "", num: 0, title: "สัญญาลิขสิทธิ์ วิทยานิพนธ์และการศึกษาค้นคว้าด้วยตนเอง (ฉบับภาษาอังกฤษ)", en: "Copyright agreement for thesis and independent study (English version)", label: "6 พ.ค. 2568", date: "2025-05-06", views: 48, ext: "docx", file: "ann-1256.docx" }
  ];

  var ICONS = {
    doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
    calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
    eye: ["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
    download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
    external: ["M14 4h6v6", "M20 4l-9 9", "M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"],
    chevronLeft: ["M15 18l-6-6 6-6"],
    chevronRight: ["M9 18l6-6-6-6"],
    chevronsLeft: ["M11 17l-5-5 5-5", "M18 17l-5-5 5-5"],
    chevronsRight: ["M13 17l5-5-5-5", "M6 17l5-5-5-5"]
  };

  var tabsEl = document.getElementById("cat-tabs");
  var listEl = document.getElementById("command-list");
  var captionEl = document.getElementById("list-caption");
  var pageInfoEl = document.getElementById("page-info");
  var paginationEl = document.getElementById("pagination");
  var searchInput = document.getElementById("search-input");
  var suggestEl = document.getElementById("search-suggest");
  var sortBtn = document.getElementById("sort-btn");
  var sortLabel = document.getElementById("sort-label");
  var chipCountEl = document.getElementById("chip-count");

  if (!tabsEl || !listEl) {
    return;
  }

  var state = { cat: 1, query: "", ascending: true, page: 1 };

  /* ---------- ข้อความสองภาษา (ไทย / English) ---------- */
  var PT = {
    th: {
      "doc.title": "แบบฟอร์มบัณฑิตศึกษา | GRAD UP",
      "crumb.home": "หน้าหลัก",
      "page.title": "แบบฟอร์มบัณฑิตศึกษา",
      "cat.label": "หมวดแบบฟอร์ม:",
      "stat.cats": "หมวดแบบฟอร์ม",
      "stat.total": "แบบฟอร์มทั้งหมด",
      "stat.with": "หมวดที่มีข้อมูล",
      "stat.latest": "อัปเดตล่าสุด",
      "count.cats": "{n} หมวด",
      "count.items": "{n} ฉบับ",
      "chip.all": "ทั้งหมด",
      "search.label": "ค้นหาแบบฟอร์ม",
      "search.placeholder": "ค้นหาจากชื่อแบบฟอร์ม หรือเลข บศ.",
      "sort.numAsc": "เลข {p} น้อยไปมาก",
      "sort.numDesc": "เลข {p} มากไปน้อย",
      "sort.dateAsc": "วันที่ใหม่ไปเก่า",
      "sort.dateDesc": "วันที่เก่าไปใหม่",
      "caption": "แสดงแบบฟอร์มหมวด{cat} • {sort}",
      "badge.be": "พ.ศ. ",
      "btn.download": "ดาวน์โหลด",
      "btn.preview": "ดูตัวอย่าง",
      "unit.views": "ครั้ง",
      "empty.none": "ยังไม่มีแบบฟอร์มในหมวดนี้",
      "empty.search": "ไม่พบรายการที่ตรงกับการค้นหา",
      "empty.note": "ดูรายการทั้งหมดได้ที่เว็บต้นทาง",
      "empty.link": "ไปที่หน้าแบบฟอร์ม",
      "pager.info": "แสดง {from}–{to} จาก {total} รายการ",
      "pager.label": "เปลี่ยนหน้า",
      "pager.first": "หน้าแรก",
      "pager.prev": "หน้าก่อนหน้า",
      "pager.next": "หน้าถัดไป",
      "pager.last": "หน้าสุดท้าย",
      "pager.page": "หน้า {n}",
      "theme.toLight": "เปลี่ยนธีมเป็นสว่าง",
      "theme.toDark": "เปลี่ยนธีมเป็นมืด"
    },
    en: {
      "doc.title": "Graduate Study Forms | GRAD UP",
      "crumb.home": "Home",
      "page.title": "Graduate Study Forms",
      "cat.label": "Form category:",
      "stat.cats": "Form categories",
      "stat.total": "Total forms",
      "stat.with": "Categories with data",
      "stat.latest": "Last updated",
      "count.cats": "{n} categories",
      "count.items": "{n} forms",
      "chip.all": "All",
      "search.label": "Search forms",
      "search.placeholder": "Search by form title or number",
      "sort.numAsc": "Number {p}, lowest first",
      "sort.numDesc": "Number {p}, highest first",
      "sort.dateAsc": "Newest first",
      "sort.dateDesc": "Oldest first",
      "caption": "Showing forms in {cat} • {sort}",
      "badge.be": "B.E. ",
      "btn.download": "Download",
      "btn.preview": "Preview",
      "unit.views": "views",
      "empty.none": "No forms in this category yet",
      "empty.search": "No entries match your search",
      "empty.note": "See all items on the original website",
      "empty.link": "Open the forms page",
      "pager.info": "Showing {from}–{to} of {total} items",
      "pager.label": "Pagination",
      "pager.first": "First page",
      "pager.prev": "Previous page",
      "pager.next": "Next page",
      "pager.last": "Last page",
      "pager.page": "Page {n}",
      "theme.toLight": "Switch to light theme",
      "theme.toDark": "Switch to dark theme"
    }
  };

  function lang() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }

  function t(key, vars) {
    var str = PT[lang()][key] || PT.th[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return str;
  }

  /* วันที่: ไทยใช้ข้อความเดิม ภาษาอังกฤษแปลงจากค่า ISO */
  function dateLabel(item) {
    if (lang() !== "en" || !item.date) return item.label;
    var d = new Date(item.date + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ชื่อรายการ: ภาษาอังกฤษใช้ค่า en ถ้ามี */
  function titleOf(item) {
    if (lang() === "en") return item.en || item.title;
    return item.title;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgIcon(paths) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) {
      var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });
    return svg;
  }

  function categoryLabel(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    if (!c) return "";
    return lang() === "en" && c.en ? c.en : c.label;
  }

  function itemsForCat(cat) {
    return FORMS.filter(function (f) { return f.cat === cat; });
  }

  function numberOf(item) {
    return item.num || 0;
  }

  function fileUrl(item) {
    return FILE_BASE + item.file;
  }

  function previewUrl(item) {
    if (item.ext === "pdf") return FILE_BASE + item.file;
    return PREVIEW_BASE + item.file.replace(/\.[^.]+$/, "") + ".pdf";
  }

  function downloadFilename(item) {
    var base = item.title.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();
    if (!base) base = item.code || item.file.replace(/\.[^.]+$/, "");
    return base + "." + item.ext;
  }

  function badgeText(item) {
    if (item.code) return lang() === "en" && item.codeEn ? item.codeEn : item.code;
    if (item.date) return t("badge.be") + (parseInt(item.date.slice(0, 4), 10) + 543);
    return item.label;
  }

  function sortText() {
    if (state.cat === 1 || state.cat === 2) {
      var prefix = state.cat === 1 ? (lang() === "en" ? "GS." : "บศ.") : (lang() === "en" ? "IS." : "บข.");
      return t(state.ascending ? "sort.numAsc" : "sort.numDesc", { p: prefix });
    }
    return t(state.ascending ? "sort.dateAsc" : "sort.dateDesc");
  }

  /* ค้นหาแบบ AND ทุกคำที่พิมพ์ ตัวเลขล้วนจับกับเลข บศ./บข. หรือวันที่เป็นคำเต็ม */
  function matchesAllTokens(item, tokens) {
    var hay = (item.title + " " + item.label).toLowerCase();
    var words = hay.split(/\s+/);
    return tokens.every(function (token) {
      if (/^\d+$/.test(token)) {
        return String(item.num) === token || words.indexOf(token) !== -1;
      }
      return hay.indexOf(token) !== -1;
    });
  }

  function tokensOf(text) {
    return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  function filteredItems() {
    var tokens = tokensOf(state.query);
    var list = itemsForCat(state.cat).filter(function (item) {
      return !tokens.length || matchesAllTokens(item, tokens);
    });
    list.sort(function (a, b) {
      var cmp;
      if (state.cat === 1 || state.cat === 2) {
        cmp = numberOf(a) - numberOf(b);
      } else {
        /* หมวดทุน/สัญญา: เรียงตามวันที่ */
        cmp = a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
      return state.ascending ? cmp : -cmp;
    });
    return list;
  }

  function updateSortLabel() {
    if (sortLabel) sortLabel.textContent = sortText();
  }

  /* ---------- แท็บหมวด ---------- */

  function renderTabs() {
    tabsEl.textContent = "";
    CATEGORIES.forEach(function (cat, i) {
      var selected = cat.id === state.cat;
      var count = itemsForCat(cat.id).length;
      var tab = el("button", "year-tab", categoryLabel(cat.id) + " (" + count + ")");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.id = "cat-tab-" + cat.id;
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("aria-controls", "command-list");
      tab.tabIndex = selected ? 0 : -1;
      tab.addEventListener("click", function () {
        state.cat = cat.id;
        state.page = 1;
        renderAll();
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = CATEGORIES[(i + 1) % CATEGORIES.length];
        if (e.key === "ArrowLeft") next = CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length];
        if (next) {
          e.preventDefault();
          state.cat = next.id;
          state.page = 1;
          renderAll();
          var target = document.getElementById("cat-tab-" + next.id);
          if (target) target.focus();
        }
      });
      tabsEl.appendChild(tab);
    });
  }

  /* ---------- แถวรายการ ---------- */

  function buildRow(item) {
    var row = el("article", "doc-row doc-row--board");

    var icon = el("div", "doc-row__icon");
    icon.appendChild(svgIcon(ICONS.doc));

    var body = el("div", "doc-row__body");
    var badges = el("div", "doc-row__badges");
    /* ไม่แสดงป้ายหมวดในรายการแบบฟอร์ม เหลือเฉพาะป้ายปี */
    badges.appendChild(el("span", "badge badge--year", badgeText(item)));

    var title = el("h3", "doc-row__title", titleOf(item));

    var meta = el("ul", "doc-row__meta");
    var dateLi = el("li");
    dateLi.appendChild(svgIcon(ICONS.calendar));
    var time = el("time", null, dateLabel(item));
    if (item.date) time.setAttribute("datetime", item.date);
    dateLi.appendChild(time);
    var viewLi = el("li");
    viewLi.appendChild(svgIcon(ICONS.eye));
    viewLi.appendChild(el("span", null, item.views.toLocaleString(lang() === "en" ? "en-US" : "th-TH") + " " + t("unit.views")));
    meta.appendChild(dateLi);
    meta.appendChild(viewLi);

    body.appendChild(badges);
    body.appendChild(title);
    body.appendChild(meta);

    var actions = el("div", "doc-row__actions");

    var download = el("a", "cmd-btn cmd-btn--solid");
    download.href = fileUrl(item);
    download.setAttribute("download", downloadFilename(item));
    download.appendChild(svgIcon(ICONS.download));
    download.appendChild(el("span", null, t("btn.download")));
    actions.appendChild(download);

    var preview = el("a", "doc-row__preview");
    preview.href = previewUrl(item);
    preview.target = "_blank";
    preview.rel = "noopener noreferrer";
    preview.appendChild(svgIcon(ICONS.eye));
    preview.appendChild(el("span", null, t("btn.preview")));
    actions.appendChild(preview);

    row.appendChild(icon);
    row.appendChild(body);
    row.appendChild(actions);
    return row;
  }

  function buildEmpty(message) {
    var box = el("div", "doc-empty");
    box.appendChild(el("h3", null, message));
    box.appendChild(el("p", null, t("empty.note")));
    var link = el("a", "cmd-btn cmd-btn--outline");
    link.href = SOURCE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(el("span", null, t("empty.link")));
    link.appendChild(svgIcon(ICONS.external));
    box.appendChild(link);
    return box;
  }

  /* ---------- การแบ่งหน้า ---------- */

  function renderPagination(total) {
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    var cur = state.page;
    var from = (cur - 1) * PAGE_SIZE + 1;
    var to = Math.min(total, cur * PAGE_SIZE);
    pageInfoEl.textContent = t("pager.info", { from: from, to: to, total: total });
    paginationEl.textContent = "";

    function go(target) {
      state.page = target;
      renderList();
      listEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function navButton(icon, label, target, disabled) {
      var b = el("button", "page-btn");
      b.type = "button";
      b.disabled = disabled;
      b.setAttribute("aria-label", label);
      b.appendChild(svgIcon(icon));
      b.addEventListener("click", function () { go(target); });
      return b;
    }

    paginationEl.appendChild(navButton(ICONS.chevronsLeft, t("pager.first"), 1, cur === 1));
    paginationEl.appendChild(navButton(ICONS.chevronLeft, t("pager.prev"), Math.max(1, cur - 1), cur === 1));
    for (var p = 1; p <= pages; p++) {
      (function (page) {
        var b = el("button", "page-btn" + (page === cur ? " is-active" : ""), String(page));
        b.type = "button";
        b.setAttribute("aria-label", t("pager.page", { n: page }));
        if (page === cur) b.setAttribute("aria-current", "page");
        b.addEventListener("click", function () { go(page); });
        paginationEl.appendChild(b);
      })(p);
    }
    paginationEl.appendChild(navButton(ICONS.chevronRight, t("pager.next"), Math.min(pages, cur + 1), cur === pages));
    paginationEl.appendChild(navButton(ICONS.chevronsRight, t("pager.last"), pages, cur === pages));
  }

  /* ---------- รายการหลัก ---------- */

  function renderList() {
    var list = filteredItems();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;

    listEl.textContent = "";
    captionEl.textContent = t("caption", { cat: categoryLabel(state.cat), sort: sortText() });
    updateSortLabel();

    if (!itemsForCat(state.cat).length) {
      listEl.appendChild(buildEmpty(t("empty.none")));
      pageInfoEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }
    if (!list.length) {
      listEl.appendChild(buildEmpty(t("empty.search")));
      pageInfoEl.textContent = "";
      paginationEl.textContent = "";
      return;
    }

    var start = (state.page - 1) * PAGE_SIZE;
    list.slice(start, start + PAGE_SIZE).forEach(function (item) {
      listEl.appendChild(buildRow(item));
    });
    renderPagination(list.length);
  }

  function renderCounts() {
    var n = itemsForCat(state.cat).length;
    if (chipCountEl) chipCountEl.textContent = "(" + n + ")";
    var withData = CATEGORIES.filter(function (c) { return itemsForCat(c.id).length > 0; }).length;
    var latest = FORMS.reduce(function (acc, f) {
      return !acc || f.date > acc.date ? f : acc;
    }, null);
    var set = function (id, text) {
      var node = document.getElementById(id);
      if (node) node.textContent = text;
    };
    set("stat-cats", t("count.cats", { n: CATEGORIES.length }));
    set("stat-total", t("count.items", { n: FORMS.length }));
    set("stat-with", t("count.cats", { n: withData }));
    set("stat-latest", latest ? dateLabel(latest) : "-");
  }

  function renderAll() {
    renderTabs();
    renderCounts();
    renderList();
  }

  /* ---------- รายการแนะนำขณะพิมพ์ ---------- */

  function renderSuggest() {
    var tokens = tokensOf(searchInput.value);
    suggestEl.textContent = "";
    if (!tokens.length) {
      suggestEl.hidden = true;
      return;
    }
    var matches = itemsForCat(state.cat).filter(function (item) {
      return matchesAllTokens(item, tokens);
    }).slice(0, 8);
    if (!matches.length) {
      suggestEl.hidden = true;
      return;
    }
    matches.forEach(function (item) {
      var li = el("li");
      var btn = el("button", "search-suggest__btn");
      btn.type = "button";
      btn.appendChild(el("span", "search-suggest__title", titleOf(item)));
      btn.appendChild(el("span", "search-suggest__meta", badgeText(item) + " · " + dateLabel(item)));
      btn.addEventListener("click", function () {
        searchInput.value = item.title;
        state.query = item.title;
        state.page = 1;
        suggestEl.hidden = true;
        renderList();
      });
      li.appendChild(btn);
      suggestEl.appendChild(li);
    });
    suggestEl.hidden = false;
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      state.page = 1;
      renderList();
      renderSuggest();
    });
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) renderSuggest();
    });
    searchInput.addEventListener("blur", function () {
      suggestEl.hidden = true;
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") suggestEl.hidden = true;
    });
  }
  if (suggestEl) {
    suggestEl.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", function () {
      state.ascending = !state.ascending;
      state.page = 1;
      sortBtn.setAttribute("aria-pressed", String(!state.ascending));
      renderList();
    });
  }

  /* สลับภาษาไทย / English ของหน้านี้ (ปุ่มภาษาใช้ตัวควบคุมกลางจาก i18n.js) */
  function applyPageLang() {
    document.querySelectorAll("[data-pt]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-pt"));
    });
    document.querySelectorAll("[data-pt-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-pt-aria")));
    });
    document.querySelectorAll("[data-pt-placeholder]").forEach(function (node) {
      node.setAttribute("placeholder", t(node.getAttribute("data-pt-placeholder")));
    });
    document.title = t("doc.title");
    renderAll();
    updateSortLabel();
  }

  if (window.GUI18n) {
    document.addEventListener("gu:languagechange", applyPageLang);
    var langButton = document.querySelector("[data-lang-toggle]");
    if (langButton) {
      langButton.addEventListener("click", function () {
        window.GUI18n.toggle();
      });
    }
    window.GUI18n.apply(window.GUI18n.stored());
    applyPageLang();
  }

  var themeButton = document.querySelector("[data-theme-toggle]");
  if (themeButton && window.GUTheme) {
    var updateThemeIcons = function () {
      var isDark = window.GUTheme.get() === "dark";
      themeButton.setAttribute("aria-label", isDark ? t("theme.toLight") : t("theme.toDark"));
      themeButton.setAttribute("aria-pressed", String(isDark));
    };
    themeButton.addEventListener("click", function () {
      window.GUTheme.toggle();
    });
    document.addEventListener("gu:themechange", updateThemeIcons);
    updateThemeIcons();
  }

  /* อนิเมชันเข้าหน้าเฉพาะตอนโหลดครั้งแรก (เหมือนหน้าคำสั่งแต่งตั้ง) */
  document.documentElement.classList.add("cmd-intro");
  setTimeout(function () {
    document.documentElement.classList.remove("cmd-intro");
  }, 1600);

  if (window.GUFontSize) {
    window.GUFontSize.init();
  }
  if (window.GUComponents) {
    window.GUComponents.init();
  }

  renderAll();
})();
