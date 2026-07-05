import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Stack } from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";

import styles from "./assets/css/HomeSceen.module.css";
import { modes } from "./data/gameConstants";

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Adventure Hub</p>

            <h1>Welcome to Hangman Quest</h1>

            <p className={styles.subtitle}>
              Travel through magical worlds, solve hidden words and unlock new
              destinations with every correct guess.
            </p>

            <Stack direction="row" spacing={1} className={styles.heroActions}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                size="large"
                onClick={() => navigate("/battle")}
              >
                Start Quest
              </Button>

              <Button
                variant="outlined"
                startIcon={<PublicIcon />}
                size="large"
                onClick={() => navigate("/worlds")}
              >
                Explore World
              </Button>

              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                size="large"
                onClick={() => navigate("/settings")}
              >
                Settings
              </Button>
            </Stack>
          </div>

          <div className={styles.statsPanel}>
            <div className={styles.statBox}>
              <strong>12,480</strong>
              <span>XP</span>
            </div>

            <div className={styles.statBox}>
              <strong>3,210</strong>
              <span>Coins</span>
            </div>

            <div className={styles.statBox}>
              <strong>48</strong>
              <span>Words</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionPanel}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Choose a Mode</h2>
          </div>
        </div>

        <div className={styles.modeGrid}>
          {modes.map((mode) => {
            const Icon = mode.icon;

            return (
              <Card key={mode.title} className={styles.modeCard}>
                <CardContent>
                  <div className={styles.modeIcon}>
                    <Icon />
                  </div>

                  <h3>{mode.title}</h3>
                  <p>{mode.description}</p>

                  <Button variant="contained" fullWidth onClick={() => navigate(mode.navigation || "/battle")}>
                    Select
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
