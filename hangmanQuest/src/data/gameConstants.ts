import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

export const worlds = [
  { name: "Enchanted Forest", status: "Unlocked", accent: "🌲" },
  { name: "Crystal Mountains", status: "Next", accent: "🏔️" },
  { name: "Desert Kingdom", status: "Locked", accent: "🏜️" },
  { name: "Ice Valley", status: "Locked", accent: "❄️" },
  { name: "Space Station", status: "Locked", accent: "🚀" },
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
    navigation: "/battle",
  },
  {
    title: "New World",
    description: "Start a fresh adventure in a new realm.",
    icon: AddCircleOutlinedIcon,
  },
];