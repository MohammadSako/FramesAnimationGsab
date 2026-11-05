"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "./heroTitle";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 149;
const FADE_DISTANCE = 2500;
const currentFrame = (i) => `/avif/${i}.avif`;

// HeroTitle never changes, so keep it out of Hero's re-renders.
const MemoHeroTitle = memo(HeroTitle);

function Hero({ onProgressChange }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(1); // frame the scroll position wants
  const drawnRef = useRef(0); // frame currently on the canvas
  const [ready, setReady] = useState(false);

  // Draw a frame with "cover" fit. Skips work when the frame is already shown.
  const drawFrame = (frame, force = false) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const f = Math.min(FRAME_COUNT, Math.max(1, Math.round(frame)));
    frameRef.current = f;
    if (!canvas || !ctx || (!force && drawnRef.current === f)) return;

    const img = imagesRef.current[f];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const canvasRatio = cw / ch;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    let sx = 0,
      sy = 0,
      sw = iw,
      sh = ih;

    if (iw / ih > canvasRatio) {
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / canvasRatio;
      sy = (ih - sh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    drawnRef.current = f;
  };

  // Overlay fade-out: write straight to the DOM instead of setState on every
  // scroll event (that re-rendered the whole hero on each scroll tick).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (overlayRef.current) {
        const opacity = Math.max(0, 1 - window.scrollY / FADE_DISTANCE);
        overlayRef.current.style.opacity = String(opacity);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Preload + decode frames, and size the canvas.
  useLayoutEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let lastReported = -1;
    imagesRef.current = new Array(FRAME_COUNT + 1);

    const onDone = () => {
      if (cancelled) return;
      loaded++;
      const pct = Math.round((loaded / FRAME_COUNT) * 100);
      if (pct !== lastReported) {
        lastReported = pct;
        onProgressChange?.(pct);
      }
      if (loaded === FRAME_COUNT) setReady(true);
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = currentFrame(i);
      // decode() moves AVIF decoding off the scroll path, so the first draw of
      // each frame doesn't stall the main thread. Errors still count, so the
      // preloader can't get stuck below 100.
      img
        .decode()
        .catch(() => {})
        .finally(onDone);
      imagesRef.current[i] = img;
    }

    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    let resizeRaf = 0;
    const setSize = () => {
      resizeRaf = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      drawFrame(frameRef.current, true); // keep the current frame on resize
    };
    const onResize = () => {
      if (!resizeRaf) resizeRaf = requestAnimationFrame(setSize);
    };

    setSize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GSAP scroll animation. onUpdate already runs on GSAP's rAF ticker, so we
  // draw directly; drawFrame skips identical frames.
  useLayoutEffect(() => {
    if (!ready || !containerRef.current) return;
    const obj = { frame: 1 };
    drawFrame(1, true);

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        frame: FRAME_COUNT,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: ".grid-container",
          start: "top top",
          end: "+=8000",
          scrub: true,
          pin: ".grid-container",
        },
        onUpdate: () => drawFrame(obj.frame),
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            <div
              ref={overlayRef}
              className="absolute top-0 bottom-0 w-full will-change-[opacity]"
            >
              <MemoHeroTitle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Hero);
