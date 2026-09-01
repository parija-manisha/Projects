import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Stack, Alert, CircularProgress, TextField } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import styles from "./assets/css/HomeSceen.module.css";
import { getGameSession, updateGameSession } from "./utils/gameSession";

export default function WaitingForPlayerScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameCode = location.state?.gameCode || "";
  const playerName = location.state?.playerName || "Player 1";

  const [copied, setCopied] = useState(false);
  const [player2Joined, setPlayer2Joined] = useState(false);
  const [player2Name, setPlayer2Name] = useState("");

  useEffect(() => {
    if (!gameCode) {
      navigate("/home");
      return;
    }

    const syncPlayer2Status = () => {
      const session = getGameSession(gameCode);
      if (session && session.player2Name) {
        setPlayer2Joined(true);
        setPlayer2Name(session.player2Name);
        return true;
      }

      setPlayer2Joined(false);
      setPlayer2Name("");
      return false;
    };

    syncPlayer2Status();

    const interval = setInterval(() => {
      syncPlayer2Status();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameCode, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}#/join-game/${gameCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    const session = getGameSession(gameCode);
    if (session && !session.currentWord) {
      const words = [
        { word: "PLANET", hint: "A world that orbits a star." },
        { word: "CASTLE", hint: "A large fortified building." },
        { word: "ROCKET", hint: "A vehicle that launches into space." },
        { word: "GARDEN", hint: "A place where flowers and plants grow." },
        { word: "TREASURE", hint: "Something valuable hidden or found." },
      ];

      const randomWord = words[Math.floor(Math.random() * words.length)];
      session.currentWord = randomWord.word;
      session.currentHint = randomWord.hint;
      updateGameSession(session);
    }

    navigate("/online-battle", {
      state: {
        gameCode: gameCode,
        playerNumber: 1,
        playerName: playerName,
      },
    });
  };

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Online Mode</p>

            <h1>Waiting for Player</h1>

            <p className={styles.subtitle}>Share your game code with a friend</p>

            <Card style={{ marginTop: "30px", padding: "20px" }}>
              <CardContent>
                <Stack spacing={3}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#999" }}>
                      Your Name
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {playerName}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      borderRadius: "8px",
                      border: "2px solid #4caf50",
                    }}
                  >
                    <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
                      Game Code
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "36px",
                          fontWeight: "bold",
                          letterSpacing: "4px",
                          color: "#4caf50",
                          fontFamily: "monospace",
                        }}
                      >
                        {gameCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#4caf50",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "10px 0", fontSize: "14px" }}>
                      Or share this link:
                    </p>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={`${window.location.origin}${window.location.pathname}#/join-game/${gameCode}`}
                      multiline
                      rows={2}
                      size="small"
                      slotProps={{
                        htmlInput: {
                          readOnly: true,
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={handleCopyLink}
                      style={{ marginTop: "10px" }}
                    >
                      Copy Link
                    </Button>
                  </div>

                  {player2Joined ? (
                    <Alert severity="success">
                      <strong>{player2Name}</strong> has joined! You can start the match now.
                    </Alert>
                  ) : (
                    <Alert severity="info">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CircularProgress size={20} />
                        <span>Waiting for Player 2 to join...</span>
                      </div>
                    </Alert>
                  )}

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleStartGame}
                      size="large"
                      disabled={!player2Joined}
                    >
                      Start Game
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleBack}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
