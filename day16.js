const DAY = +__filename.match(/^.*\/day(\d*)\.js$/)[1];

const assert = require("assert");

class Bits {
    constructor(data) {
        this.data = data;
        this.position = 0;
        this.bitMask = 0b1000;
        this.bitCount = data.length * 4;
    }

    next() {
        if (this.bitCount) {
            this.bitCount--;
            const value = this.bitMask & this.data[this.position] ? 1 : 0;
            this.bitMask >>= 1;
            if (this.bitMask === 0) {
                this.position++;
                this.bitMask = 0b1000;
            }
            return value;
        } else {
            throw "Out of bits";
        }
    }

    get(bitCount) {
        let value = 0;
        while (bitCount--) {
            const b = this.next();
            value = value * 2 + b;
        }
        return value;
    }
}

class Packet {
    constructor(version, type, subPackets, literalValue) {
        this.version = version;
        this.type = type;
        this.packets = subPackets || [];
        this.literalValue = literalValue;
    }

    get value() {
        switch (this.type) {
            case 0: // sum
                return this.packets.reduce((a, p) => a + p.value, 0);
            case 1: // product
                return this.packets.reduce((a, p) => a * p.value, 1);
            case 2: // min
                return this.packets.reduce(
                    (a, p) => Math.min(a, p.value),
                    Number.MAX_SAFE_INTEGER
                );
            case 3: // max
                return this.packets.reduce(
                    (a, p) => Math.max(a, p.value),
                    Number.MIN_SAFE_INTEGER
                );
            case 4: // literal value
                return this.literalValue;
            case 5: // greater than
                assert.strictEqual(this.packets.length, 2);
                return this.packets[0].value > this.packets[1].value ? 1 : 0;
            case 6: // less than
                assert.strictEqual(this.packets.length, 2);
                return this.packets[0].value < this.packets[1].value ? 1 : 0;
            case 7: // equal
                assert.strictEqual(this.packets.length, 2);
                return this.packets[0].value === this.packets[1].value ? 1 : 0;
            default:
                throw "Unknown Type";
        }
    }

    static Create(bits) {
        const version = bits.get(3);
        const type = bits.get(3);
        if (type === 4) {
            let value = 0;
            while (bits.next()) {
                value = value * 16 + bits.get(4);
            }
            value = value * 16 + bits.get(4);
            return new Packet(version, type, [], value);
        } else {
            const subPackets = [];

            if (bits.next() === 0) {
                const length = bits.get(15);
                const target = bits.bitCount - length;

                while (bits.bitCount > target) {
                    subPackets.push(Packet.Create(bits));
                }
                assert.strictEqual(bits.bitCount, target, "Used too many bits");
            } else {
                let length = bits.get(11);
                while (length--) {
                    subPackets.push(Packet.Create(bits));
                }
            }

            return new Packet(version, type, subPackets);
        }
    }
}

function loadData() {
    const readFile = require("./advent_tools/readfile");

    for (const line of readFile(__filename)) {
        const data = new Uint8Array(line.length);
        for (let i = 0; i < line.length; i++) {
            data[i] = parseInt(line[i], 16);
        }
        return Packet.Create(new Bits(data));
    }
}

function part1(packet) {
    let total = 0;
    function inner(packets) {
        for (const p of packets) {
            total = total + p.version;
            inner(p.packets);
        }
    }

    inner([packet]);
    return total;
}

function part2(packet) {
    return packet.value;
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
