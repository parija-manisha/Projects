import type { Word } from "../type";
import { GAMEMODE, WORLD } from "./gameConstants";
import { DAILY_WORDS } from "./words/dailyWords";
import { ENCHANTED_FOREST_WORDS } from "./words/enchantedForestWords";
import { CRYSTAL_MOUNTAINS_WORDS } from "./words/crystalMountainsWords";
import { DESERT_KINGDOM_WORDS } from "./words/desertKingdomWords";
import { ICE_VALLEY_WORDS } from "./words/iceValleyWords";
import { SPACE_STATION_WORDS } from "./words/spaceStationWords";

export const WORDS_BY_MODE: {
  [GAMEMODE.DAILY]: Word[];
  [GAMEMODE.WORLD]: Record<string, Word[]>;
  [GAMEMODE.MULTIPLAYER]: Word[];
} = {
  [GAMEMODE.DAILY]: DAILY_WORDS,
  [GAMEMODE.MULTIPLAYER]: DAILY_WORDS,
  [GAMEMODE.WORLD]: {
    [WORLD.ENCHANTED_FOREST]: ENCHANTED_FOREST_WORDS,
    [WORLD.CRYSTAL_MOUNTAINS]: CRYSTAL_MOUNTAINS_WORDS,
    [WORLD.DESERT_KINGDOM]: DESERT_KINGDOM_WORDS,
    [WORLD.ICE_VALLEY]: ICE_VALLEY_WORDS,
    [WORLD.SPACE_STATION]: SPACE_STATION_WORDS,
  },
} as const;