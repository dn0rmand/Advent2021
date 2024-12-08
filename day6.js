const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const states = new Array(9);
    states.fill(0);
    for (const line of readFile(__filename)) {
        line.split(",").forEach((v) => {
            v = +v;
            states[v] += 1;
        });
    }

    return states;
}

function process(input, days) {
    let states = input.map((s) => s);
    let newStates = new Array(9);
    while (days--) {
        newStates.fill(0);

        for (let state = 0; state < states.length; state++) {
            const count = states[state];
            if (count) {
                if (state === 0) {
                    newStates[6] += count;
                    newStates[8] += count;
                } else {
                    newStates[state - 1] += count;
                }
            }
        }
        [states, newStates] = [newStates, states];
    }

    return states.reduce((total, count) => total + count);
}

function part1(input) {
    return process(input, 80);
}

function part2(input) {
    return process(input, 256);
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
