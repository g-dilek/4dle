const waitForSubmit = setInterval(() => {
  if (window.submitGuess && window._4dleAnswer) {
    clearInterval(waitForSubmit);

    let allGuesses = [];
    let allResults = [];
    let trackerShown = false;
    const originalSubmitGuess = window.submitGuess;

    window.submitGuess = function () {
      const { guess, result } = originalSubmitGuess(); // call core logic

      if (!guess || !result) return; // safety check

      allGuesses.push(guess);
      allResults.push(result);

      // Recompute sets from scratch
      const absentSet = new Set();
      const misplacedSet = new Set();

      // Count letters in the answer
      const answer = window._4dleAnswer;
      const answerLetterCount = {};
      for (let char of answer) {
        answerLetterCount[char] = (answerLetterCount[char] || 0) + 1;
      }

      // Track how many times each letter has been matched in correct position
      const matchedCount = {};

      // First, count correct matches across all guesses
      for (let g = 0; g < allGuesses.length; g++) {
        for (let i = 0; i < 4; i++) {
          if (allResults[g][i] === allGuesses[g][i]) {
            matchedCount[allGuesses[g][i]] =
              (matchedCount[allGuesses[g][i]] || 0) + 1;
          }
        }
      }

      // Now, for all guesses, mark misplaced and absent
      for (let g = 0; g < allGuesses.length; g++) {
        for (let i = 0; i < 4; i++) {
          const letter = allGuesses[g][i];
          if (allResults[g][i] === "*") {
            // Only add to misplaced if not all instances have been matched
            if (
              (matchedCount[letter] || 0) < (answerLetterCount[letter] || 0)
            ) {
              misplacedSet.add(letter);
            }
          } else if (allResults[g][i] === "_") {
            // Only add to absent if letter is not in answer or all have been matched
            if (
              !(letter in answerLetterCount) ||
              (matchedCount[letter] || 0) >= (answerLetterCount[letter] || 0)
            ) {
              absentSet.add(letter);
            }
          }
        }
      }

      if (!trackerShown) {
        document.getElementById("letterTracker").style.display = "block";
        trackerShown = true;
      }

      document.getElementById("absentLetters").textContent =
        [...absentSet].sort().join(" ") || "(none)";
      document.getElementById("misplacedLetters").textContent =
        [...misplacedSet].sort().join(" ") || "(none)";
    };

    document
      .getElementById("guessInput")
      .addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          window.submitGuess();
        }
      });
  }
}, 50);
