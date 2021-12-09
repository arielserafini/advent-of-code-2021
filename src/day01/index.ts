import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(num => parseInt(num, 10));

function countIncrements(arr: number[]) {
  let increments = 0;
  [...arr].sort((a, b) => {
    if (a > b) {
      increments++;
    }

    return 0;
  })

  return increments;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return countIncrements(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const windows: number[] = [];

  input.forEach((num, idx, arr) => {
    if (idx < arr.length -2) {
      windows.push(num + arr[idx+1] + arr[idx+2]);
    }
  });

  return countIncrements(windows);
};

run({
  part1: {
    tests: [
      {
        input: `199
200
208
210
200
207
240
269
260
263`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `199
200
208
210
200
207
240
269
260
263`,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
