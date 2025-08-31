"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "../component/heroTitle";
import styles from "../../animation.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Tower() {
  const containerRef = useRef(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setInnerHeight(window.innerHeight);
    }
  }, [setInnerHeight]);

  useLayoutEffect(() => {
    if (!innerHeight) return;

    let ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".grid-container",
            start: "top top",
            end: () => innerHeight * 40,
            scrub: true,
            pin: ".grid",
            anticipatePin: 1,
          },
        })
        .set(".gridBlock:not(.centerBlock)", { autoAlpha: 1 })
        .to(
          ".gridBlock:not(.centerBlock)",
          { duration: 0.1, autoAlpha: 1 },
          0.001
        )
        .fromTo(
          ".gridBlock",
          { backgroundSize: "360%" },
          {
            backgroundSize: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: ".grid-container",
              start: "top top",
              end: "+=8000",
              scrub: true,
              pin: ".grid-container",
            },
          }
        );

      // https://www.youtube.com/watch?v=jETj55LE_i8
    }, containerRef);

    return () => ctx.revert();
  }, [innerHeight, containerRef]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 origin-bottom md:-mb-[50vh]"
      style={{ height: "6000px" }}
    >
      <div className="grid-container">
        <div className="grid">
          <div className="gridLayer relative">
            <div
              className={`${styles.gridBlock} gridBlock h-screen w-screen absolute inset-0`}
              style={{
                backgroundImage: "url('/hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
              }}
            >
              <div className="sticky top-[25vh] z-20 flex w-full -translate-y-1/4 flex-col items-center gap-6 text-center md:top-[22vh] md:gap-10">
                <HeroTitle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
