const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    let template = undefined;
    let map = {};

    for (const line of readFile(__filename)) {
        if (line.trim().length === 0) {
            continue;
        }
        if (template) {
            const [k, v] = line.split(" -> ");
            map[k] = v;
        } else {
            template = line;
        }
    }

    return new Polymer(template, map);
}

class Polymer {
    constructor(template, map) {
        this.step = 0;
        this.map = map;
        this.template = template;
        this.states = new Map();

        for (let i = 0; i < template.length - 1; i++) {
            const key = template[i] + template[i + 1];
            const o = this.states.get(key);
            if (o) {
                o.count++;
            } else {
                this.states.set(key, { key, count: 1 });
            }
        }
    }

    score() {
        const counts = {};

        counts[this.template[0]] = 1;
        for (const { key, count } of this.states.values()) {
            const c2 = key[1];
            counts[c2] = (counts[c2] || 0) + count;
        }

        let max = 0;
        let min = Number.MAX_SAFE_INTEGER;

        for (const k in counts) {
            const c = counts[k];
            if (c > max) {
                max = c;
            }
            if (c < min) {
                min = c;
            }
        }

        return max - min;
    }

    processStep(steps) {
        let newStates = new Map();

        const add = (key, count) => {
            const o = newStates.get(key);
            if (o) {
                o.count += count;
            } else {
                newStates.set(key, { key, count });
            }
        };

        while (this.step < steps) {
            this.step++;
            newStates.clear();

            for (const { key, count } of this.states.values()) {
                const c = this.map[key];
                if (c) {
                    add(key[0] + c, count);
                    add(c + key[1], count);
                } else {
                    add(key, count);
                }
            }

            [this.states, newStates] = [newStates, this.states];
        }

        return this;
    }
}

function part1(input) {
    return input.processStep(10).score();
}

function part2(input) {
    return input.processStep(40).score();
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
