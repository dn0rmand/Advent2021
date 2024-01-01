const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

class Board {
    static boardSize = 5;

    constructor() {
        this.data = [];
        this.mainData = [];
        this.mainScore = 0;
        this.score = 0;
    }

    reset() {
        this.data = this.mainData.map((row) => row.map((v) => v));
        this.score = this.mainScore;
        this.win = false;
    }

    addRow(values) {
        this.mainData.push(values);
        this.mainScore += values.reduce((a, v) => a + v);
    }

    isWin(x, y) {
        let win = true;
        for (let x1 = 0; x1 < Board.boardSize; x1++) {
            if (this.data[y][x1] !== -1) {
                win = false;
                break;
            }
        }
        if (!win) {
            win = true;
            for (let y1 = 0; y1 < Board.boardSize; y1++) {
                if (this.data[y1][x] !== -1) {
                    win = false;
                    break;
                }
            }
        }
        return win;
    }

    play(value) {
        for (let y = 0; y < Board.boardSize; y++) {
            for (let x = 0; x < Board.boardSize; x++) {
                if (this.data[y][x] === value) {
                    this.score -= value;
                    this.data[y][x] = -1;

                    if (this.isWin(x, y)) {
                        this.win = true;
                    }
                }
            }
        }
    }
}

function loadData() {
    const readFile = require("./advent_tools/readfile");

    let numbers = undefined;
    let board = undefined;

    const boards = [];

    for (const line of readFile(__filename)) {
        if (!numbers) {
            numbers = line.split(",").map((v) => +v);
        } else if (line.trim().length === 0) {
            // starting a new board
            board = new Board();
            boards.push(board);
        } else {
            const l = line.trim().replaceAll("  ", " ");
            board.addRow(
                l.split(" ").map((v) => {
                    return +v;
                })
            );
        }
    }

    return { numbers, boards };
}

function part1({ numbers, boards }) {
    for (const board of boards) {
        board.reset();
    }

    for (const value of numbers) {
        for (const board of boards) {
            board.play(value);
            if (board.win) {
                return value * board.score;
            }
        }
    }

    return 0;
}

function part2({ numbers, boards }) {
    for (const board of boards) {
        board.reset();
    }

    let result = 0;
    let boardSet = boards;

    for (const value of numbers) {
        boardSet = boardSet.filter((b) => !b.win);
        if (boardSet.length === 0) {
            break;
        }
        for (const board of boardSet) {
            board.play(value);
            if (board.win) {
                result = value * board.score;
            }
        }
    }

    return result;
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
