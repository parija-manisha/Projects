import styles from "../assets/css/Hangman.module.css";

type Props = {
  wrongCount: number;
};

export default function HangmanSVG({ wrongCount }: Props) {
  const gameOver = wrongCount >= 6;

  return (
    <svg
      viewBox="0 0 200 260"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={gameOver ? styles.gameOver : undefined}
    >
      {/* ================= Gallow ================= */}
      <line x1="20" y1="240" x2="180" y2="240" className={styles.gallow} />
      <line x1="50" y1="240" x2="50" y2="20" className={styles.gallow} />
      <line x1="50" y1="20" x2="130" y2="20" className={styles.gallow} />
      <line x1="130" y1="20" x2="130" y2="60" className={`${styles.gallow} ${styles.rope}`} />

      {/* ================= Head ================= */}
      {wrongCount > 0 && (
        <circle cx="130" cy="85" r="14" className={`${styles.pipe} ${styles.head}`} />
      )}

      {/* ================= Body ================= */}
      {wrongCount > 1 && (
        <line x1="130" y1="99" x2="130" y2="150" className={styles.pipe} />
      )}

      {/* Arms */}
      {wrongCount > 2 && (
        <line x1="130" y1="115" x2="105" y2="135" className={styles.pipe} />
      )}

      {wrongCount > 3 && (
        <line x1="130" y1="115" x2="155" y2="135" className={styles.pipe} />
      )}

      {/* Legs */}
      {wrongCount > 4 && (
        <line x1="130" y1="150" x2="110" y2="185" className={styles.pipe} />
      )}

      {wrongCount > 5 && (
        <line x1="130" y1="150" x2="150" y2="185" className={styles.pipe} />
      )}
    </svg>
  );
}