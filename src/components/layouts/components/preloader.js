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

  useEffect(() => {
    if (progress === 100) {
      setSlideUp(true);
    }
  }, [progress]);

  return (
    <div className={`${styles.preloader} ${slideUp ? styles.slideUp : ""} bg-[#eff2e8]`}>
      <div className={`${styles.counter} ${slideUp ? styles.hide : ""}`}>
        {progress}
      </div>
    </div>
  );
}
