import run from "aocrunner";
import assert from "assert";

const parseInput = (rawInput: string) =>
  rawInput.split(",").map((n) => parseInt(n));
const testInput = `16,1,2,0,4,2,7,1,2,14`;

function getBestPosition(positions: number[], grow = false) {
  const sortedPositions = [...positions].sort((a, b) => a - b);
  const possiblePositions = new Array(
    sortedPositions[sortedPositions.length - 1] - sortedPositions[0],
  )
    .fill(0)
    .map((_, idx) => idx + 1);

  const fuelCosts = possiblePositions.map((p) => {
    return positions.reduce((total = 0, num) => {
      const diff = num > p ? num - p : p - num;

      const newTotal = total + diff;
      if (grow) {
        return total + getTriangular(diff);
      }
      return newTotal;
    }, 0);
  });

  const result = [...fuelCosts]
  .sort((a, b) => a - b);
  return result[0];
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getBestPosition(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return getBestPosition(input, true);
};

function getTriangular(num: number) {
  return (num / 2) * (num + 1);
}

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 37,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 168,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
