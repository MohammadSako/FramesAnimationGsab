import { IBM_Plex_Sans } from "next/font/google";
import IconsList from "./IconsList";

const IBMPlexSans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
});

export default function HeroTitle() {
  return (
    <div className=" sticky top-[25vh] z-20 flex w-full -translate-y-1/4 flex-col items-center gap-6 text-center text-balance md:top-[22vh] md:gap-10">
      <h1
        className={`${IBMPlexSans.className} text-[#0a1d08] tracking-[-0.04em] text-[34px] leading-[38px] max-w-[32ch] md:text-[min(53px,min(calc(2.5vh+25px),calc(1.5vw+25px)))] md:leading-[calc(52/53)] md:tracking-[-0.04em] pe-[16px] ps-[16px]`}
      >
        <span>
          This is not the original website; it is an attempt to recreate it
          using GSAP.
        </span>
      </h1>


      <div className="max-w-full md:w-full">
        <div className="flex flex-col items-center overflow-clip">
          <p
            className={`${IBMPlexSans.className} mb-2 text-[#8D9485] capitalize text-xs tracking-widest font-normal`}
          >
            TRUSTED BY
          </p>
          <IconsList />
        </div>
      </div>
    </div>
  );
}
