const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        entries.push(line);
    }

    return entries;
}

const markers = {
    "(": { score: 1 },
    "[": { score: 2 },
    "{": { score: 3 },
    "<": { score: 4 },

    ")": { points: 3, opener: "(" },
    "]": { points: 57, opener: "[" },
    "}": { points: 1197, opener: "{" },
    ">": { points: 25137, opener: "<" },
};

function validateLine(line) {
    const state = [];
    for (const c of line) {
        const k = markers[c];
        if (k.opener && k.opener !== state.pop()) {
            return k.points;
        } else {
            state.push(c);
        }
    }
    return 0;
}

function autoCompleteLine(line) {
    const state = [];

    for (const c of line) {
        const k = markers[c];
        if (k.opener) {
            state.pop();
        } else {
            state.push(c);
        }
    }

    let total = 0;
    while (state.length > 0) {
        const c = state.pop();
        total = total * 5 + markers[c].score;
    }
    return total;
}

function part1(input) {
    return input.reduce((total, line) => total + validateLine(line), 0);
}

function part2(input) {
    const scores = input
        .filter((line) => validateLine(line) === 0)
        .map((line) => autoCompleteLine(line))
        .sort((a, b) => a - b);
    const index = (scores.length - 1) / 2;
    return scores[index];
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
