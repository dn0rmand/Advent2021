const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    let entries = [];

    for (const line of readFile(__filename)) {
        entries = [...entries, ...line.split(",").map((v) => +v)];
    }

    entries.sort((a, b) => a - b);
    return entries;
}

function part1(crabs) {
    function median(input) {
        const l = input.length;
        if (l & 1) {
            const m = (l - 1) / 2;
            return input[m];
        } else {
            const m = l / 2;
            return Math.round(input[m] + input[m - 1]) / 2;
        }
    }

    const alignTo = median(crabs);
    const minCost = crabs.reduce(
        (cost, crab) => cost + Math.abs(crab - alignTo),
        0
    );

    return minCost;
}

function part2(crabs) {
    const getCost = (alignTo) =>
        crabs.reduce((cost, crab) => {
            const distance = Math.abs(crab - alignTo);
            const fuel = (distance * (distance + 1)) / 2;

            return cost + fuel;
        }, 0);

    const average = crabs.reduce((a, v) => a + v) / crabs.length;

    const cost1 = getCost(Math.floor(average));
    const cost2 = getCost(Math.ceil(average));
    const cost = Math.min(cost1, cost2);

    return cost;
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
