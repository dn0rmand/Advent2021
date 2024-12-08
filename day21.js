const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const entries = {
        player1: 0,
        player2: 0,
    };

    for (const line of readFile(__filename)) {
        if (line.startsWith("Player 1 starting position: ")) {
            entries.player1 = +line.substring(28);
        } else if (line.startsWith("Player 2 starting position: ")) {
            entries.player2 = +line.substring(28);
        }
    }

    return entries;
}

function part1({ player1, player2 }) {
    let turn = 0;
    let dice = 0;
    let rolls = [6, 5, 4, 3, 2, 1, 0, 9, 8, 7];

    let p1 = player1;
    let p2 = player2;
    let s1 = 0;
    let s2 = 0;
    let turns = 0;

    const move = [
        (value) => {
            p1 += value;
            if (p1 > 10) {
                p1 -= 10;
            }
            s1 += p1;
            if (s1 >= 1000) {
                return s2 * turns;
            }
        },
        (value) => {
            p2 += value;
            if (p2 > 10) {
                p2 -= 10;
            }
            s2 += p2;
            if (s2 >= 1000) {
                return s1 * turns;
            }
        },
    ];

    while (true) {
        const value = rolls[dice];
        dice = (dice + 1) % 10;
        if (value === 6 && turns > 0 && p1 === player1 && p2 === player2) {
            const times = Math.floor(1000 / Math.max(s1, s2));

            s1 *= times;
            s2 *= times;
            turns *= times;
        }

        turns += 3;

        const score = move[turn](value);
        if (score) {
            return score;
        }

        turn = (turn + 1) % 2;
    }
}

function part2({ player1, player2 }) {
    const startState = {
        players: [
            { position: player1, score: 0 },
            { position: player2, score: 0 },
        ],
        count: 1,
    };

    const rollCounts = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1];
    const makeKey = (p1, p2) =>
        ((p1.position * 30 + p1.score) * 30 + p2.position) * 30 + p2.score;

    let states = new Map();
    let newStates = new Map();

    states.set("1", startState);

    let playerWins = [0, 0];
    let turn = 0;

    while (states.size > 0) {
        newStates.clear();
        for (const state of states.values()) {
            const player = state.players[turn];
            for (let value = 3; value <= 9; value++) {
                const count = rollCounts[value];

                let p = player.position + value;
                if (p > 10) {
                    p -= 10;
                }

                const newPlayer = { position: p, score: player.score + p };

                if (newPlayer.score >= 21) {
                    playerWins[turn] += state.count * count;
                    continue;
                }

                const newState = {
                    players: [...state.players],
                    count: state.count * count,
                };

                newState.players[turn] = newPlayer;

                const k = makeKey(newState.players[0], newState.players[1]);
                const o = newStates.get(k);
                if (o) {
                    o.count += newState.count;
                } else {
                    newStates.set(k, newState);
                }
            }
        }
        turn = (turn + 1) % 2;
        [newStates, states] = [states, newStates];
    }

    return Math.max(playerWins[0], playerWins[1]);
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
