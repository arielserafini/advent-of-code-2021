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

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
