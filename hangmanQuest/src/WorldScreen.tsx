import { Card, CardContent, Button, Chip } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from "./assets/css/WorldScreen.module.css";
import { worlds } from "./data/gameData";

export default function WorldScreen() {
  const navigate = useNavigate();
  const [playerScore, setPlayerScore] = useState(0);
  const [worldsWithStatus, setWorldsWithStatus] = useState(worlds);

  useEffect(() => {
    const refreshScore = () => {
      const saved = sessionStorage.getItem("playerScore");
      const score = saved ? parseInt(saved, 10) : 0;
      setPlayerScore(score);
      return score;
    };

    const score = refreshScore();
    const updatedWorlds = worlds.map((world) => {
      if (score >= world.unlockPoints) {
        return { ...world, status: "Unlocked" as const };
      } else if (score >= world.unlockPoints - 50 && world.unlockPoints > 0) {
        return { ...world, status: "Next" as const };
      } else {
        return { ...world, status: "Locked" as const };
      }
    });
    setWorldsWithStatus(updatedWorlds);

    const handlePageShow = () => {
      const nextScore = refreshScore();
      const recalculatedWorlds = worlds.map((world) => {
        if (nextScore >= world.unlockPoints) {
          return { ...world, status: "Unlocked" as const };
        } else if (nextScore >= world.unlockPoints - 50 && world.unlockPoints > 0) {
          return { ...world, status: "Next" as const };
        } else {
          return { ...world, status: "Locked" as const };
        }
      });
      setWorldsWithStatus(recalculatedWorlds);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    const updatedWorlds = worlds.map((world) => {
      if (playerScore >= world.unlockPoints) {
        return { ...world, status: "Unlocked" as const };
      } else if (playerScore >= world.unlockPoints - 50 && world.unlockPoints > 0) {
        return { ...world, status: "Next" as const };
      } else {
        return { ...world, status: "Locked" as const };
      }
    });
    setWorldsWithStatus(updatedWorlds);
  }, [playerScore]);
  return (
    <section className={styles.sectionPanel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Adventure Mode</p>
          <h2>Choose Your World</h2>
          <p className={styles.subtitle}>
            Unlock new worlds and complete exciting challenges.
          </p>
        </div>

        <Chip
          icon={<PublicIcon />}
          label={`${worldsWithStatus.length} Worlds`}
          color="primary"
        />
      </div>

      <div className={styles.worldGrid}>
        {worldsWithStatus.map((world) => (
          <Card
            key={world.name}
            elevation={0}
            className={styles.worldCard}
          >
            <CardContent className={styles.cardContent}>
              <div className={styles.worldIcon}>
                {world.accent}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <h3>{world.name}</h3>

                    <p className={styles.description}>
                      Explore hidden places, solve words, unlock rewards and
                      complete adventures.
                    </p>
                  </div>

                  <Chip
                    label={world.status}
                    size="small"
                    color={
                      world.status === "Unlocked"
                        ? "success"
                        : world.status === "Next"
                        ? "warning"
                        : "default"
                    }
                  />
                </div>

                {world.status === "Locked" && world.unlockPoints > 0 && (
                  <p className={styles.description}>
                    Unlock at {world.unlockPoints} points ({playerScore}/{world.unlockPoints})
                  </p>
                )}
                {world.status === "Next" && world.unlockPoints > 0 && (
                  <p className={styles.description}>
                    {world.unlockPoints - playerScore} points to unlock
                  </p>
                )}
              </div>

              <div className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  startIcon={
                    world.status === "Unlocked" ? (
                      <PlayArrowIcon />
                    ) : (
                      <LockIcon />
                    )
                  }
                  disabled={world.status !== "Unlocked"}
                  onClick={() =>
                    world.status === "Unlocked" &&
                    navigate("/battle", { state: { selectedWorld: world.id } })
                  }
                >
                  {world.status === "Unlocked" ? "Play" : "Locked"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}