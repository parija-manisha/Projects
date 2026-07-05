import styles from "../assets/css/OnScreenKeyboard.module.css";

interface OnScreenKeyboardProps {
  handleClick: (letter: string) => void;
  guessedLetters: string[];
  disabled?: boolean;
}

const keyboardRows = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

export default function OnScreenKeyboard({
  handleClick,
  guessedLetters,
  disabled = false,
}: OnScreenKeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {keyboardRows.map((row, index) => (
        <div key={index} className={styles.row}>
          {row.map((letter) => (
            <button
              key={letter}
              onClick={() => handleClick(letter)}
              disabled={disabled || guessedLetters.includes(letter)}
              className={`${styles.key} ${
                guessedLetters.includes(letter) ? styles.guessed : ""
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}