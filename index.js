var allDays = [
  require("./day1.js"), //1
  require("./day2.js"), //2
  require("./day3.js"), //3
  require("./day4.js"), //4
  require("./day5.js"), //5
  require("./day6.js"), //6
  require("./day7.js"), //7
  require("./day8.js"), //8
  require("./day9.js"), //9
  require("./day10.js"), //10
  require("./day11.js"), //11
  require("./day12.js"), //12
  require("./day13.js"), //13
  require("./day14.js"), //14
  require("./day15.js"), //15
  require("./day16.js"), //16
  require("./day17.js"), //17
  require("./day18.js"), //18
  require("./day19.js"), //19
  require("./day20.js"), //20
  require("./day21.js"), //21
  require("./day22.js"), //22
  require("./day23.js"), //23
  require("./day24.js"), //24
  require("./day25.js"), //25
];

function getDays() {
  const days = [];

  for (let i = 0; i < process.argv.length; i++) {
    const v = process.argv[i].toLowerCase();
    if (v === "day" && i + 1 < process.argv.length) {
      const day = +process.argv[++i] - 1;

      if (day < 0 || day >= 26) {
        throw "Invalid day. Should be 1..26";
      }
      if (allDays[day]) days.push(allDays[day]);
      else console.log(`day ${day + 1} not implemented yet`);
    }
  }

  if (days.length === 0) {
    return allDays;
  }

  return days;
}

const days = getDays();

const prettyHrtime = require("pretty-hrtime");

const start = process.hrtime();

for (let currentDay = 0; currentDay < days.length; currentDay++) {
  let puzzle = days[currentDay];

  puzzle();
  console.log("");
}

const end = process.hrtime(start);

console.log(`All days executed in ${prettyHrtime(end, { verbose: true })}`);
