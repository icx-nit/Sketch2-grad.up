/* ==========================================================================
   announce-scholarship.js — หน้าทุนอุดหนุนการทำวิทยานิพนธ์ (ดีไซน์เดียวกับหน้าคำสั่งแต่งตั้ง)
   ข้อมูลจริงจากหน้า grad.up.ac.th/announce/investment (รายชื่อผู้ได้รับทุน ปีการศึกษา 2562–2569, 53 ฉบับ)
   ไฟล์เอกสารเก็บไว้ในโปรเจกต์ที่ uploads/scholarship เพื่อให้ดาวน์โหลด/ดูตัวอย่างได้จริง
   ========================================================================== */
(function () {
  "use strict";

  var PAGE_SIZE = 10;
  var SOURCE_URL = "https://grad.up.ac.th/";
  var FILE_BASE = "uploads/scholarship/";
  var PREVIEW_BASE = "uploads/scholarship/preview/";

  var CATEGORIES = [
    { id: "2569", label: "2569", en: "2569" },
    { id: "2568", label: "2568", en: "2568" },
    { id: "2567", label: "2567", en: "2567" },
    { id: "2566", label: "2566", en: "2566" },
    { id: "2565", label: "2565", en: "2565" },
    { id: "2564", label: "2564", en: "2564" },
    { id: "2563", label: "2563", en: "2563" },
    { id: "2562", label: "2562", en: "2562" }
  ];

  var FORMS = [
    { cat: "2569", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2569 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2569 (B.E.), No. 2", label: "19 ต.ค. 2569", date: "2026-10-19", views: 21, file: "ann-1297.pdf", ext: "pdf" },
    { cat: "2569", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2569", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2569 (B.E.)", label: "27 ส.ค. 2569", date: "2026-08-27", views: 38, file: "ann-1292.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 8, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 8", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 8", label: "13 ก.ค. 2569", date: "2026-07-13", views: 30, file: "ann-1290.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 7, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 7", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 7", label: "26 พ.ค. 2569", date: "2026-05-26", views: 47, file: "ann-1286.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 6", label: "16 เม.ย. 2569", date: "2026-04-16", views: 30, file: "ann-1281.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 5", label: "19 ก.พ. 2569", date: "2026-02-19", views: 34, file: "ann-1275.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 4", label: "9 ม.ค. 2569", date: "2026-01-09", views: 36, file: "ann-1272.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 3", label: "22 ต.ค. 2568", date: "2025-10-22", views: 37, file: "ann-1271.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.), No. 2", label: "15 ก.ย. 2568", date: "2025-09-15", views: 33, file: "ann-1268.pdf", ext: "pdf" },
    { cat: "2568", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2568", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2568 (B.E.)", label: "8 ส.ค. 2568", date: "2025-08-08", views: 50, file: "ann-1264.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.), No. 6", label: "11 มิ.ย. 2568", date: "2025-06-11", views: 45, file: "ann-1257.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.), No. 5", label: "3 เม.ย. 2568", date: "2025-04-03", views: 58, file: "ann-1254.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.), No. 4", label: "14 ก.พ. 2568", date: "2025-02-14", views: 25, file: "ann-1249.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.), No. 3", label: "7 ม.ค. 2568", date: "2025-01-07", views: 24, file: "ann-1248.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.), No. 2", label: "23 ก.ย. 2567", date: "2024-09-23", views: 17, file: "ann-244.pdf", ext: "pdf" },
    { cat: "2567", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2567", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2567 (B.E.)", label: "7 ส.ค. 2567", date: "2024-08-07", views: 16, file: "ann-232.pdf", ext: "pdf" },
    { cat: "2566", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2566 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2566 (B.E.), No. 5", label: "5 มิ.ย. 2567", date: "2024-06-05", views: 6, file: "ann-222.pdf", ext: "pdf" },
    { cat: "2566", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2566 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2566 (B.E.), No. 4", label: "5 มี.ค. 2567", date: "2024-03-05", views: 7, file: "ann-215.pdf", ext: "pdf" },
    { cat: "2566", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2566 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2566 (B.E.), No. 3", label: "2 ม.ค. 2567", date: "2024-01-02", views: 10, file: "ann-211.pdf", ext: "pdf" },
    { cat: "2566", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2566 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2566 (B.E.), No. 2", label: "21 ต.ค. 2566", date: "2023-10-21", views: 7, file: "ann-207.pdf", ext: "pdf" },
    { cat: "2566", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2566", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2566 (B.E.)", label: "31 ส.ค. 2566", date: "2023-08-31", views: 7, file: "ann-206.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 7, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 7", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 7", label: "15 มิ.ย. 2566", date: "2023-06-15", views: 2, file: "ann-196.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 6", label: "30 เม.ย. 2566", date: "2023-04-30", views: 1, file: "ann-193.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 5", label: "8 มี.ค. 2566", date: "2023-03-08", views: 0, file: "ann-188.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 4", label: "19 ม.ค. 2566", date: "2023-01-19", views: 1, file: "ann-185.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 3", label: "6 ธ.ค. 2565", date: "2022-12-06", views: 1, file: "ann-181.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.), No. 2", label: "19 ต.ค. 2565", date: "2022-10-19", views: 1, file: "ann-177.pdf", ext: "pdf" },
    { cat: "2565", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2565", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2565 (B.E.)", label: "24 ส.ค. 2565", date: "2022-08-24", views: 1, file: "ann-176.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 7, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 7", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 7", label: "15 มิ.ย. 2565", date: "2022-06-15", views: 0, file: "ann-166.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 6", label: "9 พ.ค. 2565", date: "2022-05-09", views: 0, file: "ann-165.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 5", label: "9 มี.ค. 2565", date: "2022-03-09", views: 0, file: "ann-159.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 4", label: "2 ก.พ. 2565", date: "2022-02-02", views: 0, file: "ann-158.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 3", label: "3 ธ.ค. 2564", date: "2021-12-03", views: 0, file: "ann-154.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.), No. 2", label: "15 ต.ค. 2564", date: "2021-10-15", views: 0, file: "ann-150.pdf", ext: "pdf" },
    { cat: "2564", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2564", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2564 (B.E.)", label: "24 ส.ค. 2564", date: "2021-08-24", views: 0, file: "ann-147.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 8, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 8", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 8", label: "9 ก.ค. 2564", date: "2021-07-09", views: 0, file: "ann-143.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 7, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 7", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 7", label: "16 มิ.ย. 2564", date: "2021-06-16", views: 0, file: "ann-142.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 6", label: "14 พ.ค. 2564", date: "2021-05-14", views: 0, file: "ann-133.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 5", label: "29 มี.ค. 2564", date: "2021-03-29", views: 0, file: "ann-129.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 4", label: "17 ก.พ. 2564", date: "2021-02-17", views: 0, file: "ann-126.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 3", label: "15 ธ.ค. 2563", date: "2020-12-15", views: 0, file: "ann-119.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.), No. 2", label: "28 ต.ค. 2563", date: "2020-10-28", views: 0, file: "ann-114.pdf", ext: "pdf" },
    { cat: "2563", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2563", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2563 (B.E.)", label: "24 ก.ย. 2563", date: "2020-09-24", views: 0, file: "ann-111.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 10, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 10", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 10", label: "17 ส.ค. 2563", date: "2020-08-17", views: 0, file: "ann-107.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 9, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 9", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 9", label: "21 ก.ค. 2563", date: "2020-07-21", views: 0, file: "ann-53.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 8, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 8", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 8", label: "21 ก.ค. 2563", date: "2020-07-21", views: 0, file: "ann-52.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 7, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 7", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 7", label: "20 ก.ค. 2563", date: "2020-07-20", views: 0, file: "ann-51.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 6, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 6", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 6", label: "20 ก.ค. 2563", date: "2020-07-20", views: 0, file: "ann-50.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 5, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 5", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 5", label: "20 ก.ค. 2563", date: "2020-07-20", views: 0, file: "ann-49.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 4, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ที่ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 4", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 4", label: "19 ก.พ. 2563", date: "2020-02-19", views: 0, file: "ann-46.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 3, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 3", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 3", label: "19 ก.พ. 2563", date: "2020-02-19", views: 0, file: "ann-45.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 2, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562 ฉบับที่ 2", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.), No. 2", label: "19 ก.พ. 2563", date: "2020-02-19", views: 0, file: "ann-44.pdf", ext: "pdf" },
    { cat: "2562", code: "", num: 0, title: "ประกาศมหาวิทยาลัยพะเยา เรื่อง รายชื่อผู้ได้รับทุนอุดหนุนการทำวิทยานิพนธ์ ปีการศึกษา 2562", en: "University of Phayao: List of thesis research grant recipients, Academic Year 2562 (B.E.)", label: "19 ก.พ. 2563", date: "2020-02-19", views: 0, file: "ann-43.pdf", ext: "pdf" },
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
  var chipCountEl = document.getElementById("chip-count");

  if (!tabsEl || !listEl) {
    return;
  }

  var state = { cat: "2569", query: "", ascending: false, page: 1 };

  /* ---------- ข้อความสองภาษา (ไทย / English) ---------- */
  var PT = {
    th: {
      "doc.title": "ทุนอุดหนุนการทำวิทยานิพนธ์ | GRAD UP",
      "crumb.home": "หน้าหลัก",
      "page.title": "ทุนอุดหนุนการทำวิทยานิพนธ์",
      "cat.label": "เลือกปีการศึกษา:",
      "year.option": "พ.ศ. {y}",
      "stat.cats": "ปีการศึกษา",
      "stat.total": "รายการทั้งหมด",
      "stat.files": "มีไฟล์แล้ว",
      "stat.latest": "ปรับปรุงล่าสุด",
      "count.cats": "{n} ปี",
      "count.items": "{n} ฉบับ",
      "chip.all": "ทั้งหมด",
      "search.label": "ค้นหารายชื่อ",
      "search.placeholder": "ค้นหาจากชื่อประกาศ หรือเลขฉบับ",
      "sort.asc": "ลำดับเก่าไปใหม่",
      "sort.desc": "ลำดับเดิมจากเว็บ",
      "caption": "แสดงรายชื่อผู้ได้รับทุนปีการศึกษา {cat}",
      "year.label": "ปีการศึกษา {y}",
      "badge.num": "ฉบับที่ {n}",
      "btn.download": "ดาวน์โหลด",
      "btn.preview": "ดูตัวอย่าง",
      "btn.nofile": "ยังไม่มีไฟล์",
      "unit.views": "ครั้ง",
      "empty.none": "ยังไม่มีรายการในปีการศึกษานี้",
      "empty.search": "ไม่พบรายการที่ตรงกับการค้นหา",
      "empty.note": "ดูรายการทั้งหมดได้ที่เว็บต้นทาง",
      "empty.link": "ไปที่เว็บ GRAD",
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
      "doc.title": "Scholarship Recipients for Thesis Research | GRAD UP",
      "crumb.home": "Home",
      "page.title": "Thesis Research Scholarship Recipients",
      "cat.label": "Academic year:",
      "year.option": "B.E. {y}",
      "stat.cats": "Academic years",
      "stat.total": "Total entries",
      "stat.files": "With files",
      "stat.latest": "Last updated",
      "count.cats": "{n} years",
      "count.items": "{n} issues",
      "chip.all": "All",
      "search.label": "Search recipients",
      "search.placeholder": "Search by title or issue number",
      "sort.asc": "Oldest to newest",
      "sort.desc": "Original website order",
      "caption": "Showing recipients for academic year {cat}",
      "year.label": "Academic Year {y}",
      "badge.num": "Issue {n}",
      "btn.download": "Download",
      "btn.preview": "Preview",
      "btn.nofile": "No file yet",
      "unit.views": "views",
      "empty.none": "No entries for this academic year",
      "empty.search": "No entries match your search",
      "empty.note": "See all items on the original website",
      "empty.link": "Open the GRAD website",
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
    if (item.code) return item.code;
    if (item.date) return t("badge.be") + (parseInt(item.date.slice(0, 4), 10) + 543);
    return item.label;
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
      return numberOf(b) - numberOf(a);
    });
    return list;
  }

  /* ---------- แท็บหมวด ---------- */

  /* ปีเดียว: กล่องเลือกปีแบบเดียวกับหน้าคำสั่ง แสดงเฉพาะปีที่เลือก */
  function renderTabs() {
    tabsEl.textContent = "";
    var label = el("label", "year-select");
    var srOnly = el("span", "visually-hidden", t("cat.label"));
    var select = el("select");
    select.id = "cat-select";
    CATEGORIES.forEach(function (cat) {
      var option = el("option", null, t("year.option", { y: cat.id }));
      option.value = cat.id;
      if (cat.id === state.cat) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      state.cat = select.value;
      state.page = 1;
      renderAll();
    });
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "2");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.setAttribute("aria-hidden", "true");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m6 9 6 6 6-6");
    icon.appendChild(path);
    label.appendChild(srOnly);
    label.appendChild(select);
    label.appendChild(icon);
    tabsEl.appendChild(label);
  }

  /* ---------- แถวรายการ ---------- */

  function buildRow(item) {
    var row = el("article", "doc-row doc-row--board");

    var icon = el("div", "doc-row__icon");
    icon.appendChild(svgIcon(ICONS.doc));

    var body = el("div", "doc-row__body");
    var badges = el("div", "doc-row__badges");
    if (item.num) badges.appendChild(el("span", "badge badge--year", t("badge.num", { n: item.num })));

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
    if (item.file) {
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
    } else {
      var off = el("span", "cmd-btn cmd-btn--solid is-disabled");
      off.setAttribute("aria-disabled", "true");
      off.appendChild(svgIcon(ICONS.download));
      off.appendChild(el("span", null, t("btn.nofile")));
      actions.appendChild(off);

      var offPreview = el("span", "doc-row__preview is-disabled");
      offPreview.setAttribute("aria-disabled", "true");
      offPreview.appendChild(svgIcon(ICONS.eye));
      offPreview.appendChild(el("span", null, t("btn.preview")));
      actions.appendChild(offPreview);
    }

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
    captionEl.textContent = t("caption", { cat: state.cat });

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
    var withFile = FORMS.filter(function (f) { return !!f.file; }).length;
    var latest = FORMS.reduce(function (acc, f) {
      return !acc || f.date > acc.date ? f : acc;
    }, null);
    var set = function (id, text) {
      var node = document.getElementById(id);
      if (node) node.textContent = text;
    };
    set("stat-cats", t("count.cats", { n: CATEGORIES.length }));
    set("stat-total", t("count.items", { n: FORMS.length }));
    set("stat-with", t("count.items", { n: withFile }));
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
      btn.appendChild(el("span", "search-suggest__meta", badgeText(item) + " · " + item.label));
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
  } else {
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
