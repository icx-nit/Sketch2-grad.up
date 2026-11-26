/* ==========================================================================
   Academic Calendar - University of Phayao Graduate School
   Data sourced from:
   1) ประกาศมหาวิทยาลัยพะเยา เรื่อง กำหนดปฏิทินการศึกษา ปีการศึกษา 2569
      สำหรับนิสิตระดับบัณฑิตศึกษา ภาคปกติ (reg.up.ac.th)
   2) ประกาศและข่าวสารบัณฑิตวิทยาลัย มหาวิทยาลัยพะเยา (grad.up.ac.th)
   ========================================================================== */

(function () {
  "use strict";

  var section = document.querySelector("[data-calendar]");
  if (!section) {
    return;
  }

  var grid = section.querySelector("[data-calendar-grid]");
  var weekdays = section.querySelector("[data-calendar-weekdays]");
  var monthLabel = section.querySelector("[data-calendar-month]");
  var layout = section.querySelector("[data-calendar-layout]");
  var details = section.querySelector("[data-calendar-details]");
  var selectedDateLabel = section.querySelector("[data-calendar-selected-date]");
  var eventList = section.querySelector("[data-calendar-events]");
  var emptyState = section.querySelector("[data-calendar-empty]");
  var prompt = section.querySelector("[data-calendar-prompt]");

  /* Staff Dialog Controls */
  var staffBtn = section.querySelector("[data-calendar-staff-btn]");
  var dialog = section.querySelector("[data-calendar-dialog]");
  var dialogClose = section.querySelector("[data-calendar-dialog-close]");
  var form = section.querySelector("[data-calendar-form]");
  var formHeading = section.querySelector("[data-form-heading]");
  var formMode = section.querySelector("[data-form-mode]");
  var formId = section.querySelector("[data-form-id]");
  var formTitle = section.querySelector("[data-form-title]");
  var formCategory = section.querySelector("[data-form-category]");
  var formStart = section.querySelector("[data-form-start]");
  var formEnd = section.querySelector("[data-form-end]");
  var formLink = section.querySelector("[data-form-link]");
  var formDesc = section.querySelector("[data-form-desc]");
  var formCancel = section.querySelector("[data-form-cancel]");
  var resetBtn = section.querySelector("[data-calendar-reset]");
  var tableList = section.querySelector("[data-calendar-table-list]");
  var eventCountEl = section.querySelector("[data-calendar-event-count]");
  var searchEl = section.querySelector("[data-calendar-search]");

  var LABELS = {
    th: {
      weekday: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."],
      weekdayFull: [
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
        "วันอาทิตย์"
      ],
      monthGrid: "ปฏิทิน",
      event: "กำหนดการ",
      viewEvent: "ไปยังบริการ / แบบฟอร์ม",
      download: "ดาวน์โหลดเอกสาร",
      promptDefault: "เลือกวันที่เพื่อดูรายละเอียดกำหนดการ",
      promptEmpty: "เดือนนี้ไม่มีกิจกรรมสำคัญของงานทะเบียนและบัณฑิตศึกษา",
      startEnd: "ช่วงเวลา",
      statusActive: "กำลังดำเนินการ",
      statusPast: "สิ้นสุดแล้ว",
      statusUpcoming: "เร็วๆ นี้"
    },
    en: {
      weekday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekdayFull: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      monthGrid: "Calendar",
      event: "Schedule",
      viewEvent: "Go to Service / Form",
      download: "Download document",
      promptDefault: "Select a date to view its schedule",
      promptEmpty: "No scheduled events for this month",
      startEnd: "Period",
      statusActive: "In Progress",
      statusPast: "Completed",
      statusUpcoming: "Upcoming"
    }
  };

  var CAT = {
    gs1: { th: "ยื่นคำร้อง บศ.1", en: "Form GS.1" },
    review: { th: "การพิจารณาคำร้อง", en: "Petition Review" },
    register: { th: "งานทะเบียน / เปิด-ปิดภาค", en: "Registration" },
    petition: { th: "ยื่นคำร้องต่าง ๆ", en: "Petitions" },
    exam: { th: "การสอบ (QE / ปลายภาค)", en: "Examinations" },
    thesis: { th: "วิทยานิพนธ์ / บศ.16-17", en: "Thesis & Degree" },
    grant: { th: "ทุนอุดหนุนการศึกษา", en: "Thesis Grant" }
  };

  var DEFAULT_EVENTS = [
  {
    "id": "sem1-course-plan",
    "title": {
      "th": "วันสุดท้ายคณะส่งข้อมูลรายวิชาตามแผนการศึกษา ถึง กองบริการการศึกษา",
      "en": "Deadline for faculties to submit curriculum course offerings to Educational Services"
    },
    "category": "register",
    "date": "2026-03-02",
    "dateEnd": "2026-03-02",
    "description": {
      "th": "คณะส่งข้อมูลรายวิชาที่จะเปิดสอนตามแผนการศึกษาสำหรับภาคการศึกษาต้น ปีการศึกษา 2569",
      "en": "Faculties submit course offering plans for Semester 1/2026."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-transfer-docs",
    "title": {
      "th": "วันสุดท้ายของการรับเอกสารขอโอนย้ายสถานศึกษา",
      "en": "Deadline for accepting university transfer documents"
    },
    "category": "petition",
    "date": "2026-05-15",
    "dateEnd": "2026-05-15",
    "description": {
      "th": "กำหนดการวันสุดท้ายสำหรับการยื่นเอกสารขอโอนย้ายสถานศึกษาเข้าศึกษาในระดับบัณฑิตศึกษา",
      "en": "Final day for submitting institution transfer documentation."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-credit-transfer",
    "title": {
      "th": "นิสิตยื่นคำร้องขอเทียบโอนรายวิชาและผลการเรียนจากสถานศึกษาเดิม (UP06)",
      "en": "Students submit course and credit transfer requests (UP06)"
    },
    "category": "petition",
    "date": "2026-05-15",
    "dateEnd": "2026-06-15",
    "description": {
      "th": "ยื่นคำร้องเทียบโอนรายวิชาและผลการเรียนตามแบบฟอร์ม UP06 ณ คณะต้นสังกัด",
      "en": "Submit credit transfer request form UP06 at the faculty."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-faculty-transfer",
    "title": {
      "th": "นิสิตยื่นคำร้องขอย้ายคณะ หลักสูตร และแผนการศึกษา",
      "en": "Students request faculty, program, or study plan change"
    },
    "category": "petition",
    "date": "2026-05-04",
    "dateEnd": "2026-05-08",
    "description": {
      "th": "ยื่นคำร้องขอย้ายคณะ หลักสูตร หรือแผนการศึกษา ถึงคณะต้นสังกัดของนิสิต",
      "en": "Submit transfer request between faculties, programs, or study plans."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-gs1-period",
    "title": {
      "th": "ช่วงเวลายื่น บศ.1 เสนอหัวข้อวิทยานิพนธ์และแต่งตั้งอาจารย์ที่ปรึกษา",
      "en": "Form GS.1 submission period (Thesis topic & advisor proposal)"
    },
    "category": "gs1",
    "date": "2026-05-18",
    "dateEnd": "2026-06-19",
    "description": {
      "th": "นิสิตระดับบัณฑิตศึกษายื่นแบบคำร้อง บศ.1 เพื่อเสนอขออนุมัติหัวข้อและแต่งตั้งคณะกรรมการที่ปรึกษาวิทยานิพนธ์/การค้นคว้าอิสระ",
      "en": "Graduate students submit form GS.1 proposing thesis topic and thesis advisors."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem1-schedule-announce",
    "title": {
      "th": "วันประกาศตารางเรียนตารางสอบ และวันพบอาจารย์ที่ปรึกษา",
      "en": "Class and exam schedule announcement & advisor consultation day"
    },
    "category": "register",
    "date": "2026-06-02",
    "dateEnd": "2026-06-02",
    "description": {
      "th": "ระบบทะเบียนประกาศตารางเรียนตารางสอน และนิสิตเข้าพบอาจารย์ที่ปรึกษาเพื่อวางแผนการเรียน",
      "en": "REG system announces timetable; students meet advisors for course planning."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-reg-prep",
    "title": {
      "th": "นิสิตเตรียมลงทะเบียนเรียน ภาคการศึกษาต้น",
      "en": "Student registration preparation period"
    },
    "category": "register",
    "date": "2026-06-01",
    "dateEnd": "2026-06-05",
    "description": {
      "th": "ตรวจสอบรายวิชา แผนการเรียน และเงื่อนไขการลงทะเบียนผ่านระบบบริการการศึกษา",
      "en": "Check course offerings and prerequisites via the REG system."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-regular-reg",
    "title": {
      "th": "วันลงทะเบียนเรียน และชำระเงินค่าลงทะเบียน ภาคการศึกษาต้น",
      "en": "Course registration and tuition fee payment (Semester 1)"
    },
    "category": "register",
    "date": "2026-06-08",
    "dateEnd": "2026-06-12",
    "description": {
      "th": "ลงทะเบียนเรียนและรักษาสภาพการเป็นนิสิตผ่านระบบออนไลน์ เริ่มชำระเงินได้ตั้งแต่นิสิตยืนยันการลงทะเบียน",
      "en": "Online course registration and tuition payment starting after enrollment confirmation."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-defer-petition",
    "title": {
      "th": "นิสิตยื่นคำร้องขอผ่อนผันการลงทะเบียนเรียน (UP18)",
      "en": "Students submit tuition payment deferral request (UP18)"
    },
    "category": "petition",
    "date": "2026-06-08",
    "dateEnd": "2026-06-12",
    "description": {
      "th": "ยื่นคำร้องขอผ่อนผันการชำระเงินค่าลงทะเบียนเรียนผ่านคณะต้นสังกัด",
      "en": "Submit payment postponement petition form UP18 through the student faculty."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-term-start",
    "title": {
      "th": "วันเปิดภาคการศึกษาต้น ปีการศึกษา 2569",
      "en": "First day of classes (Semester 1/2026)"
    },
    "category": "register",
    "date": "2026-06-15",
    "dateEnd": "2026-06-15",
    "description": {
      "th": "วันเปิดภาคการศึกษาต้น สำหรับนิสิตระดับบัณฑิตศึกษา ภาคปกติ",
      "en": "First day of classes for graduate students, regular program."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-late-reg",
    "title": {
      "th": "ลงทะเบียนเรียนล่าช้า และเพิ่ม-ถอนรายวิชาไม่ได้รับอักษร W",
      "en": "Late registration and add/drop period without grade W"
    },
    "category": "register",
    "date": "2026-06-15",
    "dateEnd": "2026-06-26",
    "description": {
      "th": "นิสิตลงทะเบียนล่าช้า รักษาสภาพ และเพิ่ม-ถอนรายวิชาโดยไม่ได้รับอักษร W (ชำระค่าปรับตามระเบียบ)",
      "en": "Late enrollment, status maintenance, and course add/drop without grade W."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-grad-app",
    "title": {
      "th": "นิสิตยื่นคำร้องขอสำเร็จการศึกษา (UP24) และชำระค่าขึ้นทะเบียนปริญญาบัตร",
      "en": "Students apply for graduation (UP24) and pay graduation fee"
    },
    "category": "thesis",
    "date": "2026-06-15",
    "dateEnd": "2026-07-14",
    "description": {
      "th": "ยื่นคำร้องขอสำเร็จการศึกษาสำหรับผู้ที่คาดว่าจะสำเร็จการศึกษาในภาคการศึกษาต้น",
      "en": "Submit graduation intent form UP24 and pay degree registration fee."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem1-petition-review",
    "title": {
      "th": "ช่วงเวลาพิจารณาคำร้อง บศ.1 และคำร้องทั่วไป โดยคณะและบัณฑิตวิทยาลัย",
      "en": "Faculty & Graduate School review period for Form GS.1 & general petitions"
    },
    "category": "review",
    "date": "2026-06-22",
    "dateEnd": "2026-07-03",
    "description": {
      "th": "คณะกรรมการประจำคณะและคณะกรรมการบริหารบัณฑิตวิทยาลัยพิจารณาคำร้อง บศ.1 และคำร้องทางวิชาการ",
      "en": "Faculty and Graduate School committees review GS.1 forms and academic petitions."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem1-drop-w",
    "title": {
      "th": "นิสิตยื่นคำร้องขอถอนรายวิชาโดยได้รับอักษร W (UP08)",
      "en": "Course withdrawal period with grade W (UP08)"
    },
    "category": "petition",
    "date": "2026-06-27",
    "dateEnd": "2026-09-11",
    "description": {
      "th": "ถอนรายวิชาผ่านระบบทะเบียนโดยบันทึกอักษร W บนใบแสดงผลการศึกษา",
      "en": "Withdraw from courses with grade W on the transcript."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-qe1-apply",
    "title": {
      "th": "วันสมัครสอบและชำระเงินค่าสมัครสอบวัดคุณสมบัติ (QE) ครั้งที่ 1",
      "en": "Application and fee payment for Qualifying Examination (QE) No. 1"
    },
    "category": "exam",
    "date": "2026-06-29",
    "dateEnd": "2026-07-03",
    "description": {
      "th": "นิสิตระดับปริญญาเอกสมัครสอบวัดคุณสมบัติ (QE) ครั้งที่ 1 ภาคการศึกษาต้น",
      "en": "Doctoral students register for the Qualifying Examination (QE) round 1."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem1-qe1-exam",
    "title": {
      "th": "วันสอบวัดคุณสมบัติ (Qualifying Examination - QE) ครั้งที่ 1",
      "en": "Qualifying Examination (QE) test dates - Round 1"
    },
    "category": "exam",
    "date": "2026-07-24",
    "dateEnd": "2026-07-26",
    "description": {
      "th": "การจัดสอบวัดคุณสมบัติสำหรับนิสิตปริญญาเอก ณ คณะ/วิทยาลัยที่เปิดสอน",
      "en": "Qualifying Examination for doctoral students conducted by respective faculties."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem1-grant-apply",
    "title": {
      "th": "วันสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (สมัครที่คณะ/วิทยาลัย)",
      "en": "Thesis research grant application period"
    },
    "category": "grant",
    "date": "2026-08-03",
    "dateEnd": "2026-08-07",
    "description": {
      "th": "นิสิตยื่นใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ระดับบัณฑิตศึกษา ณ คณะ/วิทยาลัยต้นสังกัด",
      "en": "Graduate students apply for thesis grants at their respective faculties."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "sem1-grant-review",
    "title": {
      "th": "ช่วงเวลาพิจารณาคุณสมบัติผู้สมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์",
      "en": "Committee review period for thesis grant applicants"
    },
    "category": "review",
    "date": "2026-08-10",
    "dateEnd": "2026-08-21",
    "description": {
      "th": "คณะ/วิทยาลัยและบัณฑิตวิทยาลัยพิจารณาคุณสมบัติและผลงานของผู้สมัครขอรับทุน",
      "en": "Faculties and Graduate School evaluate qualifications of grant applicants."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "sem1-thesis-format",
    "title": {
      "th": "วันสุดท้ายของการส่งวิทยานิพนธ์เพื่อตรวจรูปแบบ",
      "en": "Deadline for submitting thesis draft for format checking"
    },
    "category": "thesis",
    "date": "2026-09-25",
    "dateEnd": "2026-09-25",
    "description": {
      "th": "ส่งเล่มวิทยานิพนธ์ผ่านระบบ iThesis หรือบัณฑิตวิทยาลัยเพื่อตรวจสอบรูปแบบความถูกต้องตามคู่มือ",
      "en": "Submit thesis draft via iThesis for formatting verification."
    },
    "href": "announce-guidebook.html"
  },
  {
    "id": "sem1-final-exam",
    "title": {
      "th": "วันสอบปลายภาค ภาคการศึกษาต้น ปีการศึกษา 2569 (งดการเรียนการสอน)",
      "en": "Final examinations period (Semester 1/2026)"
    },
    "category": "exam",
    "date": "2026-10-05",
    "dateEnd": "2026-10-16",
    "description": {
      "th": "การสอบปลายภาคการศึกษาต้น ทุกชั้นปี",
      "en": "Semester 1 final exams for all years."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem1-grad-forms-final",
    "title": {
      "th": "วันสุดท้ายของการส่งแบบฟอร์มขออนุมัติสำเร็จการศึกษา (บศ.16, บศ.17)",
      "en": "Final deadline for graduation approval forms (GS.16, GS.17)"
    },
    "category": "thesis",
    "date": "2026-10-16",
    "dateEnd": "2026-10-16",
    "description": {
      "th": "ส่งแบบฟอร์ม บศ.16 (ปริญญาโท) หรือ บศ.17 (ปริญญาเอก) พร้อมเอกสารแนบเพื่อขออนุมัติสำเร็จการศึกษา",
      "en": "Final deadline to submit form GS.16 (Master) or GS.17 (Doctoral) for graduation."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem1-term-end",
    "title": {
      "th": "วันสำเร็จการศึกษา และวันปิดภาคการศึกษาต้น",
      "en": "Graduation day and last day of Semester 1/2026"
    },
    "category": "register",
    "date": "2026-10-19",
    "dateEnd": "2026-10-19",
    "description": {
      "th": "วันอนุมัติสำเร็จการศึกษาและปิดภาคการศึกษาต้น 2569",
      "en": "Official graduation approval date and closure of Semester 1/2026."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-course-plan",
    "title": {
      "th": "วันสุดท้ายคณะส่งข้อมูลรายวิชาตามแผนการศึกษา ภาคปลาย ถึง กองบริการฯ",
      "en": "Deadline for faculties to submit Semester 2 course offerings"
    },
    "category": "register",
    "date": "2026-07-20",
    "dateEnd": "2026-07-20",
    "description": {
      "th": "คณะส่งข้อมูลรายวิชาที่จะเปิดสอนตามแผนการศึกษาสำหรับภาคปลาย ปีการศึกษา 2569",
      "en": "Faculties submit course offerings for Semester 2."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-credit-transfer",
    "title": {
      "th": "นิสิตยื่นคำร้องขอเทียบโอนรายวิชาและผลการเรียนจากสถานศึกษาเดิม (UP06)",
      "en": "Students submit course and credit transfer requests (UP06)"
    },
    "category": "petition",
    "date": "2026-10-02",
    "dateEnd": "2026-11-02",
    "description": {
      "th": "ยื่นคำร้องเทียบโอนรายวิชาและผลการเรียนตามแบบฟอร์ม UP06 สำหรับภาคการศึกษาปลาย",
      "en": "Submit credit transfer requests form UP06 for Semester 2."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-schedule-announce",
    "title": {
      "th": "วันประกาศตารางเรียนตารางสอบ และวันพบอาจารย์ที่ปรึกษา (ภาคปลาย)",
      "en": "Class timetable announcement & advisor meeting (Semester 2)"
    },
    "category": "register",
    "date": "2026-10-19",
    "dateEnd": "2026-10-19",
    "description": {
      "th": "ระบบทะเบียนประกาศตารางเรียนตารางสอน และนิสิตเข้าพบอาจารย์ที่ปรึกษา",
      "en": "Timetable published; students consult advisors."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-reg-prep",
    "title": {
      "th": "นิสิตเตรียมลงทะเบียนเรียน ภาคการศึกษาปลาย",
      "en": "Student registration preparation period (Semester 2)"
    },
    "category": "register",
    "date": "2026-10-19",
    "dateEnd": "2026-10-22",
    "description": {
      "th": "เตรียมความพร้อม วางแผนรายวิชา และตรวจสอบตารางสอนก่อนวันลงทะเบียนจริง",
      "en": "Prepare course lists and check requirements ahead of registration."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-regular-reg",
    "title": {
      "th": "วันลงทะเบียนเรียน และชำระเงินค่าลงทะเบียน ภาคการศึกษาปลาย",
      "en": "Course registration and tuition fee payment (Semester 2)"
    },
    "category": "register",
    "date": "2026-10-26",
    "dateEnd": "2026-10-30",
    "description": {
      "th": "ลงทะเบียนเรียนและรักษาสภาพการเป็นนิสิตผ่านระบบออนไลน์ (วันแรกเริ่มเวลา 09.00 น.)",
      "en": "Online course registration and tuition payment via REG UP."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-defer-petition",
    "title": {
      "th": "นิสิตยื่นคำร้องขอผ่อนผันการลงทะเบียนเรียน (UP18)",
      "en": "Students submit tuition payment deferral request (UP18)"
    },
    "category": "petition",
    "date": "2026-10-26",
    "dateEnd": "2026-10-30",
    "description": {
      "th": "ยื่นคำร้องขอผ่อนผันการชำระเงินค่าลงทะเบียนเรียนภาคการศึกษาปลาย",
      "en": "Submit tuition deferral petition form UP18."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-term-start",
    "title": {
      "th": "วันเปิดภาคการศึกษาปลาย ปีการศึกษา 2569",
      "en": "First day of classes (Semester 2/2026)"
    },
    "category": "register",
    "date": "2026-11-02",
    "dateEnd": "2026-11-02",
    "description": {
      "th": "วันเปิดภาคการศึกษาปลาย สำหรับนิสิตระดับบัณฑิตศึกษา ภาคปกติ",
      "en": "Semester 2 commencement for graduate programs."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-late-reg",
    "title": {
      "th": "ลงทะเบียนเรียนล่าช้า และเพิ่ม-ถอนรายวิชาไม่ได้รับอักษร W",
      "en": "Late registration and add/drop period without grade W"
    },
    "category": "register",
    "date": "2026-11-02",
    "dateEnd": "2026-11-13",
    "description": {
      "th": "ลงทะเบียนเรียนล่าช้าและรักษาสภาพการเป็นนิสิต เพิ่ม-ถอนรายวิชาโดยไม่ได้รับอักษร W (ชำระค่าปรับตามระเบียบ)",
      "en": "Late registration and course change without grade W."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-late-pay",
    "title": {
      "th": "ชำระเงินค่าลงทะเบียนเรียนทุกชั้นปี สำหรับนิสิตที่ลงทะเบียนล่าช้า",
      "en": "Tuition payment for late registrants"
    },
    "category": "register",
    "date": "2026-11-03",
    "dateEnd": "2026-11-13",
    "description": {
      "th": "ชำระเงินค่าลงทะเบียนเรียนสำหรับนิสิตที่ลงทะเบียนในรอบล่าช้า",
      "en": "Fee payment period for late registering students."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-gs1-period",
    "title": {
      "th": "ช่วงเวลายื่น บศ.1 เสนอหัวข้อวิทยานิพนธ์และแต่งตั้งอาจารย์ที่ปรึกษา (ภาคปลาย)",
      "en": "Form GS.1 submission period (Thesis topic & advisor proposal - Sem 2)"
    },
    "category": "gs1",
    "date": "2026-11-02",
    "dateEnd": "2026-11-27",
    "description": {
      "th": "นิสิตระดับบัณฑิตศึกษายื่นแบบคำร้อง บศ.1 เพื่อเสนอแต่งตั้งคณะกรรมการที่ปรึกษาวิทยานิพนธ์ และเสนอชื่อเรื่องโครงร่าง",
      "en": "Graduate students submit form GS.1 proposing thesis topic and thesis advisors."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem2-grad-app",
    "title": {
      "th": "นิสิตยื่นคำร้องขอสำเร็จการศึกษา (UP24) และชำระค่าขึ้นทะเบียนปริญญาบัตร",
      "en": "Students apply for graduation (UP24) and pay degree fee"
    },
    "category": "thesis",
    "date": "2026-11-02",
    "dateEnd": "2026-12-01",
    "description": {
      "th": "ยื่นคำร้องขอสำเร็จการศึกษาสำหรับผู้ที่คาดว่าจะสำเร็จการศึกษาในภาคการศึกษาปลาย",
      "en": "Submit graduation intent form UP24 and pay degree registration fee."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem2-drop-w",
    "title": {
      "th": "นิสิตยื่นคำร้องขอถอนรายวิชาโดยได้รับอักษร W (UP08)",
      "en": "Course withdrawal period with grade W (UP08)"
    },
    "category": "petition",
    "date": "2026-11-14",
    "dateEnd": "2027-01-29",
    "description": {
      "th": "ถอนรายวิชาผ่านระบบทะเบียนโดยบันทึกอักษร W บนใบแสดงผลการศึกษา",
      "en": "Course withdrawal period with grade W record."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-qe1-apply",
    "title": {
      "th": "วันสมัครสอบและชำระเงินค่าสมัครสอบวัดคุณสมบัติ (QE) ครั้งที่ 1",
      "en": "Application and fee payment for Qualifying Examination (QE) No. 1"
    },
    "category": "exam",
    "date": "2026-11-16",
    "dateEnd": "2026-11-20",
    "description": {
      "th": "นิสิตระดับปริญญาเอกสมัครสอบวัดคุณสมบัติ (QE) ครั้งที่ 1 ประจำภาคการศึกษาปลาย",
      "en": "Doctoral students register for Qualifying Examination (QE) Round 1."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem2-qe1-late-apply",
    "title": {
      "th": "วันสมัครสอบและชำระเงินค่าสอบวัดคุณสมบัติ (QE) ครั้งที่ 1 ล่าช้า",
      "en": "Late registration and fee payment for QE Round 1"
    },
    "category": "exam",
    "date": "2026-11-23",
    "dateEnd": "2026-11-27",
    "description": {
      "th": "สมัครสอบวัดคุณสมบัติรอบล่าช้า (มีค่าธรรมเนียมปรับตามระเบียบ)",
      "en": "Late registration period for Qualifying Examination."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem2-petition-review",
    "title": {
      "th": "ช่วงเวลาพิจารณาคำร้อง บศ.1 และคำร้องทั่วไป โดยคณะและบัณฑิตวิทยาลัย",
      "en": "Faculty & Graduate School review period for Form GS.1 & general petitions"
    },
    "category": "review",
    "date": "2026-11-30",
    "dateEnd": "2026-12-15",
    "description": {
      "th": "คณะกรรมการประจำคณะและบัณฑิตวิทยาลัยพิจารณาคำร้อง บศ.1 และคำร้องผ่อนผัน/เทียบโอน",
      "en": "Committees evaluate and approve GS.1 forms and academic petitions."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem2-qe1-exam",
    "title": {
      "th": "วันสอบวัดคุณสมบัติ (Qualifying Examination - QE) ครั้งที่ 1",
      "en": "Qualifying Examination (QE) test dates - Round 1"
    },
    "category": "exam",
    "date": "2026-12-11",
    "dateEnd": "2026-12-13",
    "description": {
      "th": "จัดสอบวัดคุณสมบัติข้อเขียน/ปากเปล่าสำหรับนิสิตปริญญาเอก",
      "en": "Doctoral Qualifying Examination testing sessions."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem2-defer-pay-final",
    "title": {
      "th": "วันสุดท้ายของการชำระค่าลงทะเบียนเรียน (กรณีได้รับอนุมัติให้ผ่อนผัน UP18)",
      "en": "Final tuition payment deadline for deferred students"
    },
    "category": "register",
    "date": "2026-12-18",
    "dateEnd": "2026-12-18",
    "description": {
      "th": "วันสุดท้ายของการชำระค่าลงทะเบียนเรียนสำหรับนิสิตที่ได้รับอนุมัติผ่อนผัน",
      "en": "Final deadline for postponed tuition fee settlement."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-grant-apply",
    "title": {
      "th": "วันสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (สมัครที่คณะ/วิทยาลัย)",
      "en": "Thesis research grant application period (Round 2)"
    },
    "category": "grant",
    "date": "2026-12-21",
    "dateEnd": "2026-12-25",
    "description": {
      "th": "นิสิตยื่นใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ระดับบัณฑิตศึกษา ณ คณะ/วิทยาลัย",
      "en": "Graduate students apply for thesis grants at their faculties."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "sem2-grant-review",
    "title": {
      "th": "ช่วงเวลาพิจารณาคุณสมบัติผู้สมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์",
      "en": "Committee review period for thesis grant applicants"
    },
    "category": "review",
    "date": "2026-12-28",
    "dateEnd": "2027-01-05",
    "description": {
      "th": "คณะ/วิทยาลัยและบัณฑิตวิทยาลัยพิจารณาคุณสมบัติผู้ขอรับทุนวิทยานิพนธ์",
      "en": "Evaluation of grant applicant eligibility and research proposals."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "sem2-qe2-apply",
    "title": {
      "th": "วันสมัครสอบและชำระเงินค่าสอบวัดคุณสมบัติ (QE) ครั้งที่ 2",
      "en": "Application and fee payment for QE Round 2"
    },
    "category": "exam",
    "date": "2027-01-11",
    "dateEnd": "2027-01-15",
    "description": {
      "th": "สมัครสอบวัดคุณสมบัติรอบที่ 2 สำหรับนิสิตปริญญาเอก",
      "en": "Registration period for QE Round 2."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem2-qe2-exam",
    "title": {
      "th": "วันสอบวัดคุณสมบัติ (Qualifying Examination - QE) ครั้งที่ 2",
      "en": "Qualifying Examination (QE) test dates - Round 2"
    },
    "category": "exam",
    "date": "2027-02-05",
    "dateEnd": "2027-02-07",
    "description": {
      "th": "จัดสอบวัดคุณสมบัติรอบที่ 2",
      "en": "Testing period for QE Round 2."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "sem2-thesis-format",
    "title": {
      "th": "วันสุดท้ายของการส่งวิทยานิพนธ์เพื่อตรวจรูปแบบ",
      "en": "Deadline for submitting thesis draft for format checking"
    },
    "category": "thesis",
    "date": "2027-02-12",
    "dateEnd": "2027-02-12",
    "description": {
      "th": "ส่งเล่มวิทยานิพนธ์ผ่านระบบ iThesis หรือบัณฑิตวิทยาลัยเพื่อตรวจสอบรูปแบบ",
      "en": "Submit thesis draft via iThesis for format checking."
    },
    "href": "announce-guidebook.html"
  },
  {
    "id": "sem2-leave-quit",
    "title": {
      "th": "วันสุดท้ายของการยื่นคำร้องขอลาพักการศึกษา (UP13) และขอลาออก (UP14)",
      "en": "Final deadline for leave of absence (UP13) or resignation (UP14)"
    },
    "category": "petition",
    "date": "2027-02-26",
    "dateEnd": "2027-02-26",
    "description": {
      "th": "ยื่นคำร้องขอลาพักการศึกษา หรือลาออกโดยไม่ได้รับผลการเรียน",
      "en": "Submit leave of absence or resignation request."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-final-exam",
    "title": {
      "th": "วันสอบปลายภาค ภาคการศึกษาปลาย ปีการศึกษา 2569 (งดการเรียนการสอน)",
      "en": "Final examinations period (Semester 2/2026)"
    },
    "category": "exam",
    "date": "2027-03-01",
    "dateEnd": "2027-03-12",
    "description": {
      "th": "การสอบปลายภาคการศึกษาปลาย ทุกชั้นปี",
      "en": "Semester 2 final examination period."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "sem2-grad-forms-final",
    "title": {
      "th": "วันสุดท้ายของการส่งแบบฟอร์มขออนุมัติสำเร็จการศึกษา (บศ.16, บศ.17)",
      "en": "Final deadline for graduation approval forms (GS.16, GS.17)"
    },
    "category": "thesis",
    "date": "2027-03-05",
    "dateEnd": "2027-03-05",
    "description": {
      "th": "ส่งแบบฟอร์ม บศ.16 (ปริญญาโท) หรือ บศ.17 (ปริญญาเอก) พร้อมวิทยานิพนธ์ฉบับสมบูรณ์",
      "en": "Submit form GS.16 (Master) or GS.17 (Doctoral) and complete thesis."
    },
    "href": "announce-form.html"
  },
  {
    "id": "sem2-term-end",
    "title": {
      "th": "วันสำเร็จการศึกษา และวันปิดภาคการศึกษาปลาย",
      "en": "Graduation day and last day of Semester 2/2026"
    },
    "category": "register",
    "date": "2027-03-15",
    "dateEnd": "2027-03-15",
    "description": {
      "th": "วันอนุมัติสำเร็จการศึกษาและปิดภาคการศึกษาปลาย 2569",
      "en": "Graduation approval and closure of Semester 2."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "summer-reg",
    "title": {
      "th": "วันลงทะเบียนเรียน และชำระเงินค่าลงทะเบียน ภาคฤดูร้อน",
      "en": "Summer session registration and tuition payment"
    },
    "category": "register",
    "date": "2027-03-15",
    "dateEnd": "2027-03-19",
    "description": {
      "th": "ลงทะเบียนเรียนและชำระค่าลงทะเบียนภาคฤดูร้อนผ่านระบบออนไลน์",
      "en": "Online course registration and fee payment for summer session."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "summer-term-start",
    "title": {
      "th": "วันเปิดภาคฤดูร้อน ปีการศึกษา 2569",
      "en": "First day of summer session"
    },
    "category": "register",
    "date": "2027-03-22",
    "dateEnd": "2027-03-22",
    "description": {
      "th": "วันเปิดเรียนภาคฤดูร้อน สำหรับนิสิตระดับบัณฑิตศึกษา",
      "en": "First day of classes for summer session."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "summer-late-reg",
    "title": {
      "th": "ลงทะเบียนเรียนล่าช้า และเพิ่ม-ถอนรายวิชา ภาคฤดูร้อน",
      "en": "Late registration and add/drop period (Summer)"
    },
    "category": "register",
    "date": "2027-03-22",
    "dateEnd": "2027-03-26",
    "description": {
      "th": "ลงทะเบียนเรียนล่าช้าและเพิ่ม-ถอนรายวิชาภาคฤดูร้อน",
      "en": "Late course registration and adjustments for summer session."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "summer-qe-apply",
    "title": {
      "th": "วันสมัครสอบวัดคุณสมบัติ (QE) ภาคฤดูร้อน",
      "en": "Summer QE application period"
    },
    "category": "exam",
    "date": "2027-03-29",
    "dateEnd": "2027-04-02",
    "description": {
      "th": "สมัครสอบวัดคุณสมบัติสำหรับนิสิตปริญญาเอก ภาคฤดูร้อน",
      "en": "Doctoral Qualifying Examination registration for summer session."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "summer-grant-apply",
    "title": {
      "th": "วันสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ ภาคฤดูร้อน",
      "en": "Summer thesis grant application"
    },
    "category": "grant",
    "date": "2027-04-27",
    "dateEnd": "2027-05-03",
    "description": {
      "th": "ยื่นใบสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ ณ คณะ/วิทยาลัย",
      "en": "Submit thesis grant applications during summer."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "summer-qe-exam",
    "title": {
      "th": "วันสอบวัดคุณสมบัติ (QE) ภาคฤดูร้อน",
      "en": "Summer Qualifying Examination test dates"
    },
    "category": "exam",
    "date": "2027-04-30",
    "dateEnd": "2027-05-02",
    "description": {
      "th": "สอบวัดคุณสมบัติสำหรับนิสิตปริญญาเอก ภาคฤดูร้อน",
      "en": "Summer session QE testing period."
    },
    "href": "announce-exam.html"
  },
  {
    "id": "summer-grant-review",
    "title": {
      "th": "ช่วงเวลาพิจารณาคุณสมบัติผู้สมัครขอรับทุน ภาคฤดูร้อน",
      "en": "Summer grant applicant review period"
    },
    "category": "review",
    "date": "2027-05-05",
    "dateEnd": "2027-05-11",
    "description": {
      "th": "คณะ/วิทยาลัยและบัณฑิตวิทยาลัยพิจารณาคุณสมบัติผู้สมัครรับทุน",
      "en": "Review of summer grant applicants."
    },
    "href": "announce-scholarship.html"
  },
  {
    "id": "summer-final-exam",
    "title": {
      "th": "วันสอบปลายภาค ภาคฤดูร้อน (งดการเรียนการสอน)",
      "en": "Summer session final examinations"
    },
    "category": "exam",
    "date": "2027-05-24",
    "dateEnd": "2027-05-28",
    "description": {
      "th": "การสอบปลายภาคฤดูร้อน ปีการศึกษา 2569",
      "en": "Final exams for summer session."
    },
    "href": "https://reg.up.ac.th"
  },
  {
    "id": "summer-grad-forms",
    "title": {
      "th": "วันสุดท้ายของการส่งแบบฟอร์มขออนุมัติสำเร็จการศึกษา (บศ.16, บศ.17)",
      "en": "Final deadline for graduation approval forms (GS.16, GS.17)"
    },
    "category": "thesis",
    "date": "2027-05-28",
    "dateEnd": "2027-05-28",
    "description": {
      "th": "ส่งแบบฟอร์ม บศ.16, บศ.17 และวิทยานิพนธ์ฉบับสมบูรณ์เพื่อขอสำเร็จการศึกษา",
      "en": "Submit forms GS.16, GS.17 and completed thesis for graduation."
    },
    "href": "announce-form.html"
  },
  {
    "id": "summer-term-end",
    "title": {
      "th": "วันสำเร็จการศึกษา และวันปิดภาคฤดูร้อน",
      "en": "Graduation day and last day of summer session"
    },
    "category": "register",
    "date": "2027-05-31",
    "dateEnd": "2027-05-31",
    "description": {
      "th": "วันอนุมัติสำเร็จการศึกษาและปิดภาคฤดูร้อน 2569",
      "en": "Official graduation approval and closure of summer session."
    },
    "href": "https://reg.up.ac.th"
  }
];

  var STORAGE_KEY = "grad_up_calendar_events_v2";

  function loadEvents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Cannot load events from localStorage", e);
    }
    return DEFAULT_EVENTS.slice();
  }

  function saveEvents(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Cannot save events to localStorage", e);
    }
  }

  var EVENTS = loadEvents();
  var today = startOfDay(new Date());
  var viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var selectedDate = null;

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function currentLanguage() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }

  function dateKey(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function dateFromKey(key) {
    var parts = key.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function formatDate(date) {
    var locale = currentLanguage() === "en" ? "en-US" : "th-TH";
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return "";
    var d = dateFromKey(dateStr);
    var locale = currentLanguage() === "en" ? "en-US" : "th-TH";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(d);
  }

  function formatMonth(date) {
    /* แสดงเฉพาะภาษาที่เลือก: ไทย = พฤศจิกายน 2569 / อังกฤษ = November 2026 */
    var lang = currentLanguage();
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "th-TH", {
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function eventText(value) {
    if (!value) return "";
    if (typeof value === "string") {
      return value;
    }
    var lang = currentLanguage();
    return value[lang] || value.th || value.en || "";
  }

  function eventCoversDate(event, key) {
    if (event.date === key) {
      return true;
    }
    var endDate = event.dateEnd || event.date;
    return key >= event.date && key <= endDate;
  }

  function eventsForDate(date) {
    var key = dateKey(date);
    return EVENTS.filter(function (event) {
      return eventCoversDate(event, key);
    }).sort(function (a, b) {
      var aEnd = a.dateEnd || a.date;
      var bEnd = b.dateEnd || b.date;
      return (aEnd === a.date ? 0 : 1) - (bEnd === b.date ? 0 : 1);
    });
  }

  function monthHasEvents(monthDate) {
    var y = monthDate.getFullYear();
    var m = monthDate.getMonth();
    var first = new Date(y, m, 1);
    var last = new Date(y, m + 1, 0);
    var firstKey = dateKey(first);
    var lastKey = dateKey(last);

    return EVENTS.some(function (event) {
      var evStart = event.date;
      var evEnd = event.dateEnd || event.date;
      return evStart <= lastKey && evEnd >= firstKey;
    });
  }

  function renderWeekdays() {
    var lang = currentLanguage();
    var fragment = document.createDocumentFragment();

    LABELS[lang].weekday.forEach(function (label, index) {
      var cell = document.createElement("span");
      cell.className = "calendar__weekday";
      cell.setAttribute("role", "columnheader");
      cell.setAttribute("aria-label", LABELS[lang].weekdayFull[index]);
      cell.textContent = label;
      fragment.appendChild(cell);
    });

    weekdays.replaceChildren(fragment);
  }

  function createDayCell(date, focusKey) {
    var cell = document.createElement("div");
    cell.className = "calendar__cell";
    cell.setAttribute("role", "gridcell");

    var isCurrentMonth = date.getMonth() === viewedMonth.getMonth();
    if (!isCurrentMonth) {
      var outside = document.createElement("span");
      outside.className = "calendar__outside-day";
      outside.textContent = String(date.getDate());
      cell.appendChild(outside);
      return cell;
    }

    var key = dateKey(date);
    var events = eventsForDate(date);
    var button = document.createElement("button");
    button.className = "calendar__day";
    button.type = "button";
    button.dataset.calendarDate = key;
    button.setAttribute("aria-label", formatDate(date));
    button.setAttribute(
      "aria-pressed",
      String(Boolean(selectedDate && dateKey(selectedDate) === key))
    );
    button.tabIndex = focusKey === key ? 0 : -1;

    if (dateKey(today) === key) {
      button.classList.add("calendar__day--today");
    }

    if (selectedDate && dateKey(selectedDate) === key) {
      button.classList.add("is-selected");
    }

    var number = document.createElement("span");
    number.className = "calendar__day-number";
    number.textContent = String(date.getDate());
    button.appendChild(number);

    if (events.length > 0) {
      var eventsWrap = document.createElement("div");
      eventsWrap.className = "calendar__day-events";

      /* Render up to 2 event chips inside cell */
      var maxShown = 2;
      events.slice(0, maxShown).forEach(function (ev) {
        var pill = document.createElement("span");
        var catClass = ev.category ? "calendar__event-pill--" + ev.category : "";
        pill.className = "calendar__event-pill " + catClass;
        pill.textContent = eventText(ev.title);
        pill.title = eventText(ev.title) + " (" + (ev.dateEnd ? formatShortDate(ev.date) + " - " + formatShortDate(ev.dateEnd) : formatShortDate(ev.date)) + ")";
        eventsWrap.appendChild(pill);
      });

      if (events.length > maxShown) {
        var more = document.createElement("span");
        more.className = "calendar__more-events";
        more.textContent = "+" + (events.length - maxShown) + " " + (currentLanguage() === "en" ? "more" : "รายการ");
        eventsWrap.appendChild(more);
      }

      button.appendChild(eventsWrap);
      button.setAttribute(
        "aria-label",
        formatDate(date) + ", " + events.length + " " + LABELS[currentLanguage()].event
      );
    }

    cell.appendChild(button);
    return cell;
  }

  function renderMonth(focusSelected) {
    var lang = currentLanguage();
    monthLabel.textContent = formatMonth(viewedMonth);
    grid.setAttribute(
      "aria-label",
      LABELS[lang].monthGrid + " " + monthLabel.textContent
    );

    /* Check if current viewed month has any events */
    var hasEvents = monthHasEvents(viewedMonth);
    if (prompt) {
      prompt.textContent = hasEvents
        ? LABELS[lang].promptDefault
        : LABELS[lang].promptEmpty;
    }

    var firstOfMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1);
    var mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    var gridStart = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth(),
      1 - mondayOffset
    );
    var focusKey = selectedDate && focusSelected
      ? dateKey(selectedDate)
      : dateKey(
          today.getMonth() === viewedMonth.getMonth() &&
          today.getFullYear() === viewedMonth.getFullYear()
            ? today
            : firstOfMonth
        );
    var fragment = document.createDocumentFragment();

    for (var weekIndex = 0; weekIndex < 6; weekIndex += 1) {
      var week = document.createElement("div");
      week.className = "calendar__week";
      week.setAttribute("role", "row");

      for (var dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        var date = new Date(gridStart);
        date.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
        week.appendChild(createDayCell(date, focusKey));
      }

      fragment.appendChild(week);
    }

    grid.replaceChildren(fragment);
  }

  function appendLocalizedText(parent, tagName, className, value) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = eventText(value);
    parent.appendChild(element);
    return element;
  }

  /* ไอคอนเส้นบางแบบเดียวกับเมนูหลักของเว็บ */
  function svgIcon(paths, className) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("class", className);
    paths.forEach(function (d) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });
    return svg;
  }

  /* วันที่แบบเต็ม เช่น 5 พฤศจิกายน 2569 (ปี พ.ศ. สำหรับภาษาไทย) */
  function formatLongDate(key) {
    var parts = key.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    var locale = currentLanguage() === "en" ? "en-GB" : "th-TH-u-ca-buddhist";
    return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  }

  function renderEvent(event) {
    var card = document.createElement("article");
    card.className = "calendar-event";

    /* ป้ายประเภทกิจกรรม */
    var catInfo = CAT[event.category] || { th: event.category, en: event.category };
    if (catInfo) {
      var catSpan = document.createElement("span");
      catSpan.className = "calendar-event__category";
      catSpan.textContent = eventText(catInfo);
      card.appendChild(catSpan);
    }

    /* ชื่อกิจกรรม */
    appendLocalizedText(card, "h4", "calendar-event__title", event.title);

    /* วันที่และเวลา */
    var meta = document.createElement("div");
    meta.className = "calendar-event__meta";

    var dateText = event.dateEnd && event.dateEnd !== event.date
      ? formatLongDate(event.date) + " – " + formatLongDate(event.dateEnd)
      : formatLongDate(event.date);
    var dateRow = document.createElement("p");
    dateRow.className = "calendar-event__row";
    dateRow.appendChild(svgIcon(["M3 5h18v16H3z", "M3 10h18", "M8 2v4", "M16 2v4"], "calendar-event__icon"));
    dateRow.appendChild(document.createElement("span")).textContent = dateText;
    meta.appendChild(dateRow);

    var timeText = eventText(event.time);
    if (timeText) {
      var timeRow = document.createElement("p");
      timeRow.className = "calendar-event__row";
      timeRow.appendChild(svgIcon(["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3 2"], "calendar-event__icon"));
      timeRow.appendChild(document.createElement("span")).textContent = timeText;
      meta.appendChild(timeRow);
    }
    card.appendChild(meta);

    var divider = document.createElement("div");
    divider.className = "calendar-event__divider";
    card.appendChild(divider);

    /* รายละเอียด */
    if (event.description) {
      var heading = document.createElement("h5");
      heading.className = "calendar-event__heading";
      heading.textContent = currentLanguage() === "en" ? "Details" : "รายละเอียด";
      card.appendChild(heading);
      appendLocalizedText(card, "p", "calendar-event__text", event.description);
    }

    var actions = document.createElement("div");
    actions.className = "calendar-event__actions";

    /* ปุ่มไปยังหน้าบริการที่เกี่ยวข้อง */
    var detailsHref = event.href || "https://reg.up.ac.th";
    var detailsLink = document.createElement("a");
    detailsLink.className = "calendar-event__link";
    detailsLink.href = detailsHref;
    if (detailsHref.indexOf("http") === 0) {
      detailsLink.target = "_blank";
      detailsLink.rel = "noopener noreferrer";
    }
    detailsLink.appendChild(svgIcon(["M14 4h6v6", "M20 4l-9 9", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"], "calendar-event__icon"));
    var linkText = document.createElement("span");
    linkText.textContent = eventText(event.linkLabel) || LABELS[currentLanguage()].viewEvent;
    detailsLink.appendChild(linkText);
    actions.appendChild(detailsLink);

    var documents = event.documents || (event.documentUrl
      ? [{ url: event.documentUrl, label: event.documentLabel }]
      : []);

    documents.forEach(function (doc) {
      var downloadLink = document.createElement("a");
      downloadLink.className = "calendar-event__link";
      downloadLink.href = doc.url;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";
      downloadLink.download = "";
      downloadLink.textContent =
        eventText(doc.label) || LABELS[currentLanguage()].download;
      actions.appendChild(downloadLink);
    });

    card.appendChild(actions);
    eventList.appendChild(card);
  }

  function renderDetails() {
    if (!selectedDate) {
      details.hidden = true;
      layout.classList.remove("is-selected");
      if (prompt) prompt.hidden = false;
      return;
    }

    details.hidden = false;
    layout.classList.add("is-selected");
    if (prompt) prompt.hidden = true;
    selectedDateLabel.textContent = formatDate(selectedDate);

    var events = eventsForDate(selectedDate);
    eventList.replaceChildren();
    emptyState.hidden = events.length > 0;
    events.forEach(renderEvent);
  }

  function selectDate(date, focusButton) {
    selectedDate = startOfDay(date);
    renderMonth(true);
    renderDetails();

    if (focusButton) {
      var selectedButton = grid.querySelector(
        '[data-calendar-date="' + dateKey(selectedDate) + '"]'
      );
      if (selectedButton) {
        selectedButton.focus();
      }
    }

    if (window.matchMedia("(max-width: 47.99rem)").matches && !details.hidden) {
      details.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
    }
  }

  function shiftMonth(amount) {
    viewedMonth = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth() + amount,
      1
    );
    selectedDate = null;
    renderMonth(false);
    renderDetails();
  }

  function onGridClick(event) {
    var button = event.target.closest("[data-calendar-date]");
    if (!button) {
      return;
    }
    selectDate(dateFromKey(button.dataset.calendarDate), true);
  }

  function onGridKeydown(event) {
    var button = event.target.closest("[data-calendar-date]");
    if (!button) {
      return;
    }

    var moves = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7
    };
    var amount = moves[event.key];
    if (!amount) {
      return;
    }

    event.preventDefault();
    var targetDate = dateFromKey(button.dataset.calendarDate);
    targetDate.setDate(targetDate.getDate() + amount);

    if (
      targetDate.getMonth() !== viewedMonth.getMonth() ||
      targetDate.getFullYear() !== viewedMonth.getFullYear()
    ) {
      viewedMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    }

    selectedDate = targetDate;
    renderMonth(true);
    renderDetails();
    var nextButton = grid.querySelector(
      '[data-calendar-date="' + dateKey(targetDate) + '"]'
    );
    if (nextButton) {
      nextButton.focus();
    }
  }

  /* ==========================================================================
     Staff Management Modal Logic
     ========================================================================== */

  function renderStaffTable(filterKeyword) {
    if (!tableList) return;
    var kw = (filterKeyword || "").trim().toLowerCase();

    var filtered = EVENTS.filter(function (ev) {
      if (!kw) return true;
      var titleStr = (eventText(ev.title) || "").toLowerCase();
      var descStr = (eventText(ev.description) || "").toLowerCase();
      var catStr = (CAT[ev.category] ? CAT[ev.category].th : ev.category).toLowerCase();
      return titleStr.indexOf(kw) !== -1 || descStr.indexOf(kw) !== -1 || catStr.indexOf(kw) !== -1;
    });

    if (eventCountEl) {
      eventCountEl.textContent = String(filtered.length);
    }

    tableList.replaceChildren();

    if (filtered.length === 0) {
      var noItem = document.createElement("div");
      noItem.style.padding = "1rem";
      noItem.style.color = "#6F687A";
      noItem.style.textAlign = "center";
      noItem.textContent = "ไม่พบรายการที่ค้นหา";
      tableList.appendChild(noItem);
      return;
    }

    filtered.forEach(function (ev) {
      var row = document.createElement("div");
      row.className = "calendar-item-row";

      var info = document.createElement("div");
      info.className = "calendar-item-row__info";

      var title = document.createElement("div");
      title.className = "calendar-item-row__title";
      title.textContent = eventText(ev.title);
      title.title = eventText(ev.title);
      info.appendChild(title);

      var meta = document.createElement("div");
      meta.className = "calendar-item-row__meta";

      var catTag = document.createElement("span");
      catTag.style.fontWeight = "700";
      catTag.style.color = "#582C83";
      catTag.textContent = CAT[ev.category] ? CAT[ev.category].th : ev.category;
      meta.appendChild(catTag);

      var dates = document.createElement("span");
      dates.className = "calendar-item-row__dates";
      dates.textContent = "📅 " + formatShortDate(ev.date) + (ev.dateEnd ? " – " + formatShortDate(ev.dateEnd) : "");
      meta.appendChild(dates);

      info.appendChild(meta);
      row.appendChild(info);

      var actions = document.createElement("div");
      actions.className = "calendar-item-row__actions";

      var editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "calendar-item-btn calendar-item-btn--edit";
      editBtn.textContent = "แก้ไข";
      editBtn.addEventListener("click", function () {
        populateFormForEdit(ev);
      });
      actions.appendChild(editBtn);

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "calendar-item-btn calendar-item-btn--delete";
      delBtn.textContent = "ลบ";
      delBtn.addEventListener("click", function () {
        deleteEvent(ev.id);
      });
      actions.appendChild(delBtn);

      row.appendChild(actions);
      tableList.appendChild(row);
    });
  }

  function resetForm() {
    if (!form) return;
    form.reset();
    if (formId) formId.value = "";
    if (formHeading) formHeading.textContent = "เพิ่ม / แก้ไขกำหนดการ";
    if (formMode) {
      formMode.textContent = "โหมด: เพิ่มรายการใหม่";
      formMode.style.color = "#582C83";
    }
    if (formCancel) formCancel.style.display = "none";
  }

  function populateFormForEdit(ev) {
    if (!form) return;
    if (formId) formId.value = ev.id;
    if (formTitle) formTitle.value = eventText(ev.title);
    if (formCategory) formCategory.value = ev.category || "register";
    if (formStart) formStart.value = ev.date || "";
    if (formEnd) formEnd.value = ev.dateEnd || ev.date || "";
    if (formLink) formLink.value = ev.href || "";
    if (formDesc) formDesc.value = eventText(ev.description) || "";

    if (formHeading) formHeading.textContent = "แก้ไขกำหนดการ: " + eventText(ev.title);
    if (formMode) {
      formMode.textContent = "โหมด: กำลังแก้ไขกำหนดการ";
      formMode.style.color = "#B45309";
    }
    if (formCancel) formCancel.style.display = "inline-flex";

    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function deleteEvent(id) {
    if (!window.confirm("ยืนยันการลบกำหนดการนี้หรือไม่?")) {
      return;
    }
    EVENTS = EVENTS.filter(function (e) {
      return e.id !== id;
    });
    saveEvents(EVENTS);
    renderStaffTable(searchEl ? searchEl.value : "");
    renderMonth(Boolean(selectedDate));
    renderDetails();
  }

  function onFormSubmit(e) {
    e.preventDefault();
    var id = formId ? formId.value : "";
    var titleVal = formTitle.value.trim();
    var catVal = formCategory.value;
    var startVal = formStart.value;
    var endVal = formEnd.value || startVal;
    var linkVal = formLink.value.trim();
    var descVal = formDesc.value.trim();

    if (!titleVal || !startVal) {
      alert("กรุณากรอกชื่อกิจกรรมและวันเริ่มต้น");
      return;
    }

    if (endVal < startVal) {
      alert("วันสิ้นสุดต้องไม่เกิดขึ้นก่อนวันเริ่มต้น");
      return;
    }

    if (id) {
      /* Update existing */
      var existing = EVENTS.find(function (item) {
        return item.id === id;
      });
      if (existing) {
        existing.title = { th: titleVal, en: titleVal };
        existing.category = catVal;
        existing.date = startVal;
        existing.dateEnd = endVal;
        existing.href = linkVal || (existing.href || "announce-form.html");
        existing.description = { th: descVal, en: descVal };
      }
    } else {
      /* Create new */
      var newEv = {
        id: "custom-" + Date.now(),
        title: { th: titleVal, en: titleVal },
        category: catVal,
        date: startVal,
        dateEnd: endVal,
        href: linkVal || "announce-form.html",
        description: { th: descVal, en: descVal }
      };
      EVENTS.push(newEv);
    }

    saveEvents(EVENTS);
    renderStaffTable(searchEl ? searchEl.value : "");
    renderMonth(Boolean(selectedDate));
    renderDetails();
    resetForm();
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  }

  function resetToDefaults() {
    if (!window.confirm("ยืนยันการคืนค่าเริ่มต้นตามประกาศทางการหรือไม่? การเปลี่ยนแปลงทั้งหมดจะถูกรีเซ็ต")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    EVENTS = DEFAULT_EVENTS.slice();
    saveEvents(EVENTS);
    renderStaffTable(searchEl ? searchEl.value : "");
    renderMonth(Boolean(selectedDate));
    renderDetails();
    resetForm();
    alert("คืนค่าเริ่มต้นตามประกาศเรียบร้อยแล้ว");
  }

  function initScrollAnimation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var visible = false;

    function show() {
      section.classList.remove("is-armed", "is-in");
      section.classList.add("is-armed");
      void section.offsetWidth;
      section.classList.add("is-in");
    }

    function syncVisibility(nextVisible) {
      if (nextVisible === visible) {
        return;
      }
      visible = nextVisible;
      if (visible) {
        show();
      } else {
        section.classList.remove("is-armed", "is-in");
      }
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            syncVisibility(entry.isIntersecting);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(section);
    } else {
      function checkVisibility() {
        var rect = section.getBoundingClientRect();
        syncVisibility(
          rect.top < window.innerHeight * 0.9 &&
            rect.bottom > window.innerHeight * 0.1
        );
      }
      window.addEventListener("scroll", checkVisibility, { passive: true });
      window.addEventListener("resize", checkVisibility);
      checkVisibility();
    }
  }

  /* Listeners */
  section.querySelector("[data-calendar-prev]").addEventListener("click", function () {
    shiftMonth(-1);
  });
  section.querySelector("[data-calendar-next]").addEventListener("click", function () {
    shiftMonth(1);
  });
  var todayBtn = section.querySelector("[data-calendar-today]");
  if (todayBtn) {
    todayBtn.addEventListener("click", function () {
      viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      selectDate(today, true);
    });
  }
  section.querySelector("[data-calendar-back]").addEventListener("click", function () {
    selectedDate = null;
    renderMonth(false);
    renderDetails();
    var focusTarget = section.querySelector(".calendar__day--today") || section.querySelector(".calendar__day");
    if (focusTarget) focusTarget.focus();
  });

  /* Staff dialog open / close */
  if (staffBtn && dialog) {
    staffBtn.addEventListener("click", function () {
      resetForm();
      renderStaffTable();
      dialog.showModal();
    });
  }

  if (dialogClose && dialog) {
    dialogClose.addEventListener("click", function () {
      dialog.close();
    });
  }

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  }

  if (form) {
    form.addEventListener("submit", onFormSubmit);
  }

  if (formCancel) {
    formCancel.addEventListener("click", resetForm);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetToDefaults);
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      renderStaffTable(searchEl.value);
    });
  }

  grid.addEventListener("click", onGridClick);
  grid.addEventListener("keydown", onGridKeydown);
  document.addEventListener("gu:languagechange", function () {
    renderWeekdays();
    renderMonth(Boolean(selectedDate));
    renderDetails();
  });

  renderWeekdays();
  renderMonth(false);
  initScrollAnimation();
})();
