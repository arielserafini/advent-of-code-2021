import run from "aocrunner";
import * as assert from "assert";

const parseInput = (rawInput: string) =>
  rawInput.split(",").map((n) => parseInt(n));
const testInput =         "3,4,3,1,2";
const inputAfterOneDay =  "2,3,2,0,1";
const inputAfterTwoDays = "1,2,1,6,0,8";

enum FishStatus {
  Spawning = 8,
  Fertile = 0,
  Infertile = 6,
}

function getFishForDays(startingFish: number[], days: number) {
  const buckets = new Array(9).fill(0);
  startingFish.forEach((f) => buckets[f]++);

  for (let day = 0; day < days; day++) {
    const fertileFishCount = buckets[FishStatus.Fertile];

    for (let index = 0; index < buckets.length - 1; index++) {
      buckets[index] = buckets[index + 1];
    }

    buckets[FishStatus.Spawning] = fertileFishCount;
    buckets[FishStatus.Infertile] += fertileFishCount;
  }

  return buckets.reduce(countFromBucket);
}

function countFromBucket(total = 0, n: number) {
  return total + n;
}

const parsedInput = parseInput(testInput);
assert.equal(
  getFishForDays(parsedInput, 1),
  parseInput(inputAfterOneDay).length,
);

assert.equal(
  getFishForDays(parsedInput, 2),
  parseInput(inputAfterTwoDays).length,
);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const TOTAL_DAYS = 80;

  return getFishForDays(input, TOTAL_DAYS);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const TOTAL_DAYS = 256;

  return getFishForDays(input, TOTAL_DAYS)
};

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 5934,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 26984457539,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
