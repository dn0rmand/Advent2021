// prettier-ignore
const letters = {
    '011010011001111110011001': 'A',
    '111010011110100110011110': 'B',
    '011010011000100010010110': 'C',
    '111010011001100110011110': 'D',
    '111110001110100010001111': 'E',
    '111110001110100010001000': 'F',
    '011010011000101110010111': 'G',
    '100110011111100110011001': 'H',
    '011100100010001000100111': 'I',
    '001100010001000110010110': 'J',
    '100110101100101010101001': 'K',
    '100010001000100010001111': 'L',
    'm': 'M',
    'n': 'N',
    '011010011001100110010110': 'O',
    '111010011001111010001000': 'P',
    'q': 'Q',
    '111010011001111010101001': 'R',
    '011110000110100000011110': 'S', // 2 possibilities for S
    '011110001000011000011110': 'S', // 2 possibilities for S
    't': 'T',
    '100110011001100110010110': 'U',
    'v': 'V',
    'w': 'W',
    'x': 'X',
    '100010000101001000100010': 'Y',
    '111100010010010010001111': 'Z',
};

const MAX = 2 ** 24;

function getLetter(screen, index, bit) {
  let value = 0;
  bit = bit === undefined ? 1 : bit;

  for (let y = 0; y < screen.length; y++) {
    const row = screen[y] || [];
    for (let x = 0; x < 4; x++) {
      value = value * 2 + (row[x + index * 5] === bit ? 1 : 0);
    }
  }

  const key = (value + MAX).toString(2).substring(1);
  const letter = letters[key];
  if (letter) {
    return letter;
  }

  return `|${key}|`;
}

function translate(screen, bit) {
  let result = "";

  for (let p = 0; p < screen[0].length; p += 5) {
    result += getLetter(screen, p / 5, bit);
  }

  return result;
}

function print(screen) {
  for (let y = 0; y < screen.length; y++) {
    const row = screen[y] || [];
    let line = "";
    for (let x = 0; x < row.length; x++) {
      line += row[x] === 1 ? "#" : " ";
    }
    console.log(line);
  }
}

module.exports = { getLetter, translate, print };
