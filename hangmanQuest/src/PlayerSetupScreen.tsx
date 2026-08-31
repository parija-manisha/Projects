import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent, Stack } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

import styles from "./assets/css/HomeSceen.module.css";

export default function PlayerSetupScreen() {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const handleStart = () => {
    if (player1Name.trim() && player2Name.trim()) {
      navigate("/multiplayer", {
        state: {
          player1Name: player1Name.trim(),
          player2Name: player2Name.trim(),
        },
      });
    }
  };

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Multiplayer Mode</p>

            <h1>Player vs Player</h1>

            <p className={styles.subtitle}>
              Enter your names and challenge each other to guess the hidden word!
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
                      Player 1 Name
                    </label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      placeholder="Enter Player 1 name"
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
                      Player 2 Name
                    </label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={player2Name}
                      onChange={(e) => setPlayer2Name(e.target.value)}
                      placeholder="Enter Player 2 name"
                    />
                  </div>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<SportsEsportsIcon />}
                      onClick={handleStart}
                      size="large"
                    >
                      Start Battle
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
                </Stack>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
