import "./style.css";

const ROWS = 20;
const COLS = 10;

let gameOn = false;

const field = document.getElementById("field");
const cells = field?.children ?? [];
const matrix = Array.from(cells).map((item, index) => ({
  cell: item,
  row: Math.floor(index / COLS),
  col: index % COLS,
}));

const startButton = document.getElementById("start_button");
startButton?.addEventListener("click", () => {
  gameOn = !gameOn;
  game();
});

const startAnimation = () => {
  let upDir = true;
  let currentRow = ROWS - 1;
  let animationOn = true;

  const run = () => {
    matrix
      .filter((i) => i.row === currentRow)
      .forEach((c) => {
        if (upDir) {
          c.cell.classList.add("cell_active");
        } else {
          c.cell.classList.remove("cell_active");
        }
      });

    if (upDir) {
      currentRow--;
    } else {
      currentRow++;
    }

    if (currentRow < 0) {
      upDir = false;
      currentRow = 0;
    }

    if (currentRow > ROWS - 1) {
      animationOn = false;
    }

    if (animationOn) {
      window.requestAnimationFrame(run);
    }
  };

  run();
};

const game = () => {
  if (gameOn) {
    startAnimation();

    gameOn = false;
  }
};
