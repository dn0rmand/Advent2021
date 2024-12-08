const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const parse = (line) => {
        const [from, to] = line
            .substring(2)
            .split("..")
            .map((v) => +v);
        return { from, to };
    };

    const cubes = [];

    for (const line of readFile(__filename)) {
        // on x=-20..26,y=-36..17,z=-47..7
        const on = line.startsWith("on");
        const [x, y, z] = line
            .substring(3)
            .trim()
            .split(",")
            .map((l) => parse(l));

        cubes.push(new Cube(on, x, y, z));
    }

    return cubes;
}

class Cube {
    constructor(on, x, y, z) {
        this.on = on;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get size() {
        return (
            (Math.abs(this.x.from - this.x.to) + 1) *
            (Math.abs(this.y.from - this.y.to) + 1) *
            (Math.abs(this.z.from - this.z.to) + 1)
        );
    }

    isInlimits(min, max) {
        if (this.x.from > max || this.x.to < min) {
            return false;
        }
        if (this.y.from > max || this.y.to < min) {
            return false;
        }
        if (this.z.from > max || this.z.to < min) {
            return false;
        }
        return true;
    }

    contains(cube) {
        if (
            this.x.from <= cube.x.from &&
            this.x.to >= cube.x.to &&
            this.y.from <= cube.y.from &&
            this.y.to >= cube.y.to &&
            this.z.from <= cube.z.from &&
            this.z.to >= cube.z.to
        ) {
            return true;
        } else {
            return false;
        }
    }

    intersect(cube) {
        if (
            this.x.from <= cube.x.to &&
            this.x.to >= cube.x.from &&
            this.y.from <= cube.y.to &&
            this.y.to >= cube.y.from &&
            this.z.from <= cube.z.to &&
            this.z.to >= cube.z.from
        ) {
            const x = {
                from: Math.max(this.x.from, cube.x.from),
                to: Math.min(this.x.to, cube.x.to),
            };
            const y = {
                from: Math.max(this.y.from, cube.y.from),
                to: Math.min(this.y.to, cube.y.to),
            };
            const z = {
                from: Math.max(this.z.from, cube.z.from),
                to: Math.min(this.z.to, cube.z.to),
            };

            return new Cube(this.on, x, y, z);
        }
    }

    equals(cube) {
        return (
            this.x.from === cube.x.from &&
            this.x.to === cube.x.to &&
            this.y.from === cube.y.from &&
            this.y.to === cube.y.to &&
            this.z.from === cube.z.from &&
            this.z.to === cube.z.to
        );
    }

    *subtract(cube) {
        const inside = this.intersect(cube);
        const on = this.on;

        function* makeCube(x, y, z) {
            if (x.from > x.to) {
                return;
            }
            if (y.from > y.to) {
                return;
            }
            if (z.from > z.to) {
                return;
            }

            const c = new Cube(on, x, y, z);
            if (!c.equals(inside)) {
                yield c;
            }
        }

        if (!inside) {
            yield this;
        } else {
            for (const [xf, xt] of [
                [this.x.from, inside.x.from - 1],
                [inside.x.from, inside.x.to],
                [inside.x.to + 1, this.x.to],
            ]) {
                for (const [yf, yt] of [
                    [this.y.from, inside.y.from - 1],
                    [inside.y.from, inside.y.to],
                    [inside.y.to + 1, this.y.to],
                ]) {
                    for (const [zf, zt] of [
                        [this.z.from, inside.z.from - 1],
                        [inside.z.from, inside.z.to],
                        [inside.z.to + 1, this.z.to],
                    ]) {
                        yield* makeCube(
                            { from: xf, to: xt },
                            { from: yf, to: yt },
                            { from: zf, to: zt }
                        );
                    }
                }
            }
        }
    }
}

function part1(cubes) {
    cubes = cubes.filter((c) => c.isInlimits(-50, 50));

    const map = new Map();

    for (const cube of cubes) {
        for (let x = cube.x.from + 50; x <= cube.x.to + 50; x++)
            for (let y = cube.y.from + 50; y <= cube.y.to + 50; y++)
                for (let z = cube.z.from + 50; z <= cube.z.to + 50; z++) {
                    const k = (x * 105 + y) * 105 + z;
                    if (cube.on) {
                        map.set(k, 1);
                    } else {
                        map.delete(k);
                    }
                }
    }

    return map.size;
}

function part2(cubes) {
    let processed = [];

    for (let i = 0; i < cubes.length; i++) {
        const cube1 = cubes[i];
        if (processed.length > 0) {
            let newProcessed = [];
            for (const cube2 of processed) {
                if (cube1.contains(cube2)) {
                    continue; // trash!
                }

                for (const miniCube of cube2.subtract(cube1)) {
                    newProcessed.push(miniCube);
                }
            }
            processed = newProcessed;
        }
        if (cube1.on) {
            processed.push(cube1);
        }
    }

    let total = processed.reduce((total, cube) => total + cube.size, 0);
    return total;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const cubes = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(cubes)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(cubes)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
