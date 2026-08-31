// Game code utilities
export const generateGameCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const validateGameCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
};

// Game session storage key
export const GAME_SESSION_KEY = "hangman_quest_game_session";

export interface GameSession {
  gameCode: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1SessionScore: number;
  player2SessionScore: number;
  currentPlayer: 1 | 2;
  currentWord: string;
  currentHint: string;
  guessedLetters: string[];
  wrongCount: number;
  solved: boolean;
  gameOver: boolean;
  finished: boolean;
  lastUpdated: number;
  createdAt: number;
}

export const createGameSession = (
  gameCode: string,
  player1Name: string
): GameSession => {
  return {
    gameCode,
    player1Name,
    player2Name: "",
    player1Score: 0,
    player2Score: 0,
    player1SessionScore: 0,
    player2SessionScore: 0,
    currentPlayer: 1,
    currentWord: "",
    currentHint: "",
    guessedLetters: [],
    wrongCount: 0,
    solved: false,
    gameOver: false,
    finished: false,
    lastUpdated: Date.now(),
    createdAt: Date.now(),
  };
};

export const saveGameSession = (session: GameSession): void => {
  const sessions = getGameSessions();
  sessions[session.gameCode] = session;
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(sessions));
};

export const getGameSession = (gameCode: string): GameSession | null => {
  const sessions = getGameSessions();
  return sessions[gameCode] || null;
};

export const getGameSessions = (): Record<string, GameSession> => {
  const data = localStorage.getItem(GAME_SESSION_KEY);
  return data ? JSON.parse(data) : {};
};

export const deleteGameSession = (gameCode: string): void => {
  const sessions = getGameSessions();
  delete sessions[gameCode];
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(sessions));
};

export const updateGameSession = (session: GameSession): void => {
  session.lastUpdated = Date.now();
  saveGameSession(session);
};
