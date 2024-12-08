const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    for (let line of readFile(__filename)) {
        line = line.replace("target area: x=", "");
        const [xRange, yRange] = line.split(", y=");
        const [xmin, xmax] = xRange.split("..");
        const [ymin, ymax] = yRange.split("..");

        return {
            xmin: +xmin,
            xmax: +xmax,
            ymin: +ymin,
            ymax: +ymax,
        };
    }
}

function evaluate(target) {
    target *= 2;
    const x = Math.floor(Math.sqrt(target));
    while ((x + 1) * (x + 2) < target) {
        x++;
    }
    return x;
}

function process(vx, vy, xmin, xmax, ymin, ymax) {
    let height = 0;
    let x = 0;
    let y = 0;

    while (x <= xmax && y >= ymin) {
        if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
            return { hit: true, height };
        }
        x += vx;
        y += vy;

        if (vx) vx -= 1;
        vy -= 1;

        height = Math.max(height, y);
    }

    return { hit: false };
}

function part1({ xmin, xmax, ymin, ymax }) {
    const xStart = evaluate(xmin);
    const xEnd = evaluate(xmax);
    const yStart = Math.max(Math.abs(ymin), Math.abs(ymax));

    for (let vx = xStart; vx <= xEnd; vx++) {
        for (let vy = yStart; vy >= -yStart; vy--) {
            const { hit, height } = process(vx, vy, xmin, xmax, ymin, ymax);
            if (hit) {
                return height;
            }
        }
    }
    return 0;
}

function part2({ xmin, xmax, ymin, ymax }) {
    let count = 0;

    const yStart = Math.max(Math.abs(ymin), Math.abs(ymax));
    const xStart = evaluate(xmin);

    for (let vx = xStart; vx <= xmax; vx++) {
        let subCount = 0;
        for (let vy = yStart; vy >= -yStart; vy--) {
            const { hit } = process(vx, vy, xmin, xmax, ymin, ymax);
            if (hit) {
                subCount++;
            }
        }

        count += subCount;
    }

    return count;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const input = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
