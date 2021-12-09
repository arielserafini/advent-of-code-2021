import run from "aocrunner";

const testInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

enum Direction {
  Down = "down",
  Forward = "forward",
  Up = "up",
}

type CommandString = `${Direction} ${number}`;

class MoveCommand {
  direction: Direction;
  value: number;

  constructor(command: CommandString) {
    const [direction, value] = command.split(" ");
    this.direction = direction as Direction;
    this.value = parseInt(value, 10);
  }
}

class Point {
  x = 0;
  y = 0;
  aim = 0;
}


const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((command) => new MoveCommand(command as CommandString));

function calculate(input: MoveCommand[]) {
  const position = input.reduce(
    (position, moveCommand) => {
      switch (moveCommand.direction) {
        case Direction.Down:
          position.y += moveCommand.value;
          break;
        case Direction.Up:
          position.y -= moveCommand.value;
          break;
        case Direction.Forward:
          position.x += moveCommand.value;
          break;
      }
      return position;
    },
    new Point(),
  );

  return position.x * position.y;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculate(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const position = input.reduce(
    (position, moveCommand) => {
      switch (moveCommand.direction) {
        case Direction.Down:
          position.aim += moveCommand.value
          break;
        case Direction.Up:
          position.aim -= moveCommand.value;
          break;
        case Direction.Forward:
          position.x += moveCommand.value;
          position.y += moveCommand.value * position.aim;
          break;
      }
      return position;
    },
    new Point(),
  );


  return position.x * position.y;
};

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
