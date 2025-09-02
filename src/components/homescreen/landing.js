"use client";

import { useState } from "react";
import Hero from "./component/hero";
import NavbarNextUI from "../layouts/navbarNextUI";
import Preloader from "../layouts/components/preloader";

export default function Landing() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  console.log("ready", ready);
  console.log("progress", progress);
  return (
    <>
      {!ready ? (
        <Preloader progress={progress} />
      ) : (
        <>
          <NavbarNextUI />
        </>
      )}
      <Hero onProgressChange={setProgress} onReadyChange={setReady} />
    </>
  );
}
