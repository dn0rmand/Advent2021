const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    let enhancer = undefined;
    let data = [];

    for (const line of readFile(__filename)) {
        if (!enhancer) {
            enhancer = line.split("").map((c) => (c === "#" ? 1 : 0));
        } else if (line) {
            data.push(line.split("").map((c) => (c === "#" ? 1 : 0)));
        }
    }

    const image = new Image(enhancer);

    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            image.setPixel(x, y, data[y][x]);
        }
    }

    return image;
}

class Image {
    constructor(enhancer) {
        this.step = 0;
        this.enhancer = enhancer;
        this.minX = Number.MAX_SAFE_INTEGER;
        this.maxX = Number.MIN_SAFE_INTEGER;
        this.minY = Number.MAX_SAFE_INTEGER;
        this.maxY = Number.MIN_SAFE_INTEGER;
        this.pixels = new Map();
    }

    makeKey(x, y) {
        return (x + 100) * 1000 + (y + 100);
    }

    setPixel(x, y, value) {
        if (this.minY > y) {
            this.minY = y;
        }
        if (this.maxY < y) {
            this.maxY = y;
        }
        if (this.minX > x) {
            this.minX = x;
        }
        if (this.maxX < x) {
            this.maxX = x;
        }

        const k = this.makeKey(x, y);

        if (value === 1) {
            this.pixels.set(k, 1);
        } else {
            this.pixels.delete(k);
        }
    }

    getPixel(x, y) {
        if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
            if (this.step & 1) {
                return this.enhancer[0];
            } else {
                return 0;
            }
        }

        const k = this.makeKey(x, y);

        return this.pixels.get(k) === 1 ? 1 : 0;
    }

    get pixelCount() {
        return this.pixels.size;
    }

    enhance() {
        const newImage = new Image(this.enhancer);

        newImage.step = this.step + 1;
        for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
            for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
                let index = 0;
                for (let oy of [-1, 0, 1]) {
                    for (let ox of [-1, 0, 1]) {
                        index = index * 2 + this.getPixel(x + ox, y + oy);
                    }
                }
                const pixel = this.enhancer[index];
                newImage.setPixel(x, y, pixel);
            }
        }

        return newImage;
    }
}

function part1(image) {
    // Enhance twice
    return image.enhance().enhance().pixelCount;
}

function part2(image) {
    for (let i = 0; i < 50; i++) {
        image = image.enhance();
    }
    return image.pixelCount;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const image = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(image)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(image)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
