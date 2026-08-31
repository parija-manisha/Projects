import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent, Stack, Alert } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";

import styles from "./assets/css/HomeSceen.module.css";
import { generateGameCode, createGameSession, saveGameSession } from "./utils/gameSession";

export default function CreateGameScreen() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("Player 1");
  const [gameCode, setGameCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateGame = () => {
    if (playerName.trim()) {
      const code = generateGameCode();
      setGameCode(code);
      const session = createGameSession(code, playerName.trim());
      saveGameSession(session);
      setShowCode(true);
    }
  };

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

  const handleWaitForPlayer = () => {
    navigate("/waiting-for-player", {
      state: { gameCode, playerName: playerName.trim() },
    });
  };

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Online Mode</p>

            <h1>Create Online Game</h1>

            <p className={styles.subtitle}>
              Create a game and invite a friend to play from any device
            </p>

            {!showCode ? (
              <Card style={{ marginTop: "30px", padding: "20px" }}>
                <CardContent>
                  <Stack spacing={3}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Your Name
                      </label>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCreateGame}
                      size="large"
                    >
                      Create Game
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/home")}
                      size="large"
                    >
                      Back
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Card style={{ marginTop: "30px", padding: "20px" }}>
                <CardContent>
                  <Stack spacing={3}>
                    <Alert severity="success">
                      Game created! Share the code or link below with your friend.
                    </Alert>

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
                        readOnly
                        multiline
                        rows={2}
                        size="small"
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

                    <Alert severity="info">
                      Waiting for player 2 to join using the code or link above...
                    </Alert>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleWaitForPlayer}
                      size="large"
                    >
                      Wait for Player
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setShowCode(false);
                        setGameCode("");
                      }}
                      size="large"
                    >
                      Back
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
