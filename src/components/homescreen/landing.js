"use client";

import { useState } from "react";
import Hero from "./component/hero";
import NavbarNextUI from "../layouts/navbarNextUI";
import Preloader from "../layouts/components/preloader";

export default function Landing() {
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Preloader progress={progress} />
      <NavbarNextUI />
      <Hero onProgressChange={setProgress} />
    </>
  );
}
