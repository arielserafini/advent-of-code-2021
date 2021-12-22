import run from "aocrunner";
import { deepEqual } from "assert";

const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

const testDiagram = `.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....`;

function diagramToMatrix(diagram: string) {
  return diagram
    .replaceAll(".", "0")
    .split("\n")
    .map((l) => l.split("").map((n) => parseInt(n, 10)));
}

const parsedDiagram = diagramToMatrix(testDiagram);

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((lineStr) => new Line(lineStr as LineString));

type PointString = `${number},${number}`;
type LineString = `${PointString} -> ${PointString}`;

class Point {
  x = 0;
  y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromString(str: PointString) {
    const [x, y] = str.split(",").map((num) => parseInt(num, 10));
    return new Point(x, y);
  }
}

class Line {
  start: Point;
  end: Point;

  constructor(str: LineString) {
    const [startStr, endStr] = str.split(" -> ") as PointString[];

    this.start = Point.fromString(startStr);
    this.end = Point.fromString(endStr);
  }

  get isHorizontal() {
    return this.start.y === this.end.y;
  }
  get isVertical() {
    return this.start.x === this.end.x;
  }
  get isDiagonal() {
    let diffX = this.start.x - this.end.x;
    let diffY = this.start.y - this.end.y;

    return diffX * Math.sign(diffX) - diffY * Math.sign(diffY) === 0;
  }
}

type Grid = number[][];

function getCoveredPoints(line: Line): Point[] {
  let points = [];
  const { start, end, isHorizontal, isVertical, isDiagonal } = line;
  const [sortedStart, sortedEnd] = [start, end].sort((a, b) => {
    if (a.x !== b.x) {
      return a.x - b.x;
    } else if (a.y !== b.y) {
      return a.y - b.y;
    }

    return 0;
  });

  const { x: startX, y: startY } = sortedStart;
  const { x: endX, y: endY } = sortedEnd;

  if (isHorizontal || isVertical) {
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        points.push(new Point(x, y));
      }
    }
  } else if (isDiagonal) {
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;
    const count = diffY * Math.sign(diffY);

    for (let i = 0; i <= count; i++) {
      points.push(
        new Point(
          start.x + i * Math.sign(diffX),
          start.y + i * Math.sign(diffY),
        ),
      );
    }
  }

  return points;
}

deepEqual(
  getCoveredPoints(new Line("1,1 -> 1,3")),
  ["1,1", "1,2", "1,3"].map((str) => Point.fromString(str as PointString)),
);
deepEqual(
  getCoveredPoints(new Line("1,3 -> 1,1")),
  ["1,1", "1,2", "1,3"].map((str) => Point.fromString(str as PointString)),
  "works with points in any order",
);

deepEqual(
  getCoveredPoints(new Line("1,1 -> 3,3")),
  ["1,1", "2,2", "3,3"].map((str) => Point.fromString(str as PointString)),
  "also works with diagonals",
);
deepEqual(
  getCoveredPoints(new Line("9,7 -> 7,9")),
  ["9,7", "8,8", "7,9"].map((str) => Point.fromString(str as PointString)),
  "also works with diagonals",
);

function getGrid(lines: Line[], gridSize = 1000) {
  return lines.reduce((grid, line) => {
    const coveredPoints = getCoveredPoints(line);
    coveredPoints.forEach(({ x, y }) => {
      grid[y][x]++;
    });

    return grid;
  }, new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(0)) as Grid);
}

function getDiagram(lines: Line[], gridSize = 10) {
  return getGrid(lines, gridSize)
    .map((line) => line.join(""))
    .join("\n")
    .replaceAll("0", ".");
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).filter(
    (line) => line.isHorizontal || line.isVertical,
  );

  const grid = getGrid(input);
  return grid.flat().filter((n) => n > 1).length;

  // console.log(getDiagram(input))
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).filter(
    (line) => line.isHorizontal || line.isVertical || line.isDiagonal,
  );
  console.log(input);

  const grid = getGrid(input);
  return grid.flat().filter((n) => n > 1).length;
};

run({
  part1: {
    tests: [
      // {
      //   input: testInput,
      //   expected: testDiagram,
      // },
      {
        input: testInput,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
