import Link from "next/link";
import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function WatchBtn() {
  return (
    <Link
      className="inline-flex items-center justify-center whitespace-nowrap rounded-[20px] cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 atlas-web-mono shrink-0 lg:px-[24px] px-[18px] gap-3 bg-transparent border border-[#e0e5d5] text-[#203b14] hover:text-[#3b5c23]/80 hover:border-[#e0e5d5] disabled:border-[#e0e5d5] disabled:bg-transparent disabled:text-[#c5ccb6] ring-offset-[#fbfdf6] focus-visible:ring-[#203b14] lg:h-10 h-8 overflow-clip pl-5 !bg-[#fbfdf6]"
      href="https://app.adaline.ai/sign-up?utm_source=adaline.ai"
      rel="noopener noreferrer"
    >
      <p
        className={`${fragmentMono.className} hidden lg:flex text-xs leading-tight tracking-widest hover:cursor-pointer`}
      >
        WATCH DEMO
      </p>
      <p
        className={`${fragmentMono.className} lg:hidden text-xs leading-tight tracking-widest hover:cursor-pointer`}
      >
        DEMO
      </p>
      <div className="-mr-3.5 ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e0e5d5]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="text-[#0a1d08]"
        >
          <path d="M7 7.396c0-1.432 0-2.148.3-2.548a1.5 1.5 0 0 1 1.093-.597c.498-.035 1.1.352 2.305 1.126l7.162 4.604c1.045.672 1.567 1.008 1.748 1.435a1.5 1.5 0 0 1 0 1.168c-.18.427-.703.763-1.748 1.435l-7.162 4.604c-1.205.774-1.807 1.161-2.305 1.126A1.5 1.5 0 0 1 7.3 19.15C7 18.751 7 18.036 7 16.604z"></path>
        </svg>
      </div>
    </Link>
  );
}
