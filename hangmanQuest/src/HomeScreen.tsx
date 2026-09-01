import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExploreIcon from "@mui/icons-material/Explore";
import SettingsIcon from "@mui/icons-material/Settings";

import styles from "./assets/css/HomeSceen.module.css";
import { modes, onlineModes } from "./data/gameData";
import { getPlayerStats } from "./utils/playerStats";

export function HomeScreen() {
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState(() => getPlayerStats());

  useEffect(() => {
    const refreshStats = () => setPlayerStats(getPlayerStats());
    window.addEventListener("focus", refreshStats);
    window.addEventListener("pageshow", refreshStats);
    window.addEventListener("storage", refreshStats);

    return () => {
      window.removeEventListener("focus", refreshStats);
      window.removeEventListener("pageshow", refreshStats);
      window.removeEventListener("storage", refreshStats);
    };
  }, []);

  const allModes = [...modes, ...onlineModes];

  return (
    <div className={styles.homeScreen}>
      <section className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <p className={styles.eyebrow}>Adventure Hub</p>
            <h1>Hangman Quest</h1>
            <p className={styles.subtitle}>
              Travel through magical worlds, solve hidden words and unlock new destinations with every correct guess.
            </p>
            <div className={styles.heroActions}>
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                onClick={() => navigate("/battle")}
              >
                START QUEST
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ExploreIcon />}
                onClick={() => navigate("/world")}
              >
                EXPLORE WORLD
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SettingsIcon />}
              >
                SETTINGS
              </Button>
            </div>
          </div>

          <div className={styles.statsPanel}>
            <div className={styles.statBox}>
              <strong>{playerStats.xp.toLocaleString()}</strong>
              <span>XP</span>
            </div>
            <div className={styles.statBox}>
              <strong>{playerStats.wordsSolved.toLocaleString()}</strong>
              <span>Words</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionPanel}>
        <div className={styles.sectionHeader}>
          <h2>Choose a Mode</h2>
        </div>

        <div className={styles.modeGrid}>
          {allModes.map((mode: typeof modes[0]) => {
            const Icon = mode.icon;

            return (
              <Card key={mode.title} className={styles.modeCard}>
                <CardContent className={styles.cardContentCompact}>
                  <div className={styles.modeIcon}>
                    <Icon />
                  </div>

                  <h3 className={styles.modeTitle}>
                    {mode.title}
                  </h3>
                  <p className={styles.modeDescription}>
                    {mode.description}
                  </p>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="small"
                    onClick={() => {
                      if (mode.title === "Player 1 vs Player 2") {
                        navigate("/player-setup");
                      } else {
                        navigate(mode.navigation || "/battle");
                      }
                    }}
                    className={styles.playButton}
                  >
                    SELECT
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
