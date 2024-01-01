const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const segments = [];

    const add = (from, to) => {
        if (to !== "start" && from !== "end") {
            let segment = segments[from];
            if (!segment) {
                segments[from] = [to];
            } else if (!segment.includes(to)) {
                segment.push(to);
            }
        }
    };

    for (const line of readFile(__filename)) {
        const [from, to] = line.split("-");
        add(from, to);
        add(to, from);
    }

    return segments;
}

function countPaths(segments, part2) {
    let didTwo = 0;
    const visited = {};
    const makeKey = (current) => {
        const ks = Object.keys(visited).filter((c) => visited[c]);
        const k = `${current}-${didTwo}-${ks.sort().join(":")}`;
        return k;
    };
    const isLower = (s) => s === s.toLowerCase();
    const $paths = {};

    function inner(current) {
        if (current === "end") {
            return 1;
        }
        const key = makeKey(current);
        let count = $paths[key];
        if (count !== undefined) {
            return count;
        }
        count = 0;
        for (const target of segments[current] || []) {
            if (isLower(target)) {
                const v = visited[target] || 0;
                if (!v) {
                    visited[target] = 1;
                    count += inner(target);
                    visited[target] = 0;
                } else if (part2 && !didTwo) {
                    didTwo = 1;
                    count += inner(target);
                    didTwo = 0;
                }
            } else {
                count += inner(target);
            }
        }

        $paths[key] = count;
        return count;
    }

    const total = inner("start");

    return total;
}

function part1(segments) {
    const answer = countPaths(segments, false);
    return answer;
}

function part2(segments) {
    const answer = countPaths(segments, true);
    return answer;
}

console.log(`--- Advent of Code day ${DAY} ---`);

function execute() {
    console.time(`${DAY}-segments`);
    const segments = loadData();
    console.timeLog(`${DAY}-segments`, `to load segments of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(segments)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(segments)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
