import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Card, CardContent, Stack, Alert } from "@mui/material";

import styles from "./assets/css/HomeSceen.module.css";
import {
  getGameSession,
  validateGameCode,
  updateGameSession,
} from "./utils/gameSession";

export default function JoinGameScreen() {
  const navigate = useNavigate();
  const { code: urlCode } = useParams();
  const [playerName, setPlayerName] = useState("Player 2");
  const [gameCode, setGameCode] = useState(urlCode || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinGame = () => {
    setError("");

    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!gameCode.trim()) {
      setError("Please enter a game code");
      return;
    }

    if (!validateGameCode(gameCode)) {
      setError("Invalid game code format. Code should be 6 characters (A-Z, 0-9)");
      return;
    }

    setLoading(true);

    // Simulate delay for checking if game exists
    setTimeout(() => {
      const session = getGameSession(gameCode.toUpperCase());

      if (!session) {
        setError(
          "Game not found. Please check the code and try again. Make sure Player 1 is on the same device/browser."
        );
        setLoading(false);
        return;
      }

      if (session.player2Name) {
        setError("Game already has 2 players. Cannot join.");
        setLoading(false);
        return;
      }

      // Update session with Player 2
      session.player2Name = playerName.trim();
      updateGameSession(session);

      // Navigate to online battle screen
      navigate("/online-battle", {
        state: {
          gameCode: gameCode.toUpperCase(),
          playerNumber: 2,
          playerName: playerName.trim(),
        },
      });
    }, 500);
  };

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Online Mode</p>

            <h1>Join Game</h1>

            <p className={styles.subtitle}>
              Enter the game code shared by your friend to join their game
            </p>

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

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Game Code
                    </label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={gameCode}
                      onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                      placeholder="e.g., ABC123"
                      slotProps={{
                        htmlInput: {
                          maxLength: 6,
                          style: {
                            fontSize: "24px",
                            letterSpacing: "4px",
                            textAlign: "center",
                            fontFamily: "monospace",
                          },
                        },
                      }}
                    />
                  </div>

                  {error && <Alert severity="error">{error}</Alert>}

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleJoinGame}
                      disabled={loading}
                      size="large"
                    >
                      {loading ? "Joining..." : "Join Game"}
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/home")}
                      disabled={loading}
                      size="large"
                    >
                      Back
                    </Button>
                  </Stack>

                  <Alert severity="info">
                    Note: The game will be stored locally on this browser. Make sure you're on the same
                    device as Player 1, or you can use a shared game server by installing a backend service.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
