import "../style.css";
import { Game } from "./game";

const game = new Game();

const startButton = document.getElementById("start_button");
startButton?.addEventListener("click", () => {
  game.start();
});

document.addEventListener("keydown", function (e) {
  if (e.code == "ArrowUp") {
    game.rotateClick();
  } else if (e.code == "ArrowLeft") {
    game.leftClick();
  } else if (e.code == "ArrowDown") {
    game.downClick();
  } else if (e.code == "ArrowRight") {
    game.rightClick();
  }
});
