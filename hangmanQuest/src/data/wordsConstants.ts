import type { Word } from "../type";
import { GAMEMODE, WORLD } from "./gameConstants";
import { DAILY_WORDS } from "./words/dailyWords";
import { ENCHANTED_FOREST_WORDS } from "./words/enchantedForestWords";

export const WORDS_BY_MODE: {
  [GAMEMODE.DAILY]: Word[];
  [GAMEMODE.WORLD]: Record<string, Word[]>;
} = {
  [GAMEMODE.DAILY]: DAILY_WORDS,
  [GAMEMODE.WORLD]: {
    [WORLD.ENCHANTED_FOREST]: ENCHANTED_FOREST_WORDS,
  },
} as const;