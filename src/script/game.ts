import { Board } from "./board";
import { COLS, ROWS, baseDropInterval } from "./const";
import { Draw } from "./draw";
import { TetriminoGenerator } from "./generator";
import { Tetrimino } from "./tetrimino";

export class Game {
  private tetriminoGenerator: TetriminoGenerator;
  private board: Board;
  private draw: Draw;
  private tetrimino?: Tetrimino;
  private nextTetrimino?: Tetrimino;
  private status: "on" | "off" | "pause";

  private dropCounter: number;
  private lastTime: number;

  private score: number;
  private hiScore: number;
  private fullRows: number;
  private level: number;
  private dropInterval: number;

  constructor() {
    this.board = new Board(ROWS, COLS);
    this.tetrimino = undefined;
    this.tetriminoGenerator = new TetriminoGenerator();
    this.draw = new Draw(ROWS, COLS);
    this.status = "off";

    this.dropCounter = 0;
    this.lastTime = 0;

    this.score = 0;
    this.hiScore = this.getHiScore();
    this.fullRows = 0;
    this.level = 1;
    this.dropInterval = baseDropInterval;

    this.draw.updateHiScore(this.hiScore);
    this.draw.updateLevel(this.level);
    this.draw.updateSpeed(this.dropInterval);
  }

  start() {
    switch (this.status) {
      case "on":
        this.status = "pause";
        break;

      case "off":
        this.startAnimation().then(() => {
          this.resetGame();
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
    this.saveHiScore();
  }

  resetGame() {
    this.dropCounter = 0;
    this.lastTime = 0;

    this.score = 0;
    this.hiScore = this.getHiScore();
    this.fullRows = 0;
    this.level = 1;
    this.dropInterval = baseDropInterval;

    this.draw.updateScore(this.score);
    this.draw.updateHiScore(this.hiScore);
    this.draw.updateLevel(this.level);
    this.draw.updateSpeed(this.dropInterval);
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

  async update(time = 0) {
    if (this.status === "on") {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.dropCounter += deltaTime;

      if (!this.tetrimino && !this.nextTetrimino) {
        this.tetrimino = this.tetriminoGenerator.getTetrimino();
        this.nextTetrimino = this.tetriminoGenerator.getTetrimino();
      } else if (!this.tetrimino && this.nextTetrimino) {
        this.tetrimino = this.nextTetrimino;
        this.nextTetrimino = this.tetriminoGenerator.getTetrimino();
      }

      if (!this.tetrimino || !this.nextTetrimino) {
        throw new Error("Failed to generate tetrimino or next tetrimino.");
      }

      if (this.isGameOver(this.tetrimino)) {
        this.stop();
        return;
      }

      this.draw.updateNext(this.nextTetrimino);
      this.draw.update(this.board, this.tetrimino);

      if (this.dropCounter > this.dropInterval) {
        this.dropCounter = 0;

        if (this.canMove({ x: 0, y: 1 })) {
          this.tetrimino.moveDown();
        } else {
          this.board.addTetrimino(this.tetrimino);
          this.tetrimino = undefined;

          const rows = await this.clearFullRows();
          this.updateScore(rows);

          this.updateLevel();
          this.updateSpeed();
        }
      }

      requestAnimationFrame(this.update.bind(this));
    }
  }

  clearFullRows(): Promise<number> {
    const fullRows: number[] = [];

    for (let row = ROWS - 1; row >= 0; row--) {
      if (this.board.grid[row].every((cell) => cell === 1)) {
        fullRows.push(row);
      }
    }

    if (fullRows.length === 0) {
      return Promise.resolve(0);
    }

    this.draw.fadeOut(fullRows);

    return new Promise((resolve) => {
      setTimeout(() => {
        for (let row of fullRows) {
          this.board.grid.splice(row, 1);
        }
        for (let r = 0; r < fullRows.length; r++) {
          this.board.grid.unshift(new Array(COLS).fill(0));
        }
        this.draw.clearFadeOut(fullRows);
        resolve(fullRows.length);
      }, 500);
    });
  }

  isGameOver(tetrimino: Tetrimino): boolean {
    for (let r = 0; r < tetrimino.size; r++) {
      for (let c = 0; c < tetrimino.size; c++) {
        if (
          tetrimino.map[r][c] === 1 &&
          this.board.grid[tetrimino.row + r][tetrimino.col + c] === 1
        ) {
          return true;
        }
      }
    }
    return false;
  }

  updateScore(rows?: number) {
    if (rows) {
      this.fullRows += rows;

      if (rows === 1) {
        this.score += 40 * this.level;
      } else if (rows === 2) {
        this.score += 100 * this.level;
      } else if (rows === 3) {
        this.score += 300 * this.level;
      } else if (rows === 4) {
        this.score += 1200 * this.level;
      }
    }

    this.draw.updateScore(this.score);
  }

  updateLevel() {
    const needRows = this.level * 10;

    if (this.fullRows >= needRows) {
      this.level++;
    }
    this.draw.updateLevel(this.level);
  }

  updateSpeed() {
    this.dropInterval =
      Math.pow(0.8 - (this.level - 1) * 0.007, this.level - 1) * 1000;
    this.draw.updateSpeed(this.dropInterval);
  }

  getHiScore(): number {
    const score = localStorage.getItem("hi-score") || "0";
    return parseInt(score);
  }

  saveHiScore() {
    this.hiScore = Math.max(this.hiScore, this.score);
    localStorage.setItem("hi-score", this.hiScore.toString());
    this.draw.updateHiScore(this.hiScore);
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
