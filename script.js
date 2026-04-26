const HANDS = ["rock", "scissors", "paper"];
const HAND_LABEL = {
  rock: "グー",
  scissors: "チョキ",
  paper: "パー",
};

const photoInput = document.getElementById("photo-input");
const playerPhoto = document.getElementById("player-photo");
const roundLabel = document.getElementById("round-label");
const resultLabel = document.getElementById("result-label");
const scoreLabel = document.getElementById("score-label");
const handButtons = document.querySelectorAll(".hand-button");
const resetButton = document.getElementById("reset-button");

let playerScore = 0;
let cpuScore = 0;

function judge(player, cpu) {
  if (player === cpu) return "draw";
  if (
    (player === "rock" && cpu === "scissors") ||
    (player === "scissors" && cpu === "paper") ||
    (player === "paper" && cpu === "rock")
  ) {
    return "win";
  }
  return "lose";
}

function updateScore() {
  scoreLabel.textContent = `あなた ${playerScore} - ${cpuScore} CPU`;
}

function playRound(playerHand) {
  const cpuHand = HANDS[Math.floor(Math.random() * HANDS.length)];
  const result = judge(playerHand, cpuHand);

  roundLabel.textContent = `あなた: ${HAND_LABEL[playerHand]} / CPU: ${HAND_LABEL[cpuHand]}`;

  if (result === "win") {
    playerScore += 1;
    resultLabel.textContent = "結果: あなたの勝ち！";
  } else if (result === "lose") {
    cpuScore += 1;
    resultLabel.textContent = "結果: CPUの勝ち！";
  } else {
    resultLabel.textContent = "結果: あいこ";
  }

  updateScore();
}

photoInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    playerPhoto.src = String(reader.result);
    playerPhoto.style.display = "block";
  };
  reader.readAsDataURL(file);
});

handButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.hand);
  });
});

resetButton.addEventListener("click", () => {
  playerScore = 0;
  cpuScore = 0;
  roundLabel.textContent = "手を選んでください。";
  resultLabel.textContent = "結果: -";
  updateScore();
});

updateScore();
