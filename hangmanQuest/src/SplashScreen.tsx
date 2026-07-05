import { useNavigate } from "react-router-dom";
import styles from "./assets/css/SplashScreen.module.css";

export default function SplashScreen() {
  const navigate = useNavigate();
  return (
    <div className={styles.splashScreen}>
      <div className={styles.logoContainer}>
        <h1 className={styles.title}>⚔ Hangman Quest ⚔</h1>

        <p className={styles.subtitle}>
          Explore magical kingdoms, defeat monsters and discover hidden words.
        </p>

        <div className={styles.loadingContainer}>
          <div className={styles.loadingBar}>
            <div className={styles.progress}></div>
          </div>

          <p className={styles.loadingText}>Preparing Adventure...</p>
        </div>
        <button
          className={styles.playButtonContainer}
          onClick={() => navigate("/home")}
        >
          <div className={styles.playTriangle}></div>
        </button>
      </div>
    </div>
  );
}
