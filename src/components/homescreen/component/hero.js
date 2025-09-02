"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "./heroTitle";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onProgressChange }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (onProgressChange) {
      onProgressChange(progress);
    }
  }, [progress, onProgressChange]);

  // scroll fade-out effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 2500;
      const newOpacity = Math.max(0, 1 - scrollTop / maxScroll);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const frameCount = 149;
  const currentFrame = (i) => `/avif/${i}.avif`;

  // preload images
  useLayoutEffect(() => {
    imagesRef.current = new Array(frameCount + 1);
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loaded++;
        setProgress(Math.round((loaded / frameCount) * 100));
        if (loaded === frameCount) setReady(true);
      };
      imagesRef.current[i] = img;
    }

    // make canvas responsive
    const canvas = canvasRef.current;
    const setSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(1); // redraw first frame on resize
    };

    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  // function to draw frame
  const drawFrame = (frame) => {
    const ctx = canvasRef.current.getContext("2d");
    const f = Math.min(frameCount, Math.max(1, Math.floor(frame)));
    const img = imagesRef.current[f];
    if (img && ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // maintain cover aspect ratio
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
  };

  // gsap scroll animation
  useLayoutEffect(() => {
    if (!ready || !containerRef.current) return;
    const obj = { frame: 1 };

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
        rafRef.current = requestAnimationFrame(() => drawFrame(obj.frame));
      },
    });

    imagesRef.current[1].onload = () => drawFrame(1);

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
            {/* responsive canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: ready ? "block" : "none" }}
            />

            {/* overlay content */}
            <div className="absolute top-0 bottom-0 w-full" style={{ opacity }}>
              <HeroTitle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
