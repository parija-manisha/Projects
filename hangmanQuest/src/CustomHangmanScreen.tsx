import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function CustomHangmanScreen() {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");

  const handleStartGame = () => {
    const cleanedWord = word.trim().replace(/\s+/g, " ");

    if (!cleanedWord) {
      setError("Enter a secret word to start the challenge.");
      return;
    }

    const sanitizedWord = cleanedWord.replace(/[^A-Za-z\s-]/g, "");
    const lettersOnly = sanitizedWord.replace(/[\s-]/g, "");

    if (!sanitizedWord || lettersOnly.length < 2) {
      setError("Use at least 2 letters in the word.");
      return;
    }

    navigate("/battle", {
      state: {
        customWord: sanitizedWord,
        customHint: hint.trim() || "Solve the hidden word.",
      },
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 620,
        width: "100%",
        mx: "auto",
        p: 1,
        borderRadius: 4,
        background: "rgba(14, 20, 38, 0.9)",
        border: "1px solid rgba(147, 197, 253, 0.35)",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.4)",
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="overline" color="primary.main">
              Custom Challenge
            </Typography>
            <Typography variant="h4" component="h1" color="common.white">
              Create your own hangman round
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pick a secret word and clue, then play it in the browser.
            </Typography>
          </Stack>

          <TextField
            label="Secret word"
            value={word}
            onChange={(event) => {
              setWord(event.target.value);
              setError("");
            }}
            helperText="Letters, spaces, and hyphens are supported."
            error={Boolean(error)}
            fullWidth
            sx={{
              input: { color: "#fff" },
              label: { color: "#dbeafe" },
            }}
          />

          <TextField
            label="Hint"
            value={hint}
            onChange={(event) => {
              setHint(event.target.value);
              setError("");
            }}
            fullWidth
            sx={{
              input: { color: "#fff" },
              label: { color: "#dbeafe" },
            }}
          />

          {error && (
            <Typography color="error.main" variant="body2">
              {error}
            </Typography>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" size="large" onClick={handleStartGame} fullWidth>
              Start Game
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/home")}
              fullWidth
            >
              Back to Home
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
