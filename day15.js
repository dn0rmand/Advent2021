const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        entries.push(line.split("").map((v) => +v));
    }

    return entries;
}

const KEY_SIZE = 1000;

class Mapper {
    constructor(input, size) {
        if (input.length !== input[0].length) {
            throw "Expecting square input";
        }

        this.tileSize = input.length;
        this.size = this.tileSize * size;
        this.input = input;
        this.visited = new Uint16Array(this.size * KEY_SIZE + this.size);
        this.setVisited(0, 0, 1);
    }

    get(x, y) {
        const tx = x % this.tileSize;
        const ty = y % this.tileSize;
        const extra = (x + y - (tx + ty)) / this.tileSize;

        const v = (this.input[ty][tx] + extra) % 9;
        return v || 9;
    }

    getVisited(x, y) {
        return this.visited[x * KEY_SIZE + y] || Number.MAX_SAFE_INTEGER;
    }

    setVisited(x, y, risk) {
        this.visited[x * KEY_SIZE + y] = risk;
    }

    minRisk() {
        return this.visited[(this.size - 1) * KEY_SIZE + this.size - 1];
    }

    next(x, y, callback) {
        if (x > 0) {
            callback(x - 1, y, this.get(x - 1, y));
        }
        if (y > 0) {
            callback(x, y - 1, this.get(x, y - 1));
        }
        if (x < this.size - 1) {
            callback(x + 1, y, this.get(x + 1, y));
        }
        if (y < this.size - 1) {
            callback(x, y + 1, this.get(x, y + 1));
        }
    }
}

function oldFindPath(input, size) {
    input = new Mapper(input, size);

    let states = new Map();
    let newStates = new Map();

    states.set(0, { x: 0, y: 0, risk: 0 });

    while (states.size) {
        newStates.clear();

        for (const state of states.values()) {
            input.next(state.x, state.y, (x, y, risk) => {
                const newRisk = state.risk + risk;

                if (newRisk < input.getVisited(x, y)) {
                    input.setVisited(x, y, newRisk);
                    newStates.set(x * KEY_SIZE + y, { x, y, risk: newRisk });
                }
            });
        }

        [states, newStates] = [newStates, states];
    }
    return input.minRisk();
}

function findPath(input, size) {
    input = new Mapper(input, size);

    let queue = [[{ x: 0, y: 0, risk: 0 }]];

    input.setVisited(0, 0, 1);

    let answer = undefined;
    for (let idx = 0; !answer && idx < queue.length; idx++) {
        const states = queue[idx];
        if (!states) {
            continue;
        }
        // delete queue[idx];

        for (const state of states) {
            if (answer) {
                break;
            }
            input.next(state.x, state.y, (x, y, risk) => {
                const newRisk = state.risk + risk;

                if (x === input.size - 1 && y === input.size - 1) {
                    answer = newRisk;
                    return;
                }

                if (newRisk < input.getVisited(x, y)) {
                    input.setVisited(x, y, newRisk);
                    if (!queue[newRisk]) {
                        queue[newRisk] = [{ x, y, risk: newRisk }];
                    } else {
                        queue[newRisk].push({ x, y, risk: newRisk });
                    }
                }
            });
        }
    }

    return answer;
}

function part1(input) {
    return findPath(input, 1);
}

function part2(input) {
    return findPath(input, 5);
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
