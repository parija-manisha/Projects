import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import HangmanSVG from "./components/HangmanSVG";

import styles from "./assets/css/BattleSceen.module.css";

import { WORDS_BY_MODE } from "./data/wordsConstants";
import { GAMEMODE } from "./data/gameConstants";
import { worlds } from "./data/gameData";
import type { Word } from "./type";
import { recordProgress } from "./utils/playerStats";

const MAX_WRONG = 6;
const CORRECT_WORD_POINTS = 10;
const CORRECT_GUESS_POINTS = 2;
const WRONG_GUESS_PENALTY = 5;

export default function BattleScreen() {
  const location = useLocation();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(
    (location.state?.selectedWorld as string) || null
  );
  const [totalScore, setTotalScore] = useState(() => {
    const saved = sessionStorage.getItem("playerScore");
    return saved ? parseInt(saved) : 0;
  });
  const [sessionScore, setSessionScore] = useState(0);
  const [pointChanges, setPointChanges] = useState<{ id: string; amount: number }[]>([]);
  const [lastWordIndex, setLastWordIndex] = useState(-1);

  useEffect(() => {
    setSelectedWorld(location.state?.selectedWorld || null);
  }, [location]);

  useEffect(() => {
    sessionStorage.setItem("playerScore", totalScore.toString());
  }, [totalScore]);

  const words = selectedWorld
    ? WORDS_BY_MODE[GAMEMODE.WORLD][selectedWorld] || []
    : WORDS_BY_MODE[GAMEMODE.DAILY];

  const getRandomWord = () => {
    if (words.length === 0) return words[0];
    if (words.length === 1) return words[0];
    
    let newIndex = Math.floor(Math.random() * words.length);
    while (newIndex === lastWordIndex && words.length > 1) {
      newIndex = Math.floor(Math.random() * words.length);
    }
    setLastWordIndex(newIndex);
    return words[newIndex];
  };

  const [currentWord, setCurrentWord] = useState<Word>(getRandomWord);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = useMemo(
    () =>
      guessedLetters.filter(
        (letter) => !currentWord.word.toUpperCase().includes(letter)
      ),
    [guessedLetters, currentWord]
  );

  const wrongCount = incorrectLetters.length;
  const remainingGuesses = Math.max(0, MAX_WRONG - wrongCount);

  const letters = currentWord.word.toUpperCase().split("");
  const correctWord = currentWord.word.toUpperCase();

  const solved = letters.every(
    (letter) => letter === " " || guessedLetters.includes(letter)
  );

  const gameOver = wrongCount >= MAX_WRONG;
  const finished = solved || gameOver;

  const addPointChange = (amount: number) => {
    const id = Date.now().toString();
    setPointChanges((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setPointChanges((prev) => prev.filter((pc) => pc.id !== id));
    }, 1500);
  };

  const handleLetterClick = (letter: string) => {
    if (finished || guessedLetters.includes(letter)) return;

    const isCorrect = currentWord.word.toUpperCase().includes(letter);
    if (isCorrect) {
      setTotalScore((prev) => prev + CORRECT_GUESS_POINTS);
      setSessionScore((prev) => prev + CORRECT_GUESS_POINTS);
      recordProgress(CORRECT_GUESS_POINTS);
      addPointChange(CORRECT_GUESS_POINTS);
    } else {
      const penalty = Math.min(WRONG_GUESS_PENALTY, totalScore);
      setTotalScore((prev) => Math.max(0, prev - WRONG_GUESS_PENALTY));
      setSessionScore((prev) => prev - penalty);
      recordProgress(-penalty);
      addPointChange(-penalty);
    }

    setGuessedLetters((prev) => [...prev, letter]);
  };

  const handleReset = () => {
    if (solved) {
      setTotalScore((prev) => prev + CORRECT_WORD_POINTS);
      setSessionScore((prev) => prev + CORRECT_WORD_POINTS);
      recordProgress(CORRECT_WORD_POINTS, 1);
      addPointChange(CORRECT_WORD_POINTS);
    }
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  };

  const selectedWorldName = selectedWorld
    ? worlds.find((w) => w.id === selectedWorld)?.name || "Daily Quest"
    : "Daily Quest";

  return (
    <div className={styles.battleScreen}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.sectionLabel}>{selectedWorldName}</p>
          <h1 className={styles.pageTitle}>Hangman Quest</h1>
        </div>

        <button
          className={styles.resetButton}
          onClick={handleReset}
        >
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
              <span>Word Length</span>
              <strong>
                {letters.filter((letter) => letter !== " ").length}
              </strong>
            </div>

            <div className={styles.statusCard}>
              <span>Total Score</span>
              <strong>{totalScore}</strong>
            </div>

            <div className={styles.statusCard}>
              <span>Session</span>
              <strong style={{ color: sessionScore >= 0 ? "#4caf50" : "#f44336" }}>
                {sessionScore >= 0 ? "+" : ""}{sessionScore}
              </strong>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0px",
            }}
          >
            {pointChanges.map((change) => (
              <div
                key={change.id}
                style={{
                  position: "absolute",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: change.amount > 0 ? "#4caf50" : "#f44336",
                  animation: `floatUp 1.5s ease-out forwards`,
                  pointerEvents: "none",
                }}
              >
                {change.amount > 0 ? "+" : ""}{change.amount}
              </div>
            ))}
            <style>{`
              @keyframes floatUp {
                0% {
                  opacity: 1;
                  transform: translateY(0);
                }
                100% {
                  opacity: 0;
                  transform: translateY(-40px);
                }
              }
            `}</style>
          </div>

          <div className={styles.wordSection}>
            <div className={styles.wordContainer}>
              {letters.map((letter, index) =>
                letter === " " ? (
                  <span
                    key={index}
                    className={styles.space}
                  />
                ) : (
                  <span
                    key={index}
                    className={`${styles.letterBox} ${
                      guessedLetters.includes(letter)
                        ? styles.guessedLetter
                        : ""
                    }`}
                  >
                    {guessedLetters.includes(letter) ? letter : ""}
                  </span>
                )
              )}
            </div>

            <p className={styles.hint}>
              <span className={styles.hintLabel}>Hint:</span>{" "}
              {currentWord.hint}
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
            {gameOver
              ? "Game Over"
              : solved
              ? "You Won!"
              : "Guess the word before the hangman falls."}
          </div>
        </div>
      </div>

      {finished && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <p className={styles.overlayLabel}>
              {gameOver ? "Game Over" : "Victory"}
            </p>

            <h2 className={styles.overlayTitle}>
              {gameOver
                ? "The correct word was"
                : "You found the word!"}
            </h2>

            <p className={styles.overlayWord}>
              {correctWord}
            </p>

            <button
              className={styles.overlayButton}
              onClick={handleReset}
            >
              New Word
            </button>
          </div>
        </div>
      )}
    </div>
  );
}