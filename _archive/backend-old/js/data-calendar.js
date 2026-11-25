/* ข้อมูลตัวอย่างปฏิทิน: คัดจากกิจกรรมใน js/calendar.js (DEFAULT_EVENTS) 13 รายการ ใช้เฉพาะต้นแบบ UI */
(function () {
  "use strict";
  window.GUBD = window.GUBD || {};
  window.GUBD.calendarSeed = [
    {
      "id": "cal-1",
      "titleTh": "วันเปิดภาคการศึกษาปลาย ปีการศึกษา 2569",
      "titleEn": "First day of classes (Semester 2/2026)",
      "date": "2026-11-02",
      "dateEnd": "2026-11-02",
      "label": "ลงทะเบียน",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-2",
      "titleTh": "ลงทะเบียนเรียนล่าช้า และเพิ่ม-ถอนรายวิชาไม่ได้รับอักษร W",
      "titleEn": "Late registration and add/drop period without grade W",
      "date": "2026-11-02",
      "dateEnd": "2026-11-13",
      "label": "ลงทะเบียน",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-3",
      "titleTh": "ช่วงเวลายื่น บศ.1 เสนอหัวข้อวิทยานิพนธ์และแต่งตั้งอาจารย์ที่ปรึกษา (ภาคปลาย)",
      "titleEn": "Form GS.1 submission period (Thesis topic & advisor proposal - Sem 2)",
      "date": "2026-11-02",
      "dateEnd": "2026-11-27",
      "label": "บศ.1",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-4",
      "titleTh": "นิสิตยื่นคำร้องขอสำเร็จการศึกษา (UP24) และชำระค่าขึ้นทะเบียนปริญญาบัตร",
      "titleEn": "Students apply for graduation (UP24) and pay degree fee",
      "date": "2026-11-02",
      "dateEnd": "2026-12-01",
      "label": "วิทยานิพนธ์",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-5",
      "titleTh": "ชำระเงินค่าลงทะเบียนเรียนทุกชั้นปี สำหรับนิสิตที่ลงทะเบียนล่าช้า",
      "titleEn": "Tuition payment for late registrants",
      "date": "2026-11-03",
      "dateEnd": "2026-11-13",
      "label": "ลงทะเบียน",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-6",
      "titleTh": "นิสิตยื่นคำร้องขอถอนรายวิชาโดยได้รับอักษร W (UP08)",
      "titleEn": "Course withdrawal period with grade W (UP08)",
      "date": "2026-11-14",
      "dateEnd": "2027-01-29",
      "label": "คำร้อง",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-7",
      "titleTh": "วันสมัครสอบและชำระเงินค่าสมัครสอบวัดคุณสมบัติ (QE) ครั้งที่ 1",
      "titleEn": "Application and fee payment for Qualifying Examination (QE) No. 1",
      "date": "2026-11-16",
      "dateEnd": "2026-11-20",
      "label": "การสอบ",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-8",
      "titleTh": "วันสมัครสอบและชำระเงินค่าสอบวัดคุณสมบัติ (QE) ครั้งที่ 1 ล่าช้า",
      "titleEn": "Late registration and fee payment for QE Round 1",
      "date": "2026-11-23",
      "dateEnd": "2026-11-27",
      "label": "การสอบ",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-9",
      "titleTh": "ช่วงเวลาพิจารณาคำร้อง บศ.1 และคำร้องทั่วไป โดยคณะและบัณฑิตวิทยาลัย",
      "titleEn": "Faculty & Graduate School review period for Form GS.1 & general petitions",
      "date": "2026-11-30",
      "dateEnd": "2026-12-15",
      "label": "พิจารณา",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-10",
      "titleTh": "วันสอบวัดคุณสมบัติ (Qualifying Examination - QE) ครั้งที่ 1",
      "titleEn": "Qualifying Examination (QE) test dates - Round 1",
      "date": "2026-12-11",
      "dateEnd": "2026-12-13",
      "label": "การสอบ",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-11",
      "titleTh": "วันสุดท้ายของการชำระค่าลงทะเบียนเรียน (กรณีได้รับอนุมัติให้ผ่อนผัน UP18)",
      "titleEn": "Final tuition payment deadline for deferred students",
      "date": "2026-12-18",
      "dateEnd": "2026-12-18",
      "label": "ลงทะเบียน",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-12",
      "titleTh": "วันสมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์ (สมัครที่คณะ/วิทยาลัย)",
      "titleEn": "Thesis research grant application period (Round 2)",
      "date": "2026-12-21",
      "dateEnd": "2026-12-25",
      "label": "ทุนอุดหนุน",
      "href": "",
      "visible": true
    },
    {
      "id": "cal-13",
      "titleTh": "ช่วงเวลาพิจารณาคุณสมบัติผู้สมัครขอรับทุนอุดหนุนการทำวิทยานิพนธ์",
      "titleEn": "Committee review period for thesis grant applicants",
      "date": "2026-12-28",
      "dateEnd": "2027-01-05",
      "label": "พิจารณา",
      "href": "",
      "visible": true
    }
  ];
})();
