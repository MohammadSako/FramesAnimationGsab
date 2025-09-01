// "use client";

// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import HeroTitle from "./component/heroTitle";
// import styles from "../animation.module.css";

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero() {
//   const containerRef = useRef(null);
//   const [frame, setFrame] = useState(1);

//   const frameCount = 100; // total frames
//   const currentFrame = (index) => `/frames/${index}.png`;

//   useLayoutEffect(() => {
//     if (!containerRef.current) return;

//     let ctx = gsap.context(() => {
//       let obj = { frame: 1 };

//       gsap.to(obj, {
//         frame: frameCount,
//         snap: "frame", // ensures integer frames
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".grid-container",
//           start: "top top",
//           end: "+=8000", // scroll distance
//           scrub: true,
//           pin: ".grid-container",
//         },
//         onUpdate: () => {
//           setFrame(obj.frame);
//         },
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="relative z-20 origin-bottom md:-mb-[50vh]"
//       style={{ height: "10000px" }}
//     >
//       <div className="grid-container">
//         <div className="grid">
//           <div className="gridLayer">
//             <div
//               className={`${styles.gridBlock} gridBlock h-screen w-screen`}
//               style={{
//                 backgroundImage: `url('${currentFrame(frame)}')`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             >
//               <div className="absolute top-0 bottom-0 w-full">
//                 <HeroTitle />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//////////////////////////////////




// "use client";
// import { useLayoutEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import HeroTitle from "./component/heroTitle";
// import styles from "../animation.module.css";

// gsap.registerPlugin(ScrollTrigger);

// export default function Hero() {
//   const containerRef = useRef(null);
//   const imgRef = useRef(null);
//   const imagesRef = useRef([]);
//   const frameCount = 100;

//   const currentFrame = (i) => `/frames/${i}.png`;

//   // preload images
//   useLayoutEffect(() => {
//     imagesRef.current = new Array(frameCount + 1);
//     for (let i = 1; i <= frameCount; i++) {
//       const img = new Image();
//       img.src = currentFrame(i);
//       imagesRef.current[i] = img;
//     }
//   }, []);

//   // GSAP to drive frame
//   useLayoutEffect(() => {
//     if (!containerRef.current) return;

//     const obj = { frame: 1 };

//     const ctx = gsap.context(() => {
//       gsap.to(obj, {
//         frame: frameCount,
//         snap: "frame",
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".grid-container",
//           start: "top top",
//           end: "+=8000",
//           scrub: true,
//           pin: ".grid-container",
//         },
//         onUpdate: () => {
//           const f = obj.frame;
//           // only update DOM if different
//           if (imgRef.current && imgRef.current.dataset.frame !== String(f)) {
//             imgRef.current.dataset.frame = String(f);
//             // direct DOM change (no React state)
//             imgRef.current.src = imagesRef.current[f]?.src || currentFrame(f);
//           }
//         },
//       });
//     }, containerRef);

//     return () => {
//       ctx.revert();
//       ScrollTrigger.kill();
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="relative z-20 origin-bottom md:-mb-[50vh]"
//       style={{ height: "10000px" }}
//     >
//       <div className="grid-container">
//         <div className="grid">
//           <div className="gridLayer">
//             {/* positioned <img> so it behaves like a background */}
//             <div className="relative h-screen w-screen overflow-hidden">
//               <img
//                 ref={imgRef}
//                 src={currentFrame(1)}
//                 data-frame="1"
//                 alt="frame"
//                 className="absolute inset-0 w-full h-full object-cover"
//                 style={{ willChange: "transform, opacity" }}
//               />
//               <div className="absolute top-0 left-0 right-0">
//                 <HeroTitle />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useLayoutEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import HeroTitle from "./component/heroTitle";

// gsap.registerPlugin(ScrollTrigger);

// export default function HeroCanvas() {
//   const containerRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imagesRef = useRef([]);
//   const rafRef = useRef(null);
//   const [ready, setReady] = useState(false);
//   const frameCount = 149;
// console.log("adsadas", canvasRef);

//   const currentFrame = (i) => `/frames/${i}.png`;

//   // preload images and set up canvas size
//   useLayoutEffect(() => {
//     imagesRef.current = new Array(frameCount + 1);
//     let loaded = 0;

//     for (let i = 1; i <= frameCount; i++) {
//       const img = new Image();
//       img.src = currentFrame(i);
//       img.onload = () => {
//         loaded++;
//         if (loaded === frameCount) setReady(true);
//       };
//       imagesRef.current[i] = img;
//     }

//     const canvas = canvasRef.current;
//     const setSize = () => {
//       if (!canvas) return;
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     setSize();
//     window.addEventListener("resize", setSize);
//     return () => window.removeEventListener("resize", setSize);
//   }, []);

//   useLayoutEffect(() => {
//     if (!containerRef.current) return;
//     const ctx = canvasRef.current.getContext("2d");

//     const obj = { frame: 1 };

//     function draw() {
//       const f = Math.min(frameCount, Math.max(1, Math.floor(obj.frame)));
//       const img = imagesRef.current[f];
//       if (img && ctx) {
//         // clear and draw image scaled to canvas
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         // preserve aspect ratio and cover canvas (like object-fit: cover)
//         const canvasRatio = canvasRef.current.width / canvasRef.current.height;
//         const imgRatio = img.width / img.height;
//         let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

//         if (imgRatio > canvasRatio) {
//           // image wider: crop sides
//           sWidth = img.height * canvasRatio;
//           sx = (img.width - sWidth) / 2;
//         } else {
//           // image taller: crop top/bottom
//           sHeight = img.width / canvasRatio;
//           sy = (img.height - sHeight) / 2;
//         }

//         ctx.drawImage(
//           img,
//           sx,
//           sy,
//           sWidth,
//           sHeight,
//           0,
//           0,
//           canvasRef.current.width,
//           canvasRef.current.height
//         );
//       }
//     }

//     const tween = gsap.to(obj, {
//       frame: frameCount,
//       snap: "frame",
//       ease: "none",
//       scrollTrigger: {
//         trigger: ".grid-container",
//         start: "top top",
//         end: "+=8000",
//         scrub: true,
//         pin: ".grid-container",
//       },
//       onUpdate: () => {
//         // use rAF to batch draws
//         if (rafRef.current) cancelAnimationFrame(rafRef.current);
//         rafRef.current = requestAnimationFrame(draw);
//       },
//     });

//     // initial draw once first images loaded
//     const initDraw = () => {
//       if (imagesRef.current[1]?.complete) draw();
//     };
//     initDraw();

//     return () => {
//       tween.kill();
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, [ready]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative z-20 origin-bottom md:-mb-[50vh]"
//       style={{ height: "10000px" }}
//     >
//       <div className="grid-container">
//         <div className="grid">
//           <div className="gridLayer">
//             <div className="relative h-screen w-screen">
//               <canvas
//                 ref={canvasRef}
//                 className="absolute inset-0 w-full h-full block"
//                 style={{ display: "block" }}
//               />
//               {/* Optional overlay content */}
//               <div className=" top-0 left-0 right-0 pointer-events-none">
//                 <HeroTitle />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// with preloader

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroTitle from "./component/heroTitle";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  const frameCount = 149;
  const currentFrame = (i) => `/frames/${i}.avif`;

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
            {/* Canvas (only visible after preload) */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: ready ? "block" : "none" }}
            />

            {/* Loader overlay */}
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
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

            {/* Overlayed title (once ready) */}
            {ready && (
              <div className="absolute top-0 left-0 right-0 pointer-events-none">
                <HeroTitle />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
