"use client";

import { useEffect, useState } from "react";
import Hero from "./component/hero";
import NavbarNextUI from "../layouts/navbarNextUI";
import Preloader from "../layouts/components/preloader";

export default function Landing() {
  const [progress, setProgress] = useState(0);
//   const [slideUp, setSlideUp] = useState(false);

  // wait 2 seconds before the preloader disappears
//   useEffect(() => {
//     if (progress === 100) {
//       const timer = setTimeout(() => {
//         setSlideUp(true);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [progress]);

  return (
    <>
     <Preloader progress={progress} />
      <NavbarNextUI />
      <Hero onProgressChange={setProgress} />
    </>
  );
}
