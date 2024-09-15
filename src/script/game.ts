import { Board } from "./board";
import { COLS, ROWS, dropInterval } from "./const";
import { Draw } from "./draw";
import { TetriminoGenerator } from "./generator";
import { Tetrimino } from "./tetrimino";

export class Game {
  private tetriminoGenerator: TetriminoGenerator;
  private board: Board;
  private draw: Draw;
  private tetrimino?: Tetrimino;
  private status: "on" | "off" | "pause";

  private dropCounter: number;
  private lastTime: number;

  constructor() {
    this.board = new Board(ROWS, COLS);
    this.tetrimino = undefined;
    this.tetriminoGenerator = new TetriminoGenerator();
    this.draw = new Draw(ROWS, COLS);
    this.status = "off";

    this.dropCounter = 0;
    this.lastTime = 0;
  }

  start() {
    switch (this.status) {
      case "on":
        this.status = "pause";
        break;

      case "off":
        this.startAnimation().then(() => {
          this.status = "on";
          this.update();
        });
        break;

      case "pause":
        this.status = "on";
        this.update();
        break;
    }
  }

  stop() {
    this.status = "off";
  }

  startAnimation() {
    return new Promise<void>((resolve) => {
      let currentRow = ROWS - 1;
      let direction = "up";

      const animate = () => {
        if (direction === "up") {
          for (let col = 0; col < COLS; col++) {
            this.board.grid[currentRow][col] = 1;
          }
          this.draw.update(this.board);

          currentRow--;

          if (currentRow < 0) {
            direction = "down";
            currentRow = 0;
          }
        } else {
          for (let col = 0; col < COLS; col++) {
            this.board.grid[currentRow][col] = 0;
          }
          this.draw.update(this.board);

          currentRow++;
          if (currentRow >= ROWS) {
            setTimeout(() => resolve(), 1000);

            return;
          }
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  }

  update(time = 0) {
    if (this.status === "on") {
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

  canRotate(newMap: number[][]) {
    if (!this.tetrimino) return false;

    for (let r = 0; r < this.tetrimino.size; r++) {
      for (let c = 0; c < this.tetrimino.size; c++) {
        if (newMap[r][c] !== 0) {
          const boardRow = this.tetrimino.row + r;
          const boardCol = this.tetrimino.col + c;

          if (
            boardRow >= ROWS ||
            boardCol >= COLS ||
            boardRow < 0 ||
            boardCol < 0 ||
            this.board.grid[boardRow][boardCol] !== 0
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
    if (!this.tetrimino) return;

    const newMap = this.tetrimino.rotate();
    if (this.canRotate(newMap)) {
      this.tetrimino.updateMap(newMap);
    }
  }
}
