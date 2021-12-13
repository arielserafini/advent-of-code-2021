import run from "aocrunner";
const testInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const gammaValue = input
    .reduce(
      (acc, item, idx) => {
        return acc.map((pos, posIdx) => pos + parseInt(item[posIdx], 10));
      },
      [0, 0, 0, 0, 0],
    )
    .map((pos) => (pos > input.length / 2 ? 1 : 0))
    .join("");

  const epsilonValue = gammaValue
    .split("")
    .map((num) => ~num & 1)
    .join("");

  const gammaDecimal = parseInt(gammaValue, 2);
  const epsilonDecimal = parseInt(epsilonValue, 2);

  const result = gammaDecimal * epsilonDecimal;

  return result;
};

type Bit = 1 | 0;

function getMostCommonBitForInputPosition(input: string[], position: number) {
  let onesCount = 0;

  const bits = input.map((val) => {
    const bit = parseInt(val[position], 10) as Bit;
    if (bit === 1) {
      onesCount++;
    }
    return bit;
  });
  const mostCommonBit = onesCount >= bits.length / 2 ? 1 : 0;

  return mostCommonBit;
}

function getMostCommonBitsForInput(input: string[]) {
  const values = new Array(input[0].length).fill(0);

  return values.map((_, index) =>
    getMostCommonBitForInputPosition(input, index),
  );
}

function getOxygenRating(input: string[]) {
  let oxy = [...input];
  let pass = 0;
  let currentPos = 0;

  while (oxy.length > 1 && pass < 10) {
    pass++;
    const commonBits = getMostCommonBitsForInput(oxy);

    oxy = oxy.filter((val) => parseInt(val[currentPos], 10) === commonBits[currentPos]);
    currentPos++;
  }

  return oxy[0];
}

function getCO2Rating(input: string[]) {
  let co2 = [...input];
  let pass = 0;
  let currentPos = 0;

  while (co2.length > 1 && pass < 10) {
    pass++;
    const commonBits = getMostCommonBitsForInput(co2);

    co2 = co2.filter((val) => parseInt(val[currentPos], 10) !== commonBits[currentPos]);
    currentPos++;
  }

  return co2[0];
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);



  const oxygenGeneratorRating = parseInt(getOxygenRating(input), 2);
  const co2ScrubberRating = parseInt(getCO2Rating(input), 2);
  const lifeSupportRating = oxygenGeneratorRating * co2ScrubberRating;

  return lifeSupportRating;
};

run({
  part1: {
    tests: [
      {
        input: `00100
11110
11110`,
        expected: 30,
      },
      {
        input: testInput,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
