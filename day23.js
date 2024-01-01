const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

const TYPE2ROOM = {
    a: 20,
    b: 40,
    c: 60,
    d: 80,
};

/*
#############
#...........#
###D#B#C#A###
  #C#A#D#B#
  #########

*/
function loadData() {
    const readFile = require("./advent_tools/readfile");
    const lines = [...readFile(__filename)];

    const data = {
        A: [],
        B: [],
        C: [],
        D: [],
    };

    for (const p of [2, 4, 6, 8]) {
        const t1 = lines[2][p + 1];
        const t2 = lines[3][p + 1];

        data[t1].push(p * 10);
        data[t2].push(p * 10 + 1);
    }

    return data;
}

class State {
    constructor(A, B, C, D, energy = 0) {
        this.$key = undefined;

        this.A = A.sort((a, b) => a - b);
        this.B = B.sort((a, b) => a - b);
        this.C = C.sort((a, b) => a - b);
        this.D = D.sort((a, b) => a - b);
        this.energy = energy;
        this.usedSpots = [];

        this.A.reduce((_, p) => (this.usedSpots[p] = "a"), 0);
        this.B.reduce((_, p) => (this.usedSpots[p] = "b"), 0);
        this.C.reduce((_, p) => (this.usedSpots[p] = "c"), 0);
        this.D.reduce((_, p) => (this.usedSpots[p] = "d"), 0);
    }

    get key() {
        if (!this.$key) {
            const g = (a) => a.map((v) => String.fromCharCode(v + 32)).join("");
            let k = `${g(this.A)}:${g(this.B)}:${g(this.C)}:${g(this.D)}`;
            this.$key = k;
        }
        return this.$key;
    }

    get done() {
        return (
            !this.A.some((v) => v < 20 || v >= 40) &&
            !this.B.some((v) => v < 40 || v >= 60) &&
            !this.C.some((v) => v < 60 || v >= 80) &&
            !this.D.some((v) => v < 80)
        );
    }

    moveTo(position, target) {
        if (this.usedSpots[target]) {
            return -1;
        }

        let energy = 0;
        let direction = position < target ? 1 : -1;
        while (position !== target) {
            if (this.usedSpots[position + direction]) {
                return -1;
            }
            energy += 1;
            position = position + direction;
        }
        return energy;
    }

    moves(callback) {
        this.moveA(callback);
        this.moveB(callback);
        this.moveC(callback);
        this.moveD(callback);
    }
}

class StatePart1 extends State {
    constructor(A, B, C, D, energy = 0) {
        super(A, B, C, D, energy);
    }

    create(A, B, C, D, energy = 0) {
        return new StatePart1(A, B, C, D, energy);
    }

    genericMove(type, a1, a2, callback) {
        const P0 = TYPE2ROOM[type];
        const P1 = P0 + 1;
        const entrance = P0 / 10;

        if (a1 === P0 && a2 === P1) {
            // final positions ... no move
            return;
        }

        if (a1 === P1) {
            return; // final positions ... no move
        }

        if (a1 <= 10) {
            // needs to be able to go to his room
            if (!this.usedSpots[P0] && !this.usedSpots[P1]) {
                const e = this.moveTo(a1, entrance);
                if (e >= 0) {
                    callback(P1, e + 2);
                }
            } else if (!this.usedSpots[P0] && this.usedSpots[P1] === type) {
                const e = this.moveTo(a1, entrance);
                if (e >= 0) {
                    callback(P0, e + 1);
                }
            }
        } else {
            if (a1 % 10 === 1 && this.usedSpots[a1 - 1]) {
                return; // cannot move
            }
            let start = (a1 - (a1 % 10)) / 10;
            let exitE = (a1 % 10) + 1;

            for (let target = 0; target <= 10; target++) {
                if (target === 2 || target === 4 || target === 6 || target === 8) {
                    continue;
                }
                const e = this.moveTo(start, target);
                if (e >= 0) {
                    callback(target, e + exitE);
                }
            }
        }
    }

    // move B
    moveA(callback) {
        const [a1, a2] = this.A;

        this.genericMove("a", a1, a2, (position, energy) => {
            const state = this.create(
                [position, a2],
                this.B,
                this.C,
                this.D,
                this.energy + energy
            );
            callback(state);
        });

        this.genericMove("a", a2, a1, (position, energy) => {
            const state = this.create(
                [a1, position],
                this.B,
                this.C,
                this.D,
                this.energy + energy
            );
            callback(state);
        });
    }

    // move B
    moveB(callback) {
        const [b1, b2] = this.B;

        this.genericMove("b", b1, b2, (position, energy) => {
            const state = this.create(
                this.A,
                [position, b2],
                this.C,
                this.D,
                this.energy + energy * 10
            );
            callback(state);
        });

        this.genericMove("b", b2, b1, (position, energy) => {
            const state = this.create(
                this.A,
                [b1, position],
                this.C,
                this.D,
                this.energy + energy * 10
            );
            callback(state);
        });
    }

    // move C
    moveC(callback) {
        const [c1, c2] = this.C;

        this.genericMove("c", c1, c2, (position, energy) => {
            const state = this.create(
                this.A,
                this.B,
                [position, c2],
                this.D,
                this.energy + energy * 100
            );
            callback(state);
        });

        this.genericMove("c", c2, c1, (position, energy) => {
            const state = this.create(
                this.A,
                this.B,
                [c1, position],
                this.D,
                this.energy + energy * 100
            );
            callback(state);
        });
    }

    // move D
    moveD(callback) {
        const [d1, d2] = this.D;

        this.genericMove("d", d1, d2, (position, energy) => {
            const state = this.create(
                this.A,
                this.B,
                this.C,
                [position, d2],
                this.energy + energy * 1000
            );
            callback(state);
        });

        this.genericMove("d", d2, d1, (position, energy) => {
            const state = this.create(
                this.A,
                this.B,
                this.C,
                [d1, position],
                this.energy + energy * 1000
            );
            callback(state);
        });
    }
}

class StatePart2 extends State {
    constructor(A, B, C, D, energy = 0) {
        super(A, B, C, D, energy);
    }

    create(A, B, C, D, energy = 0) {
        return new StatePart2(A, B, C, D, energy);
    }

    canExitRoom(type, pos) {
        if (pos <= 10) {
            return false;
        }
        const currentRoom = pos - (pos % 10);
        const room = TYPE2ROOM[type];

        // someone in the way?
        for (let p = pos - 1; p >= currentRoom; p--) {
            if (this.usedSpots[p]) {
                return false;
            }
        }

        if (currentRoom === room) {
            for (let p = pos + 1; p < room + 4; p++) {
                if (this.usedSpots[p] !== type) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }

    canEnterRoom(type, pos) {
        if (pos > 10) {
            return false;
        }
        const room = TYPE2ROOM[type];

        if (this.usedSpots[room]) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            if ((this.usedSpots[room + i] || type) !== type) {
                return false;
            }
        }

        return true;
    }

    genericMove(type, a1, a2, a3, a4, callback) {
        const room = TYPE2ROOM[type];
        const entrance = room / 10;

        const P0 = room,
            P1 = room + 1,
            P2 = room + 2,
            P3 = room + 3;

        if (a1 === P0 && a2 === P1 && a3 === P2 && a4 === P3) {
            // final positions ... no move
            return;
        }

        if (a1 === P3) {
            return; // final positions ... no move
        }

        if (this.canEnterRoom(type, a1)) {
            // needs to be able to go to his room
            let start = P0;
            let entryE = 1;
            while (start !== P3 && !this.usedSpots[start + 1]) {
                entryE++;
                start++;
            }
            for (let p = start + 1; p <= P3; p++) {
                if (this.usedSpots[p] !== type) {
                    return; // Not allowed
                }
            }

            const e = this.moveTo(a1, entrance);
            if (e >= 0) {
                callback(start, e + entryE);
            }
        } else if (this.canExitRoom(type, a1)) {
            let start = a1 - (a1 % 10);
            let exitE = 1;
            for (let p = a1 - 1; p >= start; p--) {
                if (this.usedSpots[p]) {
                    return; // cannot move
                }
                exitE++;
            }
            start = start / 10;

            for (let target = 0; target <= 10; target++) {
                if (target === 2 || target === 4 || target === 6 || target === 8) {
                    continue;
                }
                const e = this.moveTo(start, target);
                if (e >= 0) {
                    callback(target, e + exitE);
                }
            }
        }
    }

    // move B
    moveA(callback) {
        const A = this.A;

        for (let i = 0; i < 4; i++) {
            const [a1, a2, a3, a4] = A;

            this.genericMove("a", a1, a2, a3, a4, (position, energy) => {
                const newState = this.create(
                    [position, a2, a3, a4],
                    this.B,
                    this.C,
                    this.D,
                    this.energy + energy
                );
                callback(newState);
            });

            // Rotate array
            A.push(A[0]);
            A.shift();
        }
    }

    // move B
    moveB(callback) {
        const B = this.B;

        for (let i = 0; i < 4; i++) {
            const [b1, b2, b3, b4] = B;

            this.genericMove("b", b1, b2, b3, b4, (position, energy) => {
                const newState = this.create(
                    this.A,
                    [position, b2, b3, b4],
                    this.C,
                    this.D,
                    this.energy + energy * 10
                );
                callback(newState);
            });

            // Rotate array
            B.push(B[0]);
            B.shift();
        }
    }

    // move C
    moveC(callback) {
        const C = this.C;

        for (let i = 0; i < 4; i++) {
            const [c1, c2, c3, c4] = C;

            this.genericMove("c", c1, c2, c3, c4, (position, energy) => {
                const newState = this.create(
                    this.A,
                    this.B,
                    [position, c2, c3, c4],
                    this.D,
                    this.energy + energy * 100
                );
                callback(newState);
            });

            // Rotate array
            C.push(C[0]);
            C.shift();
        }
    }

    // move D
    moveD(callback) {
        const D = this.D;

        for (let i = 0; i < 4; i++) {
            const [d1, d2, d3, d4] = D;

            this.genericMove("d", d1, d2, d3, d4, (position, energy) => {
                const newState = this.create(
                    this.A,
                    this.B,
                    this.C,
                    [position, d2, d3, d4],
                    this.energy + energy * 1000
                );
                callback(newState);
            });

            // Rotate array
            D.push(D[0]);
            D.shift();
        }
    }
}

function solve(start) {
    let states = new Map();
    let newStates = new Map();

    const visited = new Map();

    states.set(start.key, start);
    visited.set(start.key, 0);

    let minCost = Number.MAX_SAFE_INTEGER;

    while (states.size > 0) {
        newStates.clear();
        for (const state of states.values()) {
            state.moves((newState) => {
                if (newState.done) {
                    if (newState.energy < minCost) {
                        minCost = newState.energy;
                        return;
                    }
                }
                if (newState.energy >= minCost) {
                    return;
                }

                const key = newState.key;
                if ((visited.get(key) || Number.MAX_SAFE_INTEGER) <= newState.energy) {
                    return;
                }
                visited.set(key, newState.energy);
                newStates.set(key, newState);
            });
        }

        [states, newStates] = [newStates, states];
    }

    return minCost;
}

function part1({ A, B, C, D }) {
    const start = new StatePart1(A, B, C, D, 0);

    return solve(start);
}

function part2({ A, B, C, D }) {
    const convert = (p) => (p % 10 === 1 ? p + 2 : p);

    const A2 = [convert(A[0]), 62, 81, convert(A[1])];
    const B2 = [convert(B[0]), 42, 61, convert(B[1])];
    const C2 = [convert(C[0]), 41, 82, convert(C[1])];
    const D2 = [convert(D[0]), 21, 22, convert(D[1])];

    const start = new StatePart2(A2, B2, C2, D2, 0);

    return solve(start);
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
