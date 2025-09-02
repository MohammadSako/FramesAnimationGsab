"use client";

import { useEffect, useState } from "react";
import styles from "../../animation.module.css";

export default function Preloader({ progress }) {
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setSlideUp(true);
    }
  }, [progress]);

  return (
    <div className={`${styles.preloader} ${slideUp ? styles.slideUp : ""}`}>
      <div className={`${styles.counter} ${slideUp ? styles.hide : ""}`}>
        {progress}
      </div>
    </div>
  );
}
