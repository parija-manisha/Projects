import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SplashScreen from "./SplashScreen";
import GameLayout from "./layouts/GameLayout";
import { HomeScreen } from "./HomeScreen";
import BattleScreen from "./BattleScreen";

export default function App() {
  return (
    <Routes>
      <Route element={<GameLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/battle" element={<BattleScreen />} /> 
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
