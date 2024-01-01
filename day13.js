const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];
const ocr = require("./advent_tools/ocr");

const letters = {
    "699f99": "A",
    e9e99e: "B",
    698896: "C",
    e9999e: "D",
    f8e88f: "E",
    f8e888: "F",
    "698b97": "G",
    "99f999": "H",
    722227: "I",
    311196: "J",
    "9acaa9": "K",
    "88888f": "L",
    m: "M",
    n: "N",
    699996: "O",
    e99e88: "P",
    q: "Q",
    e99ea9: "R",
    "78681e": "S", // 2 possiblilties for S
    "78861e": "S", // 2 possiblilties for S
    t: "T",
    999996: "U",
    v: "V",
    w: "W",
    x: "X",
    885222: "Y",
    f1248f: "Z",
};

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const points = [];
    const folds = [];

    for (const line of readFile(__filename)) {
        if (line.startsWith("fold along x=")) {
            folds.push({ axes: "x", value: +line.split("=")[1] });
        } else if (line.startsWith("fold along y=")) {
            folds.push({ axes: "y", value: +line.split("=")[1] });
        } else if (line.trim().length > 0) {
            const [x, y] = line.split(",").map((v) => +v);
            points.push({ x, y });
        }
    }

    return { points, folds };
}

function convert({ x, y }, folds) {
    for (const fold of folds) {
        if (fold.axes === "x" && x > fold.value) {
            x = fold.value - (x - fold.value);
        } else if (fold.axes === "y" && y > fold.value) {
            y = fold.value - (y - fold.value);
        }
    }
    return { x, y };
}

function plot(points, folds) {
    const sheet = [];

    let total = 0;
    let maxX = 0;
    let maxY = 0;

    for (const point of points) {
        const { x, y } = convert(point, folds);

        if (x < 0 || y < 0) {
            throw "ERROR";
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        if (!sheet[y]) {
            sheet[y] = [];
        }
        if (!sheet[y][x]) {
            total++;
            sheet[y][x] = 1;
        }
    }

    return { total, sheet, maxX, maxY };
}

function part1({ points, folds }) {
    const { total } = plot(points, [folds[0]]);
    return total;
}

function part2({ points, folds }) {
    const { sheet } = plot(points, folds);

    //   ocr.print(sheet);

    return ocr.translate(sheet);
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
