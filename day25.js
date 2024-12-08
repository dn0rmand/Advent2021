const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    let data = undefined;
    let width = 0;
    let height = 0;

    const lines = [...readFile(__filename)];

    height = lines.length;
    width = lines[0].length;
    data = new Uint8Array(height * width);

    for (let y = 0; y < lines.length; y++) {
        const offset = y * width;
        lines[y].split("").forEach((v, x) => {
            if (v === ">") {
                data[offset + x] = 1;
            } else if (v === "v") {
                data[offset + x] = 2;
            }
        });
    }

    return { data, width, height };
}

function part1({ data, width, height }) {
    let step = 0;
    let done = false;
    let buffer = new Uint8Array(data.length);

    while (!done) {
        step++;
        done = true;

        buffer.fill(0);

        // Move east
        for (let y = 0; y < height; y++) {
            const o = y * width;
            for (let x = 0; x < width; x++) {
                const x2 = (x + 1) % width;
                if (data[o + x] === 1) {
                    if (data[o + x2] === 0) {
                        buffer[o + x2] = 1;
                        done = false;
                    } else {
                        buffer[o + x] = 1;
                    }
                }
            }
        }

        // Move south
        for (let y = 0; y < height; y++) {
            const o = y * width;
            const o2 = ((y + 1) % height) * width;

            for (let x = 0; x < width; x++) {
                if (data[o + x] === 2) {
                    if (buffer[o2 + x] === 0 && data[o2 + x] !== 2) {
                        buffer[o2 + x] = 2;
                        done = false;
                    } else {
                        buffer[o + x] = 2;
                    }
                }
            }
        }

        [data, buffer] = [buffer, data];
    }

    return step;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const input = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Day 25: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute day ${DAY}`);
}

module.exports = execute;
