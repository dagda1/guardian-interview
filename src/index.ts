import inquirer from 'inquirer';
const { prompt } = inquirer;

const commands = ['N', 'S', 'E', 'W'] as const;

type RobotState = 'IDLE' | 'CARRYING';

type Commands = typeof commands[number];

const MaxColumns = 10;
const MaxRows = 10;

interface Robot {
  move(command: Commands): void;
  state: RobotState;
  carry(): void;
  drop(): void;
  current: Point;
}

type Point = [number, number];
type Grid = Point[][];
interface Warehouse {
  grid: Grid;
  robot: Robot;
  printGrid(): void;
}

function createWarehouse(): Warehouse {
  const grid: Point[][] = [];

  for (let row = 0; row < MaxRows; row++) {
    grid[row] = [];
    for (let column = 0; column < MaxColumns; column++) {
      grid[row][column] = [row, column];
    }
  }

  return {
    grid,
    robot: {
      state: 'IDLE',
      carry() {
        if (this.state === 'CARRYING') {
          console.log(`no you don't`);
          return;
        }
        this.state = 'CARRYING';
      },
      drop() {
        this.state = 'IDLE';
      },
      move(action: Commands) {
        const [x, y] = this.current;

        switch (action as Commands) {
          case 'N':
            if (y < MaxRows) {
              this.current = [x, y + 1];
            }
            break;
          case 'S':
            if (y !== 0) {
              this.current = [x, y - 1];
            }
            break;
          case 'E':
            if (x < MaxColumns) {
              this.current = [x + 1, y];
            }
            break;
          case 'W':
            if (x !== 0) {
              this.current = [x - 1, y];
            }
        }
      },
      current: [0, 0],
    },
    printGrid() {
      const [x, y] = this.robot.current;
      for (let row = MaxRows - 1; row >= 0; row--) {
        for (let column = 0; column < MaxColumns; column++) {
          const display = column === x && row === y ? 'R' : '.';
          process.stdout.write(display);
        }
        process.stdout.write('\n');
      }
    },
  };
}

export async function main(): Promise<void> {
  const warehouse: Warehouse = createWarehouse();

  while (true) {
    const { action } = await prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: commands,
      },
    ]);

    warehouse.robot.move(action as Commands);

    warehouse.printGrid();
  }
}

main();
