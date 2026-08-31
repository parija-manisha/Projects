import { WORLD } from "./gameConstants";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import PublicIcon from "@mui/icons-material/Public";

export const worlds = [
  {
    id: WORLD.ENCHANTED_FOREST,
    name: "Enchanted Forest",
    status: "Unlocked",
    accent: "🌲",
    unlockPoints: 0,
  },
  {
    id: WORLD.CRYSTAL_MOUNTAINS,
    name: "Crystal Mountains",
    status: "Next",
    accent: "🏔️",
    unlockPoints: 50,
  },
  {
    id: WORLD.DESERT_KINGDOM,
    name: "Desert Kingdom",
    status: "Locked",
    accent: "🏜️",
    unlockPoints: 100,
  },
  {
    id: WORLD.ICE_VALLEY,
    name: "Ice Valley",
    status: "Locked",
    accent: "❄️",
    unlockPoints: 150,
  },
  {
    id: WORLD.SPACE_STATION,
    name: "Space Station",
    status: "Locked",
    accent: "🚀",
    unlockPoints: 200,
  },
];

export const modes = [
  {
    title: "Custom Hangman",
    description: "Create your own word and play your way.",
    icon: AutoAwesomeIcon,
    navigation: "/battle",
  },
  {
    title: "Player 1 vs Player 2",
    description: "Take turns and challenge a friend on the same device.",
    icon: SportsEsportsIcon,
    navigation: "/player-setup",
  },
  {
    title: "Daily Hangman",
    description: "Play today's special word challenge.",
    icon: CalendarTodayIcon,
    navigation: "/battle",
  },
  {
    title: "New World",
    description: "Start a fresh adventure in a new realm.",
    icon: AddCircleOutlinedIcon,
    navigation: "/worlds",
  },
];

export const onlineModes = [
  {
    title: "Create Online Game",
    description: "Create a game and share with a friend on any device.",
    icon: PublicIcon,
    navigation: "/create-game",
  },
  {
    title: "Join Online Game",
    description: "Enter a game code shared by your friend.",
    icon: PublicIcon,
    navigation: "/join-game",
  },
];