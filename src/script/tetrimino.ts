type TetriminosType = {
  id: string;
  map: number[][];
  startCol: number;
};

export class Tetrimino {
  map: number[][];
  col: number;
  row: number;
  size: number;

  constructor(tetrimino: TetriminosType) {
    this.map = tetrimino.map;
    this.col = tetrimino.startCol;
    this.row = 0;
    this.size = tetrimino.map.length;
  }

  moveRight() {
    this.col++;
  }

  moveLeft() {
    this.col--;
  }

  moveDown() {
    this.row++;
  }

  rotate() {
    const len = this.map.length;

    const rotated = Array.from({ length: len }, () => Array(len).fill(0));

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        rotated[j][len - 1 - i] = this.map[i][j];
      }
    }

    this.map = rotated;
  }
}
