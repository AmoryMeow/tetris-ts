import { Tetrimino } from "./tetrimino";

type TetriminosType = {
  id: string;
  map: number[][];
  startCol: number;
};

const tetriminos: TetriminosType[] = [
  {
    id: "I",
    map: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    startCol: 3,
  },
  {
    id: "O",
    map: [
      [1, 1],
      [1, 1],
    ],
    startCol: 4,
  },
  {
    id: "J",
    map: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    startCol: 3,
  },
  {
    id: "L",
    map: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    startCol: 3,
  },
  {
    id: "S",
    map: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    startCol: 3,
  },
  {
    id: "Z",
    map: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    startCol: 3,
  },
  {
    id: "T",
    map: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    startCol: 3,
  },
];

export class TetriminoGenerator {
  private queue: Tetrimino[];

  constructor() {
    this.queue = this.generateQueue();
  }

  private generateQueue() {
    return tetriminos.map((item) => new Tetrimino(item));
  }

  getTetrimino(): Tetrimino {
    if (this.queue.length === 0) {
      this.queue = this.generateQueue();
    }

    const tetrimino = this.queue.shift();
    return tetrimino!;
  }
}
