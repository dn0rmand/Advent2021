const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];
const { Tracer } = require("@dn0rmand/project-euler-tools");

const STATES = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 90 },
    { x: 0, y: 0, z: 180 },
    { x: 0, y: 0, z: 270 },
    { x: 0, y: 90, z: 0 },
    { x: 0, y: 90, z: 90 },
    { x: 0, y: 90, z: 180 },
    { x: 0, y: 90, z: 270 },
    { x: 0, y: 180, z: 0 },
    { x: 0, y: 180, z: 90 },
    { x: 0, y: 180, z: 180 },
    { x: 0, y: 180, z: 270 },
    { x: 0, y: 270, z: 0 },
    { x: 0, y: 270, z: 90 },
    { x: 0, y: 270, z: 180 },
    { x: 0, y: 270, z: 270 },
    { x: 90, y: 0, z: 0 },
    { x: 90, y: 0, z: 90 },
    { x: 90, y: 0, z: 180 },
    { x: 90, y: 0, z: 270 },
    { x: 90, y: 180, z: 0 },
    { x: 90, y: 180, z: 90 },
    { x: 90, y: 180, z: 180 },
    { x: 90, y: 180, z: 270 },
];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];
    let scanner = undefined;
    for (const line of readFile(__filename)) {
        if (line.startsWith("--- scanner ")) {
            const l = line.substring(12, line.length - 4);
            scanner = new Scanner(+l + 1);
            entries.push(scanner);
        } else if (line) {
            const [x, y, z] = line.split(",").map((v) => +v);
            scanner.add({ x, y, z, scanner: true });
        }
    }

    return entries;
}

const makeKey = (p) => `${p.x}:${p.y}:${p.z}`;

class Scanner {
    constructor(id) {
        this.id = id;
        this.points = [];
        this.position = { x: 0, y: 0, z: 0 };
        this.testedPoints = new Set();
    }

    lock() {
        this.lockedPoint = new Set();
        for (const p of this.points) {
            this.lockedPoint.add(makeKey(p));
        }
    }

    has(p) {
        return this.lockedPoint.has(makeKey(p));
    }

    add(point) {
        this.points.push(point);
    }

    rotate(state) {
        if (state === 0) {
            return;
        }

        const rotation = STATES[state];

        const doRotate = (point) => {
            let { x, y, z } = point;
            switch (rotation.x) {
                case 90:
                    [x, y, z] = [x, z, -y];
                    break;
                case 180:
                    [x, y, z] = [x, -y, -z];
                    break;
                case 270:
                    [x, y, z] = [x, -z, y];
                    break;
                default:
                    break;
            }

            switch (rotation.y) {
                case 90:
                    [x, y, z] = [z, y, -x];
                    break;
                case 180:
                    [x, y, z] = [-x, y, -z];
                    break;
                case 270:
                    [x, y, z] = [-z, y, x];
                    break;
                default:
                    break;
            }

            switch (rotation.z) {
                case 90:
                    [x, y, z] = [-y, x, z];
                    break;
                case 180:
                    [x, y, z] = [-x, -y, z];
                    break;
                case 270:
                    [x, y, z] = [y, -x, z];
                    break;
                default:
                    break;
            }

            point.x = x;
            point.y = y;
            point.z = z;
        };

        for (const p of this.points) {
            doRotate(p);
        }
        doRotate(this.position);
    }

    translate(value) {
        if (value.x === 0 && value.y === 0 && value.z === 0) {
            return;
        }

        this.position.x += value.x;
        this.position.y += value.y;
        this.position.z += value.z;

        for (const p of this.points) {
            p.x += value.x;
            p.y += value.y;
            p.z += value.z;
        }
    }
}

function countBeacons(scanners) {
    function commonPoints(s1, s2) {
        let common = 0;
        let remaining = s2.points.length;
        for (const p2 of s2.points) {
            remaining--;
            if (s1.has(p2)) {
                if (++common >= 12) {
                    return true;
                }
            } else if (common + remaining < 12) {
                break;
            }
        }
        return false;
    }

    function adjustScanner(reference, scanner) {
        const backupPoints = scanner.points;
        const backupPosition = scanner.position;

        for (const p1 of reference.points) {
            const k = makeKey(p1);
            if (scanner.testedPoints.has(k)) {
                continue;
            }
            scanner.testedPoints.add(k);

            for (const state2 in STATES) {
                scanner.position = { ...backupPosition };
                scanner.points = backupPoints.map(({ x, y, z }) => ({ x, y, z }));
                scanner.rotate(state2);

                let c = scanner.points.length;
                for (const p2 of scanner.points) {
                    const translate = {
                        x: p1.x - p2.x,
                        y: p1.y - p2.y,
                        z: p1.z - p2.z,
                    };
                    scanner.translate(translate);
                    if (commonPoints(reference, scanner)) {
                        return true;
                    }
                    c--;
                    if (c + count < 12) {
                        break; // won't make it
                    }
                }
            }
        }
        scanner.position = backupPosition;
        scanner.points = backupPoints;
    }

    scanners[0].lock();
    const processed = [scanners[0].id];
    const references = [scanners[0]];

    let count = scanners.length - 1;
    const tracer = new Tracer(true);

    while (count) {
        let found = false;
        tracer.print((_) => count);
        for (let i = 1; i < scanners.length; i++) {
            const s1 = scanners[i];
            if (processed[s1.id]) {
                continue;
            }
            for (const reference of references) {
                if (adjustScanner(reference, s1)) {
                    found = true;
                    s1.lock();
                    references.push(s1);
                    processed[s1.id] = 1;
                    count--;
                    tracer.print((_) => count);
                    break;
                }
            }
        }
        if (!found) {
            throw "Well that's not good";
        }
    }

    tracer.clear();

    const points = new Set();

    for (const s of scanners) {
        for (const p of s.points) {
            points.add(makeKey(p));
        }
    }
    const pts = points.size;
    return pts;
}

function part1(scanners) {
    const result = countBeacons(scanners);
    return result;
}

function part2(scanners) {
    const points = scanners.map((s) => s.position);

    let max = 0;

    for (let i = 0; i < points.length; i++) {
        const { x: x1, y: y1, z: z1 } = points[i];
        for (let j = i + 1; j < points.length; j++) {
            const { x: x2, y: y2, z: z2 } = points[j];
            const d = Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
            max = Math.max(d, max);
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
