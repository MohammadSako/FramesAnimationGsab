import Link from "next/link";
import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function WatchBtn() {
  return (
    <Link
      className="bg-[#FBFDF6] inline-flex items-center justify-center whitespace-nowrap rounded-[20px] cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  shrink-0 h-10 px-6 gap-3   disabled:bg-[#eff2e8]  ring-offset-[#fbfdf6]  plausible-event-name--signup"
      href="https://app.adaline.ai/sign-up?utm_source=adaline.ai"
      rel="noopener noreferrer"
    >
      <p
        className={`${fragmentMono.className} text-sm leading-tight tracking-widest hover:cursor-pointer`}
      >
        WATCH DEMO
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
