const { DateTime, Interval } = require("luxon");
const moment = require("moment");
const momentTz = require("moment-timezone");

console.log("=== ฟีเจอร์ที่ Luxon ทำได้ดีกว่า Moment.js ===\n");

// 1. Immutability
console.log("1. Immutability Test:");
const nowLuxon = DateTime.now();
const nowMoment = moment();

const futureLuxon = nowLuxon.plus({ days: 1 });
const futureMoment = nowMoment.add(1, "days");

console.log("\nLuxon (Immutable):");
console.log("วันที่เดิม:", nowLuxon.toISO());
console.log("วันที่ใหม่:", futureLuxon.toISO());

console.log("\nMoment (Mutable):");
console.log("วันที่เดิม:", nowMoment.toISOString(), "(ถูกเปลี่ยนแปลง!)");
console.log("วันที่ใหม่:", futureMoment.toISOString());

// 2. การจัดการข้อผิดพลาด
console.log("\n2. การจัดการข้อผิดพลาด:");
const invalidDateStr = "invalid-date";

console.log("\nLuxon:");
const invalidLuxon = DateTime.fromISO(invalidDateStr);
console.log({
  isValid: invalidLuxon.isValid,
  invalidReason: invalidLuxon.invalidReason,
  invalidExplanation: invalidLuxon.invalidExplanation,
});

console.log("\nMoment:");
const invalidMoment = moment(invalidDateStr);
console.log({
  isValid: invalidMoment.isValid(),
  invalidReason: "ไม่มีการอธิบายเหตุผล",
});

// 3. การแปลงเป็น Object
console.log("\n3. การแปลงเป็น Object และกลับ:");

console.log("\nLuxon:");
const luxonObj = DateTime.now().toObject();
console.log("To Object:", luxonObj);
console.log("แปลงกลับ:", DateTime.fromObject(luxonObj).toISO());

console.log("\nMoment:");
const momentObj = moment().toObject();
console.log("To Object:", momentObj);
console.log("แปลงกลับ:", moment(momentObj).format());

// 4. การทำงานกับ SQL
console.log("\n4. การทำงานกับ SQL:");
const sqlDate = "2024-03-15 14:30:00";

console.log("\nLuxon:");
const luxonFromSQL = DateTime.fromSQL(sqlDate);
console.log("จาก SQL:", luxonFromSQL.toISO());
console.log("กลับเป็น SQL:", DateTime.now().toSQL({ includeOffset: false }));

console.log("\nMoment:");
const momentFromSQL = moment(sqlDate);
console.log("จาก SQL:", momentFromSQL.format());
console.log("กลับเป็น SQL:", moment().format("YYYY-MM-DD HH:mm:ss"));

// 5. การตรวจสอบช่วงเวลาที่ซ้อนทับ
console.log("\n5. การตรวจสอบช่วงเวลาที่ซ้อนทับ:");

console.log("\nLuxon:");
const interval1 = Interval.fromDateTimes(
  DateTime.fromISO("2024-01-01"),
  DateTime.fromISO("2024-06-30")
);
const interval2 = Interval.fromDateTimes(
  DateTime.fromISO("2024-06-01"),
  DateTime.fromISO("2024-12-31")
);
console.log("ซ้อนทับกันหรือไม่:", interval1.overlaps(interval2));
console.log("ช่วงที่ซ้อนทับ:", interval1.intersection(interval2)?.toString());

console.log("\nMoment:");
const range1 = { start: moment("2024-01-01"), end: moment("2024-06-30") };
const range2 = { start: moment("2024-06-01"), end: moment("2024-12-31") };
console.log(
  "ซ้อนทับกันหรือไม่:",
  range1.start <= range2.end && range2.start <= range1.end
);
console.log("ช่วงที่ซ้อนทับ: ต้องเขียนโค้ดเพิ่มเติมเอง");

// 6. Timezone Management
console.log("\n6. การจัดการ Timezone:");
const zones = ["Asia/Bangkok", "America/New_York", "Europe/London"];

console.log("\nLuxon (ง่ายและตรงไปตรงมา):");
zones.forEach((zone) => {
  const dt = DateTime.now().setZone(zone);
  console.log(
    `${zone}:`,
    dt.toFormat("HH:mm"),
    `(offset: ${dt.offset / 60} ชั่วโมง)`
  );
});

console.log("\nMoment (ต้องใช้ plugin เพิ่ม):");
zones.forEach((zone) => {
  const mt = momentTz.tz(zone);
  console.log(
    `${zone}:`,
    mt.format("HH:mm"),
    `(offset: ${mt.utcOffset() / 60} ชั่วโมง)`
  );
});

// 7. Relative Time with Units
console.log("\n7. Relative Time with Units:");
const pastDate = DateTime.now().minus({ days: 3, hours: 5 });
const pastMoment = moment().subtract(3, "days").subtract(5, "hours");

console.log("\nLuxon (ยืดหยุ่นกว่า):");
console.log("Default:", pastDate.toRelative());
console.log("With Unit 'days':", pastDate.toRelative({ unit: "days" }));
console.log("With Unit 'hours':", pastDate.toRelative({ unit: "hours" }));

console.log("\nMoment (จำกัดกว่า):");
console.log("Default:", pastMoment.fromNow());
console.log("With Duration:", pastMoment.from(moment(), true));

console.log("\n=== จบการเปรียบเทียบ ===");

/*
การเปรียบเทียบนี้แสดงให้เห็นว่า Luxon มีข้อดีเหนือกว่า Moment.js ในหลายด้าน:

1. **ความปลอดภัยของข้อมูล**: Luxon ไม่แก้ไขข้อมูลเดิม ทำให้ลดโอกาสเกิดข้อผิดพลาดโดยไม่ตั้งใจ
2. **การจัดการข้อผิดพลาด**: Luxon บอกสาเหตุของปัญหาได้ชัดเจนกว่า ช่วยให้แก้ไขได้เร็วและถูกต้อง
3. **การแปลงข้อมูล**: Luxon ทำงานกับข้อมูลหลายรูปแบบได้ง่ายกว่า
4. **การทำงานกับ SQL**: Luxon มีฟังก์ชันพร้อมใช้สำหรับ SQL โดยตรง
5. **การจัดการช่วงเวลา**: Luxon คำนวณและเปรียบเทียบช่วงเวลาได้สะดวกกว่า
6. **การจัดการเขตเวลา**: Luxon ทำงานกับเขตเวลาต่างๆ ได้ง่ายโดยไม่ต้องติดตั้งเพิ่ม
7. **การแสดงเวลาเปรียบเทียบ**: Luxon ปรับแต่งการแสดงผลได้หลากหลายกว่า

ข้อดีเพิ่มเติมของ Luxon:
🚀 ทำงานเร็วกว่าและใช้พื้นที่น้อยกว่า
🌍 รองรับเขตเวลาได้ดีกว่า
🔄 ปลอดภัยในการใช้งานเพราะไม่แก้ไขข้อมูลเดิม
📅 แสดงผลได้หลายรูปแบบ
🔧 ใช้งานง่ายและทันสมัย
👨‍💻 ได้รับการพัฒนาอย่างต่อเนื่อง (ต่างจาก Moment.js ที่หยุดพัฒนาแล้ว)

สรุป: Luxon เป็นตัวเลือกที่ดีกว่าสำหรับโปรเจกต์ใหม่หรือการอัพเกรดจาก Moment.js เพราะใช้งานง่าย ปลอดภัย และมีฟีเจอร์ครบครัน
REF: luxon : https://moment.github.io/luxon/
*/
