const assert = require("assert");

const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

const A = "a".charCodeAt(0);

const $length = (function () {
    const $length = [];
    for (let i = 0; i <= 0xff; i++) {
        let count = 0;
        let value = i;
        while (value) {
            if (value & 1) {
                count++;
                value = (value - 1) / 2;
            } else {
                value /= 2;
            }
        }

        $length[i] = count;
    }
    return $length;
})();

const length = (value) => $length[value];

function toBits(code) {
    let value = 0;
    for (const c of code) {
        value += 2 ** (c.charCodeAt(0) - A);
    }
    $length[value] = code.length;
    return value;
}

function contains(k1, k2) {
    return (k1 & k2) === k2;
}

function intersect(k1, k2) {
    return length(k1 & k2);
}

const numbers = [
    "abcefg", // 0
    "cf", // 1 *
    "acdeg", // 2
    "acdfg", // 3
    "bcdf", // 4 *
    "abdfg", // 5
    "abdefg", // 6
    "acf", // 7 *
    "abcdefg", // 8 *
    "abcdfg", // 9
].map((v) => toBits(v));

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const data = {
            patterns: [],
            values: [],
        };

        const [patterns, values] = line.split(" | ");

        patterns.split(" ").forEach((v) => {
            if (v.trim()) {
                // v = v.split('').sort().join('');
                data.patterns.push(toBits(v));
            }
        });

        values.split(" ").forEach((v) => {
            if (v.trim()) {
                // v = v.split('').sort().join('');
                data.values.push(toBits(v));
            }
        });

        entries.push(data);
    }

    return entries;
}

function part1(input) {
    const lengths = [0, 0, 1, 1, 1, 0, 0, 1];

    let count = 0;
    for (const entry of input) {
        for (const value of entry.values) {
            count += lengths[length(value)];
        }
    }
    return count;
}

function decoded({ patterns, values }) {
    // function intersect(k1, k2)
    // {
    //     let count = 0;
    //     for(let c of k2) {
    //         if (k1.indexOf(c) >= 0) {
    //             count++;
    //         }
    //     }
    //     return count;
    // }

    // function contains(k1, k2)
    // {
    //     if (k1.length > k2.length) {
    //         for(let c of k2) {
    //             if (k1.indexOf(c) < 0) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    // }

    function getMappings() {
        const mappings = {};
        const references = {};

        for (const k of patterns) {
            for (const ref of [1, 4, 7, 8]) {
                if (!references[ref] && length(k) === length(numbers[ref])) {
                    references[ref] = k;
                    mappings[k] = ref;
                    break;
                }
            }
        }

        // length 6: includes 4 then 9 else includes 1 then 0 else 6
        // length 5: included 1 and 7 then 3

        for (const k of patterns) {
            if (mappings[k]) {
                continue;
            }

            if (length(k) === 6) {
                if (contains(k, references[4])) {
                    mappings[k] = 9;
                } else if (contains(k, references[1])) {
                    mappings[k] = 0;
                } else {
                    mappings[k] = 6;
                }
            } else if (length(k) === 5) {
                if (contains(k, references[1]) && contains(k, references[7])) {
                    mappings[k] = 3;
                } else if (intersect(k, references[4]) === 3) {
                    mappings[k] = 5;
                } else {
                    mappings[k] = 2;
                }
            }
        }

        return mappings;
    }

    const mappings = getMappings();
    const value = values.reduce((total, code) => total * 10 + mappings[code], 0);

    return value;
}

function part2(input) {
    let total = 0;

    for (const entry of input) {
        total += decoded(entry);
    }

    return total;
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
