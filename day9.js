const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const heights = line.split("").map((v) => +v);
        entries.push(heights);
    }

    return new Floor(entries);
}

class Floor {
    constructor(data) {
        this.height = data.length;
        this.width = data[0].length;
        this.data = data;

        this.lowerPoints = [];
        this.part1Done = false;
    }

    isValid(x, y) {
        return y >= 0 && y < this.height && x >= 0 && x < this.width;
    }

    get(x, y, v) {
        if (!this.isValid(x, y)) {
            return v === undefined ? 10 : v;
        }

        return this.data[y][x];
    }

    getKey(x, y) {
        return y * 200 + x;
    }

    *nextPoints(x, y) {
        if (this.isValid(x - 1, y)) {
            yield { x: x - 1, y };
        }
        if (this.isValid(x + 1, y)) {
            yield { x: x + 1, y };
        }
        if (this.isValid(x, y - 1)) {
            yield { x, y: y - 1 };
        }
        if (this.isValid(x, y + 1)) {
            yield { x, y: y + 1 };
        }
    }

    isLowerPoint(x, y) {
        let min = this.get(x, y);
        let states = [{ x, y }];
        let visited = [];
        visited[this.getKey(x, y)] = 1;

        while (states.length > 0) {
            let newStates = [];
            for (const state of states) {
                for (const { x, y } of this.nextPoints(state.x, state.y)) {
                    const k = this.getKey(x, y);
                    if (visited[k]) {
                        continue;
                    }
                    visited[k] = 1;
                    const v2 = this.get(x, y);
                    if (v2 < min) {
                        return false;
                    }
                    if (v2 === min) {
                        newStates.push({ x, y });
                    }
                }
            }
            states = newStates;
        }

        this.lowerPoints.push({ x, y });
        return true;
    }

    getBasinSize(x, y) {
        let states = [{ x, y }];
        let visited = [];
        let size = 1;
        visited[this.getKey(x, y)] = 1;

        while (states.length > 0) {
            let newStates = [];
            for (const state of states) {
                for (const { x, y } of this.nextPoints(state.x, state.y)) {
                    const k = this.getKey(x, y);
                    if (visited[k]) {
                        continue;
                    }
                    visited[k] = 1;
                    const v2 = this.get(x, y);
                    if (v2 === 9) {
                        continue;
                    }

                    size++;
                    newStates.push({ x, y });
                }
            }
            states = newStates;
        }

        return size;
    }
}

function part1(floor) {
    let total = 0;
    for (let y = 0; y < floor.height; y++) {
        for (let x = 0; x < floor.width; x++) {
            if (floor.isLowerPoint(x, y)) {
                const v = floor.get(x, y);
                total += v + 1;
            }
        }
    }
    this.part1Done = true;
    return total;
}

function part2(floor) {
    if (!this.part1Done) {
        part1(floor);
    }

    const basins = [];
    for (const { x, y } of floor.lowerPoints) {
        basins.push(floor.getBasinSize(x, y));
    }

    basins.sort((a, b) => b - a);
    if (basins.length < 3) {
        throw "Need at least 3 basins";
    }
    return basins[0] * basins[1] * basins[2];
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const floor = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(floor)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(floor)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
