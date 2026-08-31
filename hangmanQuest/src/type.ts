export interface Word {
  word: string;
  hint: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface PlayerStats {
  name: string;
  score: number;
  sessionScore: number;
  wordsSolved: number;
}

export interface MultiplayerGameState {
  player1: PlayerStats;
  player2: PlayerStats;
  currentPlayer: 1 | 2;
  currentWord: Word;
  guessedLetters: string[];
  wrongCount: number;
  solved: boolean;
  gameOver: boolean;
  finished: boolean;
}