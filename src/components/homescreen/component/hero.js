"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "./heroTitle";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [opacity, setOpacity] = useState(1); // 1 = fully visible, 0 = hidden

  // handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 2500; // how many px until fully hidden
      const newOpacity = Math.max(0, 1 - scrollTop / maxScroll);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const frameCount = 149;
  const currentFrame = (i) => `/avif/${i}.avif`;

  // preload images with progress
  useLayoutEffect(() => {
    imagesRef.current = new Array(frameCount + 1);
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loaded++;
        setProgress(Math.round((loaded / frameCount) * 100));
        if (loaded === frameCount) setReady(true);
      };
      imagesRef.current[i] = img;
    }

    const canvas = canvasRef.current;
    const setSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  useLayoutEffect(() => {
    if (!ready || !containerRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const obj = { frame: 1 };

    function draw() {
      const f = Math.min(frameCount, Math.max(1, Math.floor(obj.frame)));
      const img = imagesRef.current[f];
      if (img && ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // aspect ratio cover (like object-fit: cover)
        const canvasRatio = canvasRef.current.width / canvasRef.current.height;
        const imgRatio = img.width / img.height;
        let sx = 0,
          sy = 0,
          sWidth = img.width,
          sHeight = img.height;

        if (imgRatio > canvasRatio) {
          sWidth = img.height * canvasRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / canvasRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(
          img,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }

    const tween = gsap.to(obj, {
      frame: frameCount,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ".grid-container",
        start: "top top",
        end: "+=8000",
        scrub: true,
        pin: ".grid-container",
      },
      onUpdate: () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(draw);
      },
    });

    imagesRef.current[1].onload = draw;

    return () => {
      tween.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="relative z-20 origin-bottom md:-mb-[50vh]"
      style={{ height: "10000px" }}
    >
      <div className="grid-container">
        <div className="grid">
          <div className="gridLayer relative h-screen w-screen">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: ready ? "block" : "none" }}
            />

            <div className="absolute top-0 bottom-0 w-full" style={{ opacity }}>
              <HeroTitle />
            </div>

            {!ready && (
              <div className="z-55 absolute inset-0 flex items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center">
                  <div className="mb-4">Loading {progress}%</div>
                  <div className="w-48 h-2 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
