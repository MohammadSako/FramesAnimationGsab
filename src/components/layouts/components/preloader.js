"use client";

import { useEffect, useState } from "react";
import styles from "../../animation.module.css";

export default function Preloader({ progress }) {
  const [slideUp, setSlideUp] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setSlideUp(true);
    }
  }, [progress]);

  // Once it has slid away, drop the full-screen layer entirely.
  if (gone) return null;

  return (
    <div
      className={`${styles.preloader} ${slideUp ? styles.slideUp : ""}`}
      onTransitionEnd={(e) => {
        if (slideUp && e.target === e.currentTarget) setGone(true);
      }}
    >
      <div className={`${styles.counter} ${slideUp ? styles.hide : ""}`}>
        {progress}
      </div>
    </div>
  );
}
