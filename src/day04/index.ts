import run from "aocrunner";
import { BigIntOptions } from "fs";

function boardStringToMatrix(board: string): Board {
  const lines = board.split("\n").map((line: string) =>
    line
      .trim()
      .replaceAll("  ", " ")
      .split(" ")
      .map((num) => parseInt(num, 10)),
  );
  return lines;
}

type Board = number[][];

const parseInput = (rawInput: string): [number[], Board[]] => {
  const [bingo, ...boards] = rawInput.split("\n\n");
  return [
    bingo.split(",").map((num) => parseInt(num, 10)),
    boards.map(boardStringToMatrix),
  ];
};

export const testInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

function parseBoard(lines: Board) {
  const columns = lines.map((_, index) => {
    return lines.map((l) => l[index]);
  });

  return [lines, columns];
}

function sumValues(values: number[]) {
  return values.reduce((total, num) => {
    return total + num;
  }, 0);
}

function boardResult(
  board: Board,
  numbers: number[],
  lastNumber: number = numbers[numbers.length - 1],
) {
  const [lines, columns] = parseBoard(board);

  const winningLineIndex = lines.findIndex((line) => {
    return line.every((n) => numbers.includes(n));
  });

  if (winningLineIndex > -1) {
    const unmarkedNumbers = lines
      .filter((_, index) => index !== winningLineIndex)
      .map((l) => l.filter((num) => !numbers.includes(num)));

    const lineSums = sumValues(unmarkedNumbers.map(sumValues));

    return lineSums * lastNumber;
  }

  const winningColumnIndex = columns.findIndex((column) => {
    return column.every((n) => numbers.includes(n));
  });

  if (winningColumnIndex > -1) {
    const unmarkedNumbers = columns
      .filter((_, index) => index !== winningColumnIndex)
      .map((l) => l.filter((num) => !numbers.includes(num)));
    const columnSums = sumValues(unmarkedNumbers.map(sumValues));

    return columnSums * lastNumber;
  }
}

const part1 = (rawInput: string) => {
  const [bingo, boards] = parseInput(rawInput);
  const calledNumbers = bingo.slice(0, 5);
  let winningBoard;

  for (let idx = 4; idx < bingo.length; idx++) {
    const num = bingo[idx];
    calledNumbers.push(num);

    winningBoard = boards
      .map((board) => boardResult(board, calledNumbers))
      .find((b) => !!b);
    if (winningBoard) {
      break;
    }
  }

  return winningBoard;
};

const part2 = (rawInput: string) => {
  const OLD_VALUE = old_part2(rawInput);
  const [bingo, boards] = parseInput(rawInput);
  const lineLength = boards[0].length;
  let idx = lineLength - 1;

  const calledNumbers = bingo.slice(0, 5);
  let solvedBoards: (number | undefined)[] = [];
  let lastBoard;

  for (idx; idx < bingo.length; idx++) {
    const num = bingo[idx];

    calledNumbers.push(num);
    const currentBoards = boards.map((b) => boardResult(b, calledNumbers));

    currentBoards.forEach((b, boardIndex) => {
      if (
        b &&
        solvedBoards.filter((b) => b === undefined).length === 1 &&
        solvedBoards[boardIndex] === undefined
      ) {
        lastBoard = b;
      }
    });

    solvedBoards = currentBoards;
    if (solvedBoards.every((b) => !!b)) {
      break;
    }
  }
  console.log("OLD", OLD_VALUE);
  console.log("NEW", lastBoard);
  return lastBoard;
};

const old_part2 = (rawInput: string) => {
  const [bingo, boards] = parseInput(rawInput);
  const calledNumbers = <number[]>[];
  let remainingBoards = [...boards];

  for (let idx = 0; idx <= bingo.length && remainingBoards.length; idx++) {
    const num = bingo[idx];
    calledNumbers.push(num);

    if (remainingBoards.length === 1) {
      break;
    }

    remainingBoards = remainingBoards.filter(
      (board) => !boardResult(board, calledNumbers, num),
    );
  }
  const lastNumber = [...calledNumbers].pop();

  return boardResult(remainingBoards[0], calledNumbers, lastNumber);
};

run({
  part1: {
    tests: [
      {
        name: "test 1",
        input: testInput,
        expected: 4512,
      },
    ],
    solution: part1, //58838
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 148 * 13,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
