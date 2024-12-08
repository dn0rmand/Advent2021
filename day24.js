const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

function loadData() {
    const readFile = require("./advent_tools/readfile");

    const program = new Program();

    for (const line of readFile(__filename)) {
        program.addInstruction(line);
    }

    return program;
}

const OPCODES = {
    inp: 1,
    add: 2,
    mul: 3,
    div: 4,
    mod: 5,
    eql: 6,
};

class Instruction {
    constructor(line, registers) {
        this.registers = registers;

        line = line.split(" ");

        this.opcode = OPCODES[line[0]];
        if (!this.opcode) {
            throw "Syntax Error";
        }
        this.toRegister = line[1];
        if (this.registers[this.toRegister] === undefined) {
            throw "Syntax Error";
        }

        if (this.opcode !== OPCODES.inp) {
            const value = line[2];
            if (this.registers[value] !== undefined) {
                this.fromRegister = value;
            } else {
                this.fromValue = +value;
                if (isNaN(this.fromValue)) {
                    throw "Syntax Error";
                }
            }
        }
    }

    get from() {
        if (this.fromRegister) {
            return this.registers[this.fromRegister];
        } else {
            return this.fromValue;
        }
    }

    get to() {
        return this.registers[this.toRegister];
    }

    set to(value) {
        this.registers[this.toRegister] = value;
    }

    execute(program) {
        switch (this.opcode) {
            case OPCODES.inp:
                this.to = program.next();
                break;
            case OPCODES.add:
                this.to = this.to + this.from;
                break;
            case OPCODES.mul:
                this.to = this.to * this.from;
                break;
            case OPCODES.div:
                this.to = Math.floor(this.to / this.from);
                break;
            case OPCODES.mod:
                this.to = this.to % this.from;
                break;
            case OPCODES.eql:
                this.to = this.to === this.from ? 1 : 0;
                break;
        }
    }
}

class Program {
    constructor() {
        this.instructions = [];
        this.input = [];
        this.ip = 0;
        this.registers = {
            w: 0,
            x: 0,
            y: 0,
            z: 0,
        };
    }

    addInstruction(line) {
        this.instructions.push(new Instruction(line, this.registers));
    }

    step() {
        if (this.ip < this.instructions.length) {
            const i = this.instructions[this.ip++];
            i.execute(this);
        }
    }

    reset() {
        this.ip = 0;
        this.registers.w = 0;
        this.registers.x = 0;
        this.registers.y = 0;
        this.registers.z = 0;
    }

    run(input) {
        this.reset();
        this.input = [...input];
        while (this.ip < this.instructions.length) {
            this.step();
        }
        return this.registers.z;
    }

    next() {
        return this.input.shift();
    }
}

function findDigits(program, order) {
    const AB = [];

    for (let i = 0; i < program.instructions.length; i += 18) {
        const a = program.instructions[i + 5].fromValue;
        const b = program.instructions[i + 15].fromValue;
        AB.push({ a, b });
    }

    function reverseStep(z, digit, { a, b }, callback) {
        let oz1 = (z - digit - b) / 26;
        let oz0 = z;

        let factor = a < 0 ? 26 : 1;
        if (Math.floor(oz0) === oz0) {
            if (factor === 1) {
                if ((oz0 % 26) + a === digit) {
                    if (callback(oz0)) {
                        return true;
                    }
                }
            } else {
                const i = digit - a;
                oz0 *= factor;
                if (i >= 0 && i < 26) {
                    if (callback(oz0 + i)) {
                        return true;
                    }
                }
            }
        }

        if (Math.floor(oz1) === oz1) {
            if (factor === 1) {
                if ((oz1 % 26) + a !== digit) {
                    if (callback(oz1)) {
                        return true;
                    }
                }
            } else {
                for (let i = 0; i < 26; i++) {
                    const oz = oz1 + i;
                    if ((oz % 26) + a !== digit) {
                        if (callback(oz)) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    const visited = {};

    function inner(idx, factor, value, z, callback) {
        if (idx < 0) {
            if (z !== 0) {
                throw "ERROR";
            }
            callback(value);
            return true;
        } else {
            const k = `${idx}:${z}`;
            if (visited[k]) {
                return;
            }
            visited[k] = 1;

            for (const d of order) {
                if (
                    reverseStep(z, d, AB[idx], (oz) => {
                        return inner(
                            idx - 1,
                            factor * 10,
                            value + factor * d,
                            oz,
                            callback
                        );
                    })
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    let value;
    inner(13, 1, 0, 0, (number) => {
        value = number;
    });

    return value;
}

function part1(program) {
    return findDigits(program, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
}

function part2(program) {
    return findDigits(program, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
}

function execute() {
    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-input`);
    const program = loadData();
    console.timeLog(`${DAY}-input`, `to load input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(program)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(program)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
}

module.exports = execute;
