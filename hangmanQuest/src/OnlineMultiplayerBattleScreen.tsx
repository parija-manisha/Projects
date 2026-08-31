import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OnScreenKeyboard from "./components/OnScreenKeyboard";
import HangmanSVG from "./components/HangmanSVG";

import styles from "./assets/css/BattleSceen.module.css";

import { WORDS_BY_MODE } from "./data/wordsConstants";
import { GAMEMODE } from "./data/gameConstants";
import { getGameSession, updateGameSession, deleteGameSession } from "./utils/gameSession";
import type { Word } from "./type";
import type { GameSession } from "./utils/gameSession";

const MAX_WRONG = 6;
const CORRECT_WORD_POINTS = 10;
const CORRECT_GUESS_POINTS = 2;
const WRONG_GUESS_PENALTY = 5;

export default function OnlineMultiplayerBattleScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const gameCode = location.state?.gameCode || "";
  const playerNumber = location.state?.playerNumber || 1;

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

  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [pointChanges, setPointChanges] = useState<{ id: string; amount: number }[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [isSynced, setIsSynced] = useState(true);

  // Initialize game
  useEffect(() => {
    if (!gameCode) {
      navigate("/home");
      return;
    }

    const session = getGameSession(gameCode);
    if (!session) {
      navigate("/home");
      return;
    }

    // Initialize current word if not set
    if (!session.currentWord) {
      const randomWord = getRandomWord();
      session.currentWord = randomWord.word.toUpperCase();
      session.currentHint = randomWord.hint;
      updateGameSession(session);
    }

    setGameSession(session);

    // Sync game state every 500ms
    const syncInterval = setInterval(() => {
      const latestSession = getGameSession(gameCode);
      if (latestSession) {
        if (latestSession.lastUpdated > lastSyncTime) {
          setGameSession(latestSession);
          setIsSynced(true);
          setLastSyncTime(latestSession.lastUpdated);
        } else {
          setIsSynced(true);
        }
      }
    }, 500);

    return () => clearInterval(syncInterval);
  }, [gameCode, navigate, lastSyncTime]);

  if (!gameSession) {
    return <div>Loading game...</div>;
  }

  const currentWord = gameSession.currentWord;
  const letters = currentWord.split("");

  const incorrectLetters = gameSession.guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  );

  const wrongCount = incorrectLetters.length;
  const remainingGuesses = Math.max(0, MAX_WRONG - wrongCount);

  const solved = letters.every(
    (letter) => letter === " " || gameSession.guessedLetters.includes(letter)
  );

  const gameOver = wrongCount >= MAX_WRONG;
  const finished = solved || gameOver;

  const canPlayerMove =
    !finished && (playerNumber === 1 ? gameSession.currentPlayer === 1 : gameSession.currentPlayer === 2);

  const addPointChange = (amount: number) => {
    const id = Date.now().toString();
    setPointChanges((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setPointChanges((prev) => prev.filter((pc) => pc.id !== id));
    }, 1500);
  };

  const handleLetterClick = (letter: string) => {
    if (finished || gameSession.guessedLetters.includes(letter) || !canPlayerMove) {
      return;
    }

    setIsSynced(false);

    const isCorrect = currentWord.includes(letter);
    const updatedSession = { ...gameSession };
    updatedSession.guessedLetters = [...gameSession.guessedLetters, letter];

    if (isCorrect) {
      if (playerNumber === 1) {
        updatedSession.player1Score += CORRECT_GUESS_POINTS;
        updatedSession.player1SessionScore += CORRECT_GUESS_POINTS;
      } else {
        updatedSession.player2Score += CORRECT_GUESS_POINTS;
        updatedSession.player2SessionScore += CORRECT_GUESS_POINTS;
      }
      addPointChange(CORRECT_GUESS_POINTS);
    } else {
      const penalty = WRONG_GUESS_PENALTY;
      if (playerNumber === 1) {
        updatedSession.player1SessionScore -= penalty;
      } else {
        updatedSession.player2SessionScore -= penalty;
      }
      addPointChange(-penalty);

      // Switch player on wrong guess
      updatedSession.currentPlayer = updatedSession.currentPlayer === 1 ? 2 : 1;
    }

    updateGameSession(updatedSession);
    setGameSession(updatedSession);
  };

  const handleReset = () => {
    const updatedSession = { ...gameSession };

    if (solved) {
      if (playerNumber === 1) {
        updatedSession.player1Score += CORRECT_WORD_POINTS;
        updatedSession.player1SessionScore += CORRECT_WORD_POINTS;
      } else {
        updatedSession.player2Score += CORRECT_WORD_POINTS;
        updatedSession.player2SessionScore += CORRECT_WORD_POINTS;
      }
      addPointChange(CORRECT_WORD_POINTS);
    }

    const randomWord = getRandomWord();
    updatedSession.currentWord = randomWord.word.toUpperCase();
    updatedSession.currentHint = randomWord.hint;
    updatedSession.guessedLetters = [];
    updatedSession.wrongCount = 0;
    updatedSession.currentPlayer = 1;
    updatedSession.solved = false;
    updatedSession.gameOver = false;
    updatedSession.finished = false;

    updateGameSession(updatedSession);
    setGameSession(updatedSession);
  };

  const handleQuit = () => {
    if (confirm("Are you sure you want to quit? The game will be deleted.")) {
      deleteGameSession(gameCode);
      navigate("/home");
    }
  };

  const player1Data = {
    name: gameSession.player1Name,
    score: gameSession.player1Score,
    sessionScore: gameSession.player1SessionScore,
  };

  const player2Data = {
    name: gameSession.player2Name || "Waiting for Player 2...",
    score: gameSession.player2Score,
    sessionScore: gameSession.player2SessionScore,
  };

  return (
    <div className={styles.battleScreen}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.sectionLabel}>Online Multiplayer</p>
          <h1 className={styles.pageTitle}>Hangman Quest</h1>
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
                  gameSession.currentPlayer === 1 && !finished
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(200, 200, 200, 0.1)",
                border:
                  gameSession.currentPlayer === 1 && !finished
                    ? "2px solid #4caf50"
                    : "1px solid #ccc",
                textAlign: "center",
                transition: "all 0.3s ease",
                opacity: playerNumber === 1 ? 1 : 0.8,
              }}
            >
              <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                {player1Data.name}
                {playerNumber === 1 && " (You)"}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Score</p>
                  <strong style={{ fontSize: "20px" }}>{player1Data.score}</strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Session</p>
                  <strong
                    style={{
                      fontSize: "16px",
                      color: player1Data.sessionScore >= 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    {player1Data.sessionScore >= 0 ? "+" : ""}
                    {player1Data.sessionScore}
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
                  gameSession.currentPlayer === 2 && !finished
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(200, 200, 200, 0.1)",
                border:
                  gameSession.currentPlayer === 2 && !finished
                    ? "2px solid #4caf50"
                    : "1px solid #ccc",
                textAlign: "center",
                transition: "all 0.3s ease",
                opacity: playerNumber === 2 ? 1 : 0.8,
              }}
            >
              <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                {player2Data.name}
                {playerNumber === 2 && " (You)"}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Score</p>
                  <strong style={{ fontSize: "20px" }}>{player2Data.score}</strong>
                </div>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "12px" }}>Session</p>
                  <strong
                    style={{
                      fontSize: "16px",
                      color: player2Data.sessionScore >= 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    {player2Data.sessionScore >= 0 ? "+" : ""}
                    {player2Data.sessionScore}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          {!isSynced && (
            <div
              style={{
                padding: "8px",
                backgroundColor: "rgba(255, 193, 7, 0.2)",
                borderRadius: "4px",
                border: "1px solid #ffc107",
                textAlign: "center",
                fontSize: "12px",
                color: "#ffc107",
                marginBottom: "10px",
              }}
            >
              🔄 Syncing...
            </div>
          )}

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
              <strong>{letters.filter((letter) => letter !== " ").length}</strong>
            </div>

            <div className={styles.statusCard}>
              <span>Current Turn</span>
              <strong style={{ fontSize: "12px" }}>
                {gameSession.currentPlayer === playerNumber ? "YOUR TURN" : "OPPONENT"}
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
                      gameSession.guessedLetters.includes(letter)
                        ? styles.guessedLetter
                        : ""
                    }`}
                  >
                    {gameSession.guessedLetters.includes(letter) ? letter : ""}
                  </span>
                )
              )}
            </div>

            <p className={styles.hint}>
              <span className={styles.hintLabel}>Hint:</span> {gameSession.currentHint}
            </p>
          </div>

          {/* Keyboard */}
          <OnScreenKeyboard
            handleClick={handleLetterClick}
            guessedLetters={gameSession.guessedLetters}
            disabled={finished || !canPlayerMove}
          />

          {!canPlayerMove && !finished && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(244, 67, 54, 0.2)",
                borderRadius: "8px",
                border: "1px solid #f44336",
                textAlign: "center",
                color: "#f44336",
                marginTop: "10px",
              }}
            >
              ⏳ Waiting for {gameSession.currentPlayer === 1 ? player1Data.name : player2Data.name}
            </div>
          )}
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
                  gameSession.currentPlayer === 1 ? player1Data.name : player2Data.name
                } Won!`
              : `${
                  gameSession.currentPlayer === 1 ? player1Data.name : player2Data.name
                }'s Turn`}
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
                    gameSession.currentPlayer === 1
                      ? player1Data.name
                      : player2Data.name
                  } found the word!`}
            </h2>

            <p className={styles.overlayWord}>{currentWord}</p>

            <button className={styles.overlayButton} onClick={handleReset}>
              New Word
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
