import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import HangmanSVG from "./components/HangmanSVG";

import styles from "./assets/css/BattleSceen.module.css";

import { WORDS_BY_MODE } from "./data/wordsConstants";
import { GAMEMODE } from "./data/gameConstants";
import type { Word, MultiplayerGameState } from "./type";

const MAX_WRONG = 6;
const CORRECT_WORD_POINTS = 10;
const CORRECT_GUESS_POINTS = 2;
const WRONG_GUESS_PENALTY = 5;

export default function MultiplayerBattleScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const words = WORDS_BY_MODE[GAMEMODE.MULTIPLAYER] || [];
  const [lastWordIndex, setLastWordIndex] = useState(-1);

  const getRandomWord = (): Word => {
    if (words.length === 0) return words[0];
    if (words.length === 1) return words[0];

    let newIndex = Math.floor(Math.random() * words.length);
    while (newIndex === lastWordIndex && words.length > 1) {
      newIndex = Math.floor(Math.random() * words.length);
    }
    setLastWordIndex(newIndex);
    return words[newIndex];
  };

  const [gameState, setGameState] = useState<MultiplayerGameState>({
    player1: {
      name: location.state?.player1Name || "Player 1",
      score: 0,
      sessionScore: 0,
      wordsSolved: 0,
    },
    player2: {
      name: location.state?.player2Name || "Player 2",
      score: 0,
      sessionScore: 0,
      wordsSolved: 0,
    },
    currentPlayer: 1,
    currentWord: getRandomWord(),
    guessedLetters: [],
    wrongCount: 0,
    solved: false,
    gameOver: false,
    finished: false,
  });

  const [pointChanges, setPointChanges] = useState<{ id: string; amount: number }[]>([]);

  const incorrectLetters = useMemo(
    () =>
      gameState.guessedLetters.filter(
        (letter) =>
          !gameState.currentWord.word.toUpperCase().includes(letter)
      ),
    [gameState.guessedLetters, gameState.currentWord]
  );

  const wrongCount = incorrectLetters.length;
  const remainingGuesses = Math.max(0, MAX_WRONG - wrongCount);

  const letters = gameState.currentWord.word.toUpperCase().split("");
  const correctWord = gameState.currentWord.word.toUpperCase();

  const solved = letters.every(
    (letter) => letter === " " || gameState.guessedLetters.includes(letter)
  );

  const gameOver = wrongCount >= MAX_WRONG;
  const finished = solved || gameOver;

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      solved,
      gameOver,
      finished,
      wrongCount,
    }));
  }, [solved, gameOver, finished, wrongCount]);

  const addPointChange = (amount: number) => {
    const id = Date.now().toString();
    setPointChanges((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setPointChanges((prev) => prev.filter((pc) => pc.id !== id));
    }, 1500);
  };

  const handleLetterClick = (letter: string) => {
    if (finished || gameState.guessedLetters.includes(letter)) return;

    const isCorrect = gameState.currentWord.word.toUpperCase().includes(letter);
    const currentPlayer = gameState.currentPlayer;

    const updatedGameState = { ...gameState };

    if (isCorrect) {
      if (currentPlayer === 1) {
        updatedGameState.player1.score += CORRECT_GUESS_POINTS;
        updatedGameState.player1.sessionScore += CORRECT_GUESS_POINTS;
      } else {
        updatedGameState.player2.score += CORRECT_GUESS_POINTS;
        updatedGameState.player2.sessionScore += CORRECT_GUESS_POINTS;
      }
      addPointChange(CORRECT_GUESS_POINTS);
    } else {
      const penalty = WRONG_GUESS_PENALTY;
      if (currentPlayer === 1) {
        updatedGameState.player1.sessionScore -= penalty;
      } else {
        updatedGameState.player2.sessionScore -= penalty;
      }
      addPointChange(-penalty);

      // Switch player on wrong guess
      updatedGameState.currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    updatedGameState.guessedLetters = [...gameState.guessedLetters, letter];
    setGameState(updatedGameState);
  };

  const handleReset = () => {
    if (solved) {
      if (gameState.currentPlayer === 1) {
        setGameState((prev) => ({
          ...prev,
          player1: {
            ...prev.player1,
            score: prev.player1.score + CORRECT_WORD_POINTS,
            sessionScore: prev.player1.sessionScore + CORRECT_WORD_POINTS,
            wordsSolved: prev.player1.wordsSolved + 1,
          },
          currentWord: getRandomWord(),
          guessedLetters: [],
          wrongCount: 0,
          currentPlayer: 1,
          solved: false,
          gameOver: false,
          finished: false,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          player2: {
            ...prev.player2,
            score: prev.player2.score + CORRECT_WORD_POINTS,
            sessionScore: prev.player2.sessionScore + CORRECT_WORD_POINTS,
            wordsSolved: prev.player2.wordsSolved + 1,
          },
          currentWord: getRandomWord(),
          guessedLetters: [],
          wrongCount: 0,
          currentPlayer: 1,
          solved: false,
          gameOver: false,
          finished: false,
        }));
      }
      addPointChange(CORRECT_WORD_POINTS);
    } else {
      // Game over - start new round
      setGameState((prev) => ({
        ...prev,
        currentWord: getRandomWord(),
        guessedLetters: [],
        wrongCount: 0,
        currentPlayer: 1,
        solved: false,
        gameOver: false,
        finished: false,
      }));
    }
  };

  const handleQuit = () => {
    navigate("/home");
  };

  return (
    <div className={styles.battleScreen}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.sectionLabel}>Multiplayer Mode</p>
          <h1 className={styles.pageTitle}>Player vs Player</h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.resetButton} onClick={handleReset}>
            New Word
          </button>
          <button className={styles.resetButton} onClick={handleQuit}>
            Exit
          </button>
        </div>
      </div>

      <div className={styles.battleMain}>
        <div className={styles.leftPanel}>
          {/* Player Info Cards */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "8px",
                backgroundColor:
                  gameState.currentPlayer === 1
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(200, 200, 200, 0.1)",
                border:
                  gameState.currentPlayer === 1
                    ? "2px solid #4caf50"
                    : "1px solid #ccc",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                {gameState.player1.name}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Score</p>
                  <strong style={{ fontSize: "20px" }}>
                    {gameState.player1.score}
                  </strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Session</p>
                  <strong
                    style={{
                      fontSize: "16px",
                      color:
                        gameState.player1.sessionScore >= 0
                          ? "#4caf50"
                          : "#f44336",
                    }}
                  >
                    {gameState.player1.sessionScore >= 0 ? "+" : ""}
                    {gameState.player1.sessionScore}
                  </strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Words</p>
                  <strong style={{ fontSize: "20px" }}>
                    {gameState.player1.wordsSolved}
                  </strong>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "8px",
                backgroundColor:
                  gameState.currentPlayer === 2
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(200, 200, 200, 0.1)",
                border:
                  gameState.currentPlayer === 2
                    ? "2px solid #4caf50"
                    : "1px solid #ccc",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                {gameState.player2.name}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Score</p>
                  <strong style={{ fontSize: "20px" }}>
                    {gameState.player2.score}
                  </strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Session</p>
                  <strong
                    style={{
                      fontSize: "16px",
                      color:
                        gameState.player2.sessionScore >= 0
                          ? "#4caf50"
                          : "#f44336",
                    }}
                  >
                    {gameState.player2.sessionScore >= 0 ? "+" : ""}
                    {gameState.player2.sessionScore}
                  </strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Words</p>
                  <strong style={{ fontSize: "20px" }}>
                    {gameState.player2.wordsSolved}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Game Stats */}
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
              <span>Current Player</span>
              <strong>
                {gameState.currentPlayer === 1
                  ? gameState.player1.name
                  : gameState.player2.name}
              </strong>
            </div>
          </div>

          {/* Point Changes Animation */}
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

          {/* Word Display */}
          <div className={styles.wordSection}>
            <div className={styles.wordContainer}>
              {letters.map((letter, index) =>
                letter === " " ? (
                  <span key={index} className={styles.space} />
                ) : (
                  <span
                    key={index}
                    className={`${styles.letterBox} ${
                      gameState.guessedLetters.includes(letter)
                        ? styles.guessedLetter
                        : ""
                    }`}
                  >
                    {gameState.guessedLetters.includes(letter) ? letter : ""}
                  </span>
                )
              )}
            </div>

            <p className={styles.hint}>
              <span className={styles.hintLabel}>Hint:</span>{" "}
              {gameState.currentWord.hint}
            </p>
          </div>

          {/* Keyboard */}
          <OnScreenKeyboard
            handleClick={handleLetterClick}
            guessedLetters={gameState.guessedLetters}
            disabled={finished}
          />
        </div>

        {/* Hangman Display */}
        <div className={styles.hangmanPanel}>
          <div className={styles.hangmanContainer}>
            <HangmanSVG wrongCount={wrongCount} />
          </div>

          <div className={styles.gameStatus}>
            {gameOver
              ? "Game Over - Wrong guess limit reached"
              : solved
              ? `${
                  gameState.currentPlayer === 1
                    ? gameState.player1.name
                    : gameState.player2.name
                } Won!`
              : `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s Turn`}
          </div>
        </div>
      </div>

      {/* Game End Overlay */}
      {finished && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <p className={styles.overlayLabel}>
              {gameOver ? "Game Over" : "Victory"}
            </p>

            <h2 className={styles.overlayTitle}>
              {gameOver
                ? "The correct word was"
                : `${
                    gameState.currentPlayer === 1
                      ? gameState.player1.name
                      : gameState.player2.name
                  } found the word!`}
            </h2>

            <p className={styles.overlayWord}>{correctWord}</p>

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
