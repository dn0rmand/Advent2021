const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const number = line
            .split("")
            .map((c) => (c === "[" || c === "]" || c === "," ? c : +c));
        entries.push(number);
    }
    return entries;
}

function magnitude(number) {
    let index = 0;

    function inner() {
        let c = number[index++];
        if (c === "[") {
            const m1 = inner();
            let c = number[index++];
            const m2 = inner();
            c = number[index++];
            return m1 * 3 + m2 * 2;
        } else if (typeof c === "number") {
            return c;
        } else {
            throw "ERROR";
        }
    }

    return inner();
}

function split(number) {
    for (let i = 0; i < number.length; i++) {
        const c = number[i];
        if (typeof c === "number" && c >= 10) {
            const l = Math.floor(c / 2);
            const r = c - l;

            number.splice(i, 1, "[", l, ",", r, "]");
            return true;
        }
    }
    return false;
}

function reduce(number) {
    do {
        let deep = 0;
        for (let i = 0; i < number.length; i++) {
            const c = number[i];
            if (c === "[") {
                deep++;
            } else if (c === "]") {
                deep--;
            } else if (c !== ",") {
                // number
                if (deep > 4) {
                    const left = c;
                    const right = number[i + 2];
                    for (let j = i - 1; j >= 0; j--) {
                        if (typeof number[j] === "number") {
                            number[j] += left;
                            break;
                        }
                    }
                    for (let j = i + 4; j < number.length; j++) {
                        if (typeof number[j] === "number") {
                            number[j] += right;
                            break;
                        }
                    }
                    number[i - 1] = 0;
                    number.splice(i, 4);
                    deep--;
                    i--;
                }
            }
        }
    } while (split(number));

    return number;
}

function part1(input) {
    let current = undefined;
    for (const number of input) {
        if (current) {
            const newNumber = ["[", ...current, ",", ...number, "]"];
            current = reduce(newNumber);
        } else {
            current = number;
        }
    }

    return magnitude(current);
}

function part2(input) {
    let max = 0;
    for (let n1 = 0; n1 < input.length; n1++) {
        for (let n2 = 0; n2 < input.length; n2++) {
            if (n1 === n2) {
                continue;
            }
            const number = ["[", ...input[n1], ",", ...input[n2], "]"];
            max = Math.max(magnitude(reduce(number)), max);
        }
    }
    return max;
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
