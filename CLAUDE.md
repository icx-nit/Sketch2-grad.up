# CLAUDE.md

คู่มือสำหรับ Claude ในการทำงานกับโปรเจกต์เว็บไซต์บัณฑิตวิทยาลัย มหาวิทยาลัยพะเยา (GRAD UP)
อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง และอ่านไฟล์เอกสารย่อยที่อ้างอิงด้านล่างประกอบ

## ภาพรวมโปรเจกต์

- เว็บไซต์แบบ Static ไม่มีฐานข้อมูลและไม่มีระบบหลังบ้านในปัจจุบัน
<<<<<<< HEAD
- Deploy อัตโนมัติจาก Git Branch `main` ไปที่ https://sketch2-grad-up.vercel.app (Remote: `origin`, `github`, `gitlab`)
- หน้าเว็บ: `index.html` (หน้าหลัก), `statistics.html`, `login.html`, `cookie-policy.html` และ `announce-*.html` (command, exam, form, guidebook, other, scholarship)
- ข้อมูลที่แสดงเกือบทั้งหมดเป็นข้อมูลจำลอง (Mock) ยกเว้นข่าวบางรายการที่ระบุลิงก์จริงแล้ว
=======
- หน้าหลักคือ `index.html` ส่วนหน้าแยกอื่นได้แก่ `statistics.html`, `login.html`, `cookie-policy.html` และหน้า `announce-*.html`
- ข้อมูลทั้งหมดที่แสดงในตอนนี้เป็นข้อมูลจำลอง (Mock) ยกเว้นข่าวบางรายการที่ระบุลิงก์จริงแล้ว
>>>>>>> Second-edit-to-the-request

## Tech Stack

- HTML5, CSS3 และ Vanilla JavaScript (รูปแบบ IIFE และ `var` ตามโค้ดเดิม) เท่านั้น
- ไม่มี Build Tool ไม่มี Package Manager ในการรันหน้าเว็บ และไม่มีขั้นตอนคอมไพล์
- ฟอนต์: `Anuphan` สำหรับหัวข้อ และ `Sarabun` สำหรับเนื้อหา (Google Fonts ผ่าน CSS Variables)
- ธีม: `data-theme` บน `<html>` รองรับ Light/Dark Mode (`js/theme.js`)
- ภาษา: `data-i18n` และ `data-lang` ไทย/อังกฤษ (`js/i18n.js`) ส่งอีเวนต์ `gu:languagechange` เมื่อเปลี่ยนภาษา
- ค่าที่จำในเบราว์เซอร์ (localStorage): `gu-language`, `gu-theme`, `gu-font-size`, `grad_up_calendar_events_v2`, `gu-cookie-notice`

## โครงสร้างโปรเจกต์

<<<<<<< HEAD
- `css/`: `variables.css`, `reset.css`, `style.css`, `components.css`, `responsive.css`, `header.css`, `footer.css`, `intro.css`, `animations.css`, `news.css`, `promo.css`, `calendar.css`, `support.css`, `stats.css`, `stats-dashboard.css`, `announce-command.css`, `login.css`, `policy.css`, `cookie-notice.css`
- `js/`: `main.js`, `intro.js`, `i18n.js`, `theme.js`, `font-size.js`, `navigation.js`, `components.js`, `search.js`, `animations.js`, `news.js`, `promo.js`, `calendar.js`, `stats-data.js`, `stats-page.js`, `stats-dashboard.js`, `stats-chart.js`, `announce-*.js`, `cookie-notice.js`
- `assets/images/`: รูปภาพ มาสคอต (`promo-mascot.gif`, `news-mascot.gif`), ริบบิ้น `news-ribbon.png` และรูปข่าวใน `assets/images/news/`
- `uploads/`: เอกสารประกอบ (ประกาศ คู่มือ แบบฟอร์ม) ไฟล์จริงไม่เก็บใน Git
- `.agents/skills/`: Skill ช่วยงาน ได้แก่ `accessibility`, `frontend-design`, `web-design-guidelines` (ล็อกเวอร์ชันใน `skills-lock.json`)

## ฟีเจอร์สำคัญที่ต้องระวังเวลาแก้

- **ส่วนหัว (Header)**: จอ 1200px ขึ้นไปเป็นแถวเดียว, แท็บเล็ต 768–1199px แยกสองแถวและแถบเต็มความกว้าง
- **ข่าวสารล่าสุด**: สไลด์เด่นใน `.news-new` มีริบบิ้น "ใหม่/NEW" มุมขวาบน มาสคอตบนภาพ และแถวล่าง (`.news-new__foot`) ที่รวมลิงก์ "อ่านประกาศฉบับเต็ม" กับปุ่มเลื่อนไว้ใน flex เดียวกัน (ลิงก์สร้างโดย `js/news.js`)
- **ประกาศและข่าวสารทั่วไป**: `.news-row` พร้อมอนิเมชันเมื่อเลื่อนมาถึง (`.news.is-in`)
- **ประชาสัมพันธ์**: มาสคอตมุมขวา และป๊อปอัพประกาศ 3 ใบซ้อนกัน (`js/promo.js`) แสดงเฉพาะหน้าหลัก ปิดทีละใบ ยุบลงมาสคอตเมื่อปิดใบสุดท้าย
- **สถิติ**: ตัวกรองปีการศึกษา/เดือน/คณะ/สาขา ปัญหาที่ยังค้าง: การเลื่อนหน้าบนหน้าสถิติรู้สึกติด (ยังไม่พบสาเหตุแน่ชัด)
- **นโยบายคุกกี้**: เว็บไม่ใช้คุกกี้ติดตามหรือโฆษณา ถ้าเพิ่มคีย์ localStorage ใหม่หรือเครื่องมือวิเคราะห์ ต้องอัปเดตตารางใน `cookie-policy.html` ด้วย
=======
- `index.html`, `statistics.html`, `login.html`, `cookie-policy.html`, `announce-*.html`: หน้าเว็บ
- `css/`: ไฟล์สไตล์แยกตามส่วน เช่น `variables.css`, `news.css`, `promo.css`, `footer.css`, `login.css`, `policy.css`, `calendar.css`, `stats-dashboard.css`
- `js/`: สคริปต์แยกตามฟีเจอร์ เช่น `news.js`, `promo.js`, `calendar.js`, `stats-data.js`, `stats-page.js`, `i18n.js`, `theme.js`, `font-size.js`
- `assets/images/`: รูปภาพ รวมถึงรูปข่าวใน `assets/images/news/`
- `uploads/`: เอกสารประกอบ (ประกาศ คู่มือ แบบฟอร์ม) โดยไฟล์จริงไม่ถูกเก็บใน Git
- `.agents/skills/`: ชุดคำสั่งช่วยออกแบบและตรวจการเข้าถึง (Accessibility)
>>>>>>> Second-edit-to-the-request

## ไฟล์เอกสารย่อย (โหลดบริบทอัตโนมัติ)

@README.md
@REQUIREMENTS.md
@DESIGN.md
@PLAN.MD
@DATA_SOURCE.md

<<<<<<< HEAD
หมายเหตุ: ไฟล์แผนงานชื่อ `PLAN.MD` (ตัวพิมพ์ใหญ่ทั้งหมด) ต้องเขียนชื่อให้ตรงเมื่ออ้างอิง
ไฟล์ `AGENTS.md` คือกฎการออกแบบและการทำงานฉบับภาษาไทย ใช้ประกอบกับไฟล์ข้างต้น
=======
ไฟล์ `AGENTS.md` คือกฎการออกแบบและการทำงาน ใช้ประกอบกับไฟล์ข้างต้น (ไม่มีไฟล์ `DESING.MD` แล้ว ใช้ `DESIGN.md` แทน)
>>>>>>> Second-edit-to-the-request

## กฎการเขียนโค้ด และข้อห้าม

- ห้ามแก้ไขหรือลบ Logic เดิมที่ทำงานได้อยู่แล้ว เว้นแต่ได้รับคำสั่งให้แก้ส่วนนั้นโดยตรง
- ห้ามเปลี่ยนหรือเพิ่ม Library หลัก หรือติดตั้ง Package ใหม่โดยไม่ได้รับอนุมัติก่อน
- ห้ามสร้าง URL ขึ้นมาเองโดยคาดเดา ให้ใช้เฉพาะลิงก์ที่ระบุไว้ในเอกสารหรือที่ผู้ใช้ให้มา
- ห้ามใช้ข้อมูล Mock เป็นข้อมูลจริงใน Production และต้องบอกชัดเจนเมื่อยังเป็นข้อมูลจำลอง
- ห้ามทำให้หน้าเว็บหลักพังหากแหล่งข้อมูลภายนอกไม่ตอบสนอง
- ทุกครั้งที่แก้ CSS หรือ JS ที่ถูกโหลดจากหน้าเว็บ ต้องเพิ่มค่า `?v=` ของไฟล์นั้นในทุกหน้าที่โหลด เพื่อกันเบราว์เซอร์โหลดไฟล์เก่า
- ทุกครั้งที่แก้ UI ต้องตรวจทั้ง Light Mode, Dark Mode และ Responsive บนมือถือและแท็บเล็ต
- ใช้ HTML เชิงความหมาย (Semantic HTML) และคำนึงถึง Accessibility เช่น Focus State และ `prefers-reduced-motion`
- แยกโค้ด HTML, CSS และ JavaScript ออกจากกัน และใช้ CSS Class ที่นำกลับมาใช้ซ้ำได้
- อนิเมชันต้องไม่ทำให้เนื้อหาหายเมื่อ JavaScript ไม่ทำงาน

## ข้อควรระวังด้านความปลอดภัยและ Git

- ไม่เข้าถึงไฟล์นอกโฟลเดอร์โปรเจกต์ และไม่แก้ไขการตั้งค่าระบบ
<<<<<<< HEAD
- ไม่ Commit หรือ Push จนกว่าผู้ใช้จะสั่งอย่างชัดเจน ถ้าอยู่บน Branch หลักให้แตก Branch ก่อน (ผู้ใช้เคยสั่ง Commit บน `main` โดยตรง และ Push เองจากเทอร์มินัลเพราะระบบบล็อก `git push`)
- ก่อน Commit ให้ตรวจว่าไม่มีเครื่องหมาย Conflict (`<<<<<<<`, `=======`, `>>>>>>>`) ค้างในไฟล์ เคยทำให้หน้าบน Vercel พังมาแล้ว
=======
- ไม่ Commit หรือ Push จนกว่าผู้ใช้จะสั่งอย่างชัดเจน ถ้าอยู่บน Branch หลักให้แตก Branch ก่อน
- ก่อน Commit ให้ตรวจ `git status` และแจ้งผู้ใช้ว่ามีไฟล์ใหม่หรือไฟล์ที่แก้ค้างไว้อยู่ (ตอนนี้มีไฟล์ใหม่ที่ยังไม่ Commit เช่น `cookie-policy.html`, `css/policy.css`)
>>>>>>> Second-edit-to-the-request
- ไม่ Commit ไฟล์ที่อาจมีข้อมูลลับ เช่น `.env` หรือ Credential
- `git status` มีไฟล์ที่ถูกแก้จำนวนมากซึ่งน่าจะเป็นความต่างของ Line Ending/สิทธิ์ไฟล์ ห้าม Commit รวมโดยไม่ตรวจก่อน
- ไม่ลบไฟล์ที่ไม่แน่ใจว่าใช้งานอยู่หรือไม่ เช่น `_probe-reveal.html` และ `sedV4ok6q` ให้ถามผู้ใช้ก่อน
- ไฟล์ใน `uploads/` ไม่ได้อยู่ใน Git ยกเว้นไฟล์ตัวอย่างที่กำหนดไว้ใน `.gitignore`

## วิธีทำงาน

1. อ่านสเปกในไฟล์ `.md` ที่เกี่ยวข้องก่อนลงมือเขียนโค้ด
2. แก้เฉพาะจุดที่ได้รับคำสั่ง และรายงานว่าไฟล์ใดถูกแก้บ้าง
<<<<<<< HEAD
3. ตอบเป็นภาษาไทย ส่วนชื่อไฟล์ คลาส และโค้ดใช้ภาษาอังกฤษ
4. ตรวจ Error ในโค้ด เช่น ไวยากรณ์ JavaScript (`node --check`) และลิงก์ที่เสีย ก่อนสรุปว่าเสร็จ
5. คำสั่ง "กลับไป Design เดิม" หมายถึงย้อนการเปลี่ยนแปลงด้านภาพล่าสุดเพียงรายการเดียว
6. อัปเดต `PLAN.MD` เมื่อสถานะของงานเปลี่ยน
7. ถ้าสเปกกับโค้ดไม่ตรงกัน ให้บอกผู้ใช้และถามก่อนตัดสินใจ
=======
3. ตรวจ Error ในโค้ด เช่น ไวยากรณ์ JavaScript และลิงก์ที่เสีย ก่อนสรุปว่าเสร็จ
4. อัปเดต `PLAN.MD` เมื่อสถานะของงานเปลี่ยน
5. ถ้าสเปกกับโค้ดไม่ตรงกัน ให้บอกผู้ใช้และถามก่อนตัดสินใจ
>>>>>>> Second-edit-to-the-request
