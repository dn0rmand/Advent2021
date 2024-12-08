const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const bits = line.split("").map((b) => +b);
        entries.push(bits);
    }

    return entries;
}

function mostCommonBit(data, index) {
    const b = data.reduce((a, bits) => a + (bits[index] ? 1 : -1), 0);
    return b < 0 ? 0 : 1;
}

function part1(input) {
    const bitCount = input[0].length;

    let gamma = 0;
    let epsilon = 0;

    for (let bit = 0; bit < bitCount; bit++) {
        const b = mostCommonBit(input, bit);
        gamma = gamma * 2 + b;
        epsilon = epsilon * 2 + (b ^ 1);
    }

    return gamma * epsilon;
}

function part2(input) {
    function find(data, criteria) {
        let index = 0;
        while (data.length > 1) {
            const bit = mostCommonBit(data, index);
            data = data.filter((value) => criteria(value[index], bit));
            index++;
        }
        if (data.length === 0) {
            throw "Error";
        }
        return parseInt(data[0].join(""), 2);
    }

    const oxygen = find(input, (bit, mask) => bit === mask);
    const co2 = find(input, (bit, mask) => bit !== mask);

    return oxygen * co2;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    const input = loadData();

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
