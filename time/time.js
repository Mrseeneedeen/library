const { DateTime } = require("luxon");
const moment = require("moment");
const momentTz = require("moment-timezone");

console.log("ความต่างระหว่าง luxon และ moment");
console.log("การออกแบบ API ที่ทันสมัย");
const nowLuxon = DateTime.now();
console.log("nowLuxon", nowLuxon.toISO());
const nowMoment = moment();
console.log("nowMoment", nowMoment.toISOString());

console.log("\nโครงสร้างข้อมูลที่ไม่เปลี่ยนแปลง");
const futureLuxon = nowLuxon.plus({ days: 1 });
console.log("nowLuxon", nowLuxon.toISO());
console.log("futureLuxon", futureLuxon.toISO());

const futureMoment = nowMoment.add(1, "days");
console.log("nowMoment", nowMoment.toISOString());
console.log("futureMoment", futureMoment.toISOString());

console.log("\nประสิทธิภาพ");
console.time("Luxon");
for (let i = 0; i < 100000; i++) {
  DateTime.now().toFormat("yyyyMMdd");
}
console.timeEnd("Luxon");

console.time("Moment");
for (let i = 0; i < 100000; i++) {
  moment().format("YYYYMMDD");
}
console.timeEnd("Moment");

console.log("\nการสนับสนุนโซนเวลา");
const dateTime = DateTime.now().setZone("America/New_York");
console.log("Luxon:", dateTime.toISO());

const dateMoment = momentTz.tz("America/New_York");
console.log("Moment:", dateMoment.format());

console.log("\nการทำงานระหว่างประเทศ");
const dt = DateTime.now().setLocale("th");
console.log(dt.toLocaleString(DateTime.DATE_FULL));

moment.locale("th");
const now = moment();
console.log(now.format("LL"));

console.log(
  "--------------------------------END--------------------------------"
);
