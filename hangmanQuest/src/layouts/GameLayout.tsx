import { Outlet } from "react-router-dom";
import styles from "../assets/css/GameLayout.module.css";

export default function GameLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.stars}></div>
      <div className={styles.starsSmall}></div>
      <div className={styles.starsLarge}></div>

      <div className={styles.ground}></div>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}