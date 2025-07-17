const answer = window.words[Math.floor(Math.random() * window.words.length)];
window._4dleAnswer = answer;
let guessCount = 0;

function submitGuess() {
  const input = document.getElementById("guessInput");
  const feedback = document.getElementById("feedback");
  const guess = input.value.trim().toLowerCase();

  if (guess.length !== 4) {
    alert("Please enter a 4-letter word.");
    return;
  }

  guessCount++;
  const result = ["_", "_", "_", "_"];
  const letterCount = {};

  for (let char of answer) {
    letterCount[char] = (letterCount[char] || 0) + 1;
  }

  for (let i = 0; i < 4; i++) {
    if (guess[i] === answer[i]) {
      result[i] = guess[i];
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < 4; i++) {
    if (result[i] === "_" && letterCount[guess[i]] > 0) {
      result[i] = "*";
      letterCount[guess[i]]--;
    }
  }

  const resultLine = document.createElement("div");
  resultLine.className = "guess";
  resultLine.textContent = `> ${guess} \u2192 ${result.join("")}`;
  feedback.appendChild(resultLine);

  input.value = "";
  input.focus();

  if (guess === answer) {
    const winMessage = document.createElement("div");
    winMessage.innerHTML = `<br><strong>You got it in ${guessCount} guess${
      guessCount === 1 ? "" : "es"
    }! 🎉</strong>`;
    feedback.appendChild(winMessage);
    input.disabled = true;
    document.getElementById("playAgainBtn").style.display = "inline-block";
    document.getElementById("kofiContainer").style.visibility = "visible";
    confetti();
  }

  return { guess, result };
}

window.submitGuess = submitGuess;
