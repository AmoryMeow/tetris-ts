import { Tetrimino } from "./tetrimino";

export class Board {
  private rows: number;
  private cols: number;
  grid: number[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createGrid();
  }

  private createGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
  }

  addTetrimino(tetrimino: Tetrimino) {
    const size = tetrimino.size;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (tetrimino.map[row][col] !== 0) {
          const boardRow = tetrimino.row + row;
          const boardCol = tetrimino.col + col;

          this.grid[boardRow][boardCol] = tetrimino.map[row][col];
        }
      }
    }
  }

  clearFullRows(): number {
    let rowsCleared = 0;

    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.grid[row].every((cell) => cell === 1)) {
        this.grid.splice(row, 1);
        rowsCleared++;
      }
    }

    for (let row = 0; row < rowsCleared; row++) {
      this.grid.unshift(new Array(this.cols).fill(0));
    }

    return rowsCleared;
  }
}
