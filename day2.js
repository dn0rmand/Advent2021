const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = [];

    for (const line of readFile(__filename)) {
        const values = line.split(" ");
        entries.push({
            direction: values[0],
            value: +values[1],
        });
    }

    return entries;
}

function part1(input) {
    const actions = {
        forward: (ctx, value) => ({
            position: ctx.position + value,
            depth: ctx.depth,
        }),
        up: (ctx, value) => ({
            position: ctx.position,
            depth: ctx.depth - value,
        }),
        down: (ctx, value) => ({
            position: ctx.position,
            depth: ctx.depth + value,
        }),
    };

    const ctx = input.reduce(
        (ctx, { direction, value }) => actions[direction](ctx, value),
        { position: 0, depth: 0 }
    );
    return ctx.position * ctx.depth;
}

function part2(input) {
    const actions = {
        forward: (ctx, value) => ({
            aim: ctx.aim,
            position: ctx.position + value,
            depth: ctx.depth + ctx.aim * value,
        }),
        up: (ctx, value) => ({
            ...ctx,
            aim: ctx.aim - value,
        }),
        down: (ctx, value) => ({
            ...ctx,
            aim: ctx.aim + value,
        }),
    };

    const ctx = input.reduce(
        (ctx, { direction, value }) => actions[direction](ctx, value),
        {
            position: 0,
            aim: 0,
            depth: 0,
        }
    );

    return ctx.position * ctx.depth;
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    const data = loadData();

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(data)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(data)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
