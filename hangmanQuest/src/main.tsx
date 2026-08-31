import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SplashScreen from "./SplashScreen";
import GameLayout from "./layouts/GameLayout";
import { HomeScreen } from "./HomeScreen";
import BattleScreen from "./BattleScreen";
import MultiplayerBattleScreen from "./MultiplayerBattleScreen";
import PlayerSetupScreen from "./PlayerSetupScreen";
import CreateGameScreen from "./CreateGameScreen";
import JoinGameScreen from "./JoinGameScreen";
import WaitingForPlayerScreen from "./WaitingForPlayerScreen";
import OnlineMultiplayerBattleScreen from "./OnlineMultiplayerBattleScreen";
import WorldScreen from "./WorldScreen";

export default function App() {
  return (
    <Routes>
      <Route element={<GameLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/battle" element={<BattleScreen />} />
        <Route path="/player-setup" element={<PlayerSetupScreen />} />
        <Route path="/multiplayer" element={<MultiplayerBattleScreen />} />
        <Route path="/create-game" element={<CreateGameScreen />} />
        <Route path="/join-game" element={<JoinGameScreen />} />
        <Route path="/join-game/:code" element={<JoinGameScreen />} />
        <Route path="/waiting-for-player" element={<WaitingForPlayerScreen />} />
        <Route path="/online-battle" element={<OnlineMultiplayerBattleScreen />} />
        <Route path="/worlds" element={<WorldScreen />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
