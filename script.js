const SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const boardElement = document.getElementById("board");
const turnLabel = document.getElementById("turn-label");
const scoreLabel = document.getElementById("score-label");
const messageLabel = document.getElementById("message-label");
const restartButton = document.getElementById("restart-button");

let board = [];
let currentPlayer = BLACK;
let gameEnded = false;

function initializeGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  currentPlayer = BLACK;
  gameEnded = false;
  render();
}

function inRange(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function opponentOf(player) {
  return player === BLACK ? WHITE : BLACK;
}

function collectFlippable(row, col, player) {
  if (!inRange(row, col) || board[row][col] !== EMPTY) {
    return [];
  }

  const opponent = opponentOf(player);
  const flippable = [];

  for (const [dr, dc] of DIRECTIONS) {
    const temp = [];
    let r = row + dr;
    let c = col + dc;

    while (inRange(r, c) && board[r][c] === opponent) {
      temp.push([r, c]);
      r += dr;
      c += dc;
    }

    if (temp.length > 0 && inRange(r, c) && board[r][c] === player) {
      flippable.push(...temp);
    }
  }

  return flippable;
}

function validMoves(player) {
  const moves = [];

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const flips = collectFlippable(row, col, player);
      if (flips.length > 0) {
        moves.push({ row, col, flips });
      }
    }
  }

  return moves;
}

function placeStone(row, col) {
  if (gameEnded) {
    return;
  }

  const flips = collectFlippable(row, col, currentPlayer);
  if (flips.length === 0) {
    messageLabel.textContent = "そこには置けません。白い点のあるマスを選んでください。";
    return;
  }

  board[row][col] = currentPlayer;
  flips.forEach(([r, c]) => {
    board[r][c] = currentPlayer;
  });

  const nextPlayer = opponentOf(currentPlayer);
  const nextMoves = validMoves(nextPlayer);
  const myMoves = validMoves(currentPlayer);

  if (nextMoves.length > 0) {
    currentPlayer = nextPlayer;
    messageLabel.textContent = "石を置きました。次の手番です。";
  } else if (myMoves.length > 0) {
    messageLabel.textContent = `${playerText(nextPlayer)}は置ける場所がないためパスします。`;
  } else {
    gameEnded = true;
    messageLabel.textContent = winnerMessage();
  }

  render();
}

function playerText(player) {
  return player === BLACK ? "黒" : "白";
}

function score() {
  let black = 0;
  let white = 0;

  board.flat().forEach((cell) => {
    if (cell === BLACK) black += 1;
    if (cell === WHITE) white += 1;
  });

  return { black, white };
}

function winnerMessage() {
  const { black, white } = score();
  if (black === white) return `ゲーム終了！引き分けです（${black}-${white}）。`;
  return black > white
    ? `ゲーム終了！黒の勝ちです（${black}-${white}）。`
    : `ゲーム終了！白の勝ちです（${black}-${white}）。`;
}

function render() {
  const moves = gameEnded ? [] : validMoves(currentPlayer);
  const validSet = new Set(moves.map((move) => `${move.row},${move.col}`));

  boardElement.innerHTML = "";

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const cellButton = document.createElement("button");
      cellButton.type = "button";
      cellButton.className = "cell";
      cellButton.setAttribute("role", "gridcell");
      cellButton.setAttribute("aria-label", `${row + 1}行${col + 1}列`);
      cellButton.addEventListener("click", () => placeStone(row, col));

      if (validSet.has(`${row},${col}`)) {
        cellButton.classList.add("valid");
      }

      const cell = board[row][col];
      if (cell !== EMPTY) {
        const stone = document.createElement("span");
        stone.className = `stone ${cell === BLACK ? "black" : "white"}`;
        cellButton.appendChild(stone);
      }

      boardElement.appendChild(cellButton);
    }
  }

  const { black, white } = score();
  turnLabel.textContent = gameEnded ? "手番: -" : `手番: ${playerText(currentPlayer)}`;
  scoreLabel.textContent = `黒 ${black} - ${white} 白`;

  if (!gameEnded && moves.length === 0) {
    messageLabel.textContent = `${playerText(currentPlayer)}は置ける場所がありません。`;
  }
}

restartButton.addEventListener("click", initializeGame);

initializeGame();
