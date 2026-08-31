export const PLAYER_STATS_KEY = "hangman_quest_player_stats";

export interface PlayerStats {
  xp: number;
  coins: number;
  wordsSolved: number;
}

const defaultStats: PlayerStats = {
  xp: 0,
  coins: 0,
  wordsSolved: 0,
};

export const getPlayerStats = (): PlayerStats => {
  const savedStats = sessionStorage.getItem(PLAYER_STATS_KEY);

  if (!savedStats) {
    const score = Number(sessionStorage.getItem("playerScore")) || 0;
    return {
      ...defaultStats,
      xp: score,
      wordsSolved: Number(JSON.parse(sessionStorage.getItem(PLAYER_STATS_KEY) || "{}")?.wordsSolved) || 0,
    };
  }

  try {
    return { ...defaultStats, ...JSON.parse(savedStats) };
  } catch {
    return { ...defaultStats };
  }
};

export const savePlayerStats = (stats: PlayerStats): void => {
  sessionStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats));
  sessionStorage.setItem("playerScore", String(stats.xp));
};

export const recordProgress = (
  xpChange: number,
  wordsSolved = 0,
): PlayerStats => {
  const stats = getPlayerStats();
  const updatedXp = Math.max(0, stats.xp + xpChange);
  const updatedStats = {
    xp: updatedXp,
    coins: updatedXp,
    wordsSolved: stats.wordsSolved + wordsSolved,
  };

  savePlayerStats(updatedStats);
  return updatedStats;
};