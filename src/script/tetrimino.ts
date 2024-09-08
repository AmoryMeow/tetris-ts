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

  rotate(): number[][] {
    const rotated = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0)
    );

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        rotated[j][this.size - 1 - i] = this.map[i][j];
      }
    }

    return rotated;
  }

  updateMap(map: number[][]) {
    this.map = map;
  }
}
