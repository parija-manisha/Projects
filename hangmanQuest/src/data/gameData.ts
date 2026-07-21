import { WORLD } from "./gameConstants";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

export const worlds = [
  {
    id: WORLD.ENCHANTED_FOREST,
    name: "Enchanted Forest",
    status: "Unlocked",
    accent: "🌲",
  },
  {
    id: WORLD.CRYSTAL_MOUNTAINS,
    name: "Crystal Mountains",
    status: "Next",
    accent: "🏔️",
  },
  {
    id: WORLD.DESERT_KINGDOM,
    name: "Desert Kingdom",
    status: "Locked",
    accent: "🏜️",
  },
  {
    id: WORLD.ICE_VALLEY,
    name: "Ice Valley",
    status: "Locked",
    accent: "❄️",
  },
  {
    id: WORLD.SPACE_STATION,
    name: "Space Station",
    status: "Locked",
    accent: "🚀",
  },
];

export const modes = [
  {
    title: "Custom Hangman",
    description: "Create your own word and play your way.",
    icon: AutoAwesomeIcon,
  },
  {
    title: "Player 1 vs Player 2",
    description: "Take turns and challenge a friend.",
    icon: SportsEsportsIcon,
  },
  {
    title: "Daily Hangman",
    description: "Play today's special word challenge.",
    icon: CalendarTodayIcon,
  },
  {
    title: "New World",
    description: "Start a fresh adventure in a new realm.",
    icon: AddCircleOutlinedIcon,
  },
];