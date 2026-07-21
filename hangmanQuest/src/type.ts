export interface Word {
  word: string;
  hint: string;
  difficulty?: "easy" | "medium" | "hard";
}