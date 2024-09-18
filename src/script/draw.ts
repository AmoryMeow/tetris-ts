import { Board } from "./board";
import { activeClassName, field } from "./const";
import { Tetrimino } from "./tetrimino";

export class Draw {
  private rows: number;
  private cols: number;
  private matrix: Element[][];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = this.createMatrix();
  }

  private createMatrix() {
    const cells = field?.children ?? [];

    const matrix = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(0)
    );

    Array.from(cells).forEach((item, index) => {
      const row = Math.floor(index / this.cols);
      const col = index % this.cols;

      matrix[row][col] = item;
      item.classList.remove(activeClassName);
    });

    return matrix;
  }

  update(board: Board, tetrimino?: Tetrimino) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const isCellActive =
          board.grid[r][c] === 1 ||
          (tetrimino !== undefined &&
            r >= tetrimino.row &&
            r < tetrimino.row + tetrimino.size &&
            c >= tetrimino.col &&
            c < tetrimino.col + tetrimino.size &&
            tetrimino.map[r - tetrimino.row][c - tetrimino.col] === 1);

        this.matrix[r][c].classList.toggle(activeClassName, isCellActive);
      }
    }
  }

  updateScore(score: number) {
    const scoreDisplay = document.getElementById("score");

    if (scoreDisplay) {
      scoreDisplay.textContent = score.toString();
    }
  }

  updateHiScore(score: number) {
    const scoreDisplay = document.getElementById("hi-score");

    if (scoreDisplay) {
      scoreDisplay.textContent = score.toString();
    }
  }
}
