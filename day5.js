const { line } = require("blessed");

const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const [from, to] = line.split(" -> ").map((p) => {
            const pt = p.split(",").map((v) => +v);
            const [x, y] = pt;
            return { x, y };
        });

        entries.push({ from, to });
    }

    return entries;
}

function drawBoard(input) {
    const board = new Array(1000);

    for (let y = 0; y < 1000; y++) board[y] = new Uint32Array(1000);

    for (const { from, to } of input) {
        const slopeX = from.x === to.x ? 0 : from.x < to.x ? 1 : -1;
        const slopeY = from.y === to.y ? 0 : from.y < to.y ? 1 : -1;

        let x = from.x;
        let y = from.y;

        board[y][x] += 1;
        while (x !== to.x || y !== to.y) {
            x += slopeX;
            y += slopeY;

            board[y][x] += 1;
        }
    }

    return board;
}

function part1(input) {
    input = input.filter(
        (line) => line.from.x === line.to.x || line.from.y === line.to.y
    );

    const board = drawBoard(input);

    const total = board.reduce(
        (a, row) => a + row.reduce((a, v) => a + (v > 1 ? 1 : 0), 0),
        0
    );

    return total;
}

function part2(input) {
    const board = drawBoard(input);

    const total = board.reduce(
        (a, row) => a + row.reduce((a, v) => a + (v > 1 ? 1 : 0), 0),
        0
    );

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
