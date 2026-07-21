import { Card, CardContent, Button, Chip } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import styles from "./assets/css/WorldScreen.module.css";
import { worlds } from "./data/gameData";

export default function WorldScreen() {
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
          label={`${worlds.length} Worlds`}
          color="primary"
        />
      </div>

      <div className={styles.worldGrid}>
        {worlds.map((world) => (
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
                  disabled={world.status === "Locked"}
                >
                  {world.status === "Unlocked"
                    ? "Play"
                    : world.status === "Next"
                    ? "Unlock"
                    : "Locked"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}