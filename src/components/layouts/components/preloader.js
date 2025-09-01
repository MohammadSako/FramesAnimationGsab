"use client";

import styles from "../../animation.module.css";

export default function Preloader({ progress }) {
  return (
    <div className={styles.preloader}>
      <div className={styles.counter}>{progress}</div>
    </div>
  );
}
