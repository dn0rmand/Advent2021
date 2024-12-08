const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const values = line.split("").map((v) => +v);
        entries.push(values);
    }

    return entries;
}

const adjacent = [
    { ox: -1, oy: -1 },
    { ox: -1, oy: 0 },
    { ox: -1, oy: 1 },
    { ox: 0, oy: -1 },
    { ox: 0, oy: 1 },
    { ox: 1, oy: -1 },
    { ox: 1, oy: 0 },
    { ox: 1, oy: 1 },
];

function process(input) {
    const invalid = (x, y) => x < 0 || y < 0 || x >= 10 || y >= 10;
    const clear = (x, y) => (input[y][x] = 0);
    const increment = (x, y) => ++input[y][x];

    let needFlashing = [];

    // Step 1 - Increase
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (!invalid(x, y) && increment(x, y) === 10) {
                needFlashing.push({ x, y });
            }
        }
    }

    // Step 2 - Flash
    const flashed = {};
    while (needFlashing.length > 0) {
        const moreFlashing = [];
        for (const { x, y } of needFlashing) {
            flashed[x + 50 * y] = { x, y };
            for (const { ox, oy } of adjacent) {
                const x2 = x + ox;
                const y2 = y + oy;
                if (
                    !invalid(x2, y2) &&
                    !flashed[x2 + 50 * y2] &&
                    increment(x2, y2) === 10
                ) {
                    moreFlashing.push({ x: x2, y: y2 });
                }
            }
        }
        needFlashing = moreFlashing;
    }

    // Step3 - Reset Flashed
    let total = 0;
    for (const k in flashed) {
        const { x, y } = flashed[k];
        clear(x, y);
        total++;
    }
    return total;
}

function part1(input) {
    // deep clone so that we don't modify the original data
    input = input.map((row) => row.map((v) => v));

    let total = 0;
    for (let times = 0; times < 100; times++) {
        total += process(input);
    }
    return total;
}

function part2(input) {
    // deep clone so that we don't modify the original data
    input = input.map((row) => row.map((v) => v));

    let first = undefined;

    for (let times = 1; ; times++) {
        const value = process(input);
        if (value === 100) {
            // all flashed
            first = times;
            break;
        }
    }

    return first;
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
