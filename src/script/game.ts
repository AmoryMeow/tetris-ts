import { Board } from "./board";
import { COLS, ROWS, dropInterval } from "./const";
import { Draw } from "./draw";
import { TetriminoGenerator } from "./generator";
import { Tetrimino } from "./tetrimino";

export class Game {
  private tetriminoGenerator: TetriminoGenerator;
  private board: Board;
  private draw: Draw;
  gameOn: boolean;
  tetrimino?: Tetrimino;

  private dropCounter: number;
  private lastTime: number;

  constructor() {
    this.board = new Board(ROWS, COLS);
    this.gameOn = false;
    this.tetrimino = undefined;
    this.tetriminoGenerator = new TetriminoGenerator();
    this.draw = new Draw(ROWS, COLS);

    this.dropCounter = 0;
    this.lastTime = 0;
  }

  start() {
    this.gameOn = !this.gameOn;
    this.update();
  }

  update(time = 0) {
    if (this.gameOn) {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.dropCounter += deltaTime;

      if (!this.tetrimino) {
        this.tetrimino = this.tetriminoGenerator.getTetrimino();
      }

      this.draw.update(this.board, this.tetrimino);

      if (this.dropCounter > dropInterval) {
        this.dropCounter = 0;

        if (this.canMove({ x: 0, y: 1 })) {
          this.tetrimino.moveDown();
        } else {
          this.board.addTetrimino(this.tetrimino);
          this.tetrimino = undefined;
        }
      }

      requestAnimationFrame(this.update.bind(this));
    }
  }

  canMove(direction: { x: number; y: number }): boolean {
    if (!this.tetrimino) return false;

    const size = this.tetrimino.size;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.tetrimino.map[row][col] !== 0) {
          const newRow = this.tetrimino.row + row + direction.y;
          const newCol = this.tetrimino.col + col + direction.x;

          if (
            newRow < 0 ||
            newRow >= this.board.grid.length ||
            newCol < 0 ||
            newCol >= this.board.grid[0].length ||
            this.board.grid[newRow][newCol] !== 0
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }

  leftClick() {
    if (this.tetrimino && this.canMove({ x: -1, y: 0 })) {
      this.tetrimino.moveLeft();
    }
  }

  rightClick() {
    if (this.tetrimino && this.canMove({ x: 1, y: 0 })) {
      this.tetrimino.moveRight();
    }
  }

  downClick() {
    if (this.tetrimino && this.canMove({ x: 0, y: 1 })) {
      this.tetrimino.moveDown();
    }
  }

  rotateClick() {
    this.tetrimino?.rotate();
  }
}
