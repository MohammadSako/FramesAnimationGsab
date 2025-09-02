// "use client";

// import styles from "../../animation.module.css";

// export default function Preloader({ progress }) {
//   return (
//     <div className={styles.preloader}>
//       <div className={styles.counter}>{progress}</div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import styles from "../../animation.module.css";

export default function Preloader({ progress }) {
  const [slideUp, setSlideUp] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      // Wait 1s, then start slide up
      const timer = setTimeout(() => {
        setSlideUp(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!visible) return null; // completely removed after animation

  return (
    <div
      className={`${styles.preloader} ${slideUp ? styles.slideUp : ""}`}
      onTransitionEnd={() => setVisible(false)} // unmount after slide finishes
    >
      <div className={styles.counter}>{progress}</div>
    </div>
  );
}




