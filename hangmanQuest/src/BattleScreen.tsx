import { useMemo, useState } from "react";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import { WORDS } from "./data/wordsConstants";
import styles from "./assets/css/BattleSceen.module.css";
import HangmanSVG from "./components/HangmanSVG";

const MAX_WRONG = 6;

export default function BattleScreen() {
  const [currentWord, setCurrentWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    return WORDS[randomIndex];
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = useMemo(
    () => guessedLetters.filter((letter) => !currentWord.word.toUpperCase().includes(letter)),
    [guessedLetters, currentWord.word],
  );

  const wrongCount = incorrectLetters.length;
  const remainingGuesses = Math.max(0, MAX_WRONG - wrongCount);
  const letters = currentWord.word.toUpperCase().split("");
  const correctWord = currentWord.word.toUpperCase();
  const solved = letters.every((letter) => letter === " " || guessedLetters.includes(letter));
  const gameOver = wrongCount >= MAX_WRONG;
  const finished = gameOver || solved;

  const handleLetterClick = (letter: string) => {
    if (!guessedLetters.includes(letter) && !finished) {
      setGuessedLetters((prev) => [...prev, letter]);
    }
  };

  const handleReset = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setCurrentWord(WORDS[randomIndex]);
    setGuessedLetters([]);
  };

  return (
    <div className={styles.battleScreen}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.sectionLabel}>Adventure Battle</p>
          <h1 className={styles.pageTitle}>Hangman Quest</h1>
        </div>

        <button className={styles.resetButton} onClick={handleReset}>
          New Word
        </button>
      </div>

      <div className={styles.battleMain}>
        <div className={styles.leftPanel}>
          <div className={styles.statsBar}>
            <div className={styles.statusCard}>
              <span>Remaining</span>
              <strong>{remainingGuesses}</strong>
            </div>
            <div className={styles.statusCard}>
              <span>Missed</span>
              <strong>{wrongCount}</strong>
            </div>
            <div className={styles.statusCard}>
              <span>Word length</span>
              <strong>{letters.filter((letter) => letter !== " ").length}</strong>
            </div>
          </div>

          <div className={styles.wordSection}>
            <div className={styles.wordContainer}>
              {letters.map((letter, index) =>
                letter === " " ? (
                  <span key={index} className={styles.space}></span>
                ) : (
                  <span
                    key={index}
                    className={`${styles.letterBox} ${
                      guessedLetters.includes(letter) ? styles.guessedLetter : ""
                    }`}
                  >
                    {guessedLetters.includes(letter) ? letter : ""}
                  </span>
                ),
              )}
            </div>

            <p className={styles.hint}>
              <span className={styles.hintLabel}>Hint:</span> {currentWord.hint}
            </p>
          </div>

          <OnScreenKeyboard
            handleClick={handleLetterClick}
            guessedLetters={guessedLetters}
            disabled={finished}
          />
        </div>

        <div className={styles.hangmanPanel}>
          <div className={styles.hangmanContainer}>
            <HangmanSVG wrongCount={wrongCount} />
          </div>

          <div className={styles.gameStatus}>
            {gameOver ? "Game Over" : solved ? "You Won!" : "Guess the word before the hangman falls."}
          </div>
        </div>
      </div>

      {finished && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <p className={styles.overlayLabel}>{gameOver ? "Game Over" : "Victory"}</p>
            <h2 className={styles.overlayTitle}>
              {gameOver ? "The correct word was" : "You found the word!"}
            </h2>
            <p className={styles.overlayWord}>{correctWord}</p>
            <button className={styles.overlayButton} onClick={handleReset}>
              New Word
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
