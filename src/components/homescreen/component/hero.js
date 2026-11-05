"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "./heroTitle";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 149;
const FADE_DISTANCE = 2500;
// How many frames are fetched + decoded at once. Decoding all 149 large AVIFs
// in parallel spikes memory and starves the main thread during load.
const LOAD_CONCURRENCY = 6;
// Only rebuild the scaled frames when the viewport changes by more than this
// (mobile URL bars change innerHeight constantly while scrolling).
const REBUILD_THRESHOLD = 0.15;
const currentFrame = (i) => `/avif/${i}.avif`;

// HeroTitle never changes, so keep it out of Hero's re-renders.
const MemoHeroTitle = memo(HeroTitle);

// "cover" crop of a (sw x sh) source into a (cw x ch) target.
function coverRect(sw, sh, cw, ch) {
  const targetRatio = cw / ch;
  if (sw / sh > targetRatio) {
    const w = sh * targetRatio;
    return [(sw - w) / 2, 0, w, sh];
  }
  const h = sw / targetRatio;
  return [0, (sh - h) / 2, sw, h];
}

// Frames are 2544x1439. Keeping 149 of them decoded at full size costs ~2 GB
// and every draw has to scale them down. Instead each frame is cropped and
// scaled once to the canvas size, so drawing is a plain 1:1 blit and memory
// drops to what the viewport actually needs.
async function toBitmap(img, cw, ch) {
  if (typeof createImageBitmap !== "function") return img;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const [sx, sy, sw, sh] = coverRect(iw, ih, cw, ch);
  // Never upscale beyond the source crop.
  const scale = Math.min(1, sw / cw, sh / ch);
  try {
    return await createImageBitmap(img, sx, sy, sw, sh, {
      resizeWidth: Math.max(1, Math.round(cw * scale)),
      resizeHeight: Math.max(1, Math.round(ch * scale)),
      resizeQuality: "medium",
    });
  } catch {
    return img;
  }
}

function release(source) {
  if (source && typeof source.close === "function") source.close();
}

function Hero({ onProgressChange }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const ctxRef = useRef(null);
  const framesRef = useRef([]); // drawable per frame (scaled ImageBitmap)
  const builtSizeRef = useRef({ w: 0, h: 0 }); // size framesRef was built for
  const frameRef = useRef(1); // frame the scroll position wants
  const drawnRef = useRef(0); // frame currently on the canvas
  const [ready, setReady] = useState(false);

  // Draw a frame. Skips work when the frame is already shown. If the exact
  // frame isn't available yet, falls back to the nearest one that is.
  const drawFrame = (frame, force = false) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const f = Math.min(FRAME_COUNT, Math.max(1, Math.round(frame)));
    frameRef.current = f;
    if (!canvas || !ctx || (!force && drawnRef.current === f)) return;

    const frames = framesRef.current;
    let src = frames[f];
    for (let d = 1; !src && d < FRAME_COUNT; d++) {
      src = frames[f - d] || frames[f + d];
    }
    if (!src) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const sw = src.naturalWidth || src.width;
    const sh = src.naturalHeight || src.height;
    if (!sw || !sh) return;

    if (Math.abs(sw / sh - cw / ch) < 0.01) {
      // Pre-scaled bitmap: straight blit (opaque canvas, no clear needed).
      ctx.drawImage(src, 0, 0, cw, ch);
    } else {
      const [sx, sy, w, h] = coverRect(sw, sh, cw, ch);
      ctx.drawImage(src, sx, sy, w, h, 0, 0, cw, ch);
    }
    drawnRef.current = frames[f] ? f : 0; // redraw once the real frame lands
  };

  // Overlay fade-out: write straight to the DOM (rAF-throttled). Once it is
  // fully transparent, hide it so the masked logo marquee stops painting.
  useEffect(() => {
    let raf = 0;
    let hidden = false;
    const update = () => {
      raf = 0;
      const el = overlayRef.current;
      if (!el) return;
      const opacity = Math.max(0, 1 - window.scrollY / FADE_DISTANCE);
      el.style.opacity = String(opacity);
      const shouldHide = opacity === 0;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        el.style.visibility = hidden ? "hidden" : "";
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

  // Preload frames (bounded concurrency, in order), scale them to the canvas,
  // and keep the canvas sized to the viewport.
  useLayoutEffect(() => {
    let cancelled = false;
    let generation = 0; // bumps on every rebuild so stale bitmaps are dropped
    framesRef.current = new Array(FRAME_COUNT + 1);

    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const sizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };
    sizeCanvas();
    builtSizeRef.current = { w: canvas.width, h: canvas.height };

    const store = async (i, img, gen) => {
      const { w, h } = builtSizeRef.current;
      const bmp = await toBitmap(img, w, h);
      if (cancelled || gen !== generation) {
        if (bmp !== img) release(bmp);
        return;
      }
      release(framesRef.current[i]);
      framesRef.current[i] = bmp;
      if (i === frameRef.current) drawFrame(i, true);
    };

    // --- initial load ---
    let loaded = 0;
    let lastReported = -1;
    let next = 1;
    const report = () => {
      loaded++;
      const pct = Math.round((loaded / FRAME_COUNT) * 100);
      if (pct !== lastReported) {
        lastReported = pct;
        onProgressChange?.(pct);
      }
      if (loaded === FRAME_COUNT) setReady(true);
    };
    // The <img> is not kept after scaling, so its full-size decoded pixels
    // can be freed; a rebuild re-reads the file from the HTTP cache.
    const loadFrame = async (i, gen) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = currentFrame(i);
      await img.decode();
      if (!cancelled) await store(i, img, gen);
    };
    const worker = async () => {
      while (!cancelled && next <= FRAME_COUNT) {
        const i = next++;
        try {
          await loadFrame(i, generation);
        } catch {
          // A failed frame still counts so the preloader can't get stuck.
        }
        if (!cancelled) report();
      }
    };
    for (let k = 0; k < LOAD_CONCURRENCY; k++) worker();

    // --- resize ---
    let resizeRaf = 0;
    let rebuildTimer = 0;
    const rebuild = async () => {
      const gen = ++generation;
      builtSizeRef.current = { w: canvas.width, h: canvas.height };
      // Current frame first, then outward, so what's on screen sharpens first.
      const order = [];
      const c = frameRef.current;
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (c - d >= 1) order.push(c - d);
        if (d && c + d <= FRAME_COUNT) order.push(c + d);
      }
      for (const i of order) {
        if (cancelled || gen !== generation) return;
        try {
          await loadFrame(i, gen);
        } catch {
          // keep the previous (differently sized) frame
        }
      }
    };
    const onResizeFrame = () => {
      resizeRaf = 0;
      if (!sizeCanvas()) return;
      drawFrame(frameRef.current, true); // keep the current frame on resize
      const built = builtSizeRef.current;
      const dw = Math.abs(canvas.width - built.w) / built.w;
      const dh = Math.abs(canvas.height - built.h) / built.h;
      if (dw > REBUILD_THRESHOLD || dh > REBUILD_THRESHOLD) {
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(rebuild, 250);
      }
    };
    const onResize = () => {
      if (!resizeRaf) resizeRaf = requestAnimationFrame(onResizeFrame);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      clearTimeout(rebuildTimer);
      framesRef.current.forEach(release);
      framesRef.current = [];
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
